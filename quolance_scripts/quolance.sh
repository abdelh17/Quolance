#!/bin/bash

# Determine the script's directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Define paths for .env and docker-compose.yml
ENV_FILE="$PROJECT_ROOT/.env"
DOCKER_COMPOSE_FILE="$PROJECT_ROOT/infrastructure/docker-compose.yaml"

# Define options
options=("Create and start container" "Stop container" "Destroy container (down)" "Exit")

# ASCII Art Header
header() {
  clear
  echo "============================"
  echo "  Quolance Internal Script  "
  echo "============================"
  echo
  echo "Choose an option for the Docker Compose container:"
  echo
}

# Function to print the menu
print_menu() {
  header
  for i in "${!options[@]}"; do
    echo "$((i+1)). ${options[i]}"
  done
  echo
}

# Main loop to display the menu and handle input
while true; do
  print_menu
  read -p "Enter your choice (1-${#options[@]}): " choice

  case $choice in
    1)
      echo "Creating and starting the container..."
      docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" up -d
      read -p "Press any key to return to the menu..."
      ;;
    2)
      echo "Stopping the container..."
      docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" stop
      read -p "Press any key to return to the menu..."
      ;;
    3)
      echo "Destroying and removing the container..."
      docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" down
      read -p "Press any key to return to the menu..."
      ;;
    4)
      echo "Exiting..."
      exit 0
      ;;
    *)
      echo "Invalid choice. Please enter a number between 1 and ${#options[@]}."
      read -p "Press any key to try again..."
      ;;
  esac
done