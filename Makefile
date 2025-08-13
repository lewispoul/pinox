# Makefile for Nox API - Simple automation
# Conforme à COPILOT_PLAN.md - Étapes 2, 4, 5

.PHONY: help install harden caddy-lan caddy-public nginx-public repair repair-v2 validate test demo logs install-logs debug clean

# Configuration
SCRIPT_DIR = nox-api/scripts
DEPLOY_DIR = nox-api/deploy
TESTS_DIR = nox-api/tests

help:  ## Afficher cette aide
	@echo "Makefile Nox API - Commandes disponibles:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Exemples:"
	@echo "  make install       # Installation complète"
	@echo "  make harden        # Durcissement sécurisé"
	@echo "  make caddy-lan     # Reverse proxy Caddy (LAN)"
	@echo "  make caddy-public DOMAIN=api.example.com EMAIL=admin@example.com"
	@echo "  make nginx-public DOMAIN=api.example.com EMAIL=admin@example.com"
	@echo "  make repair        # Réparation/maintenance"
	@echo "  make demo          # Tests automatiques avec client Python"
	@echo "  make logs          # Afficher les logs récents"
	@echo "  make install-logs  # Installer système de logs et rotation (Étape 6)"
	@echo "  make debug         # Diagnostic rapide avec nox-debug"
	@echo "  make test          # Tests API"

install:  ## Installer/réinstaller Nox API
	@echo "Installation de Nox API..."
	@./$(DEPLOY_DIR)/install_nox.sh

harden:  ## Durcissement sécurisé (Étape 3) - Migration venv vers /opt/nox
	@echo "Durcissement de Nox API..."
	@sudo ./$(DEPLOY_DIR)/harden_nox.sh

caddy-lan:  ## Installer Caddy en mode LAN (HTTP port 80)
	@echo "Configuration Caddy mode LAN..."
	@sudo ./$(DEPLOY_DIR)/caddy_setup.sh lan

caddy-public:  ## Installer Caddy en mode PUBLIC avec HTTPS - Usage: make caddy-public DOMAIN=example.com EMAIL=admin@example.com
	@echo "Configuration Caddy mode PUBLIC..."
	@if [ -z "$(DOMAIN)" ] || [ -z "$(EMAIL)" ]; then \
		echo "Usage: make caddy-public DOMAIN=votre-domaine.tld EMAIL=votre-email@example.com"; \
		exit 1; \
	fi
	@sudo ./$(DEPLOY_DIR)/caddy_setup.sh public $(DOMAIN) $(EMAIL)

nginx-public:  ## Installer Nginx en mode PUBLIC avec HTTPS - Usage: make nginx-public DOMAIN=example.com EMAIL=admin@example.com
	@echo "Configuration Nginx mode PUBLIC..."
	@if [ -z "$(DOMAIN)" ] || [ -z "$(EMAIL)" ]; then \
		echo "Usage: make nginx-public DOMAIN=votre-domaine.tld EMAIL=votre-email@example.com"; \
		exit 1; \
	fi
	@sudo ./$(DEPLOY_DIR)/nginx_setup.sh $(DOMAIN) $(EMAIL)

repair:  ## Réparer et maintenir l'installation Nox API
	@echo "Réparation de Nox API..."
	@./$(SCRIPT_DIR)/nox_repair.sh

repair-v2:  ## Réparer avec script robuste (sans hang)
	@echo "Réparation de Nox API (version robuste)..."
	@./$(SCRIPT_DIR)/nox_repair_v2.sh

validate:  ## Valider l'installation actuelle
	@echo "Validation de Nox API..."
	@./validate_nox.sh

demo:  ## Exécuter les tests automatiques avec le client Python (Étape 5)
	@echo "Lancement des tests demo avec client Python..."
	@if [ -f "/etc/default/nox-api" ]; then \
		export NOX_API_TOKEN=$$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2 | tr -d '"'); \
		export NOX_API_URL="http://localhost"; \
		echo "🚀 Configuration détectée:"; \
		echo "   API URL: $$NOX_API_URL"; \
		echo "   Token: $$(echo $$NOX_API_TOKEN | cut -c1-8)..."; \
		echo ""; \
		cd clients && python3 tests_demo.py; \
	else \
		echo "❌ Erreur: Configuration /etc/default/nox-api non trouvée."; \
		echo "💡 Exécutez 'make install' d'abord pour installer Nox API."; \
		exit 1; \
	fi

logs:  ## Afficher les logs récents du service
	@echo "=== Logs Nox API ==="
	@if [ -d "/var/log/nox-api" ]; then \
		echo "Logs dédiés disponibles:"; \
		sudo tail -20 /var/log/nox-api/nox-api.log 2>/dev/null || echo "Pas de logs applicatifs"; \
	else \
		echo "Logs systemd (pas de logs dédiés):"; \
		sudo journalctl -u nox-api -n 30 --no-pager 2>/dev/null || echo "Service non installé"; \
	fi

install-logs:  ## Installer le système de logs dédiés et rotation (Étape 6)
	@echo "Installation du système de logs et rotation..."
	@sudo ./$(DEPLOY_DIR)/install_logging.sh

debug:  ## Diagnostic rapide du système Nox API
	@echo "Diagnostic Nox API..."
	@if command -v nox-debug >/dev/null 2>&1; then \
		nox-debug; \
	else \
		echo "❌ Outil nox-debug non installé. Exécutez 'make logs' d'abord."; \
		echo "💡 Alternative: sudo journalctl -u nox-api -n 20"; \
		exit 1; \
	fi

test:  ## Exécuter les tests de l'API
	@echo "Tests de l'API Nox..."
	@if [ -f "/etc/default/nox-api" ]; then \
		TOKEN=$$(sudo grep "^NOX_API_TOKEN=" /etc/default/nox-api | cut -d= -f2); \
		./$(TESTS_DIR)/run_all_tests.sh "$$TOKEN"; \
	else \
		echo "Erreur: Configuration non trouvée. Exécutez 'make install' d'abord."; \
		exit 1; \
	fi

clean:  ## Nettoyer les fichiers temporaires
	@echo "Nettoyage des fichiers temporaires..."
	@find . -name "*.pyc" -delete 2>/dev/null || true
	@find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "*.tmp" -delete 2>/dev/null || true
	@echo "Nettoyage terminé"

status:  ## Afficher le statut du service Nox API
	@echo "=== Statut Nox API ==="
	@echo "Service: $$(systemctl is-active nox-api 2>/dev/null || echo 'non installé')"
	@echo "API: $$(curl -s http://127.0.0.1:8080/health 2>/dev/null | grep -o 'ok' || echo 'non disponible')"
	@if [ -f "/etc/default/nox-api" ]; then \
		echo "Configuration: présente"; \
	else \
		echo "Configuration: absente"; \
	fi

logs:  ## Afficher les logs récents du service
	@echo "=== Logs Nox API ==="
	@sudo journalctl -u nox-api -n 30 --no-pager 2>/dev/null || echo "Service non installé"

# Cibles de développement
dev-test:  ## Tests de développement (sans authentification complète)
	@echo "Tests de développement..."
	@curl -s http://127.0.0.1:8080/health && echo " - Health OK" || echo " - Health FAIL"

# Installation des outils (pour future étape 7)
install-tools:  ## Installer les outils de ligne de commande (futur noxctl)
	@echo "Installation des outils prévue pour l'Étape 7"
	@echo "Pas encore implémenté - voir COPILOT_PLAN.md Étape 7"

# Cible par défaut
all: install validate  ## Installation complète + validation

.DEFAULT_GOAL := help
