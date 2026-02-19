import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chart from '../../../components/ui/Chart';
import Loading from '../../../components/ui/Loading';
import { createClient } from '../../../utils/client';


const Analytics = () => {
    const { projectId } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('day'); // hour, day, week, month, all
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, [projectId, filter, startDate, endDate]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const client = createClient('/api');
            const params = new URLSearchParams();
            
            if (filter !== 'all') params.append('filter_type', filter);
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            
            const response = await client.get(`/analytics/projects/${projectId}/overview?${params}`);
            setAnalytics(response.data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError('Failed to load analytics data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading fullScreen />;

    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 border border-error text-error bg-error/5 rounded-lg">
                <span className="text-sm font-bold uppercase tracking-wide">{error}</span>
            </div>
        );
    }

    if (!analytics) return null;

    // Prepare data for charts
    const hourlyData = analytics.hourly_chart?.datasets?.messages_sent || [];
    const hourlyLabels = analytics.hourly_chart?.labels || [];
    
    const eventTypeData = analytics.event_type_chart?.datasets?.count || [];
    const eventTypeLabels = analytics.event_type_chart?.labels || [];

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-base-content/60 mt-1">
                        Real-time insights and performance metrics for your project
                    </p>
                </div>
                
                {/* Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="select select-bordered select-md rounded-lg"
                    >
                        <option value="hour">Last Hour</option>
                        <option value="day">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="all">All Time</option>
                    </select>
                    
                    {filter === 'all' && (
                        <>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="input input-bordered input-md rounded-lg"
                                placeholder="Start date"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="input input-bordered input-md rounded-lg"
                                placeholder="End date"
                            />
                        </>
                    )}
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-base-100 border border-base-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <div className="w-6 h-6 bg-primary rounded"></div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider">Total Events</p>
                            <p className="text-2xl font-bold text-base-content">
                                {analytics.current_stats.total_events.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 border border-base-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-success/10">
                            <div className="w-6 h-6 bg-success rounded"></div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider">Messages Sent</p>
                            <p className="text-2xl font-bold text-base-content">
                                {analytics.current_stats.messages_sent.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 border border-base-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-info/10">
                            <div className="w-6 h-6 bg-info rounded"></div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider">Active Connections</p>
                            <p className="text-2xl font-bold text-base-content">
                                {analytics.current_stats.connections.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 border border-base-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-warning/10">
                            <div className="w-6 h-6 bg-warning rounded"></div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-base-content/40 uppercase tracking-wider">Avg Message Size</p>
                            <p className="text-2xl font-bold text-base-content">
                                {Math.round(analytics.current_stats.avg_message_size)}B
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hourly Activity Chart */}
                <section className="border border-base-300 rounded-lg">
                    <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                        <h2 className="text-sm font-bold uppercase tracking-widest">Hourly Activity</h2>
                        <p className="text-xs text-base-content/60 mt-1">Messages sent per hour</p>
                    </div>
                    <div className="p-6">
                        {hourlyData.length > 0 ? (
                            <Chart 
                                type="bar" 
                                data={hourlyData} 
                                labels={hourlyLabels}
                                height={250}
                            />
                        ) : (
                            <div className="h-64 flex items-center justify-center text-base-content/40">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">No data available for this time period</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Event Types Chart */}
                <section className="border border-base-300 rounded-lg">
                    <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                        <h2 className="text-sm font-bold uppercase tracking-widest">Event Distribution</h2>
                        <p className="text-xs text-base-content/60 mt-1">Breakdown by event type</p>
                    </div>
                    <div className="p-6">
                        {eventTypeData.length > 0 ? (
                            <div className="space-y-6">
                                <div className="flex justify-center">
                                    <Chart 
                                        type="pie" 
                                        data={eventTypeData} 
                                        labels={eventTypeLabels}
                                        height={300}
                                    />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {eventTypeLabels.map((label, index) => {
                                        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                                        const count = eventTypeData[index];
                                        const total = eventTypeData.reduce((a, b) => a + b, 0);
                                        const percentage = ((count / total) * 100).toFixed(1);
                                        
                                        return (
                                            <div key={label} className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-100 transition-colors">
                                                <div 
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: colors[index % colors.length] }}
                                                ></div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm text-base-content/80 truncate">{label}</div>
                                                    <div className="text-xs text-base-content/60">{percentage}%</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-base-content/40">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">No events recorded yet</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Connection Types Chart */}
            <section className="border border-base-300 rounded-lg">
                <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                    <h2 className="text-sm font-bold uppercase tracking-widest">Connection Types</h2>
                    <p className="text-xs text-base-content/60 mt-1">WebSocket vs Server-Sent Events</p>
                </div>
                <div className="p-6">
                    {analytics.connection_chart?.datasets?.count?.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <Chart 
                                    type="pie" 
                                    data={analytics.connection_chart.datasets.count} 
                                    labels={analytics.connection_chart.labels}
                                    height={200}
                                />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-base-content/80 mb-3">Connection Types</h3>
                                {analytics.connection_chart.labels.map((label, index) => {
                                    const colors = ['#3b82f6', '#10b981'];
                                    const count = analytics.connection_chart.datasets.count[index];
                                    const total = analytics.connection_chart.datasets.count.reduce((a, b) => a + b, 0);
                                    const percentage = ((count / total) * 100).toFixed(1);
                                    
                                    return (
                                        <div key={label} className="flex items-center justify-between p-2 rounded-lg hover:bg-base-100 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: colors[index % colors.length] }}
                                                ></div>
                                                <span className="text-sm text-base-content/80">{label}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{count.toLocaleString()}</div>
                                                <div className="text-xs text-base-content/60">{percentage}%</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-base-content/40">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="text-sm">No connection data available</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Detailed Stats Table */}
            <section className="border border-base-300 rounded-lg">
                <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                    <h2 className="text-sm font-bold uppercase tracking-widest">Detailed Metrics</h2>
                </div>
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="table table-md">
                            <thead>
                                <tr>
                                    <th>Metric</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="font-medium">Messages Sent</td>
                                    <td>{analytics.current_stats.messages_sent.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.messages_sent / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                    <td>
                                        <div className="badge badge-success badge-sm">↑ Active</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Messages Received</td>
                                    <td>{analytics.current_stats.messages_received.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.messages_received / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                    <td>
                                        <div className="badge badge-success badge-sm">↑ Active</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Broadcasts Sent</td>
                                    <td>{analytics.current_stats.broadcasts_sent.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.broadcasts_sent / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                    <td>
                                        <div className="badge badge-info badge-sm">→ Stable</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Direct Messages</td>
                                    <td>{analytics.current_stats.direct_sent.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.direct_sent / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                    <td>
                                        <div className="badge badge-info badge-sm">→ Stable</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Client Connections</td>
                                    <td>{analytics.current_stats.connections.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.connections / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                    <td>
                                        <div className="badge badge-success badge-sm">↑ Active</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Rooms Joined</td>
                                    <td>{analytics.current_stats.rooms_joined.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.rooms_joined / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                    <td>
                                        <div className="badge badge-info badge-sm">→ Stable</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Analytics;
