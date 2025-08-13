# Bash completion for noxctl v2.0 - Phase 2.1 Extensions
# Installation: sudo cp scripts/noxctl-completion.bash /etc/bash_completion.d/
# Ou: source scripts/noxctl-completion.bash

_noxctl_completion() {
    local cur prev opts
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    # Commandes principales (Phase 2.1 étendues)
    opts="health put runpy runsh ls cat rm logs status backup version help"
    
    # Complétion selon la position et le contexte
    case $COMP_CWORD in
        1)
            # Première position: commandes principales
            COMPREPLY=($(compgen -W "$opts" -- "$cur"))
            return 0
            ;;
        2)
            # Deuxième position: dépend de la commande
            case "$prev" in
                put)
                    # Pour 'put', complétion des fichiers locaux
                    COMPREPLY=($(compgen -f -- "$cur"))
                    return 0
                    ;;
                runpy)
                    # Pour 'runpy', complétion des fichiers .py
                    COMPREPLY=($(compgen -f -X '!*.py' -- "$cur"))
                    return 0
                    ;;
                cat|rm)
                    # Pour cat/rm, suggérer chemins sandbox courants
                    local common_files="scripts/ data/ temp/ logs/ config/ test.py run.py main.py"
                    COMPREPLY=($(compgen -W "$common_files" -- "$cur"))
                    return 0
                    ;;
                ls)
                    # Pour ls, suggérer dossiers courants
                    local common_dirs="scripts data temp logs config tests"
                    COMPREPLY=($(compgen -W "$common_dirs" -- "$cur"))
                    return 0
                    ;;
                logs)
                    # Pour logs, options --tail
                    COMPREPLY=($(compgen -W "--tail=10 --tail=50 --tail=100 --tail=500" -- "$cur"))
                    return 0
                    ;;
                status)
                    # Pour status, option --full
                    COMPREPLY=($(compgen -W "--full" -- "$cur"))
                    return 0
                    ;;
                backup)
                    # Pour backup, suggérer noms courants
                    local backup_names="daily weekly monthly full-$(date +%Y%m%d) test-backup"
                    COMPREPLY=($(compgen -W "$backup_names" -- "$cur"))
                    return 0
                    ;;
                runsh)
                    # Pour 'runsh', suggérer commandes courantes
                    local common_cmds="'ls -la' 'pwd' 'df -h' 'ps aux' 'cat' 'find'"
                    COMPREPLY=($(compgen -W "$common_cmds" -- "$cur"))
                    return 0
                    ;;
                *)
                    return 0
                    ;;
            esac
            ;;
        3)
            # Troisième position
            case "${COMP_WORDS[1]}" in
                put)
                    # Pour 'put', suggérer des chemins sandbox courants
                    local common_paths="scripts/ data/ temp/ logs/ config/ tests/"
                    COMPREPLY=($(compgen -W "$common_paths" -- "$cur"))
                    return 0
                    ;;
                *)
                    return 0
                    ;;
            esac
            ;;
        *)
            return 0
            ;;
    esac
}

# Enregistrement de la fonction de complétion
complete -F _noxctl_completion noxctl