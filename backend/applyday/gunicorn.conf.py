# Gunicorn configuration file for ApplyDay backend
import multiprocessing
import os

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = 2  # Reduced for better memory management with AI calls
worker_class = "sync"
worker_connections = 1000
timeout = 300  # 5 minutes timeout for AI API calls
keepalive = 2

# Restart workers after this many requests, to help control memory usage
max_requests = 100
max_requests_jitter = 10

# Preload app for better performance
preload_app = True

# Logging
accesslog = "-"  # Log to stdout
errorlog = "-"   # Log to stderr
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "applyday_api"

# Server mechanics
daemon = False
pidfile = None
user = None
group = None
tmp_upload_dir = None

# Environment variables
raw_env = [
    'DJANGO_SETTINGS_MODULE=applyday.settings',
]

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190
