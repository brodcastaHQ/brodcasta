import { Activity, CalendarRange, Download, RefreshCw, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Chart from '../../../components/ui/Chart';
import Loading from '../../../components/ui/Loading';
import { Field, MetricCard, PageHeader, SectionHeader, StatusBadge, Surface } from '../../../components/ui/System';
import { createClient } from '../../../utils/client';
import { formatBytes, formatCount, titleCase } from '../../../utils/formatters';

const requestAnalytics = async ({ projectId, filterType, startDate, endDate }) => {
  const client = createClient(`/api/analytics/projects/${projectId}`);
  const params = new URLSearchParams({ filter_type: filterType });
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  return client.get(`/overview?${params}`);
};

const Analytics = () => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [filterType, setFilterType] = useState('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalyticsData = async () => {
    try {
      const response = await requestAnalytics({ projectId, filterType, startDate, endDate });
      setAnalyticsData(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError('Analytics are not available for this project yet.');
      } else {
        setError(err.response?.data?.detail || 'Failed to load analytics.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      setError('Missing project ID.');
      return;
    }

    let active = true;

    const load = async () => {
      try {
        const response = await requestAnalytics({ projectId, filterType, startDate, endDate });
        if (!active) return;
        setAnalyticsData(response.data);
        setError('');
      } catch (err) {
        console.error(err);
        if (!active) return;
        if (err.response?.status === 404) {
          setError('Analytics are not available for this project yet.');
        } else {
          setError(err.response?.data?.detail || 'Failed to load analytics.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    void load();

    return () => {
      active = false;
    };
  }, [projectId, filterType, startDate, endDate]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  const handleExportData = () => {
    if (!analyticsData) return;

    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${projectId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <Loading fullScreen label="Loading analytics" />;
  }

  if (error || !analyticsData) {
    return (
      <Surface className="rounded-[2rem] p-8">
        <p className="text-xl font-semibold text-white">Analytics unavailable</p>
        <p className="mt-3 text-[var(--app-muted)]">{error || 'Try again shortly.'}</p>
        <div className="mt-6">
          <button type="button" className="button-secondary" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      </Surface>
    );
  }

  const stats = analyticsData.current_stats;
  const hourlyMessages = analyticsData.hourly_chart.datasets.messages_sent || [];
  const dailyConnections = analyticsData.daily_chart.datasets.connections || [];
  const eventDistribution = analyticsData.event_type_chart.datasets.count || [];
  const connectionDistribution = analyticsData.connection_type_chart.datasets.count || [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analytics"
        title="See the shape of traffic, not just the totals."
        description="The analytics surface now uses calmer charts, shorter controls, and cleaner summary cards so trends are easier to read."
        meta={
          <>
            <StatusBadge tone="info">{titleCase(filterType)}</StatusBadge>
            <StatusBadge tone="success">Events {formatCount(stats.total_events)}</StatusBadge>
          </>
        }
        actions={
          <>
            <button type="button" className="button-secondary" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button type="button" className="button-primary" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </>
        }
      />

      <Surface className="rounded-[2rem] p-6">
        <SectionHeader
          eyebrow="Filters"
          title="Adjust the observation window"
          description="Use predefined ranges or a custom date window to inspect transport and message activity."
        />

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Field htmlFor="analytics-filter" label="Range preset">
            <select
              id="analytics-filter"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              className="select-shell"
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="all">All</option>
            </select>
          </Field>
          <Field htmlFor="analytics-start" label="Start date">
            <input
              id="analytics-start"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="input-shell"
            />
          </Field>
          <Field htmlFor="analytics-end" label="End date">
            <input
              id="analytics-end"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="input-shell"
            />
          </Field>
        </div>
      </Surface>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Activity}
          label="Total Events"
          value={formatCount(stats.total_events)}
          meta="All tracked analytics events in the selected window."
        />
        <MetricCard
          icon={Waves}
          label="Messages Sent"
          value={formatCount(stats.messages_sent)}
          meta="Outbound room, direct, and broadcast activity."
          tone="success"
        />
        <MetricCard
          icon={CalendarRange}
          label="Connections"
          value={formatCount(stats.connections)}
          meta="Clients connected during the selected period."
        />
        <MetricCard
          icon={Download}
          label="Payload Volume"
          value={formatBytes(stats.total_message_size)}
          meta={`Average payload ${formatBytes(stats.avg_message_size)}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Surface className="rounded-[2rem] p-6">
          <SectionHeader
            eyebrow="Hourly messages"
            title="Message volume by hour"
            description="A tighter line chart replaces the older decorative treatment."
          />
          <div className="mt-6">
            <Chart type="line" data={hourlyMessages} labels={analyticsData.hourly_chart.labels} />
          </div>
        </Surface>

        <Surface className="rounded-[2rem] p-6">
          <SectionHeader
            eyebrow="Daily connections"
            title="Connection trend over the last week"
            description="Connection counts help explain when load or engagement changes."
          />
          <div className="mt-6">
            <Chart type="bar" data={dailyConnections} labels={analyticsData.daily_chart.labels} />
          </div>
        </Surface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface className="rounded-[2rem] p-6">
          <SectionHeader
            eyebrow="Event mix"
            title="Which event types dominate"
            description="Distribution views make it easier to spot unusual traffic shapes."
          />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
              <Chart
                type="pie"
                data={eventDistribution}
                labels={analyticsData.event_type_chart.labels}
                height={260}
              />
            </div>
            <div className="space-y-3">
              {analyticsData.event_type_chart.labels.map((label, index) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <p className="text-sm font-medium text-white">{titleCase(label)}</p>
                  <p className="text-sm text-[var(--app-muted)]">{formatCount(eventDistribution[index])}</p>
                </div>
              ))}
            </div>
          </div>
        </Surface>

        <Surface tone="muted" className="rounded-[2rem] p-6">
          <SectionHeader
            eyebrow="Transport split"
            title="How clients connected"
            description="This gives you a quick read on fallback usage versus native sockets."
          />
          <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
            <Chart
              type="pie"
              data={connectionDistribution}
              labels={analyticsData.connection_type_chart.labels}
              height={260}
            />
          </div>

          <div className="mt-6 space-y-3">
            {analyticsData.connection_type_chart.labels.map((label, index) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-4 py-3"
              >
                <p className="text-sm font-medium text-white">{titleCase(label)}</p>
                <p className="text-sm text-[var(--app-muted)]">{formatCount(connectionDistribution[index])}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
};

export default Analytics;
