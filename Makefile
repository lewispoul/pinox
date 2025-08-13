# Makefile for Nox API - Simple automation
# Conforme à COPILOT_PLAN.md - Étape 2

.PHONY: help install repair validate test clean

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
	@echo "  make install    # Installation complète"
	@echo "  make repair     # Réparation/maintenance"
	@echo "  make validate   # Validation système"
	@echo "  make test       # Tests API"

install:  ## Installer/réinstaller Nox API
	@echo "Installation de Nox API..."
	@./$(DEPLOY_DIR)/install_nox.sh

harden:  ## Durcissement sécurisé (Étape 3) - Migration venv vers /opt/nox
	@echo "Durcissement de Nox API..."
	@sudo ./$(DEPLOY_DIR)/harden_nox.sh

repair:  ## Réparer et maintenir l'installation Nox API
	@echo "Réparation de Nox API..."
	@./$(SCRIPT_DIR)/nox_repair.sh

repair-v2:  ## Réparer avec script robuste (sans hang)
	@echo "Réparation de Nox API (version robuste)..."
	@./$(SCRIPT_DIR)/nox_repair_v2.sh

validate:  ## Valider l'installation actuelle
	@echo "Validation de Nox API..."
	@./validate_nox.sh

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
