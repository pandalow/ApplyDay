import React, { useState } from 'react';
import { getFilterOptions } from '../utils/applicationUtils';

const ApplicationControls = ({ 
  applications = [],
  searchTerm = '',
  onSearchChange,
  sortBy = 'date',
  sortOrder = 'desc',
  onSortChange,
  statusFilters = [],
  onStatusFiltersChange,
  locationFilters = [],
  onLocationFiltersChange,
  roleFilters = [],
  onRoleFiltersChange,
  onClearFilters
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const filterOptions = getFilterOptions(applications);
  
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortOrder] = e.target.value.split(':');
    onSortChange(newSortBy, newSortOrder);
  };

  const handleStatusFilterChange = (status) => {
    const updated = statusFilters.includes(status)
      ? statusFilters.filter(s => s !== status)
      : [...statusFilters, status];
    onStatusFiltersChange(updated);
  };

  const handleLocationFilterChange = (location) => {
    const updated = locationFilters.includes(location)
      ? locationFilters.filter(l => l !== location)
      : [...locationFilters, location];
    onLocationFiltersChange(updated);
  };

  const handleRoleFilterChange = (role) => {
    const updated = roleFilters.includes(role)
      ? roleFilters.filter(r => r !== role)
      : [...roleFilters, role];
    onRoleFiltersChange(updated);
  };

  const getActiveFilterCount = () => {
    return statusFilters.length + locationFilters.length + roleFilters.length;
  };

  const formatStatusDisplay = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatLocationDisplay = (location) => {
    const displayMap = {
      'remote': 'Remote',
      'hybrid': 'Hybrid',
      'onsite': 'On-site'
    };
    return displayMap[location] || location;
  };

  const formatRoleDisplay = (role) => {
    const displayMap = {
      'full-time': 'Full-time',
      'part-time': 'Part-time', 
      'internship': 'Internship'
    };
    return displayMap[role] || role;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:hidden text-sm text-gray-600 dark:text-gray-400 mb-2">
          {applications.length} application{applications.length !== 1 ? 's' : ''} total
        </div>
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by company, job title, or status... (⌘+K)"
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="Search applications"
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Press Control+K or Command+K to focus this search field
            </div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={`${sortBy}:${sortOrder}`}
              onChange={handleSortChange}
              className="min-w-0 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Sort applications"
            >
              {filterOptions.sortOptions.map(option => (
                <React.Fragment key={option.value}>
                  <option value={`${option.value}:desc`}>
                    {option.label} (Newest First)
                  </option>
                  <option value={`${option.value}:asc`}>
                    {option.label} (Oldest First)
                  </option>
                </React.Fragment>
              ))}
            </select>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${
              getActiveFilterCount() > 0 || isFiltersExpanded
                ? 'border-blue-500 text-blue-700 bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:bg-blue-900/20'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
            }`}
            aria-expanded={isFiltersExpanded}
            aria-controls="filter-panel"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {isFiltersExpanded && (
        <div 
          id="filter-panel"
          className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Application Status
              </h4>
              <div className="space-y-2">
                {filterOptions.statuses.map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={statusFilters.includes(status)}
                      onChange={() => handleStatusFilterChange(status)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-describedby={`status-${status}-description`}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {formatStatusDisplay(status)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Type Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location Type
              </h4>
              <div className="space-y-2">
                {filterOptions.locationTypes.map(location => (
                  <label key={location} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={locationFilters.includes(location)}
                      onChange={() => handleLocationFilterChange(location)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-describedby={`location-${location}-description`}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {formatLocationDisplay(location)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Role Type Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Type
              </h4>
              <div className="space-y-2">
                {filterOptions.roleTypes.map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={roleFilters.includes(role)}
                      onChange={() => handleRoleFilterChange(role)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-describedby={`role-${role}-description`}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {formatRoleDisplay(role)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters Button and Keyboard Shortcuts */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
            {getActiveFilterCount() > 0 && (
              <button
                onClick={onClearFilters}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-colors"
                aria-label="Clear all active filters"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All Filters (⌘⇧C)
              </button>
            )}
            <div className="text-xs text-gray-400 dark:text-gray-500">
              <span className="hidden sm:inline">Shortcuts: </span>
              <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">⌘</kbd>
              <span className="mx-1">+</span>
              <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">K</kbd>
              <span className="text-gray-300 dark:text-gray-600 mx-1">•</span>
              <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">⌘</kbd>
              <span className="mx-1">+</span>
              <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">N</kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationControls;