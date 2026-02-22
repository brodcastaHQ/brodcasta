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

  const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-gray-600">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value?.toLocaleString() || 0}</p>
          {change && (
            <div className={`mt-2 flex items-center text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
            <button
              onClick={handleRefresh}
              className="mt-3 bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stats = analyticsData?.current_stats
  const charts = analyticsData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Monitor your project's real-time metrics and performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportData}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hour">Last Hour</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start date"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="End date"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Activity}
          title="Total Events"
          value={stats?.total_events}
          color="bg-blue-500"
        />
        <StatCard
          icon={MessageSquare}
          title="Messages Sent"
          value={stats?.messages_sent}
          color="bg-green-500"
        />
        <StatCard
          icon={Users}
          title="Connections"
          value={stats?.connections}
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg Message Size"
          value={`${Math.round(stats?.avg_message_size || 0)} bytes`}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Activity</h3>
          <Chart
            type="line"
            data={charts?.hourly_chart?.datasets?.messages_sent || []}
            labels={charts?.hourly_chart?.labels || []}
            height={300}
          />
        </div>

        {/* Daily Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Trends</h3>
          <Chart
            type="bar"
            data={charts?.daily_chart?.datasets?.messages_sent || []}
            labels={charts?.daily_chart?.labels || []}
            height={300}
          />
        </div>

        {/* Event Types Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
          <Chart
            type="pie"
            data={charts?.event_type_chart?.datasets?.count || []}
            labels={charts?.event_type_chart?.labels || []}
            height={300}
          />
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Legend</h4>
            <div className="flex flex-wrap gap-3">
              {charts?.event_type_chart?.labels?.map((label, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                const color = colors[index % colors.length];
                return (
                  <div key={label} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Connection Types Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Types</h3>
          <Chart
            type="pie"
            data={charts?.connection_type_chart?.datasets?.count || []}
            labels={charts?.connection_type_chart?.labels || []}
            height={300}
          />
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Legend</h4>
            <div className="flex flex-wrap gap-3">
              {charts?.connection_type_chart?.labels?.map((label, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                const color = colors[index % colors.length];
                return (
                  <div key={label} className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Messages Sent
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats?.messages_sent?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Total messages sent from your application
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Messages Received
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats?.messages_received?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Total messages received by your application
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  WebSocket Connections
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats?.websocket_connections?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Total WebSocket connections established
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  SSE Connections
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stats?.sse_connections?.toLocaleString() || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Total Server-Sent Events connections
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Message Size
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(stats?.total_message_size / 1024).toFixed(2)} KB
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Combined size of all messages transferred
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics