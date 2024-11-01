#!/bin/bash

# Define paths for .env and docker-compose.yml
ENV_FILE="./.env"
DOCKER_COMPOSE_FILE="./infrastructure/docker-compose.yaml"

# Define options
options=("Create and start container" "Stop container" "Destroy container (down)" "Exit")

# Initialize cursor position
cursor=0

# ASCII Art Header
header() {
  clear
  echo "============================"
  echo "   Quolance Internal Script  "
  echo "============================"
  echo
  echo "Choose an option for the Docker Compose container:"
  echo
}

# Function to print the menu
print_menu() {
  header
  for i in "${!options[@]}"; do
    if [ "$i" -eq "$cursor" ]; then
      # Highlight the selected option
      echo -e "\033[31m> ${options[i]}\033[0m"
    else
      echo "  ${options[i]}"
    fi
  done
}

# Function to handle key inputs
move_cursor() {
  read -rsn1 key
  if [[ $key == $'\x1b' ]]; then
    read -rsn2 -t 0.1 key
    if [[ $key == "[A" ]]; then
      # Up arrow
      ((cursor--))
      if [ "$cursor" -lt 0 ]; then
        cursor=$((${#options[@]} - 1))
      fi
    elif [[ $key == "[B" ]]; then
      # Down arrow
      ((cursor++))
      if [ "$cursor" -ge "${#options[@]}" ]; then
        cursor=0
      fi
    fi
  elif [[ $key == "" ]]; then
    # Enter key
    case "$cursor" in
      0)
        echo "Creating and starting the container..."
        docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" up -d
        read -p "Press any key to return to the menu..."
        ;;
      1)
        echo "Stopping the container..."
        docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" stop
        read -p "Press any key to return to the menu..."
        ;;
      2)
        echo "Destroying and removing the container..."
        docker-compose --env-file "$ENV_FILE" -f "$DOCKER_COMPOSE_FILE" down
        read -p "Press any key to return to the menu..."
        ;;
      3)
        echo "Exiting..."
        exit 0
        ;;
    esac
  fi
}

# Main loop to display the menu and handle input
while true; do
  print_menu
  move_cursor
done
