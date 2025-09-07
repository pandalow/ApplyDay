import { useState, useEffect } from "react";
import { fetchReports, getReport, deleteReport } from "../service/report";
import ReportItem from "./ReportItem";
import ReportAnalysis from "./ReportAnalysis";


function ReportDetail({ reportId }) {
  const [reportList, setReportList] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState("visualization"); // 新增：子tab状态
  const [deletingReportId, setDeletingReportId] = useState(null); // 新增：删除状态

  // 加载报告列表
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await fetchReports();
        // 倒序排列，最新在前
        const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setReportList(sorted);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  // 页面初次加载或 reportId 变化时自动选中对应报告
  useEffect(() => {
    if (reportId) {
      handleViewReport(reportId);
    }
    // eslint-disable-next-line
  }, [reportId]);

  const handleViewReport = async (id) => {
    try {
      setLoadingReport(true);
      const fullReport = await getReport(id);
      setSelectedReport(fullReport);
      setActiveReportTab("visualization"); // 重置为默认tab
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingReportId(reportId);
      await deleteReport(reportId);
      
      // 更新报告列表
      setReportList(prev => prev.filter(report => report.id !== reportId));
      
      // 如果删除的是当前选中的报告，清空选中状态
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(null);
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("Failed to delete report. Please try again.");
    } finally {
      setDeletingReportId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左边：报告列表（可折叠） */}
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Analysis Reports
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              {reportList.length} reports
            </span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {reportList.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">📊</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No reports available yet
                </p>
              </div>
            ) : (
              <>
                {/* 折叠按钮 */}
                <div className="flex justify-end mb-1">
                  <button
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                    onClick={() => setShowAll((v) => !v)}
                  >
                    {showAll ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>
                {/* 报告项 */}
                {(showAll ? reportList : reportList.slice(0, 1)).map((r, idx, arr) => {
                  const isOpen = selectedReport?.id == r.id;
                  // 统一圆角：首个和最后一个item都加圆角
                  const isFirst = idx === 0;
                  const isLast = idx === arr.length - 1;
                  return (
                    <div
                      key={r.id}
                      className={`border transition-all duration-200 ${
                        isFirst ? 'rounded-t-lg' : ''
                      } ${isLast ? 'rounded-b-lg' : ''} ${isOpen ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className={`flex items-center justify-between p-3`}>
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleViewReport(r.id)}
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Report #{r.id}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(r.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isOpen && (
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteReport(r.id);
                            }}
                            disabled={deletingReportId === r.id}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors duration-200 disabled:opacity-50"
                            title="Delete report"
                          >
                            {deletingReportId === r.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                          <div 
                            className="cursor-pointer"
                            onClick={() => handleViewReport(r.id)}
                          >
                            <svg
                              className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {isOpen && (
                        <div className="p-3 bg-white dark:bg-gray-900 border-t border-indigo-100 dark:border-indigo-800 text-xs text-gray-600 dark:text-gray-300 rounded-b-lg">
                          <span>Selected, details on the right</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 右边：报告详情 */}
      <div className="lg:col-span-2">
        {loadingReport ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading report details...</span>
          </div>
        ) : selectedReport ? (
          <div className="space-y-6">
            {/* 报告头部信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Report #{selectedReport.id}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  ✓ Complete
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  📅 {new Date(selectedReport.created_at).toLocaleString()}
                </span>
                <span className="flex items-center">
                  📊 {selectedReport.results.length} analyses
                </span>
              </div>
            </div>

            {/* 子Tab导航 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveReportTab("visualization")}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeReportTab === "visualization"
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <span>📊</span>
                    <span>Data Visualization</span>
                  </button>
                  <button
                    onClick={() => setActiveReportTab("analysis")}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeReportTab === "analysis"
                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <span>📝</span>
                    <span>AI Analysis</span>
                  </button>
                </nav>
              </div>

              {/* 子Tab内容 */}
              <div className="p-6">
                {activeReportTab === "visualization" && (
                  <div className="space-y-6">
                    {selectedReport.results.map((res) => (
                      <ReportItem key={res.id || `${res.name}-${Math.random()}`} result={res} />
                    ))}
                  </div>
                )}
                {activeReportTab === "analysis" && (
                  <ReportAnalysis selectedReport={selectedReport} />
                )}
              </div>
            </div>
          </div>
        ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Select a Report
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a report from the list to view detailed analysis results
              </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportDetail;
