import React, { useState, useEffect } from 'react';
import { 
  fetchApplications, 
  createApplication, 
  updateApplication, 
  deleteApplication,
  getApplication 
} from '../service/application';

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    job_description: '',
    status: 'applied',
    stage_notes: ''
  });

  // 加载所有申请记录
  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 创建新申请
  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createApplication(formData);
      setFormData({
        company: '',
        job_title: '',
        job_description: '',
        status: 'applied',
        stage_notes: ''
      });
      setShowCreateForm(false);
      await loadApplications();
    } catch (error) {
      console.error('Failed to create application:', error);
    } finally {
      setLoading(false);
    }
  };

  // 开始编辑
  const handleEdit = async (id) => {
    try {
      const application = await getApplication(id);
      setFormData({
        company: application.company || '',
        job_title: application.job_title || '',
        job_description: application.job_description || '',
        status: application.status || 'applied',
        stage_notes: application.stage_notes || ''
      });
      setEditingId(id);
    } catch (error) {
      console.error('Failed to fetch application for editing:', error);
    }
  };

  // 保存编辑
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateApplication(editingId, formData);
      setEditingId(null);
      setFormData({
        company: '',
        job_title: '',
        job_description: '',
        status: 'applied',
        stage_notes: ''
      });
      await loadApplications();
    } catch (error) {
      console.error('Failed to update application:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除申请
  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这个申请记录吗？')) {
      setLoading(true);
      try {
        await deleteApplication(id);
        await loadApplications();
      } catch (error) {
        console.error('Failed to delete application:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 取消编辑或创建
  const handleCancel = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setFormData({
      company: '',
      job_title: '',
      job_description: '',
      status: 'applied',
      stage_notes: ''
    });
  };

  return (
    <div>
      <h2>Application 管理</h2>
      
      {/* 创建按钮 */}
      <div>
        <button 
          onClick={() => setShowCreateForm(true)} 
          disabled={loading || showCreateForm || editingId}
        >
          新建申请记录
        </button>
      </div>

      {/* 创建表单 */}
      {showCreateForm && (
        <div>
          <h3>创建新申请</h3>
          <form onSubmit={handleCreate}>
            <div>
              <label>公司名称:</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>职位名称:</label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>职位描述:</label>
              <textarea
                name="job_description"
                value={formData.job_description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
            <div>
              <label>状态:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="applied">已申请</option>
                <option value="interviewed">已面试</option>
                <option value="offered">已获offer</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>
            <div>
              <label>阶段备注:</label>
              <textarea
                name="stage_notes"
                value={formData.stage_notes}
                onChange={handleInputChange}
                rows="3"
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

      {/* 申请记录列表 */}
      {loading && <div>加载中...</div>}
      
      <div>
        <h3>申请记录列表</h3>
        {applications.length === 0 ? (
          <div>暂无申请记录</div>
        ) : (
          <div>
            {applications.map(application => (
              <div key={application.id}>
                {editingId === application.id ? (
                  // 编辑表单
                  <form onSubmit={handleUpdate}>
                    <div>
                      <label>公司名称:</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>职位名称:</label>
                      <input
                        type="text"
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label>职位描述:</label>
                      <textarea
                        name="job_description"
                        value={formData.job_description}
                        onChange={handleInputChange}
                        rows="4"
                      />
                    </div>
                    <div>
                      <label>状态:</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="applied">已申请</option>
                        <option value="interviewed">已面试</option>
                        <option value="offered">已获offer</option>
                        <option value="rejected">已拒绝</option>
                      </select>
                    </div>
                    <div>
                      <label>阶段备注:</label>
                      <textarea
                        name="stage_notes"
                        value={formData.stage_notes}
                        onChange={handleInputChange}
                        rows="3"
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
                    <h4>{application.job_title} - {application.company}</h4>
                    <p>状态: {application.status}</p>
                    <p>申请日期: {application.application_date}</p>
                    {application.job_description && (
                      <p>职位描述: {application.job_description}</p>
                    )}
                    {application.stage_notes && (
                      <p>备注: {application.stage_notes}</p>
                    )}
                    <div>
                      <button 
                        onClick={() => handleEdit(application.id)}
                        disabled={loading || editingId || showCreateForm}
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleDelete(application.id)}
                        disabled={loading || editingId || showCreateForm}
                      >
                        删除
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
  );
};

export default ApplicationManager;
