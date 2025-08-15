'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface WSPoolConfig {
  maxConnections: number;
  reconnectDelay: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

interface WSConnection {
  id: string;
  ws: WebSocket;
  lastUsed: number;
  reconnectCount: number;
  subscribers: Set<string>;
}

export class WebSocketPool {
  private connections: Map<string, WSConnection> = new Map();
  private config: WSPoolConfig;
  private heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(config: Partial<WSPoolConfig> = {}) {
    this.config = {
      maxConnections: 5,
      reconnectDelay: 1000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...config
    };
  }

  async getConnection(url: string, subscriberId: string): Promise<WebSocket> {
    const connectionId = this.getConnectionId(url);
    const connection = this.connections.get(connectionId);

    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.lastUsed = Date.now();
      connection.subscribers.add(subscriberId);
      return connection.ws;
    }

    // Create new connection or replace closed one
    return this.createConnection(url, connectionId, subscriberId);
  }

  private async createConnection(url: string, connectionId: string, subscriberId: string): Promise<WebSocket> {
    // Clean up old connection if exists
    this.cleanupConnection(connectionId);

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      const connection: WSConnection = {
        id: connectionId,
        ws,
        lastUsed: Date.now(),
        reconnectCount: 0,
        subscribers: new Set([subscriberId])
      };

      ws.onopen = () => {
        this.connections.set(connectionId, connection);
        this.setupHeartbeat(connectionId);
        resolve(ws);
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for ${connectionId}:`, error);
        reject(error);
      };

      ws.onclose = () => {
        this.handleConnectionClose(connectionId);
      };
    });
  }

  private setupHeartbeat(connectionId: string): void {
    const timer = setInterval(() => {
      const connection = this.connections.get(connectionId);
      if (connection && connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.send(JSON.stringify({ type: 'ping' }));
      } else {
        clearInterval(timer);
        this.heartbeatTimers.delete(connectionId);
      }
    }, this.config.heartbeatInterval);

    this.heartbeatTimers.set(connectionId, timer);
  }

  private handleConnectionClose(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Clear heartbeat
    const timer = this.heartbeatTimers.get(connectionId);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(connectionId);
    }

    // Attempt reconnection if there are active subscribers
    if (connection.subscribers.size > 0 && connection.reconnectCount < this.config.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, connection.reconnectCount), 30000);
      
      setTimeout(() => {
        this.reconnectConnection(connectionId);
      }, delay);
    } else {
      this.connections.delete(connectionId);
    }
  }

  private async reconnectConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    try {
      const url = this.getUrlFromConnectionId(connectionId);
      const firstSubscriber = Array.from(connection.subscribers)[0];
      
      connection.reconnectCount++;
      await this.createConnection(url, connectionId, firstSubscriber);
      
      // Re-add all subscribers
      const newConnection = this.connections.get(connectionId);
      if (newConnection) {
        connection.subscribers.forEach(sub => newConnection.subscribers.add(sub));
      }
    } catch (error) {
      console.error(`Failed to reconnect ${connectionId}:`, error);
    }
  }

  releaseConnection(url: string, subscriberId: string): void {
    const connectionId = this.getConnectionId(url);
    const connection = this.connections.get(connectionId);
    
    if (connection) {
      connection.subscribers.delete(subscriberId);
      
      // Clean up connection if no subscribers left
      if (connection.subscribers.size === 0) {
        setTimeout(() => {
          // Double-check subscribers haven't been re-added
          const currentConnection = this.connections.get(connectionId);
          if (currentConnection && currentConnection.subscribers.size === 0) {
            this.cleanupConnection(connectionId);
          }
        }, 5000); // Grace period for reconnections
      }
    }
  }

  private cleanupConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      // Clear heartbeat
      const timer = this.heartbeatTimers.get(connectionId);
      if (timer) {
        clearInterval(timer);
        this.heartbeatTimers.delete(connectionId);
      }

      // Close WebSocket
      if (connection.ws.readyState === WebSocket.OPEN || connection.ws.readyState === WebSocket.CONNECTING) {
        connection.ws.close();
      }

      this.connections.delete(connectionId);
    }
  }

  private getConnectionId(url: string): string {
    return btoa(url).replace(/[/+=]/g, '');
  }

  private getUrlFromConnectionId(connectionId: string): string {
    // In a real implementation, you'd need to store the URL mapping
    // For now, assume we can reconstruct it or store it separately
    return atob(connectionId);
  }

  getStats(): { 
    activeConnections: number;
    totalSubscribers: number;
    connections: Array<{ id: string; subscribers: number; lastUsed: Date }>;
  } {
    const connections = Array.from(this.connections.entries()).map(([id, conn]) => ({
      id,
      subscribers: conn.subscribers.size,
      lastUsed: new Date(conn.lastUsed)
    }));

    return {
      activeConnections: this.connections.size,
      totalSubscribers: connections.reduce((sum, conn) => sum + conn.subscribers, 0),
      connections
    };
  }

  destroy(): void {
    // Cleanup all connections
    this.connections.forEach((_, connectionId) => {
      this.cleanupConnection(connectionId);
    });
    this.connections.clear();
    this.heartbeatTimers.clear();
  }
}

// React Hook for using WebSocket Pool
export function useWebSocketPool(config?: Partial<WSPoolConfig>) {
  const poolRef = useRef<WebSocketPool | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    poolRef.current = new WebSocketPool(config);
    setIsReady(true);

    return () => {
      if (poolRef.current) {
        poolRef.current.destroy();
      }
    };
  }, []); // config is stable, no need to depend on it

  const getConnection = useCallback(async (url: string, subscriberId: string) => {
    if (!poolRef.current) throw new Error('WebSocket pool not initialized');
    return poolRef.current.getConnection(url, subscriberId);
  }, []);

  const releaseConnection = useCallback((url: string, subscriberId: string) => {
    if (poolRef.current) {
      poolRef.current.releaseConnection(url, subscriberId);
    }
  }, []);

  const getStats = useCallback(() => {
    return poolRef.current?.getStats() || {
      activeConnections: 0,
      totalSubscribers: 0,
      connections: []
    };
  }, []);

  return {
    isReady,
    getConnection,
    releaseConnection,
    getStats
  };
}
