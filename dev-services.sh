#!/usr/bin/env bash
# Service manager for ShopsMart - safe for use in non-interactive SSH sessions

# ── System Optimizations (Swap for t2.micro) ──
if [ ! -f /swapfile ]; then
    echo "[INFO] Creating 2GB swap file for low-memory stability..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo "[OK] Swap enabled."
fi

# ── Global Dependencies ──
echo "[INFO] Installing global utilities..."
sudo npm install -g serve 2>/dev/null || npm install -g serve --force

handle_start() {
  echo "[INFO] Starting services..."

  if [ -d "server" ]; then
    echo "[INFO] Starting backend..."
    cd server || { echo "[ERROR] Cannot enter server dir"; exit 1; }
    nohup npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    disown $BACKEND_PID
    cd ..
    echo "[INFO] Backend started with PID: $BACKEND_PID"
  else
    echo "[WARNING] Backend directory 'server' not found."
  fi

  if [ -d "client" ]; then
    echo "[INFO] Building and starting frontend..."
    cd client || { echo "[ERROR] Cannot enter client dir"; exit 1; }
    
    # Check if dist exists, build if not or if specifically needed
    if [ ! -d "dist" ]; then
      echo "[INFO] Dist directory not found, building..."
      npm run build
    fi

    nohup serve -s dist -l 5173 > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    disown $FRONTEND_PID
    cd ..
    echo "[INFO] Frontend serving on port 5173 with PID: $FRONTEND_PID"
  else
    echo "[WARNING] Frontend directory 'client' not found."
  fi

  echo "[INFO] All services launched in background."
  return 0
}

handle_stop() {
  echo "[INFO] Stopping services..."

  if [ -f "backend.pid" ]; then
    TARGET_PID=$(cat backend.pid)
    echo "[INFO] Killing backend (PID: $TARGET_PID)..."
    kill "$TARGET_PID" 2>/dev/null || true
    rm -f backend.pid
  else
    echo "[INFO] No backend.pid found."
  fi

  if [ -f "frontend.pid" ]; then
    TARGET_PID=$(cat frontend.pid)
    echo "[INFO] Killing frontend (PID: $TARGET_PID)..."
    kill "$TARGET_PID" 2>/dev/null || true
    rm -f frontend.pid
  else
    echo "[INFO] No frontend.pid found."
  fi

  echo "[INFO] Services stopped."
  return 0
}

case "${1:-}" in
  start) handle_start ;;
  stop)  handle_stop  ;;
  *)
    echo "Usage: $0 start|stop"
    exit 1
    ;;
esac