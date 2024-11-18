#!/bin/bash

# Define color codes
RED='\033[0;31m'
NC='\033[0m' # No color

# Menu options
options=("Manage Containers" "Exit")
options_desc=("Create, start, stop, or destroy containers" "Exit the script")

# Variables for menu navigation
selected=0
num_options=${#options[@]}

header() {
  clear
  echo "=================================="
  echo
  echo "     Quolance Internal Script     "
  echo
  echo "=================================="
  echo
  echo "Main Menu"
  echo
  echo "Choose an option (↑ or ↓ + Enter):"
  echo
}

# Function to print the menu
print_menu() {
    header
    for i in "${!options[@]}"; do
        if [ "$i" -eq "$selected" ]; then
            echo -e " ${RED}>  ${options[$i]}${NC} — (${options_desc[$i]})"
        else
            echo "   ${options[$i]}"
        fi
    done
}

# Main loop
while true; do
    print_menu

    # Capture user input for navigation
    read -rsn1 input
    case "$input" in
        A) # Up arrow
            ((selected--))
            if [ "$selected" -lt 0 ]; then
                selected=$((num_options - 1))
            fi
            ;;
        B) # Down arrow
            ((selected++))
            if [ "$selected" -ge "$num_options" ]; then
                selected=0
            fi
            ;;
        "") # Enter key
            case "$selected" in
                0)
                    echo
                    echo "Navigating to Manage Containers..."
                    sleep 0.2
                    ./container_manager.sh
                    ;;
                1)
                    echo
                    echo "Exiting..."
                    sleep 0.5
                    exit 0
                    ;;
            esac
            ;;
    esac
done
