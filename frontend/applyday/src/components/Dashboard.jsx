import { useEffect, useState } from "react"
import { getStats } from "../service/application"

function Dashboard(){

    const [stats, setStats] = useState({
        total: 0,
        rejected: 0,
        interviewed: 0,
        offered: 0,
        applied: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const response = await getStats()
                console.log('API Response:', response) // 调试用
                
                if (response && response.data) {
                    setStats(response.data)
                }
            } catch (err) {
                console.error('Error fetching stats:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Total Applications: {stats.total}</p>
            <p>Applied Applications: {stats.applied}</p>
            <p>Rejected Applications: {stats.rejected}</p>
            <p>Interviewed Applications: {stats.interviewed}</p>
            <p>Offered Applications: {stats.offered}</p>
        </div>
    )
}

export default Dashboard