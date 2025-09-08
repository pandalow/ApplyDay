import { useState } from "react";
import { generatePipeline } from "../service/application";
import { useNavigate } from "react-router-dom";

function ReportGenerator({ selectedApplicationIds, selectedResumeId, compact = false }) {
  const [showOptions, setShowOptions] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [analysisMode, setAnalysisMode] = useState("selected"); // selected, dateRange, all
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aiLanguage, setAiLanguage] = useState("en"); // en, zh
  const navigate = useNavigate();

  const handleGenerateReport = async (mode = analysisMode) => {
    setGenerating(true);
    
    try {
      let requestData = {};
      
      switch (mode) {
        case "selected":
          // Selected applications
          if (selectedApplicationIds.length === 0) {
            alert("Please select at least one job application.");
            setGenerating(false);
            return;
          }
          requestData = {
            job_ids: selectedApplicationIds,
            languages: aiLanguage,
            ...(selectedResumeId && { resume_id: selectedResumeId })
          };
          break;
          
        case "dateRange":
          // Use date range
          if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            setGenerating(false);
            return;
          }
          requestData = {
            start_date: startDate,
            end_date: endDate,
            languages: aiLanguage,
            ...(selectedResumeId && { resume_id: selectedResumeId })
          };
          break;
          
        case "all":
          // Analyze all data
          requestData = {
            languages: aiLanguage,
            ...(selectedResumeId && { resume_id: selectedResumeId })
          };
          break;
          
        default:
          alert("Invalid analysis mode.");
          setGenerating(false);
          return;
      }

      console.log("Generating report with data:", requestData);
      
      const response = await generatePipeline(requestData);
      console.log("Report generation response:", response);

      // Navigate to report details page
      // API response format: { report: { id: ... }, summary: ... }
      if (response && response.report && response.report.id) {
        console.log("Navigating to report with ID:", response.report.id);
        navigate(`/report?report_id=${response.report.id}`);
      } else if (response && response.id) {
        // Fallback: if the report object is returned directly
        console.log("Navigating to report with direct ID:", response.id);
        navigate(`/report?report_id=${response.id}`);
      } else if (response && response.report_id) {
        // Fallback: if the report_id field is present
        console.log("Navigating to report with report_id:", response.report_id);
        navigate(`/report?report_id=${response.report_id}`);
      } else {
        console.error("Unexpected response structure:", response);
        alert("Report generated but missing report ID in response");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report, please check console for details");
    } finally {
      setGenerating(false);
      setShowOptions(false);
    }
  };

  const getButtonText = () => {
    const languageIndicator = aiLanguage === "en" ? "🇺🇸" : "🇨🇳";
    
    switch (analysisMode) {
      case "selected":
        return `Generate Report ${languageIndicator} (${selectedApplicationIds.length} selected)`;
      case "dateRange":
        return startDate && endDate 
          ? `Generate Report ${languageIndicator} (${startDate} to ${endDate})`
          : `Generate Report ${languageIndicator} (Date Range)`;
      case "all":
        return `Generate Report ${languageIndicator} (All Data)`;
      default:
        return `Generate Report ${languageIndicator}`;
    }
  };

  const isButtonDisabled = () => {
    if (generating) return true;
    
    switch (analysisMode) {
      case "selected":
        return selectedApplicationIds.length === 0;
      case "dateRange":
        return !startDate || !endDate;
      case "all":
        return false;
      default:
        return true;
    }
  };

  return (
    <div className={`${compact ? "relative space-y-2" : "space-y-4"}`}>
      {compact ? (
        /* Compact mode for header */
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleGenerateReport()}
            disabled={isButtonDisabled()}
            className="inline-flex items-center px-3 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium shadow-sm hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 transition-all disabled:opacity-50"
            title={
              isButtonDisabled() 
                ? "Select applications or configure report options to generate"
                : `Generate report for ${selectedApplicationIds.length > 0 ? selectedApplicationIds.length + ' selected app(s)' : 'analysis'}`
            }
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l4 4m0 0l-4 4m4-4H3" />
            </svg>
            {generating ? "Generating..." : "Generate Report"}
          </button>
          
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="px-2 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            title="Report Generation Options"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      ) : (
        /* Full mode */
        <div className="space-y-3">
          <button
            onClick={() => handleGenerateReport()}
            disabled={isButtonDisabled()}
            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold shadow-sm hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l4 4m0 0l-4 4m4-4H3" />
            </svg>
            {generating ? "Generating..." : "Generate Report"}
          </button>
          
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
              <span>Report Options</span>
            </div>
          </button>
        </div>
      )}

      {/* Status Information - Only displayed in non-compact mode */}
      {!compact && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <div className="flex items-center justify-between">
              <span>Current Mode:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {analysisMode === "selected" && "Selected Apps"}
                {analysisMode === "dateRange" && "Date Range"}
                {analysisMode === "all" && "All Data"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Language:</span>
              <span className="font-medium text-green-600 dark:text-green-400 flex items-center space-x-1">
                <span>{aiLanguage === "en" ? "🇺🇸" : "🇨🇳"}</span>
                <span>{aiLanguage === "en" ? "English" : "中文"}</span>
              </span>
            </div>
            {analysisMode === "selected" && selectedApplicationIds.length > 0 && (
              <div className="text-center text-blue-600 dark:text-blue-400">
                {selectedApplicationIds.length} application{selectedApplicationIds.length > 1 ? 's' : ''} selected
              </div>
            )}
            {selectedResumeId && (
              <div className="text-green-600 dark:text-green-400 text-center flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Resume included
              </div>
            )}
          </div>
        </div>
      )}

      {/* Options Panel */}
      {showOptions && (
        <div className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4
          ${compact ? 'absolute top-full right-0 mt-2 w-80 z-50' : ''}
        `}>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Report Generation Options
          </h5>

          {/* Analysis Mode Selection */}
          <div className="space-y-3">
            <div className="space-y-2">
              {/* Selected Applications */}
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="selected"
                  checked={analysisMode === "selected"}
                  onChange={(e) => setAnalysisMode(e.target.value)}
                  className="accent-blue-600 mt-1"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">Selected Applications</span>
                  <p className="text-xs text-gray-500">
                    Analyze only selected applications ({selectedApplicationIds.length} selected)
                  </p>
                </div>
              </label>

              {/* Date Range */}
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="dateRange"
                  checked={analysisMode === "dateRange"}
                  onChange={(e) => setAnalysisMode(e.target.value)}
                  className="accent-blue-600 mt-1"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">Date Range</span>
                  <p className="text-xs text-gray-500 mb-2">
                    Analyze applications within specific dates
                  </p>
                  {analysisMode === "dateRange" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Start Date:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">End Date:</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* All Data */}
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value="all"
                  checked={analysisMode === "all"}
                  onChange={(e) => setAnalysisMode(e.target.value)}
                  className="accent-blue-600 mt-1"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium">All Data</span>
                  <p className="text-xs text-gray-500">Analyze all applications in system</p>
                </div>
              </label>
            </div>
          </div>

          {/* AI Report Language Selection */}
          <div className="space-y-3">
            <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              AI Analysis Language
            </h6>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="en"
                  checked={aiLanguage === "en"}
                  onChange={(e) => setAiLanguage(e.target.value)}
                  className="accent-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🇺🇸</span>
                  <span className="text-sm">English</span>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="zh"
                  checked={aiLanguage === "zh"}
                  onChange={(e) => setAiLanguage(e.target.value)}
                  className="accent-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🇨🇳</span>
                  <span className="text-sm">中文</span>
                </div>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Select the language for AI-generated analysis reports
            </p>
          </div>

          {/* Bottom Buttons */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowOptions(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleGenerateReport()}
              disabled={isButtonDisabled()}
              className="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportGenerator;
