import React, { useState, useEffect } from "react";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationItem from "../components/ApplicationItem";
import ResumeManager from "../components/ResumeManager";
import ReportGenerator from "../components/ReportGenerator";
import { AnimatePresence, motion } from "framer-motion";
import Dashboard from "../components/Dashboard";
import { useNavigate } from "react-router-dom";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplication,
} from "../service/application";

const ApplicationManager = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    job_title: "",
    job_description: "",
    status: "applied",
    stage_notes: "",
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // New: Tab state
  
  const navigate = useNavigate();
  // Select/Deselect application for report
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await fetchApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Adding ESC keyboard event listener for modal close (Esc key)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && (showCreateForm || showEditForm)) {
        handleCancel();
      }
    };

    if (showCreateForm || showEditForm) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showCreateForm, showEditForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createApplication(formData);
      setFormData({
        company: "",
        job_title: "",
        job_description: "",
        status: "applied",
        stage_notes: "",
      });
      setShowCreateForm(false);
      await loadApplications();
    } catch (error) {
      console.error("Failed to create application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const application = await getApplication(id);
      
      // Process job description data - extract from apply_description field
      let jobDescription = "";
      if (application.apply_description && Array.isArray(application.apply_description) && application.apply_description.length > 0) {
        jobDescription = application.apply_description[0]?.text || "";
      }
      
      setFormData({
        company: application.company || "",
        job_title: application.job_title || "",
        job_description: application.job_description || "",
        status: application.status || "applied",
        stage_notes: application.stage_notes || "",
      });
      setEditingId(id);
      setShowEditForm(true);
    } catch (error) {
      console.error("Failed to fetch application for editing:", error);
      alert("Failed to load application data for editing");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateApplication(editingId, formData);
      setEditingId(null);
      setShowEditForm(false);
      setFormData({
        company: "",
        job_title: "",
        job_description: "",
        status: "applied",
        stage_notes: "",
      });
      await loadApplications();
    } catch (error) {
      console.error("Failed to update application:", error);
      alert("Failed to update application");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure deleting this record?")) {
      setLoading(true);
      try {
        await deleteApplication(id);
        await loadApplications();
      } catch (error) {
        console.error("Failed to delete application:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setShowEditForm(false);
    setFormData({
      company: "",
      job_title: "",
      job_description: "",
      status: "applied",
      stage_notes: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Bar with Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              {/* Simplified page indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Application Management</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Selection Status & Quick Selectors */}
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                {/* Applications Status */}
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedIds.length > 0 ? (
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {selectedIds.length} app{selectedIds.length > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-gray-400">No apps</span>
                    )}
                  </span>
                </div>
                
                <span className="text-gray-300 dark:text-gray-600">|</span>
                
                {/* Resume Status */}
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedResumeId ? (
                      <span className="font-medium text-green-600 dark:text-green-400">
                        Resume
                      </span>
                    ) : (
                      <span className="text-gray-400">No resume</span>
                    )}
                  </span>
                </div>
                
                {/* Quick Resume Tab Switch */}
                {!selectedResumeId && (
                  <button
                    onClick={() => setActiveTab("resume")}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    Select resume
                  </button>
                )}
              </div>

              {/* Generate Pipeline Button - compact version for header */}
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-1">
                <ReportGenerator 
                  selectedApplicationIds={selectedIds}
                  selectedResumeId={selectedResumeId}
                  compact={true}
                />
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                disabled={loading || showCreateForm || showEditForm}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Application
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard & Applications</span>
                {selectedIds.length > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {selectedIds.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab("resume")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                activeTab === "resume"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Resume Management</span>
                {selectedResumeId && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    ✓
                  </span>
                )}
                {/* Prompt user to select resume */}
                {!selectedResumeId && selectedIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content with Tab Views */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && (
          <motion.div
            key="dashboard-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dashboard Stats */}
            <div className="mb-4">
              <Dashboard />
            </div>

            {/* Analysis Guidance Card */}
            {(selectedIds.length > 0 || selectedResumeId) && (
              <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Ready for Analysis!
                    </h4>
                    <div className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                      {selectedIds.length > 0 && (
                        <p>✅ Selected {selectedIds.length} application{selectedIds.length > 1 ? 's' : ''} for analysis</p>
                      )}
                      {selectedResumeId ? (
                        <p>✅ Resume selected for comparison</p>
                      ) : (
                        <p className="flex items-center space-x-2">
                          <span>📄 Add a resume to compare your profile with job requirements</span>
                          <button
                            onClick={() => setActiveTab("resume")}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200 underline font-medium"
                          >
                            Go to Resume Tab
                          </button>
                        </p>
                      )}
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                        💡 Use the Generate Report button above to create detailed insights and analysis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Applications Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Applications Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Applications
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {applications.length} total
                </span>
                {selectedIds.length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {selectedIds.length} selected
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {selectedIds.length > 0 && (
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Applications Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading applications...</span>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                  Start by adding your first job application
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add First Application
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-200 border-2 ${
                      selectedIds.includes(application.id) 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedIds.includes(application.id)}
                        onChange={() => handleSelect(application.id)}
                        disabled={showEditForm || showCreateForm}
                      />
                      <div className="flex-1">
                        <ApplicationItem
                          showCreateForm={showCreateForm}
                          showEditForm={showEditForm}
                          loading={loading}
                          application={application}
                          handleEdit={handleEdit}
                          handleDelete={handleDelete}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            </div>
          </motion.div>
        )}

        {activeTab === "resume" && (
          <motion.div
            key="resume-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Resume Guidance Card */}
            {(selectedResumeId || selectedIds.length > 0) && (
              <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                      Resume & Application Analysis
                    </h4>
                    <div className="text-sm text-green-700 dark:text-green-200 space-y-1">
                      {selectedResumeId ? (
                        <p>✅ Resume selected and ready for comparison</p>
                      ) : (
                        <p>📄 Select a resume below to enable job-profile matching analysis</p>
                      )}
                      {selectedIds.length > 0 ? (
                        <p>✅ {selectedIds.length} application{selectedIds.length > 1 ? 's' : ''} selected from Dashboard tab</p>
                      ) : (
                        <p className="flex items-center space-x-2">
                          <span>🎯 Select applications to analyze job requirements</span>
                          <button
                            onClick={() => setActiveTab("dashboard")}
                            className="text-green-600 hover:text-green-700 dark:text-green-300 dark:hover:text-green-200 underline font-medium"
                          >
                            Go to Dashboard Tab
                          </button>
                        </p>
                      )}
                      {selectedResumeId && selectedIds.length > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-300 mt-2">
                          🚀 Perfect! You can now generate comprehensive analysis reports from the header
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resume Management Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume Management
                </h3>
              </div>
              <div className="p-6">
                <ResumeManager 
                  onSelectResume={setSelectedResumeId}
                  selectedResumeId={selectedResumeId}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            key="create-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Create New Application
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pb-6">
                <ApplicationForm
                  onCancel={handleCancel}
                  onCreate={handleCreate}
                  onChange={handleInputChange}
                  formData={formData}
                  loading={loading}
                  isModal={true}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {showEditForm && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Edit Application
                </h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pb-6">
                <ApplicationForm
                  onCancel={handleCancel}
                  onCreate={handleUpdate}
                  onChange={handleInputChange}
                  formData={formData}
                  loading={loading}
                  isModal={true}
                  isEditing={true}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ApplicationManager;
