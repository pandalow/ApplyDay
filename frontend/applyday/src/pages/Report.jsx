import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ReportDetail from "../components/ReportDetail";

function Report() {
    const [searchParams] = useSearchParams();
    const reportId = searchParams.get("report_id");

    return(
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* 页面标题 */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Job Market Analysis Report
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Comprehensive analysis of job descriptions and market trends with AI-powered insights
                </p>
            </div>

            {/* 报告内容 */}
            <ReportDetail reportId={reportId} />
        </div>
    )
}

export default Report;