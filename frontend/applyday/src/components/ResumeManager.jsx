import { useState, useEffect } from "react";
import { fetchResumes, createResume, deleteResume } from "../service/application";

function ResumeManager({ onSelectResume, selectedResumeId }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 加载简历列表
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await fetchResumes();
      setResumes(data);
    } catch (error) {
      console.error("Error loading resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, DOC, and DOCX files are allowed.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    try {
      const newResume = await createResume(formData);
      setResumes(prev => [...prev, newResume]);
      // 自动选择刚上传的简历
      onSelectResume(newResume.id);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
      // 清空input
      event.target.value = '';
    }
  };

  // 删除简历
  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      await deleteResume(resumeId);
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
      // 如果删除的是当前选中的简历，清空选择
      if (selectedResumeId === resumeId) {
        onSelectResume(null);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Resume</span>
        </div>
        <div className="space-y-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Uploading...
            </div>
          )}
          <p className="text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX
          </p>
        </div>
      </div>

      {/* Resume List */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Resume</span>
          <button
            onClick={loadResumes}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-500">Loading...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">No resumes uploaded</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedResumeId === resume.id
                    ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:hover:bg-gray-500'
                }`}
                onClick={() => onSelectResume(resume.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {resume.name || `Resume ${resume.id}`}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {resume.id}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResume(resume.id);
                  }}
                  className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 p-1"
                  title="Delete resume"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected Resume Indicator */}
      {selectedResumeId && (
        <div className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Resume #{selectedResumeId} selected
        </div>
      )}
    </div>
  );
}

export default ResumeManager;
