#!/usr/bin/env bash


handle_start() {
  echo "[INFO] Starting services..."

  if [ -d "server" ]; then
    echo "[INFO] Starting backend..."
    cd server || exit 1
    
    npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    disown $BACKEND_PID
    
    echo "[INFO] Checking backend health... (logs: backend.log)"
    cd ..
    
    check_health() {
      for i in {1..15}; do
        
        if curl -f -s http://localhost:5001/api/health > /dev/null; then
          echo "[OK] Backend is Up!"
          return 0
        fi
        echo "[INFO] Waiting for backend to start... (Attempt $i/15)"
        sleep 2
      done
      echo "[FAIL] Backend did not start in time"
      exit 1
    }
    
    check_health
    
  else
    echo "[WARNING] Backend directory 'server' not found."
  fi


  if [ -d "client" ]; then
    echo "[INFO] Starting frontend..."
    cd client || exit 1

    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    disown $FRONTEND_PID
    cd ..

    check_frontend_health() {
      for i in {1..15}; do
        if curl -f -s http://localhost:5173 > /dev/null; then
          echo "[OK] Frontend is Up!"
          return 0
        fi
        echo "[INFO] Waiting for frontend to start... (Attempt $i/15)"
        sleep 2
      done
      echo "[FAIL] Frontend did not start in time. Check frontend.log for errors."
      exit 1
    }

    check_frontend_health

  else
    echo "[WARNING] Frontend directory 'client' not found."
  fi

  echo "[INFO] Services started."
  if [ -n "$BACKEND_PID" ]; then echo "Backend PID: $BACKEND_PID"; fi
  if [ -n "$FRONTEND_PID" ]; then echo "Frontend PID: $FRONTEND_PID"; fi
}



handle_stop() {
  echo "[INFO] Stopping services..."


  if [ -f "backend.pid" ]; then
    TARGET_PID=$(cat backend.pid)
    echo "[INFO] Killing backend (PID: $TARGET_PID)..."
    kill $TARGET_PID 2>/dev/null
    rm backend.pid
  else
    echo "[INFO] No backend.pid found."
  fi


  if [ -f "frontend.pid" ]; then
    TARGET_PID=$(cat frontend.pid)
    echo "[INFO] Killing frontend (PID: $TARGET_PID)..."
    kill $TARGET_PID 2>/dev/null
    rm frontend.pid
  else
    echo "[INFO] No frontend.pid found."
  fi
  
  echo "[INFO] Services stopped."
}

if [ "$1" == "start" ]; then
  handle_start
elif [ "$1" == "stop" ]; then
  handle_stop
else
  echo "Usage: ./dev-services.sh start|stop"
  exit 1
fi
