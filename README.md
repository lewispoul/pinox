# Nox API — README

## 1. Overview

Nox API is a secure, sandboxed execution platform built on **FastAPI**, designed for running Python and shell commands in a controlled environment.

**Key use cases:**

* Local or remote code execution over LAN or HTTPS
* Automated script deployment and testing
* DevOps sandbox for safe experimentation

**Key endpoints:** `/health`, `/put`, `/run_py`, `/run_sh`
**Target OS:** Ubuntu 22.04
**Deployment:** venv or Docker, with optional reverse proxy (Caddy/Nginx)

---

## 2. Features

* Sandboxed execution — Restricts file paths and dangerous commands
* Bearer token authentication
* Systemd service — Automatic startup on boot
* Reverse proxy ready — HTTPS with Caddy or Nginx
* Git integration (optional) — Memory/history of scripts
* Environment-based config — `/etc/default/nox-api`

---

## 3. Repository Structure

```
nox/
├── api/
│   └── nox_api.py
├── deploy/
│   ├── install_nox.sh
│   ├── repair_nox.sh
│   └── harden_nox.sh              # optional, step 3
├── tests/
│   ├── test_health.sh
│   ├── test_put.sh
│   ├── test_run_py.sh
│   └── test_run_sh.sh
├── systemd/
│   └── nox-api.service
└── README.md
```

---

## 4. Installation

```bash
git clone https://github.com/<your-org-or-user>/nox.git
cd nox/deploy
sudo bash install_nox.sh
```

---

## 5. Configuration

Edit `/etc/default/nox-api`:

```ini
NOX_API_TOKEN=replace_with_secure_token
NOX_BIND_ADDR=127.0.0.1
NOX_PORT=8080
NOX_SANDBOX=/home/nox/nox/sandbox
```

Reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart nox-api
```

---

## 6. API Endpoints

| Method | Endpoint | Description                      |
| ------ | -------- | -------------------------------- |
| GET    | /health  | Health check                     |
| POST   | /put     | Upload file to sandbox           |
| POST   | /run\_py | Execute Python code in sandbox   |
| POST   | /run\_sh | Execute shell command in sandbox |

---

## 7. Security Notes

* Keep `/run_sh` limited to non-destructive commands
* Always set a strong `NOX_API_TOKEN`
* Restrict `NOX_SANDBOX` to safe directories
* If exposed publicly, use HTTPS behind Caddy or Nginx and a firewall (UFW)
* Consider systemd hardening options in `nox-api.service`

---

## 8. Tests

After installation:

```bash
bash tests/test_health.sh
bash tests/test_put.sh
bash tests/test_run_py.sh
bash tests/test_run_sh.sh
```

---

## 9. Troubleshooting

* Service status:

  ```bash
  sudo systemctl status nox-api
  ```
* Logs:

  ```bash
  sudo journalctl -u nox-api -n 100 --no-pager
  ```
* Common errors:

  * 203/EXEC → wrong interpreter path in service file
  * Connection refused → service not running or wrong bind address
  * 401 Unauthorized → invalid `NOX_API_TOKEN`

---

## 10. License

Choose a license (MIT, Apache 2.0, etc.) and include it here.
