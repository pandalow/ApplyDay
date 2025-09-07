import React, { useState, useEffect } from "react";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationItem from "../components/ApplicationItem";
import ResumeManager from "../components/ResumeManager";
import { AnimatePresence, motion } from "framer-motion";
import Dashboard from "../components/Dashboard";
import { useNavigate } from "react-router-dom";
import {
  fetchApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplication,
  generatePipeline,
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
  const [generating, setGenerating] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const navigate = useNavigate();
  // Select/Deselect application for report
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Generate report
  const handleGenerateReport = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one job application.");
      return;
    }
    if (!selectedResumeId) {
      alert("Please select a resume first.");
      return;
    }
    
    setGenerating(true);
    try {
      const report = await generatePipeline({ 
        job_ids: selectedIds,
        resume_id: selectedResumeId 
      });
      // Jump to report detail page
      if (report && report.id) {
        navigate(`/report?report_id=${report.id}`);
      } else if (report && report.report_id) {
        navigate(`/report?report_id=${report.report_id}`);
      } else {
        alert("Report generated but missing report ID in response");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report, please check console for details");
    } finally {
      setGenerating(false);
    }
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
      
      // 处理job description数据 - 从apply_description字段提取
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
  <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
      {/* Header */}
  <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Application Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your job applications and track your progress
        </p>
      </div>

      {/* Dashboard */}
      <div className="mb-6">
        <Dashboard />
      </div>

      {/* Resume Manager and Generate Report Section */}
      <div className="mb-8 space-y-6">
        {/* Resume Manager */}
        <div className="flex justify-center">
          <ResumeManager 
            onSelectResume={setSelectedResumeId}
            selectedResumeId={selectedResumeId}
          />
        </div>

        {/* Generate Report Section */}
        <div className="flex flex-col items-center">
          <div className="mb-3 text-sm text-gray-500 dark:text-gray-400 text-center">
            Select a resume above, then select one or more applications below, and click <span className="font-semibold text-orange-600">Generate Report</span> to create a comprehensive analysis.
          </div>
          {selectedResumeId && (
            <div className="mb-2 text-xs text-green-600 dark:text-green-400">
              ✓ Resume {selectedResumeId} selected
            </div>
          )}
          <button
            onClick={handleGenerateReport}
            disabled={generating || selectedIds.length === 0 || !selectedResumeId}
            className="inline-flex items-center px-8 py-3 rounded-xl bg-orange-500 text-white text-lg font-bold shadow-lg hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 transition-all duration-200 disabled:opacity-50 mt-1 custom-animate-report"
            style={{ minWidth: 220 }}
          >
            {/* Custom animation styles */}
            <style>{`
              @keyframes report-glow {
                0% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.7), 0 2px 8px 0 rgba(0,0,0,0.10); transform: scale(1); }
                50% { box-shadow: 0 0 16px 8px rgba(251, 146, 60, 0.25), 0 2px 16px 0 rgba(0,0,0,0.13); transform: scale(1.06); }
                100% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.7), 0 2px 8px 0 rgba(0,0,0,0.10); transform: scale(1); }
              }
              .custom-animate-report {
                animation: report-glow 1.6s infinite;
              }
            `}</style>
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l4 4m0 0l-4 4m4-4H3" />
            </svg>
            {generating ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>
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

      {/* 申请列表 */}
  <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 py-2 px-2 sm:px-4 bg-transparent">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
              Application List
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 ml-2">
              {applications.length} applications
            </span>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            disabled={loading || showCreateForm || editingId}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200 font-medium ml-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📝</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No applications yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Create your first application to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center ${selectedIds.includes(application.id) ? 'ring-2 ring-green-400' : ''}`}
              >
                <input
                  type="checkbox"
                  className="mr-4 accent-green-600"
                  checked={selectedIds.includes(application.id)}
                  onChange={() => handleSelect(application.id)}
                  disabled={showEditForm || showCreateForm}
                  title="Select to include in report"
                />
                <div className="flex-1">
                  <ApplicationItem
                    showCreateForm={showCreateForm}
                    editingId={editingId}
                    loading={loading}
                    application={application}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationManager;
