# Pinox API Systemd Setup

## Installation Instructions

1. **Copy the service file:**
   ```bash
   sudo cp deploy/systemd/pinox-api.service /etc/systemd/system/
   ```

2. **Reload systemd and enable the service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable pinox-api
   ```

3. **Start the service:**
   ```bash
   sudo systemctl restart pinox-api
   ```

4. **Check status:**
   ```bash
   sudo systemctl status pinox-api
   ```

## Network Access

- The service binds to `0.0.0.0:8000`
- Ensure port 8000 is reachable on your LAN
- Access documentation at: `http://<host>:8000/docs`

## Configuration

Ensure you have:
- Project cloned to `/home/lppou/pinox`
- Virtual environment created at `/home/lppou/pinox/.venv`
- Dependencies installed via bootstrap script
- `.env` file configured with your settings

## Verification

Test the service is working:

```bash
curl -sS http://127.0.0.1:8000/health
curl -sS http://127.0.0.1:8000/docs | head -20
```

## Logs

View service logs:

```bash
journalctl -u pinox-api -f
```