import React, { useState } from 'react';
import ApplicationManager from './ApplicationManager';
import ExtractManager from './ExtractManager';
import TestConnection from './TestConnection';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('test');

  return (
    <div>
      <h1>管理面板</h1>
      
      {/* Tab 导航 */}
      <div>
        <button 
          onClick={() => setActiveTab('test')}
          disabled={activeTab === 'test'}
        >
          连接测试
        </button>
        <button 
          onClick={() => setActiveTab('applications')}
          disabled={activeTab === 'applications'}
        >
          Application 管理
        </button>
        <button 
          onClick={() => setActiveTab('extracts')}
          disabled={activeTab === 'extracts'}
        >
          Extract 管理
        </button>
      </div>

      {/* Tab 内容 */}
      <div>
        {activeTab === 'test' && <TestConnection />}
        {activeTab === 'applications' && <ApplicationManager />}
        {activeTab === 'extracts' && <ExtractManager />}
      </div>
    </div>
  );
};

export default AdminPanel;
