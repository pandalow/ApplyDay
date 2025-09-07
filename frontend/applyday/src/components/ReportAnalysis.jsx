import ReactMarkdown from 'react-markdown';

function ReportAnalysis({ selectedReport }) {
  if (!selectedReport) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No Report Selected
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please select a report to view the AI analysis.
        </p>
      </div>
    );
  }

  const analysisContent = selectedReport.latest_summary?.content;

  if (!analysisContent) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No Analysis Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          AI analysis has not been generated for this report yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            AI Analysis Report
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {selectedReport.latest_summary?.created_at && 
              new Date(selectedReport.latest_summary.created_at).toLocaleString()
            }
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-8">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 mt-6">{children}</h3>,
              h4: ({children}) => <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 mt-4">{children}</h4>,
              p: ({children}) => <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{children}</p>,
              strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>,
              em: ({children}) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
              ul: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
              li: ({children}) => <li className="text-gray-700 dark:text-gray-300 ml-4">{children}</li>,
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 mb-4 bg-gray-50 dark:bg-gray-700 rounded-r">
                  <div className="text-gray-800 dark:text-gray-200 italic">{children}</div>
                </blockquote>
              ),
              code: ({inline, children}) => 
                inline ? (
                  <code className="bg-gray-100 dark:bg-gray-700 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-4 rounded mb-4 overflow-x-auto font-mono text-sm">
                    {children}
                  </code>
                ),
              hr: () => <hr className="border-gray-300 dark:border-gray-600 my-8" />,
              table: ({children}) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    {children}
                  </table>
                </div>
              ),
              thead: ({children}) => <thead className="bg-gray-50 dark:bg-gray-700">{children}</thead>,
              tbody: ({children}) => <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>,
              tr: ({children}) => <tr>{children}</tr>,
              th: ({children}) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{children}</th>,
              td: ({children}) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{children}</td>,
            }}
          >
            {analysisContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default ReportAnalysis;
