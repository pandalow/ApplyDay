@echo off
rem ApplyDay 一键部署脚本 (Windows)
rem 作者: ApplyDay Team
rem 日期: 2025-09-08

setlocal enabledelayedexpansion
title ApplyDay 部署工具

rem 设置颜色代码
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

rem 打印带颜色的消息
:print_message
echo %~2%~1%NC%
goto :eof

rem 检查命令是否存在
:check_command
where %1 >nul 2>nul
if errorlevel 1 (
    call :print_message "错误: %1 未安装，请先安装 %1" %RED%
    pause
    exit /b 1
)
goto :eof

rem 检查文件是否存在
:check_file
if not exist "%~1" (
    call :print_message "错误: 文件 %~1 不存在" %RED%
    pause
    exit /b 1
)
goto :eof

rem 主函数
:main
call :print_message "🚀 ApplyDay 一键部署开始..." %BLUE%
call :print_message "========================================" %BLUE%

rem 检查依赖
call :print_message "📋 检查系统依赖..." %YELLOW%
call :check_command docker
call :check_command docker-compose

rem 检查必要文件
call :print_message "📁 检查项目文件..." %YELLOW%
call :check_file "docker-compose.yml"
call :check_file "backend\Dockerfile"
call :check_file "frontend\Dockerfile"

rem 创建环境变量文件
call :print_message "⚙️  配置环境变量..." %YELLOW%
if not exist ".env" (
    (
        echo # Django 配置
        echo DJANGO_SECRET_KEY=your-secret-key-change-in-production
        echo DJANGO_DEBUG=False
        echo DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
        echo.
        echo # AI 配置 ^(根据需要配置其中一个^)
        echo # OpenAI
        echo OPENAI_API_KEY=your-openai-api-key
        echo.
        echo # Anthropic
        echo ANTHROPIC_API_KEY=your-anthropic-api-key
        echo.
        echo # Google
        echo GOOGLE_API_KEY=your-google-api-key
        echo.
        echo # 数据库配置
        echo DATABASE_URL=sqlite:///app/db.sqlite3
        echo.
        echo # CORS 配置
        echo CORS_ALLOW_ALL_ORIGINS=True
        echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80,http://127.0.0.1:3000,http://127.0.0.1:80
    ) > .env
    call :print_message "✅ 已创建 .env 文件，请根据需要修改配置" %GREEN%
    call :print_message "⚠️  请确保配置正确的 AI API Key!" %YELLOW%
) else (
    call :print_message "✅ .env 文件已存在" %GREEN%
)

rem 创建数据目录
call :print_message "📂 创建数据目录..." %YELLOW%
if not exist "data" mkdir data
if not exist "backend\applyday" mkdir backend\applyday

rem 停止现有容器
call :print_message "🛑 停止现有服务..." %YELLOW%
docker-compose down --remove-orphans >nul 2>nul

rem 清理旧镜像 (可选)
set /p clean_images="是否清理旧的 Docker 镜像? (y/N): "
if /i "!clean_images!"=="y" (
    call :print_message "🧹 清理旧镜像..." %YELLOW%
    docker system prune -f >nul 2>nul
    docker image prune -a -f >nul 2>nul
)

rem 构建和启动服务
call :print_message "🔨 构建 Docker 镜像..." %YELLOW%
docker-compose build --no-cache
if errorlevel 1 (
    call :print_message "❌ Docker 镜像构建失败" %RED%
    pause
    exit /b 1
)

call :print_message "🚀 启动服务..." %YELLOW%
docker-compose up -d
if errorlevel 1 (
    call :print_message "❌ 服务启动失败" %RED%
    pause
    exit /b 1
)

rem 等待服务启动
call :print_message "⏳ 等待服务启动..." %YELLOW%
timeout /t 10 /nobreak >nul

rem 运行数据库迁移
call :print_message "🗃️  运行数据库迁移..." %YELLOW%
docker-compose exec -T api python manage.py migrate
if errorlevel 1 (
    call :print_message "⚠️  数据库迁移可能失败，请检查日志" %YELLOW%
)

rem 创建超级用户 (可选)
set /p create_superuser="是否创建 Django 超级用户? (y/N): "
if /i "!create_superuser!"=="y" (
    call :print_message "👤 创建超级用户..." %YELLOW%
    docker-compose exec api python manage.py createsuperuser
)

rem 收集静态文件
call :print_message "📦 收集静态文件..." %YELLOW%
docker-compose exec -T api python manage.py collectstatic --noinput >nul 2>nul

rem 检查服务状态
call :print_message "🔍 检查服务状态..." %YELLOW%
docker-compose ps

rem 健康检查
call :print_message "🏥 进行健康检查..." %YELLOW%
timeout /t 5 /nobreak >nul

rem 检查后端 (Windows 没有 curl，使用 PowerShell)
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8000/app/info/' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host '✅ 后端服务运行正常' -ForegroundColor Green } catch { Write-Host '❌ 后端服务可能有问题' -ForegroundColor Red }"

rem 检查前端
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:80' -UseBasicParsing -TimeoutSec 5 | Out-Null; Write-Host '✅ 前端服务运行正常' -ForegroundColor Green } catch { Write-Host '❌ 前端服务可能有问题' -ForegroundColor Red }"

rem 部署完成
call :print_message "========================================" %BLUE%
call :print_message "🎉 部署完成!" %GREEN%
call :print_message "📱 前端地址: http://localhost" %GREEN%
call :print_message "🔧 后端 API: http://localhost:8000" %GREEN%
call :print_message "📊 管理后台: http://localhost:8000/admin" %GREEN%
call :print_message "========================================" %BLUE%

rem 显示日志
set /p show_logs="是否查看实时日志? (y/N): "
if /i "!show_logs!"=="y" (
    call :print_message "📄 显示实时日志 (按 Ctrl+C 退出)..." %YELLOW%
    docker-compose logs -f
)

goto :eof

rem 帮助信息
:show_help
echo ApplyDay 一键部署脚本 (Windows)
echo.
echo 用法: %~nx0 [选项]
echo.
echo 选项:
echo   -h, --help     显示帮助信息
echo   -c, --clean    清理模式 (停止并删除所有容器和镜像)
echo   -r, --restart  重启服务
echo   -l, --logs     显示日志
echo   -s, --status   显示服务状态
echo.
echo 示例:
echo   %~nx0              # 正常部署
echo   %~nx0 --clean     # 清理模式部署
echo   %~nx0 --restart   # 重启服务
echo   %~nx0 --logs      # 查看日志
goto :eof

rem 清理模式
:clean_mode
call :print_message "🧹 清理模式启动..." %YELLOW%
docker-compose down --volumes --remove-orphans
docker system prune -a -f
docker volume prune -f
call :print_message "✅ 清理完成" %GREEN%
goto :eof

rem 重启服务
:restart_services
call :print_message "🔄 重启服务..." %YELLOW%
docker-compose restart
call :print_message "✅ 服务已重启" %GREEN%
goto :eof

rem 显示日志
:show_logs
call :print_message "📄 显示日志..." %YELLOW%
docker-compose logs -f
goto :eof

rem 显示状态
:show_status
call :print_message "📊 服务状态:" %YELLOW%
docker-compose ps
echo.
call :print_message "💾 磁盘使用:" %YELLOW%
docker system df
goto :eof

rem 解析命令行参数
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

rem 未知选项
call :print_message "未知选项: %~1" %RED%
call :show_help

:end
pause
