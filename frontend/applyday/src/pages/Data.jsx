import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import JDTextManagement from "../components/JDTextManagement";
import JDPage from "../components/JDpage";
import { fetchJDs } from "../service/application";

const DataManagement = () => {
    const [activeTab, setActiveTab] = useState("jd");
    const [dataStats, setDataStats] = useState({ jds: 0, texts: 0 });
    const [loading, setLoading] = useState(true);
    const jdTextManagementRef = useRef();

    // 加载数据统计信息
    useEffect(() => {
        const loadDataStats = async () => {
            try {
                setLoading(true);
                const jdData = await fetchJDs();
                // 这里可以添加获取文本数据的API调用
                setDataStats({
                    jds: jdData.length,
                    texts: 0 // 暂时设为0，等有相关API时更新
                });
            } catch (error) {
                console.error("Failed to load data stats:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDataStats();
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
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Management</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            {/* Data Status */}
                            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {loading ? (
                                            <span className="text-gray-400">Loading...</span>
                                        ) : (
                                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                                {dataStats.jds} JD{dataStats.jds !== 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                                    </svg>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {loading ? (
                                            <span className="text-gray-400">...</span>
                                        ) : (
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                {dataStats.texts} text{dataStats.texts !== 1 ? 's' : ''}
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
                            onClick={() => setActiveTab("jd")}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === "jd"
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>JD Management</span>
                                {!loading && dataStats.jds > 0 && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                        {dataStats.jds}
                                    </span>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("jdtext")}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === "jdtext"
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                                </svg>
                                <span>JD Text Management</span>
                                {!loading && dataStats.texts > 0 && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                        {dataStats.texts}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content with Tab Views */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {activeTab === "jd" && (
                    <motion.div
                        key="jd-tab"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* JD Management Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            {/* JD Header */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            Job Descriptions
                                        </h3>
                                        {!loading && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                {dataStats.jds} total
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* JD Content */}
                            <div className="p-6">
                                <JDPage />
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "jdtext" && (
                    <motion.div
                        key="jdtext-tab"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* JD Text Management Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            {/* JD Text Header */}
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            JD Text Management
                                        </h3>
                                        {!loading && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                {dataStats.texts} total
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => {
                                                if (jdTextManagementRef.current) {
                                                    jdTextManagementRef.current.showExtractDialog();
                                                }
                                            }}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                            </svg>
                                            Extract New JDs
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* JD Text Content */}
                            <div className="p-6">
                                <JDTextManagement ref={jdTextManagementRef} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DataManagement;
