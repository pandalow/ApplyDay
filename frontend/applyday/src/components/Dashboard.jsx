import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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
        console.log("API Response:", response) // For debugging

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

  // Calculate funnel data - remove Applied (as it's always 100%)
  const funnelData = [
    { 
      label: "Interview", 
      value: stats.interviewed, 
      percentage: stats.applied > 0 ? (stats.interviewed / stats.applied * 100) : 0,
      color: "bg-yellow-500",
      icon: "💬"
    },
    { 
      label: "Offer", 
      value: stats.offered, 
      percentage: stats.applied > 0 ? (stats.offered / stats.applied * 100) : 0,
      color: "bg-green-500",
      icon: "🎉"
    }
  ]

  return (
    <div className="w-full space-y-4">
      {/* Data overview - compressed layout */}
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
          <p className="text-md md:text-lg font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-2 text-center"
        >
          <p className="text-xs text-blue-600 dark:text-blue-300 mb-1">Applied</p>
          <p className="text-md md:text-lg font-bold text-blue-600 dark:text-blue-400">{stats.applied}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm border border-yellow-200 dark:border-yellow-800 p-2 text-center"
        >
          <p className="text-xs text-yellow-600 dark:text-yellow-300 mb-1">Interview</p>
          <p className="text-md md:text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.interviewed}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm border border-green-200 dark:border-green-800 p-2 text-center"
        >
          <p className="text-xs text-green-600 dark:text-green-300 mb-1">Offered</p>
          <p className="text-md md:text-lg font-bold text-green-600 dark:text-green-400">{stats.offered}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow-sm border border-red-200 dark:border-red-800 p-2 text-center"
        >
          <p className="text-xs text-red-600 dark:text-red-300 mb-1">Rejected</p>
          <p className="text-md md:text-lg font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
        </motion.div>
      </div>

      {/* Conversion funnel - compressed version */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
      >
        <h2 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
          Conversion Funnel
        </h2>
        
        <div className="space-y-3">
          {funnelData.map((stage, index) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
              className="relative"
            >
              {/* Funnel bar */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 w-20">
                  <span className="text-md">{stage.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {stage.label}
                  </span>
                </div>
                
                <div className="flex-1 relative">
                  {/* Background bar */}
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {/* Progress bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.percentage}%` }}
                      transition={{ duration: 1, delay: 1 + index * 0.2, ease: "easeOut" }}
                      className={`h-full ${stage.color} relative overflow-hidden`}
                    >
                      {/* Animation light effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </motion.div>
                  </div>
                  
                  {/* Value display */}
                  <div className="absolute right-0 top-0 h-6 flex items-center pr-2">
                    <span className="text-xs font-bold text-white mix-blend-difference">
                      {stage.value} ({stage.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Connection line */}
              {index < funnelData.length - 1 && (
                <div className="flex justify-center mt-1 mb-1">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: 1.2 + index * 0.2 }}
                    className="w-0.5 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
