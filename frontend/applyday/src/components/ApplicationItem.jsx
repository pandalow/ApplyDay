import React from 'react';

function ApplicationItem({ showCreateForm, showEditForm, loading, application, handleEdit, handleDelete }) {
  // Status color mapping
  const getStatusConfig = (status) => {
    const configs = {
      'prepared': {
        color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
        icon: '📋',
        label: 'Prepared'
      },
      'applied': {
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700',
        icon: '📤',
        label: 'Applied'
      },
      'interviewed': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700',
        icon: '💬',
        label: 'Interviewed'
      },
      'offered': {
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700',
        icon: '🎉',
        label: 'Offered'
      },
      'rejected': {
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700',
        icon: '❌',
        label: 'Rejected'
      }
    };
    return configs[status] || configs['applied'];
  };

  // Detect job characteristics from title and notes
  const getJobCharacteristics = (application) => {
    const title = (application.job_title || '').toLowerCase();
    const notes = (application.stage_notes || '').toLowerCase();
    const company = (application.company || '').toLowerCase();
    
    const characteristics = [];
    
    // Employment type
    if (title.includes('intern') || notes.includes('intern')) {
      characteristics.push({ label: 'Internship', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300', icon: '🎓' });
    } else if (title.includes('part-time') || title.includes('part time') || notes.includes('part-time') || notes.includes('part time')) {
      characteristics.push({ label: 'Part-time', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300', icon: '⏰' });
    } else {
      characteristics.push({ label: 'Full-time', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300', icon: '💼' });
    }
    
    // Location type
    if (title.includes('remote') || notes.includes('remote') || company.includes('remote')) {
      characteristics.push({ label: 'Remote', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: '🏠' });
    } else if (title.includes('hybrid') || notes.includes('hybrid')) {
      characteristics.push({ label: 'Hybrid', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: '🔄' });
    } else {
      characteristics.push({ label: 'On-site', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', icon: '🏢' });
    }
    
    return characteristics;
  };

  // Format date for better display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      if (diffDays <= 30) return `${Math.ceil((diffDays - 1) / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const statusConfig = getStatusConfig(application.status);
  const characteristics = getJobCharacteristics(application);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        {/* Left content */}
        <div className="flex-1 min-w-0 pr-4">
          {/* Job title and company */}
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {application.job_title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {application.company}
              </p>
            </div>
            
            {/* Status badge */}
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              <span className="mr-1">{statusConfig.icon}</span>
              {statusConfig.label}
            </div>
          </div>
          
          {/* Job characteristics */}
          <div className="flex flex-wrap gap-2 mb-3">
            {characteristics.map((char, index) => (
              <span key={index} className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${char.color}`}>
                <span className="mr-1">{char.icon}</span>
                {char.label}
              </span>
            ))}
          </div>
          
          {/* Application date */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Applied {formatDate(application.application_date)}
          </div>
          
          {/* Stage notes preview */}
          {application.stage_notes && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              <span className="font-medium">Notes:</span> {application.stage_notes}
            </div>
          )}
        </div>

        {/* Right buttons */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={() => handleEdit(application.id)}
            disabled={loading || showEditForm || showCreateForm}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-300 dark:bg-blue-900 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={`Edit ${application.job_title} application`}
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => handleDelete(application.id)}
            disabled={loading || showEditForm || showCreateForm}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={`Delete ${application.job_title} application`}
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


export default ApplicationItem