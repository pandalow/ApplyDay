import React, { useState, useEffect } from 'react';
import { 
  fetchExtracts, 
  createExtract, 
  partialUpdateExtract,
  processExtract 
} from '../service/extract';

const ExtractManager = () => {
  const [extracts, setExtracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    text: ''
  });
  
  // 处理提取任务的状态
  const [extractProcessing, setExtractProcessing] = useState(false);
  const [extractDates, setExtractDates] = useState({
    startDate: '',
    endDate: ''
  });

  // 加载所有提取记录
  const loadExtracts = async () => {
    setLoading(true);
    try {
      const data = await fetchExtracts();
      setExtracts(data);
    } catch (error) {
      console.error('Failed to load extracts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExtracts();
  }, []);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理日期输入变化
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setExtractDates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 创建新提取记录
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createExtract(formData);
      setFormData({ text: '' });
      setShowCreateForm(false);
      await loadExtracts();
    } catch (error) {
      console.error('Failed to create extract:', error);
    } finally {
      setLoading(false);
    }
  };

  // 开始编辑
  const handleEdit = (extract) => {
    setFormData({
      text: extract.text || ''
    });
    setEditingId(extract.id);
  };

  // 保存编辑
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await partialUpdateExtract(editingId, formData);
      setEditingId(null);
      setFormData({ text: '' });
      await loadExtracts();
    } catch (error) {
      console.error('Failed to update extract:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取消编辑或创建
  const handleCancel = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setFormData({ text: '' });
  };

  // 执行提取任务
  const handleProcessExtract = async (e) => {
    e.preventDefault();
    if (!extractDates.startDate || !extractDates.endDate) {
      alert('请选择开始和结束日期');
      return;
    }
    
    setExtractProcessing(true);
    try {
      const result = await processExtract(
        extractDates.startDate + 'T00:00:00', 
        extractDates.endDate + 'T23:59:59'
      );
      alert('提取任务完成！');
      console.log('Extract result:', result);
      await loadExtracts(); // 重新加载数据
    } catch (error) {
      console.error('Failed to process extract:', error);
      alert('提取任务失败，请检查控制台错误信息');
    } finally {
      setExtractProcessing(false);
    }
  };

  return (
    <div>
      <h2>Extract 管理</h2>
      
      {/* Tab 1: CRUD 管理 */}
      <div>
        <h3>数据管理</h3>
        
        {/* 创建按钮 */}
        <div>
          <button 
            onClick={() => setShowCreateForm(true)} 
            disabled={loading || showCreateForm || editingId}
          >
            新建提取记录
          </button>
        </div>

        {/* 创建表单 */}
        {showCreateForm && (
          <div>
            <h4>创建新提取记录</h4>
            <form onSubmit={handleCreate}>
              <div>
                <label>文本内容:</label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows="6"
                  required
                  placeholder="请输入要提取的文本内容"
                />
              </div>
              <div>
                <button type="submit" disabled={loading}>
                  {loading ? '创建中...' : '创建'}
                </button>
                <button type="button" onClick={handleCancel}>
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 提取记录列表 */}
        {loading && <div>加载中...</div>}
        
        <div>
          <h4>提取记录列表</h4>
          {extracts.length === 0 ? (
            <div>暂无提取记录</div>
          ) : (
            <div>
              {extracts.map(extract => (
                <div key={extract.id}>
                  {editingId === extract.id ? (
                    // 编辑表单
                    <form onSubmit={handleUpdate}>
                      <div>
                        <label>文本内容:</label>
                        <textarea
                          name="text"
                          value={formData.text}
                          onChange={handleInputChange}
                          rows="6"
                          required
                        />
                      </div>
                      <div>
                        <button type="submit" disabled={loading}>
                          {loading ? '更新中...' : '更新'}
                        </button>
                        <button type="button" onClick={handleCancel}>
                          取消
                        </button>
                      </div>
                    </form>
                  ) : (
                    // 显示模式
                    <div>
                      <h5>记录 ID: {extract.id}</h5>
                      <p>创建时间: {new Date(extract.created_at).toLocaleString()}</p>
                      <div>
                        <strong>文本内容:</strong>
                        <pre>{extract.text}</pre>
                      </div>
                      <div>
                        <button 
                          onClick={() => handleEdit(extract)}
                          disabled={loading || editingId || showCreateForm}
                        >
                          编辑
                        </button>
                      </div>
                    </div>
                  )}
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab 2: 提取处理功能 */}
      <div>
        <h3>提取处理</h3>
        <p>选择日期范围来处理提取任务</p>
        
        <form onSubmit={handleProcessExtract}>
          <div>
            <label>开始日期:</label>
            <input
              type="date"
              name="startDate"
              value={extractDates.startDate}
              onChange={handleDateChange}
              required
            />
          </div>
          <div>
            <label>结束日期:</label>
            <input
              type="date"
              name="endDate"
              value={extractDates.endDate}
              onChange={handleDateChange}
              required
            />
          </div>
          <div>
            <button 
              type="submit" 
              disabled={extractProcessing || loading}
            >
              {extractProcessing ? '处理中...' : '执行提取任务'}
            </button>
          </div>
        </form>

        {extractProcessing && (
          <div>
            <p>正在处理提取任务，请稍候...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractManager;
