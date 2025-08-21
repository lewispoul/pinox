PiNox deploy artifacts

Files included:
- `nox.service` - systemd unit template (copy to `/etc/systemd/system/nox.service` and enable)
- `verify_env.sh` - checks Conda and `nox-env` and attempts a dry import
- `verify_service.sh` - checks systemd unit and prints status

Quick install steps (on the Pi):

```bash
# stop and backup any previous service
sudo systemctl stop nox.service || true
sudo systemctl disable nox.service || true
mkdir -p ~/backup_pinox
mv ~/pinox ~/backup_pinox/pinox_$(date +%Y%m%d_%H%M%S) || true

# clone fresh repo (if needed)
# git clone https://github.com/lppoulin/pinox.git ~/pinox
# cd ~/pinox

# Create conda env
# wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh -O miniconda.sh
# bash miniconda.sh -b -p $HOME/miniconda3
# export PATH="$HOME/miniconda3/bin:$PATH"
# conda create -y -n nox-env python=3.11
# conda activate nox-env
# pip install -r requirements.txt

# Install service
sudo cp deploy/nox.service /etc/systemd/system/nox.service
sudo systemctl daemon-reload
sudo systemctl enable --now nox.service

# Verify
./deploy/verify_env.sh
sudo ./deploy/verify_service.sh
```

Notes:
- `run_nox.sh` is the intended ExecStart and already activates `nox-env`. Ensure it is executable: `chmod +x run_nox.sh deploy/verify_*.sh`
- If you prefer the python binary directly in ExecStart, change the unit to point at `/home/lppou/miniconda3/envs/nox-env/bin/python -m nox`.
