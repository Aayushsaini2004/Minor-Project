@echo off
echo ========================================
echo Starting AI HealthOS with API Test
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "ai-healthos-frontend" (
    echo Error: Please run this script from the Hackathon1.1L folder
    pause
    exit /b 1
)

echo [1/3] Building Frontend...
cd ai-healthos-frontend
call npm run build
cd ..
echo Frontend built successfully!
echo.

echo [2/3] Copying API Test files to public folder...
if not exist "ai-healthos-frontend\public" mkdir ai-healthos-frontend\public
copy "api test\*.*" "ai-healthos-frontend\public\" >nul
echo API Test files copied!
echo.

echo [3/3] Starting all services...
echo.
echo Services will be available at:
echo - Frontend: http://localhost:5173
echo - API Test: http://localhost:5173/api-test
echo - Backend: http://localhost:8080
echo - AI Service: http://localhost:8000
echo.
echo Press Ctrl+C to stop all services
echo ========================================
echo.

REM Start backend
start "Backend" cmd /k "cd ai-healthos-backend && mvn spring-boot:run"

REM Wait a bit for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
start "Frontend" cmd /k "cd ai-healthos-frontend && npm run dev"

REM Keep this window open
pause
