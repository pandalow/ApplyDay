@echo off
rem ApplyDay One-Click Deployment Script (Windows)
rem Author: ApplyDay Team
rem Date: 2025-09-08

setlocal enabledelayedexpansion
title ApplyDay Deployment Tool

rem Print color codes
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

rem Print messages with color
:print_message
echo %~2%~1%NC%
goto :eof

rem Check if command exists
:check_command
where %1 >nul 2>nul
if errorlevel 1 (
    call :print_message "Error: %1 is not installed. Please install %1 first." %RED%
    pause
    exit /b 1
)
goto :eof

rem 检查文件是否存在
:check_file
if not exist "%~1" (
    call :print_message "Error: File %~1 does not exist." %RED%
    pause
    exit /b 1
)
goto :eof

rem Main function
:main
call :print_message "🚀 ApplyDay One-Click Deployment Starting..." %BLUE%
call :print_message "========================================" %BLUE%

rem Check dependencies
call :print_message "📋 Checking system dependencies..." %YELLOW%
call :check_command docker
call :check_command docker-compose

rem Check required files
call :print_message "📁 Checking project files..." %YELLOW%
call :check_file "docker-compose.yml"
call :check_file "backend\Dockerfile"
call :check_file "frontend\Dockerfile"

rem Create environment variable file
call :print_message "⚙️  Configuring environment variables..." %YELLOW%
if not exist ".env" (
    (
        echo # Django configuration
        echo DJANGO_SECRET_KEY=your-secret-key-change-in-production
        echo DJANGO_DEBUG=False
        echo DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
        echo.
        echo # AI configuration (configure one of the following)
        echo # OpenAI
        echo OPENAI_API_KEY=your-openai-api-key
        echo.
        echo # Anthropic
        echo ANTHROPIC_API_KEY=your-anthropic-api-key
        echo.
        echo # Google
        echo GOOGLE_API_KEY=your-google-api-key
        echo.
        echo # Database configuration
        echo DATABASE_URL=sqlite:///app/db.sqlite3
        echo.
        echo # CORS configuration
        echo CORS_ALLOW_ALL_ORIGINS=True
        echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80,http://127.0.0.1:3000,http://127.0.0.1:80
    ) > .env
    call :print_message "✅ .env file created. Please modify the configuration as needed." %GREEN%
    call :print_message "⚠️  Please ensure the correct AI API Key is configured!" %YELLOW%
) else (
    call :print_message "✅ .env file already exists." %GREEN%
)

rem Create data directories
call :print_message "📂 Creating data directories..." %YELLOW%
if not exist "data" mkdir data
if not exist "backend\applyday" mkdir backend\applyday

rem Stop existing containers
call :print_message "🛑 Stopping existing services..." %YELLOW%
docker-compose down --remove-orphans >nul 2>nul

rem Clean up old images (optional)
set /p clean_images=" Clean up Docker images? (y/N): "
if /i "!clean_images!"=="y" (
    call :print_message "🧹 Cleaning up old images..." %YELLOW%
    docker system prune -f >nul 2>nul
    docker image prune -a -f >nul 2>nul
)

rem Build and start services
call :print_message "🔨 Building Docker images..." %YELLOW%
docker-compose build --no-cache
if errorlevel 1 (
    call :print_message "❌ Docker image build failed" %RED%
    pause
    exit /b 1
)

call :print_message "🚀 Starting services..." %YELLOW%
docker-compose up -d
if errorlevel 1 (
    call :print_message "❌ Service startup failed" %RED%
    pause
    exit /b 1
)

rem Wait for services to start
call :print_message "⏳ Waiting for services to start..." %YELLOW%
timeout /t 10 /nobreak >nul

rem Run database migrations
call :print_message "🗃️  Running database migrations..." %YELLOW%
docker-compose exec -T api python manage.py migrate
if errorlevel 1 (
    call :print_message "⚠️  Database migration may have failed, please check the logs" %YELLOW%
)

