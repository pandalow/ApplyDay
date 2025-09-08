#!/bin/bash

# ApplyDay One-Click Deployment Script (Linux/macOS)
# Author: ApplyDay Team
# Date: 2025-09-08

set -e  # Exit immediately if a command exits with a non-zero status

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

# Check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_message "Error: $1 is not installed. Please install $1 first." $RED
        exit 1
    fi
}

# Check if a file exists
check_file() {
    if [ ! -f "$1" ]; then
        print_message "Error: File $1 does not exist." $RED
        exit 1
    fi
}

# Main function
main() {
    print_message "🚀 ApplyDay One-Click Deployment Script Starting..." $BLUE
    print_message "========================================" $BLUE

    # Check dependencies
    print_message "📋 Checking system dependencies..." $YELLOW
    check_command "docker"
    check_command "docker-compose"
    check_command "git"

    # Check required files
    print_message "📁 Checking project files..." $YELLOW
    check_file "docker-compose.yml"
    check_file "backend/Dockerfile"
    check_file "frontend/Dockerfile"

    # Create environment variable file
    print_message "⚙️  Configuring environment variables..." $YELLOW
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Django configuration
DJANGO_SECRET_KEY=your-secret-key-change-in-production
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# AI configuration (configure one as needed)
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key

# Google
GOOGLE_API_KEY=your-google-api-key

# Database configuration
DATABASE_URL=sqlite:///app/db.sqlite3

# CORS configuration
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:80,http://127.0.0.1:3000,http://127.0.0.1:80
EOF
        print_message "✅ .env file created. Please modify the configuration as needed." $GREEN
        print_message "⚠️  Please ensure the correct AI API Key is configured!" $YELLOW
    else
        print_message "✅ .env file already exists." $GREEN
    fi

    # Create data directories
    print_message "📂 Creating data directories..." $YELLOW
    mkdir -p data
    mkdir -p backend/applyday

    # Stop existing containers
    print_message "🛑 Stopping existing services..." $YELLOW
    docker-compose down --remove-orphans || true

    # Clean up old images (optional)
    read -p "Do you want to clean up old Docker images? (y/N): " clean_images
    if [[ $clean_images =~ ^[Yy]$ ]]; then
        print_message "🧹 Cleaning up old images..." $YELLOW
        docker system prune -f
        docker image prune -a -f
    fi

    # Build and start services
    print_message "🔨 Building Docker images..." $YELLOW
    docker-compose build --no-cache

    print_message "🚀 Starting services..." $YELLOW
    docker-compose up -d

    # Wait for services to start
    print_message "⏳ Waiting for services to start..." $YELLOW
    sleep 10

    # Run database migrations
    print_message "🗃️  Running database migrations..." $YELLOW
    docker-compose exec -T api python manage.py migrate

    # Create superuser (optional)
    read -p "Do you want to create a Django superuser? (y/N): " create_superuser
    if [[ $create_superuser =~ ^[Yy]$ ]]; then
        print_message "👤 Creating superuser..." $YELLOW
        docker-compose exec api python manage.py createsuperuser
    fi

    # Collect static files
    print_message "📦 Collecting static files..." $YELLOW
    docker-compose exec -T api python manage.py collectstatic --noinput || true

    # Check service status
    print_message "🔍 Checking service status..." $YELLOW
    docker-compose ps

    # Health check
    print_message "🏥 Performing health checks..." $YELLOW
    sleep 5

    # Check backend
    if curl -f http://localhost:8000/app/info/ > /dev/null 2>&1; then
        print_message "✅ Backend service is running normally" $GREEN
    else
        print_message "❌ Backend service may have issues" $RED
    fi

    # Check frontend
    if curl -f http://localhost:80 > /dev/null 2>&1; then
        print_message "✅ Frontend service is running normally" $GREEN
    else
        print_message "❌ Frontend service may have issues" $RED
    fi

    # Deployment complete
    print_message "========================================" $BLUE
    print_message "🎉 Deployment complete!" $GREEN
    print_message "📱 Frontend URL: http://localhost" $GREEN
    print_message "🔧 Backend API: http://localhost:8000" $GREEN
    print_message "📊 Admin Panel: http://localhost:8000/admin" $GREEN
    print_message "========================================" $BLUE

    # Show logs
    read -p "Do you want to view real-time logs? (y/N): " show_logs
    if [[ $show_logs =~ ^[Yy]$ ]]; then
        print_message "📄 Showing real-time logs (Press Ctrl+C to exit)..." $YELLOW
        docker-compose logs -f
    fi
}

# Help information
show_help() {
    echo "ApplyDay One-Click Deployment Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show help information"
    echo "  -c, --clean    Clean mode (stop and remove all containers and images)"
    echo "  -r, --restart  Restart services"
    echo "  -l, --logs     Show logs"
    echo "  -s, --status   Show service status"
    echo ""
    echo "Examples:"
    echo "  $0              # Normal deployment"
    echo "  $0 --clean     # Clean mode deployment"
    echo "  $0 --restart   # Restart services"
    echo "  $0 --logs      # Show logs"
}

# Clean mode
clean_mode() {
    print_message "🧹 Clean mode activated..." $YELLOW
    docker-compose down --volumes --remove-orphans
    docker system prune -a -f
    docker volume prune -f
    print_message "✅ Cleanup complete" $GREEN
}

# Restart services
restart_services() {
    print_message "🔄 Restarting services..." $YELLOW
    docker-compose restart
    print_message "✅ Services restarted" $GREEN
}

# Show logs
show_logs() {
    print_message "📄 Showing logs..." $YELLOW
    docker-compose logs -f
}

# Show status
show_status() {
    print_message "📊 Service status:" $YELLOW
    docker-compose ps
    echo ""
    print_message "💾 Disk usage:" $YELLOW
    docker system df
}

# Parse command line arguments
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
        print_message "Unknown option: $1" $RED
        show_help
        exit 1
        ;;
esac
