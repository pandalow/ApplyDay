import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ReportDetail from "../components/ReportDetail";
import { fetchReports } from "../service/report";

function Report() {
    const [searchParams] = useSearchParams();
    const reportId = searchParams.get("report_id");
    const [activeTab, setActiveTab] = useState("reports"); // Tab状态
    const [reportStats, setReportStats] = useState({ total: 0, recent: 0 });
    const [loading, setLoading] = useState(true);

    // 加载报告统计信息
    useEffect(() => {
        const loadReportStats = async () => {
            try {
                setLoading(true);
                const data = await fetchReports();
                const now = new Date();
                const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const recentCount = data.filter(report => 
                    new Date(report.created_at) >= sevenDaysAgo
                ).length;
                
                setReportStats({
                    total: data.length,
                    recent: recentCount
                });
            } catch (error) {
                console.error("Failed to load report stats:", error);
            } finally {
                setLoading(false);
            }
        };
        loadReportStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header Bar with Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center space-x-4">
                            {/* 简化的页面指示器 */}
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analysis Reports</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* Report Status */}
                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {loading ? (
                                            <span className="text-gray-400">Loading...</span>
                                        ) : (
                                            <span className="font-medium text-purple-600 dark:text-purple-400">
                                                {reportStats.total} report{reportStats.total !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {loading ? (
                                            <span className="text-gray-400">...</span>
                                        ) : (
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                {reportStats.recent} recent
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tab Navigation */}
                    <div className="flex space-x-8 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab("reports")}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === "reports"
                                    ? "border-purple-500 text-purple-600 dark:text-purple-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span>Reports & Analysis</span>
                                {!loading && reportStats.total > 0 && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        {reportStats.total}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content with Tab Views */}
            <div className="py-6">
                {activeTab === "reports" && (
                    <motion.div
                        key="reports-tab"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Reports Section Header */}
                        <div className="mb-6 px-4 sm:px-6 lg:px-8">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Analysis Reports
                                        </h3>
                                        {!loading && (
                                            <>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                    {reportStats.total} total
                                                </span>
                                                {reportStats.recent > 0 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                        {reportStats.recent} recent
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reports Content - Full width container */}
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="max-w-7xl mx-auto">
                                <ReportDetail reportId={reportId} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Report;