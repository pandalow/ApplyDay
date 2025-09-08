import { useState } from "react";
import { processExtract } from "../service/report";

function Extracting({ onSuccess }) {
  const [extractProcessing, setExtractProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  

  const [extractDates, setExtractDates] = useState({
    startDate: "",
    endDate: "",
  });

    const handleDateChange = (e) => {
    const { name, value } = e.target;
    setExtractDates((prev) => ({ ...prev, [name]: value }));
  };

    const handleProcessExtract = async (e) => {
    e.preventDefault();
    if (!extractDates.startDate || !extractDates.endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    setExtractProcessing(true);
    try {
      const result = await processExtract(
        extractDates.startDate + "T00:00:00",
        extractDates.endDate + "T23:59:59"
      );
      alert("Extraction task completed!");
      console.log("Extract result:", result);
      await loadExtracts();
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to process extract:", error);
      alert("Extraction task failed, please check the console for error messages");
    } finally {
      setExtractProcessing(false);
    }
  };


  return (
    
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-6">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Extracting job description information
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Select a date range to process the extraction task
      </p>

      {/* Form */}
      <form onSubmit={handleProcessExtract} className="space-y-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={extractDates.startDate}
            onChange={handleDateChange}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-600 text-gray-800 dark:text-white 
                       focus:border-indigo-500 focus:ring-indigo-500 px-2 py-1"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={extractDates.endDate}
            onChange={handleDateChange}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-600 text-gray-800 dark:text-white 
                       focus:border-indigo-500 focus:ring-indigo-500 px-2 py-1"
          />
        </div>

        {/* Execute button */}
        <div>
          <button
            type="submit"
            disabled={extractProcessing || loading}
            className="w-full px-4 py-2 rounded-md bg-indigo-600 text-white font-medium 
                       hover:bg-indigo-700 disabled:opacity-50"
          >
            {extractProcessing ? "Processing..." : "Execute Extraction Task"}
          </button>
        </div>
      </form>

      {/* Processing status prompt */}
      {extractProcessing && (
        <div className="mt-4 p-3 rounded-md bg-yellow-50 dark:bg-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Processing extraction task, please wait...
          </p>
        </div>
      )}
    </div>
  );
}

export default Extracting;
