#!/usr/bin/env bash
# AI-Powered Smart Fake Account Detector - Linux/macOS launcher

echo "Starting Backend on http://127.0.0.1:8000..."
python3 backend/run.py &
BACKEND_PID=$!

echo "Starting Frontend on http://127.0.0.1:5173..."
cd frontend && npm run dev -- --host 127.0.0.1 &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
