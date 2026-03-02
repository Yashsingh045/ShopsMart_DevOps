#!/usr/bin/env bash

# this setup script initialises the developer environment
# and validates node and npm are installed, then checks for node_modules

if ! command -v node &> /dev/null; then
  echo "[ERROR] node is not installed. Please install Node.js."
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "[ERROR] npm is not installed. Please install npm."
  exit 1
fi

echo "[INFO] Dependencies pre-flight check passed."


DIRECTORIES=("backend" "frontend")


if [ -d "server" ]; then
    DIRECTORIES[0]="server"
fi

if [ -d "client" ]; then
    DIRECTORIES[1]="client"
fi


for DIR in "${DIRECTORIES[@]}"; do
  if [ -d "$DIR" ]; then
    echo "[INFO] Entering directory: $DIR"
    cd "$DIR" || exit 1
    
    if [ -d "node_modules" ]; then
      echo "[INFO] Skipping install in $DIR: node_modules already exists."
    else
      echo "[INFO] Installing dependencies in $DIR..."
      npm install
    fi
    
    cd ..
  else
    echo "[WARNING] Directory $DIR does not exist."
  fi
done

echo "[INFO] Setup complete."
