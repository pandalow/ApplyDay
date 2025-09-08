FROM node:22.19.0 AS build   
WORKDIR /app

COPY applyday/package*.json ./

# 清理缓存并安装依赖，添加更宽松的配置
RUN npm cache clean --force && \
    npm ci --silent --legacy-peer-deps --no-audit --no-fund

COPY applyday ./

# Setting environment variables for production build
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=/api
ENV VITE_APPLICATION_API=/api/app/
ENV VITE_REPORT_API=/api/report/

# 增加 Node.js 内存限制，解决 Rollup 构建问题
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 构建应用
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

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