function ExtractionForm({ formData, onCreate, onChange, onCancel, loading }) {
  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <form onSubmit={onCreate} className="space-y-4">
        {/* 输入区 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Description Text
          </label>
          <textarea
            name="text"
            value={formData.text}
            onChange={onChange}
            rows="6"
            required
            placeholder="Please input the job description that you want to extract information from"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 按钮区 */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Finish"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExtractionForm;
