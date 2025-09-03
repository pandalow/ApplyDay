import { useState, useEffect } from "react";
import { fetchReports, getReport } from "../service/report.js";
import ReportItem from "./ReportItem";

function ReportDetail() {
  const [reportList, setReportList] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await fetchReports();
        setReportList(data);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const handleViewReport = async (id) => {
    try {
      setLoadingReport(true);
      const fullReport = await getReport(id);
      setSelectedReport(fullReport);
    } catch (error) {
      console.error("Error loading report:", error);
    } finally {
      setLoadingReport(false);
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
      {/* 左边：报告列表 */}
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
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reportList.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">📊</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No reports available yet
                </p>
              </div>
            ) : (
              reportList.map((r) => (
                <div 
                  key={r.id} 
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedReport?.id === r.id
                      ? "border-indigo-200 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => handleViewReport(r.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Report #{r.id}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {selectedReport?.id === r.id && (
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      )}
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))
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

            {/* 报告内容 */}
            <div className="space-y-6">
              {selectedReport.results.map((res) => (
                <ReportItem key={res.id || `${res.name}-${Math.random()}`} result={res} />
              ))}
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
