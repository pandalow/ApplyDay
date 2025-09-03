import FrequencyChart from "../charts/FrequencyChart";
import WordCloudChart from "../charts/WordCloudChart";
import PieChart from "../charts/PieChart";
import TfidfGroupedChart from "../charts/TFIDFChart";

function ReportItem({ result }) {
  const { name, result: data } = result;

  // 频率分析组件
  if (name.startsWith("freq")) {
    const pieFields = ["freq.role", "freq.level", "freq.employment_type"];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
            {name.replace('freq.', '').replace('_', ' ')} Analysis
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Frequency distribution analysis
          </p>
        </div>
        <div className="chart-container">
          {pieFields.includes(name) ? (
            <PieChart data={data} />
          ) : (
            <FrequencyChart data={data} />
          )}
        </div>
      </div>
    );
  }

  // Swiss Knife分析组件
  if (name === "swiss_knife") {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Swiss Knife Analysis
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Multi-tool job description analysis
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ODI Tools
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Swiss JD
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {row.role}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {row.company}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {row.odi_tools}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.is_swiss_jd 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}>
                      {row.is_swiss_jd ? "✅ Yes" : "❌ No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 词性分析组件
  if (name.startsWith("pos")) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Part-of-Speech Analysis
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Word cloud visualization by grammatical categories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Nouns</h5>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {Object.keys(data.nouns || {}).length} words
              </span>
            </div>
            <WordCloudChart words={data.nouns} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Verbs</h5>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {Object.keys(data.verbs || {}).length} words
              </span>
            </div>
            <WordCloudChart words={data.verbs} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Adjectives</h5>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {Object.keys(data.adjectives || {}).length} words
              </span>
            </div>
            <WordCloudChart words={data.adjectives} />
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">All Words</h5>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {Object.keys(data.all || {}).length} words
              </span>
            </div>
            <WordCloudChart words={data.all} />
          </div>
        </div>
      </div>
    );
  }

  // TF-IDF分析组件
  if (name.startsWith("tfidf")) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            TF-IDF Analysis
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Term frequency-inverse document frequency analysis
          </p>
        </div>
        <div className="chart-container">
          <TfidfGroupedChart data={data} />
        </div>
      </div>
    );
  }

  // 默认JSON显示组件
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 capitalize">
          {name.replace(/_/g, ' ')} Data
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Raw data visualization
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
export default ReportItem;
