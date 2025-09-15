// Utility functions for application search, sort, and filter operations

/**
 * Filters applications based on search term
 * @param {Array} applications - Array of application objects
 * @param {string} searchTerm - Search term to match against
 * @returns {Array} Filtered applications
 */
export const searchApplications = (applications, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return applications;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return applications.filter(app => {
    const company = app.company?.toLowerCase() || '';
    const jobTitle = app.job_title?.toLowerCase() || '';
    const status = app.status?.toLowerCase() || '';
    const stageNotes = app.stage_notes?.toLowerCase() || '';
    
    // Check if search term matches any of the searchable fields
    return (
      company.includes(term) ||
      jobTitle.includes(term) ||
      status.includes(term) ||
      stageNotes.includes(term)
    );
  });
};

/**
 * Filters applications based on status
 * @param {Array} applications - Array of application objects
 * @param {Array} selectedStatuses - Array of selected status filters
 * @returns {Array} Filtered applications
 */
export const filterByStatus = (applications, selectedStatuses) => {
  if (!selectedStatuses || selectedStatuses.length === 0) {
    return applications;
  }
  
  return applications.filter(app => selectedStatuses.includes(app.status));
};

/**
 * Filters applications based on location type (remote/onsite/hybrid)
 * @param {Array} applications - Array of application objects  
 * @param {Array} selectedLocationTypes - Array of selected location type filters
 * @returns {Array} Filtered applications
 */
export const filterByLocationType = (applications, selectedLocationTypes) => {
  if (!selectedLocationTypes || selectedLocationTypes.length === 0) {
    return applications;
  }
  
  return applications.filter(app => {
    // This would need to be enhanced when job description data includes remote_work field
    // For now, we'll assume remote if location contains "remote" keyword
    const hasRemote = app.job_title?.toLowerCase().includes('remote') || 
                     app.stage_notes?.toLowerCase().includes('remote') ||
                     app.company?.toLowerCase().includes('remote');
    
    if (selectedLocationTypes.includes('remote') && hasRemote) return true;
    if (selectedLocationTypes.includes('onsite') && !hasRemote) return true;
    if (selectedLocationTypes.includes('hybrid')) return true; // Default assumption
    
    return false;
  });
};

/**
 * Filters applications based on role type (full-time/part-time/internship)
 * @param {Array} applications - Array of application objects
 * @param {Array} selectedRoleTypes - Array of selected role type filters  
 * @returns {Array} Filtered applications
 */
export const filterByRoleType = (applications, selectedRoleTypes) => {
  if (!selectedRoleTypes || selectedRoleTypes.length === 0) {
    return applications;
  }
  
  return applications.filter(app => {
    const title = app.job_title?.toLowerCase() || '';
    const notes = app.stage_notes?.toLowerCase() || '';
    
    // Check for keywords in job title or notes
    const hasInternship = title.includes('intern') || notes.includes('intern');
    const hasPartTime = title.includes('part-time') || title.includes('part time') || 
                       notes.includes('part-time') || notes.includes('part time');
    const hasFullTime = title.includes('full-time') || title.includes('full time') || 
                       notes.includes('full-time') || notes.includes('full time') || 
                       (!hasInternship && !hasPartTime); // Default to full-time
    
    if (selectedRoleTypes.includes('internship') && hasInternship) return true;
    if (selectedRoleTypes.includes('part-time') && hasPartTime) return true;
    if (selectedRoleTypes.includes('full-time') && hasFullTime) return true;
    
    return false;
  });
};

/**
 * Sorts applications based on specified criteria
 * @param {Array} applications - Array of application objects
 * @param {string} sortBy - Sort criteria ('date', 'company', 'status', 'title')
 * @param {string} sortOrder - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted applications
 */
export const sortApplications = (applications, sortBy, sortOrder = 'desc') => {
  const sorted = [...applications].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'date':
        valueA = new Date(a.application_date || a.created_at);
        valueB = new Date(b.application_date || b.created_at);
        break;
      case 'company':
        valueA = (a.company || '').toLowerCase();
        valueB = (b.company || '').toLowerCase();
        break;
      case 'status':
        // Custom status order: offered > interviewed > applied > prepared > rejected
        const statusOrder = {
          'offered': 5,
          'interviewed': 4, 
          'applied': 3,
          'prepared': 2,
          'rejected': 1
        };
        valueA = statusOrder[a.status] || 0;
        valueB = statusOrder[b.status] || 0;
        break;
      case 'title':
        valueA = (a.job_title || '').toLowerCase();
        valueB = (b.job_title || '').toLowerCase();
        break;
      default:
        // Default to date sorting
        valueA = new Date(a.application_date || a.created_at);
        valueB = new Date(b.application_date || b.created_at);
    }
    
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

/**
 * Applies all filters and sorting to applications
 * @param {Array} applications - Array of application objects
 * @param {Object} filters - Filter options object
 * @param {string} filters.searchTerm - Search term
 * @param {Array} filters.statuses - Selected status filters
 * @param {Array} filters.locationTypes - Selected location type filters  
 * @param {Array} filters.roleTypes - Selected role type filters
 * @param {string} filters.sortBy - Sort criteria
 * @param {string} filters.sortOrder - Sort order
 * @returns {Array} Filtered and sorted applications
 */
export const processApplications = (applications, filters) => {
  let processed = [...applications];
  
  // Apply search filter
  if (filters.searchTerm) {
    processed = searchApplications(processed, filters.searchTerm);
  }
  
  // Apply status filter
  if (filters.statuses && filters.statuses.length > 0) {
    processed = filterByStatus(processed, filters.statuses);
  }
  
  // Apply location type filter
  if (filters.locationTypes && filters.locationTypes.length > 0) {
    processed = filterByLocationType(processed, filters.locationTypes);
  }
  
  // Apply role type filter
  if (filters.roleTypes && filters.roleTypes.length > 0) {
    processed = filterByRoleType(processed, filters.roleTypes);
  }
  
  // Apply sorting
  if (filters.sortBy) {
    processed = sortApplications(processed, filters.sortBy, filters.sortOrder);
  }
  
  return processed;
};

/**
 * Gets available filter options from applications array
 * @param {Array} applications - Array of application objects
 * @returns {Object} Available filter options
 */
export const getFilterOptions = (applications) => {
  const statuses = [...new Set(applications.map(app => app.status).filter(Boolean))];
  
  return {
    statuses: statuses.sort(),
    locationTypes: ['remote', 'hybrid', 'onsite'],
    roleTypes: ['full-time', 'part-time', 'internship'],
    sortOptions: [
      { value: 'date', label: 'Application Date' },
      { value: 'company', label: 'Company Name' },
      { value: 'status', label: 'Status Priority' },
      { value: 'title', label: 'Job Title' }
    ]
  };
};