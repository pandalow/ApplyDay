function ExtractionItem({ extract, loading, editingId, showCreateForm, handleEdit, handleDelete }) {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {/* 左侧信息 */}
      <div className="flex-1 min-w-0">
        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          ID: {extract.id}
        </h5>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Created at: {new Date(extract.created_at).toLocaleString()}
        </p>
        <p
          className="mt-2 text-sm text-gray-700 dark:text-gray-300 truncate"
          title={extract.text}
        >
          <span className="font-medium">Job Description:</span> {extract.text}
        </p>
      </div>

      {/* 右侧按钮 */}
      <div className="flex-shrink-0 ml-4 space-x-2">
        <button
          onClick={() => handleEdit(extract)}
          disabled={loading || editingId || showCreateForm}
          className="px-3 py-1 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(extract.id)}
          disabled={loading || editingId || showCreateForm}
          className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ExtractionItem;
