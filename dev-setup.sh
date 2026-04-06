#!/usr/bin/env bash
# this setup script initialises the developer environment
# and validates node and npm are installed, then checks for node_modules
# Source nvm so this script works in non-interactive SSH sessions
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
if ! command -v node &> /dev/null; then
  echo "[INFO] node not found; installing via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
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
# Install dependencies in a single directory.
# Uses package-lock.json hash caching to skip installs when deps haven't changed.
# Runs npm ci --prefer-offline for speed and reproducibility.
install_dir() {
  local DIR="$1"
  local LOCK_FILE="$DIR/package-lock.json"
  local HASH_FILE="$DIR/.install-hash"
  if [ ! -d "$DIR" ]; then
    echo "[WARNING] Directory $DIR does not exist."
    return 0
  fi
  echo "[INFO] Checking dependencies in $DIR..."
  if [ ! -f "$LOCK_FILE" ]; then
    echo "[WARNING] No package-lock.json found in $DIR; running npm install --prefer-offline..."
    (cd "$DIR" && npm install --prefer-offline)
    return 0
  fi
  local CURRENT_HASH
  CURRENT_HASH=$(sha256sum "$LOCK_FILE" | awk '{print $1}')
  if [ -f "$HASH_FILE" ] && [ "$(cat "$HASH_FILE")" = "$CURRENT_HASH" ]; then
    echo "[INFO] Skipping install in $DIR: package-lock.json unchanged."
    return 0
  fi
  echo "[INFO] Installing dependencies in $DIR..."
  (cd "$DIR" && npm ci --prefer-offline && echo "$CURRENT_HASH" > .install-hash)
  echo "[INFO] Install complete in $DIR."
}
# Run installs for all directories in parallel
PIDS=()
for DIR in "${DIRECTORIES[@]}"; do
  install_dir "$DIR" &
  PIDS+=($!)
done
# Wait for all background installs and collect exit codes
EXIT_CODE=0
for PID in "${PIDS[@]}"; do
  if ! wait "$PID"; then
    EXIT_CODE=1
  fi
done
if [ "$EXIT_CODE" -ne 0 ]; then
  echo "[ERROR] One or more installs failed."
  exit 1
fi
echo "[INFO] Setup complete."