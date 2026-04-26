@echo off
echo ========================================
echo Starting AI HealthOS (Development Mode)
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "ai-healthos-frontend" (
    echo Error: Please run this script from the Hackathon1.1L folder
    pause
    exit /b 1
)

echo [1/2] Copying API Test files to public folder...
if not exist "ai-healthos-frontend\public" mkdir ai-healthos-frontend\public
copy "api test\*.*" "ai-healthos-frontend\public\" >nul
echo API Test files copied!
echo.

echo [2/2] Starting Frontend Development Server...
echo.
echo Services will be available at:
echo - Frontend: http://localhost:5173
echo - API Test (standalone): Open api test\index.html in browser
echo.
echo Note: Backend should be running separately on port 8080
echo Press Ctrl+C to stop the frontend
echo ========================================
echo.

cd ai-healthos-frontend
npm run dev
