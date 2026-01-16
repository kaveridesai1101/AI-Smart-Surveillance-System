@echo off
echo Starting Sentinel AI - Enterprise Surveillance System...

start "Sentinel Backend" powershell -Command ".\venv\Scripts\python -m backend.main"
start "Sentinel Frontend" powershell -Command "cd frontend; npm run dev"

echo Started both services. 
echo Backend: http://localhost:8001
echo Frontend: http://localhost:5173
pause
