#!/bin/bash

# Define color codes
RED='\033[0;31m'
NC='\033[0m' # No color

# Determine the script's directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Define paths for .env and docker-compose.yml
ENV_FILE="$PROJECT_ROOT/.env"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/infrastructure/docker-compose.yaml"

# Container management options
container_options=("Create and start containers" "Stop containers" "Destroy containers" "Return to Main Menu")
container_options_desc=("Create and start the container" "Stop the container" "Destroy and remove the container")
num_options=${#container_options[@]}
selected=0

# Function to display container management header
container_header() {
  clear
  echo "=================================="
  echo
  echo "     Quolance Internal Script     "
  echo
  echo "=================================="
  echo
  echo "Main Menu => Container Management"
  echo
  echo "Choose an option (↑ or ↓ + Enter):"
  echo
}

# Function to display the container management menu
print_container_menu() {
    container_header
    for i in "${!container_options[@]}"; do
        if [ "$i" -eq "$selected" ]; then
            echo -e "${RED}>  ${container_options[$i]}${NC} — (${container_options_desc[$i]})"
        else
            echo "  ${container_options[$i]}"
        fi
    done
}

# Main loop for container management submenu
while true; do
    print_container_menu

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
                    echo "Creating and starting the container..."
                    docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" up -d
                    echo
                    read -p "Press any key to return to the menu..."
                    ;;
                1)
                    echo
                    echo "Stopping the container..."
                    docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" stop
                    echo
                    read -p "Press any key to return to the menu..."
                    ;;
                2)
                    echo
                    echo "Destroying and removing the container..."
                    docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" down
                    echo
                    read -p "Press any key to return to the menu..."
                    ;;
                3)
                    echo
                    echo "Returning to Main Menu..."
                    sleep 0.2
                    break
                    ;;
            esac
            ;;
    esac
done
