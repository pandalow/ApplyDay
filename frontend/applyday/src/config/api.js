// API 配置文件
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  APPLICATION_API: import.meta.env.VITE_APPLICATION_API || 'http://127.0.0.1:8000/app/',
  REPORT_API: import.meta.env.VITE_REPORT_API || 'http://127.0.0.1:8000/report/',
};

export default API_CONFIG;
