FROM node:22.19.0 AS build   
WORKDIR /app

COPY applyday/package*.json ./
RUN npm ci --silent

COPY applyday ./

# Setting environment variables for production build
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=/api
ENV VITE_APPLICATION_API=/api/app/
ENV VITE_REPORT_API=/api/report/

RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# 删除默认的nginx静态资源
RUN rm -rf ./*

# 从构建阶段复制构建结果
COPY --from=build /app/dist . 

# 创建nginx配置
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