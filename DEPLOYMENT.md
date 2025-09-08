# 🚀 ApplyDay One-Click Deployment Guide

This project provides two one-click deployment scripts that support fast deployment on Linux/macOS and Windows systems.

## 📋 System Requirements

### Required Software:
- **Docker**: [Installation Guide](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Installation Guide](https://docs.docker.com/compose/install/)
- **Git**: [Installation Guide](https://git-scm.com/downloads)

### System Compatibility:
- ✅ Linux (Ubuntu, CentOS, Debian, etc.)
- ✅ macOS (Intel and Apple Silicon)
- ✅ Windows 10/11 (WSL2 recommended)

## 🔧 Deployment Steps

### 1. Clone the Project
```bash
git clone https://github.com/pandalow/applyday.git
cd applyday
```

### 2. Configure Environment Variables
Copy the environment variable template and configure:
```bash
# Linux/macOS
cp .env.example .env

# Windows
copy .env.example .env
```

Edit the `.env` file and **configure at least one AI API Key**:
- `OPENAI_API_KEY`: OpenAI GPT API key
- `ANTHROPIC_API_KEY`: Anthropic Claude API key  
- `GOOGLE_API_KEY`: Google Gemini API key

### 3. Execute Deployment

#### Linux/macOS Systems:
```bash
# Grant execution permissions
chmod +x deploy.sh

# Execute deployment
./deploy.sh
```

#### Windows Systems:
```cmd
# Run the batch file directly
deploy.bat
```

## 📝 Script Usage

### Basic Usage

#### Linux/macOS:
```bash
./deploy.sh              # Standard deployment
./deploy.sh --clean      # Clean mode deployment
./deploy.sh --restart    # Restart services
./deploy.sh --logs       # View logs
./deploy.sh --status     # View status
./deploy.sh --help       # Show help
```

#### Windows:
```cmd
deploy.bat              # Standard deployment
deploy.bat --clean      # Clean mode deployment
deploy.bat --restart    # Restart services
deploy.bat --logs       # View logs
deploy.bat --status     # View status
deploy.bat --help       # Show help
```

### Deployment Options

| Option | Function | Description |
|--------|----------|-------------|
| No parameters | Standard deployment | Normal deployment process |
| `--clean` | Clean deployment | Delete old containers and images before redeployment |
| `--restart` | Restart services | Restart existing services |
| `--logs` | View logs | Display real-time log output |
| `--status` | Service status | Show container status and disk usage |
| `--help` | Help information | Display usage instructions |

## 🌐 Service Access

After successful deployment, you can access the services through the following URLs:

- 🖥️ **Frontend Application**: http://localhost
- 🔧 **Backend API**: http://localhost:8000
- 📊 **Admin Panel**: http://localhost:8000/admin

## 🛠️ Common Issues

### 1. Port Already in Use
If ports 80 or 8000 are occupied, please:
- Stop the services occupying the ports
- Or modify the port mappings in `docker-compose.yml`

### 2. Docker Permission Issues (Linux)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Re-login or execute
newgrp docker
```

### 3. AI API Configuration Error
Ensure that at least one AI API Key is correctly configured in the `.env` file:
```bash
# Check configuration
cat .env | grep API_KEY
```

### 4. Insufficient Memory
Recommend at least 4GB of available system memory. If memory is insufficient:
- Close other applications
- Or consider using a lighter deployment method

### 5. Network Issues
If Docker image downloads are slow:
```bash
# Configure Docker registry mirror (for Chinese users)
# Alibaba Cloud registry mirror
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 🔍 Troubleshooting

### Check Service Status
```bash
# Linux/macOS
./deploy.sh --status

# Windows  
deploy.bat --status
```

### View Logs
```bash
# Linux/macOS
./deploy.sh --logs

# Windows
deploy.bat --logs

# Or use docker-compose directly
docker-compose logs -f
```

### Restart Services
```bash
# Linux/macOS
./deploy.sh --restart

# Windows
deploy.bat --restart
```

### Complete Redeployment
```bash
# Linux/macOS
./deploy.sh --clean

# Windows
deploy.bat --clean
```

## 🔒 Production Deployment Recommendations

1. **Modify Default Configuration**:
   - Change `DJANGO_SECRET_KEY`
   - Set `DJANGO_DEBUG=False` 
   - Configure correct `DJANGO_ALLOWED_HOSTS`

2. **Use HTTPS**:
   - Configure SSL certificates
   - Set `DJANGO_SECURE_SSL_REDIRECT=True`

3. **Data Backup**:
   - Regularly backup `backend/applyday/db.sqlite3`
   - Backup the `data/` directory

4. **Monitoring and Logging**:
   - Set up log rotation
   - Configure monitoring alerts

## 📞 Technical Support

If you encounter issues, please:
1. Check the troubleshooting guide above
2. Review project [Issues](https://github.com/pandalow/applyday/issues)
3. Submit a new Issue with detailed error information

## 📄 License

This project is released under an open source license. Please check the LICENSE file for details.
