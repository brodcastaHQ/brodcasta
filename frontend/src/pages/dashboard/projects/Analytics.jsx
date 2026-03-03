import { Activity, Calendar, Download, Filter, MessageSquare, RefreshCw, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Chart from '../../../components/ui/Chart'
import { createClient } from '../../../utils/client'

const Analytics = () => {
  const { projectId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [filterType, setFilterType] = useState('day')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      console.log('Fetching analytics for project:', projectId)
      
      if (!projectId) {
        setError('No project ID found')
        return
      }
      
      const client = createClient(`/api/analytics/projects/${projectId}`)
      const params = new URLSearchParams({ filter_type: filterType })
      
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)

      console.log('Fetching from endpoint:', `/overview?${params}`)

      const response = await client.get(`/overview?${params}`)

      console.log('Response received:', response.data)
      setAnalyticsData(response.data)
      setError(null)
    } catch (err) {
      console.error('Analytics fetch error:', err)
      if (err.response?.status === 404) {
        setError('Analytics endpoint not found. The backend analytics module may not be implemented yet.')
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.')
      } else {
        setError(`Failed to load analytics data: ${err.response?.data?.detail || err.message}`)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchAnalyticsData()
    } else {
      setLoading(false)
      setError('No project ID found')
    }
  }, [projectId, filterType, startDate, endDate])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalyticsData()
  }

  const handleExportData = () => {
    if (!analyticsData) return
    
    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${projectId}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const StatCard = ({ icon: Icon, title, value, change, changeType }) => (
    <div className="bg-base-100 rounded-xl border border-base-300 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-base-200">
            <Icon className="w-6 h-6 text-base-content" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-base-content/60">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-base-content">{value?.toLocaleString() || 0}</p>
          {change && (
            <div className="mt-2 flex items-center text-sm text-base-content/60">
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        {/* Loading Content */}
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200">
        {/* Error Content */}
        <div className="flex items-center justify-center h-screen">
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <Activity className="h-5 w-5 text-error" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-error">Error</h3>
                <div className="mt-2 text-sm text-error/80">{error}</div>
                <button
                  onClick={handleRefresh}
                  className="mt-3 bg-error/100 text-error px-3 py-1 rounded-md text-sm font-medium hover:bg-error/200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const stats = analyticsData?.current_stats
  const charts = analyticsData

  return (
    <div className="min-h-screen bg-base-200">
      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-base-content">Analytics</h1>
            <p className="mt-1 text-base-content/60">
              Monitor your project's real-time metrics and performance
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 mb-8">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-4 py-2 border border-base-300 rounded-lg text-sm font-medium text-base-content bg-base-100 hover:bg-base-200 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>

          {/* Filters */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6 mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-base-content/60" />
                <span className="text-sm font-medium text-base-content">Filter:</span>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-base-300 rounded-lg text-sm bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="hour">Last Hour</option>
                <option value="day">Last 24 Hours</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="all">All Time</option>
              </select>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-base-content/60" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-base-300 rounded-lg text-sm bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Start date"
                />
                <span className="text-base-content/60">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-base-300 rounded-lg text-sm bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="End date"
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Activity}
              title="Total Events"
              value={stats?.total_events}
            />
            <StatCard
              icon={MessageSquare}
              title="Messages Sent"
              value={stats?.messages_sent}
            />
            <StatCard
              icon={Users}
              title="Connections"
              value={stats?.connections}
            />
            <StatCard
              icon={TrendingUp}
              title="Avg Message Size"
              value={`${Math.round(stats?.avg_message_size || 0)} bytes`}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Hourly Chart */}
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <h3 className="text-lg font-semibold text-base-content mb-4">Hourly Activity</h3>
              <Chart
                type="line"
                data={charts?.hourly_chart?.datasets?.messages_sent || []}
                labels={charts?.hourly_chart?.labels || []}
                height={300}
              />
            </div>

            {/* Daily Chart */}
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <h3 className="text-lg font-semibold text-base-content mb-4">Daily Trends</h3>
              <Chart
                type="bar"
                data={charts?.daily_chart?.datasets?.messages_sent || []}
                labels={charts?.daily_chart?.labels || []}
                height={300}
              />
            </div>

            {/* Event Types Distribution */}
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <h3 className="text-lg font-semibold text-base-content mb-4">Event Types</h3>
              <Chart
                type="pie"
                data={charts?.event_type_chart?.datasets?.count || []}
                labels={charts?.event_type_chart?.labels || []}
                height={300}
              />
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-base-content mb-2">Legend</h4>
                <div className="flex flex-wrap gap-3">
                  {charts?.event_type_chart?.labels?.map((label, index) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded bg-base-300" />
                      <span className="text-xs text-base-content/60">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connection Types Distribution */}
            <div className="bg-base-100 rounded-xl border border-base-300 p-6">
              <h3 className="text-lg font-semibold text-base-content mb-4">Connection Types</h3>
              <Chart
                type="pie"
                data={charts?.connection_type_chart?.datasets?.count || []}
                labels={charts?.connection_type_chart?.labels || []}
                height={300}
              />
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-base-content mb-2">Legend</h4>
                <div className="flex flex-wrap gap-3">
                  {charts?.connection_type_chart?.labels?.map((label, index) => (
                    <div key={label} className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded bg-base-300" />
                      <span className="text-xs text-base-content/60">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Stats Table */}
          <div className="bg-base-100 rounded-xl border border-base-300 p-6">
            <h3 className="text-lg font-semibold text-base-content mb-4">Detailed Statistics</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-base-300">
                <thead className="bg-base-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-base-content/60 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-base-100 divide-y divide-base-300">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                      Messages Sent
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/80">
                      {stats?.messages_sent?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-base-content/60">
                      Total messages sent from your application
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                      Messages Received
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/80">
                      {stats?.messages_received?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-base-content/60">
                      Total messages received by your application
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                      WebSocket Connections
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/80">
                      {stats?.websocket_connections?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-base-content/60">
                      Total WebSocket connections established
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                      SSE Connections
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/80">
                      {stats?.sse_connections?.toLocaleString() || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-base-content/60">
                      Total Server-Sent Events connections
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-base-content">
                      Total Message Size
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/80">
                      {(stats?.total_message_size / 1024).toFixed(2)} KB
                    </td>
                    <td className="px-6 py-4 text-sm text-base-content/60">
                      Combined size of all messages transferred
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics