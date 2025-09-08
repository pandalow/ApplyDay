@echo off
rem ApplyDay One-Click Deployment Script for Windows
rem Author: ApplyDay Team
rem Date: 2025-09-08

setlocal enabledelayedexpansion
title ApplyDay Deployment Tool

rem Entry point - call main function
if "%~1"=="" (
    call :main
    goto :end
)

rem Print message function
:print_message
echo %~1
goto :eof

rem Check if command exists
:check_command
where %1 >nul 2>nul
if errorlevel 1 (
    call :print_message "Error: %1 is not installed. Please install %1 first."
    pause
    exit /b 1
)
goto :eof

rem Check if file exists
:check_file
if not exist "%~1" (
    call :print_message "Error: File %~1 does not exist."
    pause
    exit /b 1
)
goto :eof

rem Main deployment function
:main
call :print_message "ApplyDay One-Click Deployment Starting..."
call :print_message "========================================"

rem Check dependencies
call :print_message "Checking system dependencies..."
call :check_command docker
call :check_command docker-compose

rem Check required files
call :print_message "Checking project files..."
call :check_file "docker-compose.yml"
call :check_file "backend\Dockerfile"
call :check_file "frontend\Dockerfile"

rem Create environment variable file
call :print_message "Configuring environment variables..."
if not exist ".env" (
    echo # Django configuration > .env
    echo DJANGO_SECRET_KEY=your-secret-key-change-in-production >> .env
    echo DJANGO_DEBUG=False >> .env
    echo DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0 >> .env
    echo. >> .env
    echo # AI configuration >> .env
    echo OPENAI_API_KEY=your-openai-api-key >> .env
    echo ANTHROPIC_API_KEY=your-anthropic-api-key >> .env
    echo GOOGLE_API_KEY=your-google-api-key >> .env
    echo. >> .env
    echo # Database configuration >> .env
    echo DATABASE_URL=sqlite:///app/db.sqlite3 >> .env
    echo. >> .env
    echo # CORS configuration >> .env
    echo CORS_ALLOW_ALL_ORIGINS=True >> .env
    echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80,http://127.0.0.1:3000,http://127.0.0.1:80 >> .env
    call :print_message ".env file created. Please modify the configuration as needed."
    call :print_message "Please ensure the correct AI API Key is configured!"
) else (
    call :print_message ".env file already exists."
)

rem Create data directories
call :print_message "Creating data directories..."
if not exist "data" mkdir data
if not exist "backend\applyday" mkdir backend\applyday

rem Stop existing containers
call :print_message "Stopping existing services..."
docker-compose down --remove-orphans >nul 2>nul

rem Build and start services
call :print_message "Building Docker images..."
docker-compose build --no-cache
if errorlevel 1 (
    call :print_message "Docker image build failed"
    pause
    exit /b 1
)

call :print_message "Starting services..."
docker-compose up -d
if errorlevel 1 (
    call :print_message "Service startup failed"
    pause
    exit /b 1
)

rem Wait for services to start and complete initialization
call :print_message "Waiting for services to start and initialize (database migration, etc.)..."
call :print_message "This may take up to 2 minutes on first run..."
timeout /t 30 /nobreak >nul

rem Check service status
call :print_message "Checking service status..."
docker-compose ps

rem Health check
call :print_message "Performing health check..."
timeout /t 10 /nobreak >nul

rem Check backend
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8000/app/info/' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host 'Backend service is running normally' -ForegroundColor Green } catch { Write-Host 'Backend service may have issues' -ForegroundColor Red }"

rem Check frontend
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:80' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host 'Frontend service is running normally' -ForegroundColor Green } catch { Write-Host 'Frontend service may have issues' -ForegroundColor Red }"

rem Deployment complete
call :print_message "========================================"
call :print_message "Deployment complete!"
call :print_message "Database migrations run automatically on startup"
call :print_message "Default superuser: admin/admin123 (if created)"
call :print_message "Frontend URL: http://localhost"
call :print_message "Backend API: http://localhost:8000"
call :print_message "Admin Panel: http://localhost:8000/admin"
call :print_message "========================================"

pause

:end