rem Create superuser (optional)
set /p create_superuser="Create Django superuser? (y/N): "
if /i "!create_superuser!"=="y" (
    call :print_message "👤 Creating superuser..." %YELLOW%
    docker-compose exec api python manage.py createsuperuser
)

rem Collect static files
call :print_message "📦 Collecting static files..." %YELLOW%
docker-compose exec -T api python manage.py collectstatic --noinput >nul 2>nul

rem Check service status
call :print_message "🔍 Checking service status..." %YELLOW%
docker-compose ps

rem Health check
call :print_message "🏥 Performing health check..." %YELLOW%
timeout /t 5 /nobreak >nul

rem Check backend (Windows does not have curl, use PowerShell)
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8000/app/info/' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host '✅ Backend service is running normally' -ForegroundColor Green } catch { Write-Host '❌ Backend service may have issues' -ForegroundColor Red }"

rem Check frontend
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:80' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host '✅ Frontend service is running normally' -ForegroundColor Green } catch { Write-Host '❌ Frontend service may have issues' -ForegroundColor Red }"

rem Deployment complete
call :print_message "========================================" %BLUE%
call :print_message "🎉 Deployment complete!" %GREEN%
call :print_message "📱 Frontend URL: http://localhost" %GREEN%
call :print_message "🔧 Backend API: http://localhost:8000" %GREEN%
call :print_message "📊 Admin Panel: http://localhost:8000/admin" %GREEN%
call :print_message "========================================" %BLUE%

rem Show logs
set /p show_logs="View real-time logs? (y/N): "
if /i "!show_logs!"=="y" (
    call :print_message "📄 Showing real-time logs (Press Ctrl+C to exit)..." %YELLOW%
    docker-compose logs -f
)

goto :eof

rem Help information
:show_help
echo ApplyDay One-Click Deployment Script (Windows)
echo.
echo Usage: %~nx0 [options]
echo.
echo Options:
echo   -h, --help     Show help information
echo   -c, --clean    Clean mode (stop and remove all containers and images)
echo   -r, --restart  Restart services
echo   -l, --logs     Show logs
echo   -s, --status   Show service status
echo.
echo Example:
echo   %~nx0              # Normal deployment
echo   %~nx0 --clean     # Clean mode deployment
echo   %~nx0 --restart   # Restart services
echo   %~nx0 --logs      # Show logs
goto :eof

rem Clean mode
:clean_mode
call :print_message "🧹 Clean mode activated..." %YELLOW%
docker-compose down --volumes --remove-orphans
docker system prune -a -f
docker volume prune -f
call :print_message "✅ Clean up complete" %GREEN%
goto :eof

rem Restart services
:restart_services
call :print_message "🔄 Restarting services..." %YELLOW%
docker-compose restart
call :print_message "✅ Services have been restarted" %GREEN%
goto :eof

rem Show logs
:show_logs
call :print_message "📄 Showing logs..." %YELLOW%
docker-compose logs -f
goto :eof

rem Show status
:show_status
call :print_message "📊 Service status:" %YELLOW%
docker-compose ps
echo.
call :print_message "💾 Disk usage:" %YELLOW%
docker system df
goto :eof

rem Parse command line arguments
if "%~1"=="-h" goto show_help
if "%~1"=="--help" goto show_help
if "%~1"=="-c" (
    call :clean_mode
    call :main
    goto :end
)
if "%~1"=="--clean" (
    call :clean_mode
    call :main
    goto :end
)
if "%~1"=="-r" (
    call :restart_services
    goto :end
)
if "%~1"=="--restart" (
    call :restart_services
    goto :end
)
if "%~1"=="-l" (
    call :show_logs
    goto :end
)
if "%~1"=="--logs" (
    call :show_logs
    goto :end
)
if "%~1"=="-s" (
    call :show_status
    goto :end
)
if "%~1"=="--status" (
    call :show_status
    goto :end
)
if "%~1"=="" (
    call :main
    goto :end
)

rem Unknown option
call :print_message "Unknown option: %~1" %RED%
call :show_help

:end
pause
