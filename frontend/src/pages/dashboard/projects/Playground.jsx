import { BrodcastaClient } from 'brodcasta-sdk';
import { AlertTriangle, Link, Link2Off, PlugZap, RefreshCcw, Send, Terminal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
import { Field, PageHeader, SectionHeader, StatusBadge, Surface } from '../../../components/ui/System';
import { createClient } from '../../../utils/client';

const DEFAULT_ROOM = 'brodcasta_default';
const MAX_LOGS = 200;

// Hide low-signal connection bootstrap events from the log list.
const HIDDEN_EVENTS = new Set(['client.identity', 'connection.established']);

const formatTime = (date) => {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
};

const safeJson = (value) => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const prettifyJson = (text) => {
  try {
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return text;
  }
};

const summarize = (eventName, payload) => {
  if (payload == null) return '';
  if (typeof payload !== 'object') return String(payload);

  const data = payload;

  if (eventName === 'message.received' && typeof data.message === 'string') {
    return data.message;
  }

  if (eventName === 'broadcast.received' && typeof data.message === 'string') {
    return data.message;
  }

  if (eventName === 'direct.received' && typeof data.message === 'string') {
    return data.message;
  }

  const raw = safeJson(data);
  if (raw.length <= 140) return raw;
  return `${raw.slice(0, 140)}...`;
};

const ProjectPlayground = () => {
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [token, setToken] = useState('');
  const [authError, setAuthError] = useState('');

  const [state, setState] = useState('idle');
  const [transport, setTransport] = useState(null);
  const [prefer, setPrefer] = useState('ws');
  const [connectionError, setConnectionError] = useState('');

  const [room, setRoom] = useState(DEFAULT_ROOM);
  const [rooms, setRooms] = useState([DEFAULT_ROOM]);

  const [eventType, setEventType] = useState('message.send');
  const [message, setMessage] = useState('{"text": "Hello World!"}');
  const [targetClientId, setTargetClientId] = useState('');

  const [logs, setLogs] = useState([]);
  const [allLogs, setAllLogs] = useState({}); // Store logs per room

  const clientRef = useRef(null);
  const cleanupRef = useRef([]);

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL || 'http://localhost:8041',
    []
  );
  const sdkBaseUrl = useMemo(() => apiBaseUrl.replace(/\/api\/?$/, ''), [apiBaseUrl]);

  const connected = state === 'open';
  const busy = state === 'connecting' || state === 'reconnecting';

  const pushEventLog = (eventName, payload, roomId = null) => {
    const logEntry = { time: new Date(), event: eventName, data: payload, room: roomId };
    
    setAllLogs((prev) => {
      const roomKey = roomId || 'global';
      const currentRoomLogs = prev[roomKey] || [];
      const nextLogs = [logEntry, ...currentRoomLogs].slice(0, MAX_LOGS);
      return {
        ...prev,
        [roomKey]: nextLogs
      };
    });
    
    // Only update displayed logs if this belongs to current room
    const activeRoom = room.trim();
    if (roomId === activeRoom || (!roomId && activeRoom === DEFAULT_ROOM)) {
      setLogs((prev) => {
        const next = [logEntry, ...prev];
        return next.slice(0, MAX_LOGS);
      });
    }
  };

  const switchRoom = (newRoom) => {
    setRoom(newRoom);
    // Load logs for the new room
    const roomKey = newRoom || 'global';
    setLogs(allLogs[roomKey] || []);
  };

  const disconnect = () => {
    cleanupRef.current.forEach((fn) => fn?.());
    cleanupRef.current = [];

    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }

    setTransport(null);
    setState('closed');
    setConnectionError('');
  };

  const connect = async () => {
    // Only require token if project needs authentication
    if (project?.auth_type !== 'none' && !token) {
      setAuthError('Token required to connect.');
      return;
    }

    disconnect();
    setAuthError('');
    setConnectionError('');
    setState('connecting');

    const client = new BrodcastaClient({
      baseUrl: sdkBaseUrl,
      projectId,
      prefer,
      fallbackToSse: true,
      autoConnect: false,
      
    });

    clientRef.current = client;
    cleanupRef.current = [
      client.on('state', ({ state: nextState }) => setState(nextState)),
      client.on('transport', ({ transport }) => setTransport(transport)),
      client.on('error', ({ error }) => {
        setConnectionError(error?.message || 'Connection error');
      }),
      client.on('message', ({ event, data }) => {
        console.log('message', event, data);
        const eventName = String(event);
        if (HIDDEN_EVENTS.has(eventName)) return;
        
        // Extract room information from message data if available
        let messageRoom = null;
        if (data && typeof data === 'object') {
          messageRoom = data.room_id || data.room || null;
        }
        
        pushEventLog(eventName, data, messageRoom);
      }),
    ];

    try {
      // Pass token only if authentication is required
      await client.connect(project?.auth_type !== 'none' ? token : null);
    } catch (err) {
      console.error(err);
      setConnectionError(err?.message || 'Failed to connect');
      setState('error');
    }
  };

  const attachRoom = async () => {
    const roomId = room.trim();
    if (!clientRef.current || !connected || !roomId) return;

    try {
      await clientRef.current.join(roomId);
      setRooms((prev) => (prev.includes(roomId) ? prev : [roomId, ...prev]));
      // Auto-switch to the newly attached room
      switchRoom(roomId);
    } catch (err) {
      console.error(err);
      setConnectionError(err?.message || 'Failed to attach room');
    }
  };

  const detachRoom = async () => {
    const roomId = room.trim();
    if (!clientRef.current || !connected || !roomId) return;

    try {
      await clientRef.current.leave(roomId);
      setRooms((prev) => prev.filter((item) => item !== roomId));
    } catch (err) {
      console.error(err);
      setConnectionError(err?.message || 'Failed to detach room');
    }
  };

  const publish = async () => {
    if (!clientRef.current || !connected) return;

    const text = message.trim();
    if (!text) return;

    try {
      if (eventType === 'message.send') {
        const roomId = room.trim();
        if (!roomId) return;
        if (!rooms.includes(roomId)) {
          setConnectionError('Attach the room before publishing.');
          return;
        }
        await clientRef.current.sendMessage(roomId, text);
      }

      if (eventType === 'message.broadcast') {
        await clientRef.current.broadcast(text);
      }

      if (eventType === 'message.direct') {
        const target = targetClientId.trim();
        if (!target) return;
        await clientRef.current.direct(target, text);
      }

      setMessage('');
    } catch (err) {
      console.error(err);
      setConnectionError(err?.message || 'Publish failed');
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchProject = async () => {
      disconnect();
      setLogs([]);
      setAllLogs({});
      setRooms([DEFAULT_ROOM]);
      setRoom(DEFAULT_ROOM);

      setLoading(true);
      setError('');
      setAuthError('');
      setConnectionError('');

      try {
        const client = createClient(`/api/projects/${projectId}`);
        const projectRes = await client.get('/');

        if (cancelled) return;

        if (projectRes.status === 200) {
          setProject(projectRes.data);
        } else {
          setError('Failed to load project.');
        }

        // Only show auth error if project requires authentication
        if (projectRes.data?.auth_type !== 'none') {
          setAuthError('Provide a token below to authenticate.');
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError('Failed to load project.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchProject();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  if (loading) return <Loading fullScreen />;

  if (error) {
    return (
      <div role="alert" className="alert alert-error shadow-none">
        <span>{error}</span>
      </div>
    );
  }

  const statusText = connected ? 'Connected' : busy ? 'Connecting' : 'Disconnected';
  const statusTone = connected ? 'success' : busy ? 'warning' : 'neutral';

  const canDetach = rooms.includes(room.trim());

  const publishDisabled =
    !connected ||
    !message.trim() ||
    (eventType === 'message.direct' && !targetClientId.trim()) ||
    (eventType === 'message.send' && (!room.trim() || !rooms.includes(room.trim())));

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Playground"
        title={`Interactive testing for ${project?.name || 'this project'}`}
        description="Connect with WebSocket or SSE, join rooms, publish JSON payloads, and watch the event stream from a calmer operator layout."
        meta={
          <>
            <StatusBadge tone={statusTone}>{statusText}</StatusBadge>
            {transport ? <StatusBadge tone="info">{String(transport).toUpperCase()}</StatusBadge> : null}
            <StatusBadge tone="neutral">Room {room || DEFAULT_ROOM}</StatusBadge>
          </>
        }
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="select-shell"
              value={prefer}
              onChange={(event) => setPrefer(event.target.value)}
              disabled={connected || busy}
            >
              <option value="ws">WebSocket</option>
              <option value="sse">SSE</option>
            </select>
            <button
              type="button"
              className="button-primary"
              onClick={connected ? disconnect : connect}
              disabled={(project?.auth_type !== 'none' && !token) || busy}
            >
              {connected ? <RefreshCcw className="h-4 w-4" /> : <PlugZap className="h-4 w-4" />}
              {connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        }
      />

      {connectionError ? (
        <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {connectionError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface className="flex min-h-[640px] flex-col rounded-[2rem] p-6">
          <div className="flex flex-col gap-4 border-b border-white/8 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Event Stream"
              title="Live logs"
              description={
                room !== DEFAULT_ROOM
                  ? `Streaming recent events for ${room}.`
                  : 'Streaming recent events and payload summaries.'
              }
            />
            <button
              type="button"
              className="button-secondary"
              onClick={() => {
                setAllLogs((prev) => ({ ...prev, [room || 'global']: [] }));
                setLogs([]);
              }}
            >
              Clear logs
            </button>
          </div>

          <div className="mt-6 flex-1 overflow-auto">
            {logs.length === 0 ? (
              <div className="flex h-full min-h-[420px] items-center justify-center rounded-[1.75rem] border border-white/8 bg-white/[0.03] text-center">
                <div className="space-y-3 px-6">
                  <Terminal className="mx-auto h-6 w-6 text-cyan-200" />
                  <p className="text-lg font-semibold text-white">No events yet</p>
                  <p className="text-sm text-[var(--app-muted)]">
                    Connect the playground and publish a payload to see the stream populate.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((entry, index) => (
                  <div
                    key={`${entry.time?.getTime?.() || index}-${index}`}
                    className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone="info" className="font-mono">
                          {entry.event}
                        </StatusBadge>
                        {entry.room ? (
                          <StatusBadge tone="neutral" className="font-mono">
                            {entry.room}
                          </StatusBadge>
                        ) : null}
                      </div>
                      <p className="font-mono text-xs text-[var(--app-subtle)]">
                        {entry.time ? formatTime(entry.time) : '--:--:--.---'}
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-100">
                      {summarize(entry.event, entry.data)}
                    </p>

                    {entry.data && typeof entry.data === 'object' ? (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-[var(--app-muted)]">
                          Inspect JSON
                        </summary>
                        <pre className="mt-3 rounded-[1.25rem] border border-white/8 bg-slate-950/70 p-4 whitespace-pre-wrap font-mono text-xs text-slate-100">
                          {safeJson(entry.data)}
                        </pre>
                      </details>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Surface>

        <div className="space-y-6">
          {project?.auth_type !== 'none' ? (
            <Surface tone="highlight" className="rounded-[2rem] p-6">
              <SectionHeader
                eyebrow="Authentication"
                title="Provide a token before connecting"
                description={authError || 'This project requires authentication for playground connections.'}
              />
              <div className="mt-6">
                <Field htmlFor="playground-token" label="JWT token">
                  <textarea
                    id="playground-token"
                    className="textarea-shell min-h-[110px] font-mono"
                    value={token}
                    onChange={(event) => {
                      setToken(event.target.value);
                      setAuthError('');
                    }}
                    placeholder="Paste your JWT token here"
                    rows={4}
                  />
                </Field>
              </div>
            </Surface>
          ) : null}

          <Surface className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Room Management"
              title="Attach or detach rooms"
              description="Joined rooms are where room-level sends can publish and receive traffic."
            />

            <div className="mt-6 space-y-5">
              <Field htmlFor="playground-room" label="Room">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="playground-room"
                    className="input-shell font-mono"
                    value={room}
                    onChange={(event) => setRoom(event.target.value)}
                    placeholder="Enter a room name"
                  />
                  <button
                    type="button"
                    className="button-primary"
                    onClick={canDetach ? detachRoom : attachRoom}
                    disabled={!connected || !room.trim()}
                  >
                    {canDetach ? <Link2Off className="h-4 w-4" /> : <Link className="h-4 w-4" />}
                    {canDetach ? 'Detach' : 'Attach'}
                  </button>
                </div>
              </Field>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                  Attached rooms
                </p>
                <div className="flex flex-wrap gap-2">
                  {rooms.length === 0 ? (
                    <span className="text-sm text-[var(--app-muted)]">No rooms attached yet.</span>
                  ) : (
                    rooms.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`rounded-full border px-3 py-2 font-mono text-xs ${
                          item === room.trim()
                            ? 'border-cyan-400/28 bg-cyan-400/10 text-cyan-100'
                            : 'border-white/8 bg-white/[0.03] text-[var(--app-muted)]'
                        }`}
                        onClick={() => switchRoom(item)}
                      >
                        {item}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Surface>

          <Surface className="rounded-[2rem] p-6">
            <SectionHeader
              eyebrow="Publisher"
              title="Send JSON payloads"
              description="Ctrl+Enter submits quickly once the playground is connected."
            />

            <div className="mt-6 space-y-5">
              <Field htmlFor="playground-event-type" label="Event type">
                <select
                  id="playground-event-type"
                  className="select-shell"
                  value={eventType}
                  onChange={(event) => setEventType(event.target.value)}
                  disabled={!connected}
                >
                  <option value="message.send">message.send</option>
                  <option value="message.broadcast">message.broadcast</option>
                  <option value="message.direct">message.direct</option>
                </select>
              </Field>

              {eventType === 'message.direct' ? (
                <Field htmlFor="playground-target" label="Target client ID">
                  <input
                    id="playground-target"
                    className="input-shell font-mono"
                    value={targetClientId}
                    onChange={(event) => setTargetClientId(event.target.value)}
                    placeholder="Target client ID"
                    disabled={!connected}
                  />
                </Field>
              ) : null}

              <div className="rounded-[1.5rem] border border-amber-400/18 bg-amber-400/[0.08] p-4 text-sm text-amber-50">
                Only JSON payloads are accepted in the playground. Use the prettify action to clean up malformed spacing before sending.
              </div>

              <Field htmlFor="playground-message" label="Message content">
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => setMessage(prettifyJson(message))}
                      disabled={!connected}
                    >
                      Prettify JSON
                    </button>
                  </div>
                  <textarea
                    id="playground-message"
                    className="textarea-shell min-h-[180px] font-mono text-sm"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={
                      eventType === 'message.send'
                        ? `JSON message to ${room.trim() || 'room'} (e.g. {"text":"Hello"})`
                        : 'JSON message content (e.g. {"text":"Hello"})'
                    }
                    disabled={!connected}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && event.ctrlKey) {
                        event.preventDefault();
                        void publish();
                      }
                    }}
                  />
                </div>
              </Field>

              <button
                type="button"
                className="button-primary w-full"
                onClick={publish}
                disabled={publishDisabled}
              >
                <Send className="h-4 w-4" />
                Publish message
              </button>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlayground;
