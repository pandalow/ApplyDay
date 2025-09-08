import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import ExtractionForm from "../components/ExtractionForm";
import ExtractionItem from "../components/ExtractionItem";
import Extracting from "../components/Extracting";
import {
  fetchExtracts,
  createExtract,
  partialUpdateExtract,
  deleteExtract,
} from "../service/application";

const JDTextManagement = forwardRef((props, ref) => {
    const [extracts, setExtracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showExtractDialog, setShowExtractDialog] = useState(false);
  const [formData, setFormData] = useState({ text: "" });

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    showExtractDialog: () => setShowExtractDialog(true)
  }));

  const loadExtracts = async () => {
    setLoading(true);
    try {
      const data = await fetchExtracts();
      setExtracts(data);
    } catch (error) {
      console.error("Failed to load extracts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExtracts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createExtract(formData);
      setFormData({ text: "" });
      setShowCreateForm(false);
      await loadExtracts();
    } catch (error) {
      console.error("Failed to create extract:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (extract) => {
    setFormData({ text: extract.text || "" });
    setEditingId(extract.id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await partialUpdateExtract(editingId, formData);
      setEditingId(null);
      setFormData({ text: "" });
      await loadExtracts();
    } catch (error) {
      console.error("Failed to update extract:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowCreateForm(false);
    setFormData({ text: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this extract?")) {
      setLoading(true);
      try {
        await deleteExtract(id);
        await loadExtracts();
      } catch (error) {
        console.error("Failed to delete extract:", error);
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <div className="space-y-6">
      {/* Extract New JDs Dialog */}
      {showExtractDialog && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Extract New Job Descriptions
            </h4>
            <button
              onClick={() => setShowExtractDialog(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <Extracting 
            onSuccess={() => {
              loadExtracts();
              setShowExtractDialog(false);
            }} 
          />
        </div>
      )}

      {/* Create button */}
      <div>
        <button
          onClick={() => setShowCreateForm(true)}
          disabled={loading || showCreateForm || editingId}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-200 font-medium"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Adding Extra JDs
        </button>
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
          <ExtractionForm
            formData={formData}
            onCreate={handleCreate}
            onChange={handleInputChange}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      )}

      {/* Extraction record list */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Job Description List
          </h4>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            {extracts.length} records
          </span>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading extracts...</span>
          </div>
        ) : extracts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📄</div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No extraction records yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Create your first record to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {extracts.map((extract) => (
              <div
                key={extract.id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6"
              >
                {editingId === extract.id ? (
                  <ExtractionForm
                    formData={formData}
                    onCreate={handleUpdate}
                    onChange={handleInputChange}
                    onCancel={handleCancel}
                    loading={loading}
                  />
                ) : (
                  <ExtractionItem
                    extract={extract}
                    loading={loading}
                    editingId={editingId}
                    showCreateForm={showCreateForm}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default JDTextManagement;