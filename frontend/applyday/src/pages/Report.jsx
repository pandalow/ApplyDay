import { useState, useEffect } from "react";
import '../service/report.js'
import ReportDetail from "../components/ReportDetail.jsx";
import JDPage from "../components/JDpage.jsx";

function Report() {
    const [activeTab, setActiveTab] = useState("report");

    const tabs = [
        { id: "report", label: "Analysis Report", icon: "📊" },
        { id: "jd", label: "Job Summary", icon: "📋" }
    ];

    return(
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* 页面标题 */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Job Market Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Comprehensive analysis of job descriptions and market trends
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === tab.id
                                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === "report" && <ReportDetail />}
                {activeTab === "jd" && <JDPage />}
            </div>
        </div>
    )
}

export default Report;