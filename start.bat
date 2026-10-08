@echo off
TITLE AI-Powered Smart Fake Account Detector - Launcher
echo ========================================================
echo   AI-POWERED SMART FAKE ACCOUNT DETECTOR
echo   Starting Backend (FastAPI + OpenCV) and Frontend (Vite)
echo ========================================================
echo.

REM Start Backend
start "Fake Account Detector - Backend (Port 8000)" cmd /k "python backend\run.py"

REM Start Frontend
start "Fake Account Detector - Frontend (Port 5173)" cmd /k "cd frontend && npm run dev -- --host 127.0.0.1"

echo.
echo ========================================================
echo   Services are starting!
echo   - Backend API: http://127.0.0.1:8000 (Docs: /docs)
echo   - Frontend UI: http://127.0.0.1:5173
echo ========================================================
echo.
pause
