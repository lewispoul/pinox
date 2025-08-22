// Pinox Agent GUI JavaScript
function agentApp() {
    return {
        activeTab: 'terminal',
        terminalInput: '',
        chatInput: '',
        requestMethod: 'GET',
        requestPath: '/health',
        requestBody: '{}',
        lastResponse: null,
        testsRunning: false,
        openaiConfigured: false,
        websocket: null,
        
        init() {
            this.initKeyboardShortcuts();
            this.initWebSocket();
            this.loadFiles();
            this.checkOpenAIConfig();
        },
        
        initKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    if (this.activeTab === 'chat') {
                        this.sendChat();
                    }
                } else if (e.ctrlKey && e.key === 'r') {
                    e.preventDefault();
                    if (this.activeTab === 'tests') {
                        this.runTests();
                    }
                } else if (e.ctrlKey && e.key === 'u') {
                    e.preventDefault();
                    document.getElementById('fileUpload').click();
                }
            });
        },
        
        initWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const token = localStorage.getItem('apiToken') || '';
            const wsUrl = `${protocol}//${window.location.host}/ws/terminal${token ? '?token=' + encodeURIComponent(token) : ''}`;
            
            try {
                this.websocket = new WebSocket(wsUrl);
                
                this.websocket.onopen = () => {
                    this.addTerminalLine('WebSocket connected');
                };
                
                this.websocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.stdout) {
                        this.addTerminalLine(data.stdout, 'output');
                    }
                    if (data.stderr) {
                        this.addTerminalLine(data.stderr, 'error');
                    }
                    if (data.error) {
                        this.addTerminalLine(`Error: ${data.error}`, 'error');
                    }
                };
                
                this.websocket.onerror = (error) => {
                    this.addTerminalLine('WebSocket error - using HTTP fallback', 'error');
                };
                
                this.websocket.onclose = () => {
                    this.addTerminalLine('WebSocket disconnected', 'error');
                };
            } catch (e) {
                this.addTerminalLine('WebSocket not supported - using HTTP fallback', 'error');
            }
        },
        
        executeCommand() {
            if (!this.terminalInput.trim()) return;
            
            const command = this.terminalInput;
            this.addTerminalLine(`$ ${command}`, 'input');
            this.terminalInput = '';
            
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.send(JSON.stringify({ cmd: command }));
            } else {
                // Fallback to HTTP request
                this.executeCommandHTTP(command);
            }
        },
        
        async executeCommandHTTP(command) {
            try {
                const headers = this.getAuthHeaders();
                const response = await fetch('/run_sh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers
                    },
                    body: JSON.stringify({ cmd: command })
                });
                
                const data = await response.json();
                
                if (data.stdout) {
                    this.addTerminalLine(data.stdout, 'output');
                }
                if (data.stderr) {
                    this.addTerminalLine(data.stderr, 'error');
                }
                if (response.status !== 200) {
                    this.addTerminalLine(`HTTP ${response.status}: ${data.detail || 'Unknown error'}`, 'error');
                }
            } catch (e) {
                this.addTerminalLine(`Network error: ${e.message}`, 'error');
            }
        },
        
        addTerminalLine(text, type = 'output') {
            const output = document.getElementById('terminal-output');
            const line = document.createElement('div');
            line.textContent = text;
            
            if (type === 'input') {
                line.className = 'text-yellow-400';
            } else if (type === 'error') {
                line.className = 'text-red-400';
            }
            
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        },
        
        async sendChat() {
            if (!this.chatInput.trim()) return;
            
            const userMessage = this.chatInput;
            this.chatInput = '';
            
            this.addChatMessage('user', userMessage);
            
            try {
                const headers = this.getAuthHeaders();
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers
                    },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: userMessage }]
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    this.addChatMessage('assistant', data.reply);
                } else {
                    this.addChatMessage('system', `Error: ${data.detail}`);
                }
            } catch (e) {
                this.addChatMessage('system', `Network error: ${e.message}`);
            }
        },
        
        addChatMessage(role, content) {
            const chatMessages = document.getElementById('chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `mb-4 ${role === 'user' ? 'text-right' : 'text-left'}`;
            
            const bubble = document.createElement('div');
            bubble.className = `inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                role === 'user' ? 'bg-blue-600 text-white' : 
                role === 'assistant' ? 'bg-gray-200 text-gray-800' :
                'bg-red-100 text-red-800'
            }`;
            bubble.textContent = content;
            
            messageDiv.appendChild(bubble);
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        },
        
        async runTests() {
            if (this.testsRunning) return;
            
            this.testsRunning = true;
            const output = document.getElementById('test-output');
            output.textContent = 'Starting tests...\n';
            
            try {
                const headers = this.getAuthHeaders();
                const response = await fetch('/run_tests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream',
                        ...headers
                    },
                    body: JSON.stringify({ test_path: '', args: [] })
                });
                
                if (response.headers.get('content-type')?.includes('text/event-stream')) {
                    // Handle streaming response
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        
                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');
                        
                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') {
                                    output.textContent += '\nTests completed.\n';
                                } else {
                                    output.textContent += data + '\n';
                                }
                                output.scrollTop = output.scrollHeight;
                            }
                        }
                    }
                } else {
                    // Handle regular JSON response
                    const data = await response.json();
                    output.textContent = data.summary || data.stdout + data.stderr;
                }
            } catch (e) {
                output.textContent += `\nError running tests: ${e.message}\n`;
            } finally {
                this.testsRunning = false;
            }
        },
        
        async sendRequest() {
            try {
                const headers = this.getAuthHeaders();
                const options = {
                    method: this.requestMethod,
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers
                    }
                };
                
                if (['POST', 'PUT'].includes(this.requestMethod) && this.requestBody.trim()) {
                    options.body = this.requestBody;
                }
                
                const response = await fetch(this.requestPath, options);
                const data = await response.json().catch(() => response.text());
                
                this.lastResponse = {
                    status: response.status,
                    data: data
                };
            } catch (e) {
                this.lastResponse = {
                    status: 0,
                    data: { error: e.message }
                };
            }
        },
        
        async loadFiles() {
            try {
                const headers = this.getAuthHeaders();
                const response = await fetch('/list?path=', {
                    headers: headers
                });
                
                const data = await response.json();
                const fileList = document.getElementById('fileList');
                
                if (data.files && data.files.length > 0) {
                    fileList.innerHTML = data.files.map(file => `
                        <div class="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                            <div class="flex items-center">
                                <svg class="w-4 h-4 mr-2 ${file.type === 'dir' ? 'text-blue-500' : 'text-gray-500'}" fill="currentColor" viewBox="0 0 20 20">
                                    ${file.type === 'dir' ? 
                                        '<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>' :
                                        '<path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>'
                                    }
                                </svg>
                                <span class="text-sm">${file.name}</span>
                            </div>
                            <div class="flex space-x-1">
                                ${file.type === 'file' ? `<button onclick="viewFile('${file.name}')" class="text-blue-600 hover:text-blue-800 text-xs">View</button>` : ''}
                                <button onclick="deleteFile('${file.name}')" class="text-red-600 hover:text-red-800 text-xs">Delete</button>
                            </div>
                        </div>
                    `).join('');
                } else {
                    fileList.innerHTML = '<div class="text-gray-500 text-center py-8">No files found</div>';
                }
            } catch (e) {
                console.error('Error loading files:', e);
            }
        },
        
        async handleFileUpload(event) {
            const files = Array.from(event.target.files);
            
            for (const file of files) {
                const formData = new FormData();
                formData.append('f', file);
                
                try {
                    const headers = this.getAuthHeaders();
                    delete headers['Content-Type']; // Let browser set it for FormData
                    
                    const response = await fetch(`/put?path=${encodeURIComponent(file.name)}`, {
                        method: 'POST',
                        headers: headers,
                        body: formData
                    });
                    
                    if (response.ok) {
                        console.log(`Uploaded ${file.name}`);
                    } else {
                        console.error(`Failed to upload ${file.name}`);
                    }
                } catch (e) {
                    console.error(`Error uploading ${file.name}:`, e);
                }
            }
            
            // Refresh file list
            this.loadFiles();
            
            // Clear input
            event.target.value = '';
        },
        
        getAuthHeaders() {
            const token = localStorage.getItem('apiToken');
            return token ? { 'Authorization': `Bearer ${token}` } : {};
        },
        
        async checkOpenAIConfig() {
            try {
                const headers = this.getAuthHeaders();
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...headers
                    },
                    body: JSON.stringify({
                        messages: [{ role: 'user', content: 'test' }]
                    })
                });
                
                this.openaiConfigured = response.status !== 501;
            } catch (e) {
                this.openaiConfigured = false;
            }
        }
    }
}

// Global functions for file operations
async function viewFile(filename) {
    try {
        const token = localStorage.getItem('apiToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch(`/cat?path=${encodeURIComponent(filename)}`, {
            headers: headers
        });
        const data = await response.json();
        
        // Open modal or new tab with file content
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <pre style="white-space: pre-wrap; font-family: monospace; padding: 20px;">
${data.content}
            </pre>
        `);
        newWindow.document.title = filename;
    } catch (e) {
        alert(`Error viewing file: ${e.message}`);
    }
}

async function deleteFile(filename) {
    if (!confirm(`Delete ${filename}?`)) return;
    
    try {
        const token = localStorage.getItem('apiToken');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch(`/delete?path=${encodeURIComponent(filename)}`, {
            method: 'DELETE',
            headers: headers
        });
        
        if (response.ok) {
            // Refresh file list
            window.location.reload(); // Simple refresh for now
        } else {
            const data = await response.json();
            alert(`Error deleting file: ${data.detail}`);
        }
    } catch (e) {
        alert(`Error deleting file: ${e.message}`);
    }
}