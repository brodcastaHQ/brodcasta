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
    <div className="bg-base-100 rounded-xl border border-base-300 p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="mt-4 text-sm font-medium text-base-content/60">{title}</h3>
          <p className="mt-2 text-3xl font-bold text-base-content">{value?.toLocaleString() || 0}</p>
          {change && (
            <div className={`mt-2 flex items-center text-sm ${
              changeType === 'positive' ? 'text-success' : 'text-error'
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2"/>
              </radialGradient>
            </defs>
            
            {/* Dot grid pattern */}
            <circle cx="50" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="150" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="250" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="350" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="450" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="550" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="650" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="750" cy="50" r="10" fill="url(#dotGradient)" />
            
            <circle cx="50" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="150" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="250" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="350" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="450" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="550" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="650" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="750" cy="200" r="6" fill="url(#dotGradient)" />
            
            <circle cx="50" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="150" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="250" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="350" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="450" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="550" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="650" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="750" cy="400" r="3" fill="url(#dotGradient)" />
          </svg>
        </div>
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-base-200/80"></div>
        
        {/* Loading Content */}
        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2"/>
              </radialGradient>
            </defs>
            
            {/* Dot grid pattern */}
            <circle cx="50" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="150" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="250" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="350" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="450" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="550" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="650" cy="50" r="10" fill="url(#dotGradient)" />
            <circle cx="750" cy="50" r="10" fill="url(#dotGradient)" />
            
            <circle cx="50" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="150" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="250" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="350" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="450" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="550" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="650" cy="200" r="6" fill="url(#dotGradient)" />
            <circle cx="750" cy="200" r="6" fill="url(#dotGradient)" />
            
            <circle cx="50" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="150" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="250" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="350" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="450" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="550" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="650" cy="400" r="3" fill="url(#dotGradient)" />
            <circle cx="750" cy="400" r="3" fill="url(#dotGradient)" />
          </svg>
        </div>
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-base-200/80"></div>
        
        {/* Error Content */}
        <div className="relative z-10 flex items-center justify-center h-screen">
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
                  className="btn btn-error btn-sm mt-3"
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Dot Pattern Background */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2"/>
            </radialGradient>
          </defs>
          
          {/* Dot grid pattern */}
          <circle cx="50" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="150" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="250" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="350" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="450" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="550" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="650" cy="50" r="10" fill="url(#dotGradient)" />
          <circle cx="750" cy="50" r="10" fill="url(#dotGradient)" />
          
          <circle cx="50" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="150" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="250" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="350" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="450" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="550" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="650" cy="200" r="6" fill="url(#dotGradient)" />
          <circle cx="750" cy="200" r="6" fill="url(#dotGradient)" />
          
          <circle cx="50" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="150" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="250" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="350" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="450" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="550" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="650" cy="400" r="3" fill="url(#dotGradient)" />
          <circle cx="750" cy="400" r="3" fill="url(#dotGradient)" />
        </svg>
      </div>
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-base-200/80"></div>
      
      {/* Content */}
      <div className="relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Analytics</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Monitor your project's real-time metrics and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-primary btn-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportData}
            className="btn btn-secondary btn-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-base-content/60" />
            <span className="text-sm font-medium text-base-content">Filter:</span>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="hour">Last Hour</option>
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-base-content/60" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered input-sm"
              placeholder="Start date"
            />
            <span className="text-base-content/60">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered input-sm"
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
              {charts?.event_type_chart?.labels?.map((label, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                const color = colors[index % colors.length];
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-base-content/60">{label}</span>
                  </div>
                );
              })}
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
              {charts?.connection_type_chart?.labels?.map((label, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                const color = colors[index % colors.length];
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-base-content/60">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-base-100 rounded-xl border border-base-300 p-6">
        <h3 className="text-lg font-semibold text-base-content mb-4">Detailed Statistics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/60">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/60">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/60">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/60">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/60">
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
  )
}

export default Analytics