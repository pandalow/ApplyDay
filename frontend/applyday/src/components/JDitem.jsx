import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function JDItem({ jd, onUpdate, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    company: jd.company || "",
    role: jd.role || "",
    location: jd.location || "",
    level: jd.level || "",
    employment_type: jd.employment_type || "",
    salary_eur_min: jd.salary_eur_min || "",
    salary_eur_max: jd.salary_eur_max || ""
  });

  const handleSave = () => {
    onUpdate(jd.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      company: jd.company || "",
      role: jd.role || "",
      location: jd.location || "",
      level: jd.level || "",
      employment_type: jd.employment_type || "",
      salary_eur_min: jd.salary_eur_min || "",
      salary_eur_max: jd.salary_eur_max || ""
    });
    setIsEditing(false);
  };

  const formatSalary = (min, max) => {
    if (min && max) {
      return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    } else if (min) {
      return `€${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to €${max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  const formatArray = (arr) => {
    if (!arr || arr.length === 0) return "Not specified";
    return arr.map(item => item.replace(/_/g, ' ')).join(", ");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4"
    >
      {/* Header - Company and Role */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={editData.company}
                  onChange={(e) => setEditData({...editData, company: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {jd.company}
              </h3>
              <p className="text-lg text-blue-600 dark:text-blue-400 capitalize">
                {jd.role?.replace(/_/g, ' ')}
              </p>
            </>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(jd.id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
              >
                Delete
              </button>
            </>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-md transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) => setEditData({...editData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Level
              </label>
              <select
                value={editData.level}
                onChange={(e) => setEditData({...editData, level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="principal">Principal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employment Type
              </label>
              <select
                value={editData.employment_type}
                onChange={(e) => setEditData({...editData, employment_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Type</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">📍</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">
                {jd.location || "Location not specified"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">🎯</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                {jd.level?.replace(/_/g, ' ') || "Level not specified"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 text-sm">💼</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300 capitalize">
                {jd.employment_type?.replace(/_/g, ' ') || "Type not specified"}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Salary Info */}
      <div className="mb-4">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Salary (EUR)
              </label>
              <input
                type="number"
                value={editData.salary_eur_min}
                onChange={(e) => setEditData({...editData, salary_eur_min: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Salary (EUR)
              </label>
              <input
                type="number"
                value={editData.salary_eur_max}
                onChange={(e) => setEditData({...editData, salary_eur_max: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">💰</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
              {formatSalary(jd.salary_eur_min, jd.salary_eur_max)}
            </span>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required Skills */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Required Skills</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatArray(jd.required_core_skills)}
                </p>
              </div>

              {/* Programming Languages */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Programming Languages</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatArray(jd.programming_languages)}
                </p>
              </div>

              {/* Frameworks & Tools */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Frameworks & Tools</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatArray(jd.frameworks_tools)}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Responsibilities</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatArray(jd.responsibilities?.slice(0, 3))}
                  {jd.responsibilities?.length > 3 && "..."}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Benefits</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatArray(jd.benefits)}
                </p>
              </div>

              {/* Industry */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Industry</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {jd.industry?.replace(/_/g, ' ') || "Not specified"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default JDItem;
