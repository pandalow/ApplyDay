
function ApplicationItem({ showCreateForm, showEditForm, loading, application, handleEdit, handleDelete }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 px-4 py-2 text-sm">
      {/* 左边内容 */}
      <div
        className="flex-1 truncate"
        title={`${application.job_title} - ${application.company} | ${application.status} | ${application.application_date}`}
      >
        <span className="font-medium">{application.job_title}</span> @ {application.company} |{" "}
        <span className="text-gray-600">{application.status}</span> |{" "}
        <span className="text-gray-500">{application.application_date}</span>
      </div>

      {/* 右边按钮 */}
      <div className="flex-shrink-0 space-x-2 ml-4">
        <button
          onClick={() => handleEdit(application.id)}
          disabled={loading || showEditForm || showCreateForm}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(application.id)}
          disabled={loading || showEditForm || showCreateForm}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}


export default ApplicationItem