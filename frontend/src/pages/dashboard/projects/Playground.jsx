import { BrodcastaClient } from 'brodcasta-sdk';
import { AlertTriangle, Link, Link2Off, PlugZap, RefreshCcw, Send, Terminal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../components/ui/Loading';
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

  const pushEventLog = (eventName, payload, room = null) => {
    const logEntry = { time: new Date(), event: eventName, data: payload, room };
    
    setAllLogs((prev) => {
      const roomKey = room || 'global';
      const currentRoomLogs = prev[roomKey] || [];
      const nextLogs = [logEntry, ...currentRoomLogs].slice(0, MAX_LOGS);
      return {
        ...prev,
        [roomKey]: nextLogs
      };
    });
    
    // Only update displayed logs if this belongs to current room
    if (room === room.trim() || (!room && room.trim() === DEFAULT_ROOM)) {
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
        const [projectRes, secretRes] = await Promise.allSettled([
          client.get('/'),
          client.get('/secret'),
        ]);

        if (cancelled) return;

        if (projectRes.status === 'fulfilled') {
          setProject(projectRes.value.data);
        } else {
          setError('Failed to load project.');
        }

        if (secretRes.status === 'fulfilled') {
          // Only set token if project requires authentication
          if (projectRes.value.data?.auth_type !== 'none' && secretRes.value.data?.project_secret) {
            setToken(secretRes.value.data.project_secret);
          } else if (projectRes.value.data?.auth_type !== 'none') {
            setAuthError('No token available. Provide a token below.');
          }
        } else {
          // Only show auth error if project requires authentication
          if (projectRes.value.data?.auth_type !== 'none') {
            setAuthError('Could not fetch authentication. Provide a token below.');
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loading fullScreen />;

  if (error) {
    return (
      <div role="alert" className="alert alert-error shadow-none">
        <span>{error}</span>
      </div>
    );
  }

  const statusTone = connected
    ? 'border-success/20 bg-success/5 text-success'
    : busy
      ? 'border-warning/20 bg-warning/5 text-warning'
      : 'border-base-200 bg-base-200/40 text-base-content/60';

  const statusDot = connected
    ? 'bg-success'
    : busy
      ? 'bg-warning'
      : 'bg-base-content/30';

  const statusText = connected ? 'Connected' : busy ? 'Connecting' : 'Disconnected';

  const canDetach = rooms.includes(room.trim());

  const publishDisabled =
    !connected ||
    !message.trim() ||
    (eventType === 'message.direct' && !targetClientId.trim()) ||
    (eventType === 'message.send' && (!room.trim() || !rooms.includes(room.trim())));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-base-300 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Terminal size={20} />
            <h1 className="text-3xl font-bold tracking-tight">Playground</h1>
          </div>
          <p className="text-base-content/60">
            Real-time testing environment for <span className="font-semibold">{project?.name || 'Project'}</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${statusTone}`}
          >
            <span className={`h-2 w-2 rounded-full ${statusDot}`} />
            <span>{statusText}</span>
            {connected && transport ? (
              <span className="font-mono text-xs opacity-70">({String(transport).toUpperCase()})</span>
            ) : null}
          </div>

          <div className="join">
            <select
              className="select select-bordered select-md join-item shadow-none rounded-lg"
              value={prefer}
              onChange={(event) => setPrefer(event.target.value)}
              disabled={connected || busy}
            >
              <option value="ws">WebSocket</option>
              <option value="sse">SSE</option>
            </select>
            <button
              className="btn btn-primary btn-md join-item shadow-none rounded-lg"
              onClick={connected ? disconnect : connect}
              disabled={(project?.auth_type !== 'none' && !token) || busy}
            >
              {connected ? (
                <>
                  <RefreshCcw size={14} />
                  Disconnect
                </>
              ) : (
                <>
                  <PlugZap size={14} />
                  Connect
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {connectionError ? (
        <div className="flex items-center gap-3 p-4 border border-error text-error bg-error/5 rounded-lg">
          <AlertTriangle size={16} />
          <span className="text-sm font-bold uppercase tracking-wide">{connectionError}</span>
        </div>
      ) : null}

      {/* Event Logs */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-8">
        <section className="border border-base-300 rounded-lg flex flex-col">
          <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg flex items-center justify-between flex-shrink-0">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-widest">Event Logs</h2>
              <p className="text-[11px] text-base-content/50">
                Real-time events and messages
                {room !== DEFAULT_ROOM && (
                  <> for room: <span className="font-mono text-primary">{room}</span></>
                )}
              </p>
            </div>
            <button className="btn btn-ghost btn-xs rounded-lg" onClick={() => {
              setAllLogs(prev => ({ ...prev, [room || 'global']: [] }));
              setLogs([]);
            }}>
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-auto max-h-[640px]">
            <table className="table table-md text-xs">
              <thead className="sticky top-0 z-10 bg-base-100">
                <tr>
                  <th className="w-[130px]">Time</th>
                  <th className="w-[240px]">Event</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-base-content/40">
                      No events yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((entry, index) => (
                    <tr key={`${entry.time?.getTime?.() || index}-${index}`}>
                      <td className="font-mono whitespace-nowrap text-[11px]">
                        {entry.time ? formatTime(entry.time) : '--:--:--.---'}
                      </td>
                      <td className="font-mono text-[11px]">{entry.event}</td>
                      <td className="text-[11px]">
                        <div className="flex items-center gap-2">
                          {entry.room && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-mono">
                              {entry.room}
                            </span>
                          )}
                          <div className="text-base-content/70">{summarize(entry.event, entry.data)}</div>
                        </div>
                        {entry.data && typeof entry.data === 'object' ? (
                          
                          <details className="mt-2">
                            <summary className="cursor-pointer text-base-content/60 select-none">JSON</summary>
                            <pre className="mt-2 p-3 rounded-lg bg-base-200/40 border border-base-200 whitespace-pre-wrap text-[11px] text-base-content/70">
                              {safeJson(entry.data)}
                            </pre>
                          </details>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-8">
          {/* Authentication */}
          {project?.auth_type !== 'none' && (
            <section className="border border-warning/20 rounded-lg">
              <div className="p-6 border-b border-warning/20 bg-warning/5 rounded-t-lg">
                <h2 className="text-sm font-bold uppercase tracking-widest text-warning">Authentication Required</h2>
                <p className="text-xs text-base-content/60 mt-2">
                  {authError || 'Provide a token to connect to the playground.'}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-base-content/70 mb-3">JWT Token</label>
                  <textarea
                    className="textarea textarea-bordered textarea-md w-full font-mono rounded-lg min-h-[100px] resize-none"
                    value={token}
                    onChange={(event) => {
                      setToken(event.target.value);
                      setAuthError('');
                    }}
                    placeholder="Paste your JWT token here..."
                    rows={4}
                  />
                  <p className="text-[11px] text-base-content/50 mt-2">
                    Enter your authentication token to enable real-time connections.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Room Management */}
          <section className="border border-base-300 rounded-lg">
            <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
              <div className="space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-widest">Room Management</h2>
                <p className="text-[11px] text-base-content/50">Attach rooms to receive and send events</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    className="input input-bordered input-md flex-1 font-mono rounded-lg"
                    value={room}
                    onChange={(event) => setRoom(event.target.value)}
                    placeholder="Enter a room name"
                  />
                  <button
                    className={`btn btn-md shadow-none rounded-lg min-w-[100px] ${
                      canDetach 
                        ? 'btn-error' 
                        : 'btn-primary'
                    }`}
                    onClick={canDetach ? detachRoom : attachRoom}
                    disabled={!connected || !room.trim()}
                  >
                    {canDetach ? (
                      <>
                        <Link2Off size={14} />
                        Detach
                      </>
                    ) : (
                      <>
                        <Link size={14} />
                        Attach
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-medium text-base-content/70 uppercase tracking-wider">Attached Rooms</div>
                <div className="flex flex-wrap gap-2">
                  {rooms.length === 0 ? (
                    <div className="text-xs text-base-content/40 italic">No rooms attached yet.</div>
                  ) : (
                    rooms.map((item) => (
                      <button
                        key={item}
                        className={`px-3 py-1.5 rounded-full border text-[11px] font-mono transition-colors shadow-none ${
                          item === room.trim()
                            ? 'border-primary/30 bg-primary/10 text-primary'
                            : 'border-base-200 bg-base-200/40 text-base-content/70 hover:bg-base-200'
                        }`}
                        onClick={() => switchRoom(item)}
                        type="button"
                      >
                        {item}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {!connected ? (
                <div className="text-[11px] text-base-content/40 italic">Connect to attach rooms.</div>
              ) : null}
            </div>
          </section>

          {/* Message Publisher */}
          <section className="border border-base-300 rounded-lg">
            <div className="p-6 border-b border-base-300 bg-base-200/50 rounded-t-lg">
              <div className="space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-widest">Message Publisher</h2>
                <p className="text-[11px] text-base-content/50">Send messages using the SDK</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Event Type</label>
                  <select
                    className="select select-bordered w-full rounded-lg"
                    value={eventType}
                    onChange={(event) => setEventType(event.target.value)}
                    disabled={!connected}
                  >
                    <option value="message.send">message.send</option>
                    <option value="message.broadcast">message.broadcast</option>
                    <option value="message.direct">message.direct</option>
                  </select>
                </div>

                {eventType === 'message.direct' && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Target Client ID</label>
                    <input
                      className="input input-bordered input-sm font-mono rounded-lg w-full"
                      value={targetClientId}
                      onChange={(event) => setTargetClientId(event.target.value)}
                      placeholder="Target client ID"
                      disabled={!connected}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-base-content/70 uppercase tracking-wider">Message Content</label>
                    <button
                      className="btn btn-ghost btn-xs rounded-lg"
                      onClick={() => setMessage(prettifyJson(message))}
                      disabled={!connected}
                    >
                      Prettify JSON
                    </button>
                  </div>
                  
                  <div className="alert alert-warning">
                    <AlertTriangle size={14} />
                    <span className="text-xs font-medium">Only JSON messages are allowed</span>
                  </div>
                  
                  <textarea
                    className="textarea w-full textarea-bordered rounded-lg font-mono text-sm min-h-[140px] resize-none"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder={eventType === 'message.send' 
                      ? `JSON message to ${room.trim() || 'room'} (e.g., {"text": "Hello!"})` 
                      : 'JSON message content (e.g., {"text": "Hello!"})'
                    }
                    disabled={!connected}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && event.ctrlKey) {
                        event.preventDefault();
                        void publish();
                      }
                    }}
                  />
                  <p className="text-[11px] text-base-content/50">
                    {eventType === 'message.send' 
                      ? `Room must be attached before publishing. Ctrl+Enter to send. Messages must be valid JSON.`
                      : 'Ctrl+Enter to send. Messages must be valid JSON.'
                    }
                  </p>
                </div>

                <button
                  className="btn btn-primary btn-md shadow-none rounded-lg w-full sm:w-auto"
                  onClick={publish}
                  disabled={publishDisabled}
                >
                  <Send size={14} />
                  Publish Message
                </button>
              </div>

              {!connected ? (
                <div className="text-[11px] text-base-content/40 italic">Connect to publish events.</div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlayground;
