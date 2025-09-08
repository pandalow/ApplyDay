FROM node:22.19.0 AS build   
WORKDIR /app

COPY applyday/package*.json ./

# Clean cache and install dependencies with relaxed configurations
RUN npm cache clean --force && \
    npm ci --silent --legacy-peer-deps --no-audit --no-fund

COPY applyday ./

# Set environment variables for production build
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=/api
ENV VITE_APPLICATION_API=/api/app/
ENV VITE_REPORT_API=/api/report/

# Increase Node.js memory limit to resolve Rollup build issues
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the application
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Set timezone for Alpine
ENV TZ=Europe/Dublin
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apk del tzdata

# Remove default nginx static assets
RUN rm -rf ./*

# Copy build results from build stage
COPY --from=build /app/dist . 

# Create nginx configuration
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /api/ { \
        proxy_pass http://api:8000/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]