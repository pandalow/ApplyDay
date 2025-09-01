import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [backendInfo, setBackendInfo] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // 测试基本连接
        const response = await axios.get('http://127.0.0.1:8000/admin/', {
          timeout: 5000
        });
        setConnectionStatus('connected');
        setBackendInfo('Django admin accessible');
      } catch (error) {
        console.error('Connection test failed:', error);
        setConnectionStatus('failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      <h2>后端连接测试</h2>
      <div>
        <p>连接状态: {connectionStatus}</p>
        {backendInfo && <p>后端信息: {backendInfo}</p>}
        
        {connectionStatus === 'connected' && (
          <div>
            <h3>可用接口:</h3>
            <ul>
              <li>Application CRUD: http://127.0.0.1:8000/applications/</li>
              <li>Extract CRUD: http://127.0.0.1:8000/extract/</li>
              <li>Extract Process: http://127.0.0.1:8000/extract/process_extract/</li>
            </ul>
          </div>
        )}
        
        {connectionStatus === 'failed' && (
          <div>
            <p>连接失败！请确保:</p>
            <ul>
              <li>Django 后端服务器正在运行 (http://127.0.0.1:8000/)</li>
              <li>CORS 配置正确</li>
              <li>网络连接正常</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConnection;
