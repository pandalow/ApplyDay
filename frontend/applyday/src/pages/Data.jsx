import { useState } from "react";
import JDTextManagement from "../components/JDTextManagement";
import JDPage from "../components/JDpage";


const DataManagement = () => {
    const [activeTab, setActiveTab] = useState("jd");

    const tabs = [
      { id: "jd", label: "JD Management" },
      { id: "jdtext", label: "JD Text Management" },
    ];
    return(
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* 页面标题 */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Data Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage job descriptions and extract valuable insights
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
                {activeTab === "jd" && <JDPage />}
                {activeTab === "jdtext" && <JDTextManagement />}
            </div>
        </div>
    )
};

export default DataManagement;
