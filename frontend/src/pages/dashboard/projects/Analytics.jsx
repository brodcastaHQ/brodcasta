import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
                <div className="bg-base-100 border border-base-200 rounded-lg p-6">
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

                <div className="bg-base-100 border border-base-200 rounded-lg p-6">
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

                <div className="bg-base-100 border border-base-200 rounded-lg p-6">
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

                <div className="bg-base-100 border border-base-200 rounded-lg p-6">
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
                    </div>
                    <div className="p-6">
                        <div className="h-64 flex items-end justify-between gap-1">
                            {analytics.hourly_chart.labels.map((label, index) => {
                                const maxValue = Math.max(...Object.values(analytics.hourly_chart.datasets).flat());
                                const messagesSent = analytics.hourly_chart.datasets.messages_sent[index] || 0;
                                const height = (messagesSent / maxValue) * 100;
                                
                                return (
                                    <div key={label} className="flex-1 flex flex-col items-center">
                                        <div 
                                            className="w-full bg-primary rounded-t"
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <span className="text-xs text-base-content/60 mt-1">{label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Event Types Chart */}
                <section className="border border-base-300 rounded-lg">
                    <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
                        <h2 className="text-sm font-bold uppercase tracking-widest">Event Distribution</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {analytics.event_type_chart.labels.map((label, index) => {
                                const count = analytics.event_type_chart.datasets.count[index];
                                const total = analytics.event_type_chart.datasets.count.reduce((a, b) => a + b, 0);
                                const percentage = (count / total) * 100;
                                
                                return (
                                    <div key={label} className="flex items-center justify-between">
                                        <span className="text-sm text-base-content/80">{label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-base-200 rounded-full h-2">
                                                <div 
                                                    className="bg-primary h-2 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">{count}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>

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
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="font-medium">Messages Sent</td>
                                    <td>{analytics.current_stats.messages_sent.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.messages_sent / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Messages Received</td>
                                    <td>{analytics.current_stats.messages_received.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.messages_received / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Broadcasts Sent</td>
                                    <td>{analytics.current_stats.broadcasts_sent.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.broadcasts_sent / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Direct Messages</td>
                                    <td>{analytics.current_stats.direct_sent.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.direct_sent / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Client Connections</td>
                                    <td>{analytics.current_stats.connections.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.connections / analytics.current_stats.total_events) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium">Rooms Joined</td>
                                    <td>{analytics.current_stats.rooms_joined.toLocaleString()}</td>
                                    <td>
                                        {((analytics.current_stats.rooms_joined / analytics.current_stats.total_events) * 100).toFixed(1)}%
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
