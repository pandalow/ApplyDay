function ApplicationForm({ onCreate, onChange, onCancel, formData, loading, isModal = false }) {
  return (
    <div className={isModal ? "mt-4" : "max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"}>
      <form onSubmit={onCreate} className="space-y-4">
        {/* 公司 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company Name
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 职位 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={onChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Job Description
          </label>
          <textarea
            name="job_description"
            value={formData.job_description}
            onChange={onChange}
            rows="4"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 状态 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="prepared">Prepared</option>
            <option value="applied">Applied</option>
            <option value="interviewed">Interviewed</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* 备注 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stage Notes
          </label>
          <textarea
            name="stage_notes"
            value={formData.stage_notes}
            onChange={onChange}
            rows="3"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 按钮 */}
        <div className="flex justify-end space-x-3 pt-4">
          {!isModal && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 ${isModal ? 'w-full' : ''}`}
          >
            {loading ? "Creating..." : "Create Application"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;
