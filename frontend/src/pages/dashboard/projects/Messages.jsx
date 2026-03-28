import { Filter, MessageSquareText, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { EmptyState, Field, PageHeader, SectionHeader, StatusBadge, Surface } from '../../../components/ui/System';
import { createClient } from '../../../utils/client';
import { formatDateTime, titleCase } from '../../../utils/formatters';

const requestMessages = async ({ projectId, limit, offset, selectedRoom, selectedType }) => {
  const client = createClient('/api/messages');
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    ...(selectedRoom && { room_id: selectedRoom }),
    ...(selectedType && { message_type: selectedType }),
  });
  return client.get(`/project/${projectId}?${params}`);
};

const requestRooms = async (projectId) => {
  const client = createClient('/api/messages');
  return client.get(`/project/${projectId}/rooms`);
};

const DEFAULT_LIMIT = 50;

const ProjectMessages = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: DEFAULT_LIMIT,
    offset: 0,
    has_more: false,
  });

  const fetchMessages = async (offset = 0) => {
    try {
      const response = await requestMessages({
        projectId,
        limit: DEFAULT_LIMIT,
        offset,
        selectedRoom,
        selectedType,
      });
      setMessages((current) =>
        offset === 0 ? response.data.messages : [...current, ...response.data.messages],
      );
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessages = async () => {
    const scope = selectedRoom ? `all messages in ${selectedRoom}` : 'all messages for this project';
    const shouldDelete = window.confirm(`Delete ${scope}? This cannot be undone.`);
    if (!shouldDelete) return;

    try {
      const client = createClient('/api/messages');
      const params = new URLSearchParams(selectedRoom ? { room_id: selectedRoom } : {});
      await client.delete(`/project/${projectId}?${params}`);
      setMessages([]);
      setPagination((current) => ({ ...current, total: 0, has_more: false, offset: 0 }));
    } catch (err) {
      console.error(err);
      setError('Failed to delete messages.');
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        const [messagesResponse, roomsResponse] = await Promise.all([
          requestMessages({
            projectId,
            limit: DEFAULT_LIMIT,
            offset: 0,
            selectedRoom,
            selectedType,
          }),
          requestRooms(projectId),
        ]);

        if (!active) return;
        setMessages(messagesResponse.data.messages);
        setPagination(messagesResponse.data.pagination);
        setRooms(roomsResponse.data.rooms || []);
        setError('');
      } catch (err) {
        console.error(err);
        if (active) setError('Failed to load messages.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [projectId, selectedRoom, selectedType]);

  const summary = {
    rooms: rooms.length,
    total: pagination.total,
    latestType: messages[0]?.message_type ? titleCase(messages[0].message_type) : 'No activity yet',
  };

  if (loading) {
    return <Loading fullScreen label="Loading messages" />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Message History"
        title="Scan traffic without drowning in raw payloads."
        description="Filters, counts, and readable cards now replace the old heavy header-plus-list treatment."
        meta={
          <>
            <StatusBadge tone="info">Rooms {summary.rooms}</StatusBadge>
            <StatusBadge tone="neutral">Messages {summary.total}</StatusBadge>
            <StatusBadge tone="success">{summary.latestType}</StatusBadge>
          </>
        }
        actions={
          <button type="button" className="button-secondary" onClick={handleDeleteMessages}>
            <Trash2 className="h-4 w-4" />
            Delete messages
          </button>
        }
      />

      {error ? (
        <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface className="rounded-[2rem] p-6">
          <SectionHeader
            eyebrow="Filters"
            title="Narrow the traffic stream"
            description="Keep filter controls visible and grouped so operators can reduce noise quickly."
          />

          <div className="mt-6 space-y-5">
            <Field htmlFor="message-room" label="Room">
              <select
                id="message-room"
                value={selectedRoom}
                onChange={(event) => setSelectedRoom(event.target.value)}
                className="select-shell"
              >
                <option value="">All rooms</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </Field>

            <Field htmlFor="message-type" label="Message type">
              <select
                id="message-type"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="select-shell"
              >
                <option value="">All types</option>
                <option value="room_message">Room message</option>
                <option value="broadcast_message">Broadcast</option>
                <option value="direct_message">Direct message</option>
              </select>
            </Field>

            <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/18 bg-cyan-400/10 text-cyan-200">
                  <Filter className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Current result set</p>
                  <p className="mt-1 text-sm text-[var(--app-muted)]">
                    {pagination.total} messages across {rooms.length} known rooms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="rounded-[2rem] p-6">
          <SectionHeader
            eyebrow="Feed"
            title="Recent messages"
            description="Cards are easier to scan than the old dense rows, especially when payloads vary."
          />

          <div className="mt-6 space-y-4">
            {messages.length === 0 ? (
              <EmptyState
                icon={MessageSquareText}
                title="No messages found"
                description={
                  selectedRoom || selectedType
                    ? 'Try widening your filters to bring more traffic into view.'
                    : 'Traffic will appear here once the project starts receiving messages.'
                }
              />
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone="info">{titleCase(message.message_type || 'unknown')}</StatusBadge>
                      {message.room_id ? <StatusBadge tone="neutral">{message.room_id}</StatusBadge> : null}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-subtle)]">
                      {formatDateTime(message.created_at)}
                    </p>
                  </div>

                  <div className="mt-4 rounded-[1.25rem] border border-white/8 bg-slate-950/70 p-4">
                    <p className="font-mono text-xs leading-7 text-slate-100">
                      {typeof message.data === 'string'
                        ? message.data
                        : JSON.stringify(message.data, null, 2)}
                    </p>
                  </div>

                  {message.sender_id ? (
                    <p className="mt-3 text-sm text-[var(--app-muted)]">Sender: {message.sender_id}</p>
                  ) : null}
                </div>
              ))
            )}
          </div>

          {pagination.has_more ? (
            <div className="mt-6">
              <button
                type="button"
                className="button-secondary w-full"
                onClick={() => fetchMessages(pagination.offset + pagination.limit)}
              >
                Load more messages
              </button>
            </div>
          ) : null}
        </Surface>
      </div>
    </div>
  );
};

export default ProjectMessages;
