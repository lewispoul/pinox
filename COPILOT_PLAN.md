Contexte
Je veux une mini plateforme « Nox API » sur Ubuntu 22.04, accessible en LAN ou via HTTPS, avec sandbox d’exécution, mémoire Git, et service au boot.

Livrables

1) api/nox_api.py, FastAPI, endpoints: /health, /put, /run_py, /run_sh, auth par Bearer token, validation chemins sandbox, timeouts, liste de commandes interdites.
2) install_nox.sh, idempotent, crée user nox, arborescence, venv, installe deps, déploie l’API, systemd, UFW, options Docker ou venv, option Caddy ou Nginx.
3) systemd: nox-api.service, sécurisé avec ProtectSystem, NoNewPrivileges, RuntimeMaxSec, variables d’environnement NOX_API_TOKEN et NOX_SANDBOX.
4) Reverse proxy: Caddyfile ou conf Nginx, prêt pour domaine public.
5) tests: scripts curl pour /health, /put, /run_py, /run_sh, plus un client Python minimal.
6) README avec pas à pas, sécurité, troubleshooting.
7) Hooks git pour push auto post-commit.

Contraintes
Ne pas utiliser de chemins absolus codés en dur sauf variables. Mettre des commentaires clairs. Fournir messages d’erreur utiles. Aucune commande dangereuse côté /run_sh.

Vérifications attendues

- systemctl status nox-api actif
- curl <http://IP:8080/health> renvoie ok
- upload puis exécution d’un script Python simple fonctionne
- UFW n’expose pas 8080 si reverse proxy actif
- Caddy ou Nginx répond sur le domaine si configuré
