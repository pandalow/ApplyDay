#!/bin/bash

# ApplyDay 一键部署脚本 (Linux/macOS)
# 作者: ApplyDay Team
# 日期: 2025-09-08

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${2}${1}${NC}"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message "错误: $1 未安装，请先安装 $1" $RED
        exit 1
    fi
}

# 检查文件是否存在
check_file() {
    if [ ! -f "$1" ]; then
        print_message "错误: 文件 $1 不存在" $RED
        exit 1
    fi
}

# 主函数
main() {
    print_message "🚀 ApplyDay 一键部署开始..." $BLUE
    print_message "========================================" $BLUE
    
    # 检查依赖
    print_message "📋 检查系统依赖..." $YELLOW
    check_command "docker"
    check_command "docker-compose"
    check_command "git"
    
    # 检查必要文件
    print_message "📁 检查项目文件..." $YELLOW
    check_file "docker-compose.yml"
    check_file "backend/Dockerfile"
    check_file "frontend/Dockerfile"
    
    # 创建环境变量文件
    print_message "⚙️  配置环境变量..." $YELLOW
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Django 配置
DJANGO_SECRET_KEY=your-secret-key-change-in-production
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# AI 配置 (根据需要配置其中一个)
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key

# Google
GOOGLE_API_KEY=your-google-api-key

# 数据库配置
DATABASE_URL=sqlite:///app/db.sqlite3

# CORS 配置
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80,http://127.0.0.1:3000,http://127.0.0.1:80
EOF
        print_message "✅ 已创建 .env 文件，请根据需要修改配置" $GREEN
        print_message "⚠️  请确保配置正确的 AI API Key!" $YELLOW
    else
        print_message "✅ .env 文件已存在" $GREEN
    fi
    
    # 创建数据目录
    print_message "📂 创建数据目录..." $YELLOW
    mkdir -p data
    mkdir -p backend/applyday
    
    # 停止现有容器
    print_message "🛑 停止现有服务..." $YELLOW
    docker-compose down --remove-orphans || true
    
    # 清理旧镜像 (可选)
    read -p "是否清理旧的 Docker 镜像? (y/N): " clean_images
    if [[ $clean_images =~ ^[Yy]$ ]]; then
        print_message "🧹 清理旧镜像..." $YELLOW
        docker system prune -f
        docker image prune -a -f
    fi
    
    # 构建和启动服务
    print_message "🔨 构建 Docker 镜像..." $YELLOW
    docker-compose build --no-cache
    
    print_message "🚀 启动服务..." $YELLOW
    docker-compose up -d
    
    # 等待服务启动
    print_message "⏳ 等待服务启动..." $YELLOW
    sleep 10
    
    # 运行数据库迁移
    print_message "🗃️  运行数据库迁移..." $YELLOW
    docker-compose exec -T api python manage.py migrate
    
    # 创建超级用户 (可选)
    read -p "是否创建 Django 超级用户? (y/N): " create_superuser
    if [[ $create_superuser =~ ^[Yy]$ ]]; then
        print_message "👤 创建超级用户..." $YELLOW
        docker-compose exec api python manage.py createsuperuser
    fi
    
    # 收集静态文件
    print_message "📦 收集静态文件..." $YELLOW
    docker-compose exec -T api python manage.py collectstatic --noinput || true
    
    # 检查服务状态
    print_message "🔍 检查服务状态..." $YELLOW
    docker-compose ps
    
    # 健康检查
    print_message "🏥 进行健康检查..." $YELLOW
    sleep 5
    
    # 检查后端
    if curl -f http://localhost:8000/app/info/ > /dev/null 2>&1; then
        print_message "✅ 后端服务运行正常" $GREEN
    else
        print_message "❌ 后端服务可能有问题" $RED
    fi
    
    # 检查前端
    if curl -f http://localhost:80 > /dev/null 2>&1; then
        print_message "✅ 前端服务运行正常" $GREEN
    else
        print_message "❌ 前端服务可能有问题" $RED
    fi
    
    # 部署完成
    print_message "========================================" $BLUE
    print_message "🎉 部署完成!" $GREEN
    print_message "📱 前端地址: http://localhost" $GREEN
    print_message "🔧 后端 API: http://localhost:8000" $GREEN
    print_message "📊 管理后台: http://localhost:8000/admin" $GREEN
    print_message "========================================" $BLUE
    
    # 显示日志
    read -p "是否查看实时日志? (y/N): " show_logs
    if [[ $show_logs =~ ^[Yy]$ ]]; then
        print_message "📄 显示实时日志 (按 Ctrl+C 退出)..." $YELLOW
        docker-compose logs -f
    fi
}

# 帮助信息
show_help() {
    echo "ApplyDay 一键部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -c, --clean    清理模式 (停止并删除所有容器和镜像)"
    echo "  -r, --restart  重启服务"
    echo "  -l, --logs     显示日志"
    echo "  -s, --status   显示服务状态"
    echo ""
    echo "示例:"
    echo "  $0              # 正常部署"
    echo "  $0 --clean     # 清理模式部署"
    echo "  $0 --restart   # 重启服务"
    echo "  $0 --logs      # 查看日志"
}

# 清理模式
clean_mode() {
    print_message "🧹 清理模式启动..." $YELLOW
    docker-compose down --volumes --remove-orphans
    docker system prune -a -f
    docker volume prune -f
    print_message "✅ 清理完成" $GREEN
}

# 重启服务
restart_services() {
    print_message "🔄 重启服务..." $YELLOW
    docker-compose restart
    print_message "✅ 服务已重启" $GREEN
}

# 显示日志
show_logs() {
    print_message "📄 显示日志..." $YELLOW
    docker-compose logs -f
}

# 显示状态
show_status() {
    print_message "📊 服务状态:" $YELLOW
    docker-compose ps
    echo ""
    print_message "💾 磁盘使用:" $YELLOW
    docker system df
}

# 解析命令行参数
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -c|--clean)
        clean_mode
        main
        exit 0
        ;;
    -r|--restart)
        restart_services
        exit 0
        ;;
    -l|--logs)
        show_logs
        exit 0
        ;;
    -s|--status)
        show_status
        exit 0
        ;;
    "")
        main
        exit 0
        ;;
    *)
        print_message "未知选项: $1" $RED
        show_help
        exit 1
        ;;
esac
