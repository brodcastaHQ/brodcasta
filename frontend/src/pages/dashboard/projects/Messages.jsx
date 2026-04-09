import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { createClient } from '../../../utils/client';
import { formatDateTime } from '../../../utils/formatters';

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
    const shouldDelete = window.confirm(`Delete ${scope}?`);
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

    load();

    return () => {
      active = false;
    };
  }, [projectId, selectedRoom, selectedType]);

  if (loading) {
    return <Loading fullScreen label="Loading messages" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--app-text)]">Messages</h1>
          <p className="text-sm text-[var(--app-muted)]">
            {pagination.total} messages · {rooms.length} rooms
          </p>
        </div>
        <button type="button" className="button-secondary text-sm" onClick={handleDeleteMessages}>
          <Trash2 className="mr-1 inline h-4 w-4" />
          Delete
        </button>
      </div>

      {error ? (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2">
        <span className="text-xs font-medium text-[var(--app-subtle)]">Filter:</span>
        
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--app-muted)]">Room</label>
          <select
            value={selectedRoom}
            onChange={(event) => setSelectedRoom(event.target.value)}
            className="rounded border border-[var(--app-border)] bg-[var(--app-surface-2)] px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--app-muted)]">Type</label>
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="rounded border border-[var(--app-border)] bg-[var(--app-surface-2)] px-2 py-1 text-sm"
          >
            <option value="">All</option>
            <option value="room_message">Room</option>
            <option value="broadcast_message">Broadcast</option>
            <option value="direct_message">Direct</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-[var(--app-border)] rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)]">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-[var(--app-muted)]">No messages</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[var(--app-accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--app-accent)]">
                    {message.message_type?.replace('_message', '') || 'msg'}
                  </span>
                  {message.room_id && (
                    <span className="text-xs text-[var(--app-muted)]">@{message.room_id}</span>
                  )}
                </div>
                <span className="text-xs text-[var(--app-subtle)]">{formatDateTime(message.created_at)}</span>
              </div>

              <div className="mt-2">
                <pre className="font-mono text-xs whitespace-pre-wrap text-[var(--app-text)]">
                  {typeof message.data === 'string' ? message.data : JSON.stringify(message.data, null, 2)}
                </pre>
              </div>

              {message.sender_id && (
                <p className="mt-2 text-xs text-[var(--app-subtle)]">from: {message.sender_id}</p>
              )}
            </div>
          ))
        )}
      </div>

      {pagination.has_more ? (
        <button
          type="button"
          className="button-secondary w-full"
          onClick={() => fetchMessages(pagination.offset + pagination.limit)}
        >
          Load more
        </button>
      ) : null}
    </div>
  );
};

export default ProjectMessages;