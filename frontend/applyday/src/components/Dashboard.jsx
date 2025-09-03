import { useEffect, useState } from "react"
import { getStats } from "../service/application"

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    rejected: 0,
    interviewed: 0,
    offered: 0,
    applied: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await getStats()
        console.log("API Response:", response) // 调试用

        if (response && response.data) {
          setStats(response.data)
        }
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
    </div>
  )
  
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-400 text-4xl mb-4">⚠️</div>
      <p className="text-red-500 dark:text-red-400 text-lg mb-2">Error loading dashboard</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
    </div>
  )

  // 计算转化率
  const conversionRate =
    stats.applied > 0 ? ((stats.offered / stats.applied) * 100).toFixed(1) : 0

  return (
    <div className="w-full">
      {/* 卡片区域 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.total}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-6">
          <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">Applied</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.applied}</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm border border-red-200 dark:border-red-800 p-6">
          <p className="text-sm text-red-600 dark:text-red-300 mb-2">Rejected</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm border border-yellow-200 dark:border-yellow-800 p-6">
          <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-2">Interviewed</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.interviewed}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-800 p-6">
          <p className="text-sm text-green-600 dark:text-green-300 mb-2">Offered</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.offered}</p>
        </div>
      </div>

      {/* 转化率 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Conversion Rate
        </h2>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{conversionRate}%</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          (offered ÷ applied × 100)
        </p>
      </div>
    </div>
  )
}

export default Dashboard
