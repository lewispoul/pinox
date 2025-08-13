# Bash completion for noxctl
# Installation: sudo cp scripts/noxctl-completion.bash /etc/bash_completion.d/
# Ou: source scripts/noxctl-completion.bash

_noxctl_completion() {
    local cur prev opts
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    
    # Commandes principales
    opts="health put runpy runsh version help"
    
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
                runsh)
                    # Pour 'runsh', pas de complétion spécifique
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
                    local common_paths="scripts/ data/ temp/ logs/ config/"
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
