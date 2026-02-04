import { Check, PlugZap, RefreshCcw, Send, ShieldAlert, Terminal } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PinglyClient } from 'brodcasta-sdk';
import Loading from '../../../components/ui/Loading';
import { createClient } from '../../../utils/client';

const DEFAULT_ROOM = 'global';
const MAX_LOGS = 200;

const ProjectPlayground = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [secret, setSecret] = useState('');
  const [secretLoading, setSecretLoading] = useState(false);
  const [secretError, setSecretError] = useState('');

  const [state, setState] = useState('idle');
  const [transport, setTransport] = useState(null);
  const [clientId, setClientId] = useState('');
  const [clientToken, setClientToken] = useState('');
  const [prefer, setPrefer] = useState('ws');

  const [roomId, setRoomId] = useState(DEFAULT_ROOM);
  const [rooms, setRooms] = useState([DEFAULT_ROOM]);
  const [message, setMessage] = useState('');
  const [directId, setDirectId] = useState('');
  const [eventType, setEventType] = useState('message.send');

  const [logs, setLogs] = useState([]);

  const clientRef = useRef(null);
  const cleanupRef = useRef([]);

  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL || 'http://localhost:6494',
    []
  );
  const sdkBaseUrl = useMemo(() => apiBaseUrl.replace(/\/api\/?$/, ''), [apiBaseUrl]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const client = createClient(`/api/projects/${projectId}`);
        const [projectRes, secretRes] = await Promise.all([
          client.get('/'),
          client.get('/secret'),
        ]);
        setProject(projectRes.data);
        setSecret(secretRes.data?.project_secret || '');
        pushLog({
          type: 'system',
          level: 'info',
          message: 'Project secret loaded',
          time: new Date(),
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load project.');
        setSecretError('Failed to load project secret.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushLog = (entry) => {
    setLogs((prev) => {
      const next = [entry, ...prev];
      return next.slice(0, MAX_LOGS);
    });
  };

  const connect = async () => {
    if (!secret) {
      setSecretError('Project secret required to connect.');
      return;
    }

    disconnect();
    setSecretError('');
    setState('connecting');

    const client = new PinglyClient({
      baseUrl: sdkBaseUrl,
      projectId,
      projectSecret: secret,
      prefer,
      fallbackToSse: true,
      room: roomId || undefined,
      onLog: (level, message, meta) => {
        pushLog({ type: 'sdk', level, message, meta, time: new Date() });
      },
    });

    clientRef.current = client;
    cleanupRef.current = [
      client.on('state', ({ state: nextState }) => setState(nextState)),
      client.on('transport', ({ transport }) => setTransport(transport)),
      client.on('open', ({ transport }) =>
        pushLog({ type: 'system', level: 'info', message: `Connected via ${transport}`, time: new Date() })
      ),
      client.on('close', ({ transport, code, reason }) =>
        pushLog({
          type: 'system',
          level: 'warn',
          message: `Closed (${transport})`,
          meta: { code, reason },
          time: new Date(),
        })
      ),
      client.on('error', ({ transport, error }) =>
        pushLog({
          type: 'system',
          level: 'error',
          message: `Error on ${transport}`,
          meta: error,
          time: new Date(),
        })
      ),
      client.on('identity', ({ clientId, clientToken }) => {
        setClientId(clientId);
        setClientToken(clientToken);
        pushLog({
          type: 'system',
          level: 'info',
          message: 'Client identity issued',
          meta: { clientId },
          time: new Date(),
        });
      }),
      client.on('connection', ({ connectionId, projectId }) => {
        pushLog({
          type: 'system',
          level: 'info',
          message: 'Connection established',
          meta: { connectionId, projectId },
          time: new Date(),
        });
      }),
      client.on('message', ({ event, data }) =>
        pushLog({
          type: 'event',
          level: 'info',
          message: String(event),
          meta: data,
          time: new Date(),
        })
      ),
    ];

    try {
      await client.connect();
    } catch (err) {
      console.error(err);
      pushLog({
        type: 'system',
        level: 'error',
        message: 'Failed to connect',
        meta: err?.message || err,
        time: new Date(),
      });
      setState('error');
    }
  };

  const disconnect = () => {
    cleanupRef.current.forEach((fn) => fn?.());
    cleanupRef.current = [];
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setTransport(null);
  };

  const fetchSecret = async () => {
    try {
      setSecretLoading(true);
      setSecretError('');
      const client = createClient(`/api/projects/${projectId}`);
      const response = await client.get('/secret');
      setSecret(response.data?.project_secret || '');
      pushLog({
        type: 'system',
        level: 'info',
        message: 'Fetched project secret',
        time: new Date(),
      });
    } catch (err) {
      console.error(err);
      setSecretError('Failed to fetch project secret.');
    } finally {
      setSecretLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!clientRef.current) return;
    await clientRef.current.join(roomId);
    setRooms((prev) => (prev.includes(roomId) ? prev : [roomId, ...prev]));
    pushLog({ type: 'action', level: 'info', message: `Joined ${roomId}`, time: new Date() });
  };

  const leaveRoom = async () => {
    if (!clientRef.current) return;
    await clientRef.current.leave(roomId);
    setRooms((prev) => prev.filter((room) => room !== roomId));
    pushLog({ type: 'action', level: 'info', message: `Left ${roomId}`, time: new Date() });
  };

  const sendPayload = async () => {
    if (!clientRef.current || !message) return;

    if (eventType === 'message.send') {
      await clientRef.current.sendMessage(roomId, message);
      pushLog({ type: 'action', level: 'info', message: `Sent to ${roomId}`, meta: message, time: new Date() });
    }

    if (eventType === 'message.broadcast') {
      await clientRef.current.broadcast(message);
      pushLog({ type: 'action', level: 'info', message: 'Broadcast sent', meta: message, time: new Date() });
    }

    if (eventType === 'message.direct') {
      if (!directId) return;
      await clientRef.current.direct(directId, message);
      pushLog({
        type: 'action',
        level: 'info',
        message: `Direct to ${directId}`,
        meta: message,
        time: new Date(),
      });
    }

    setMessage('');
  };

  if (loading) return <Loading fullScreen />;

  if (error) {
    return (
      <div role="alert" className="alert alert-error shadow-lg">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="card bg-base-100 border border-base-200 shadow-none">
        <div className="card-body p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <Terminal size={20} />
                <h1 className="text-2xl font-bold">Project Playground</h1>
              </div>
              <p className="text-sm text-base-content/60 mt-1">
                Live sandbox for {project?.name || projectId}. Attach rooms and publish events in real-time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-primary btn-sm" onClick={state === 'open' ? disconnect : connect}>
                <PlugZap size={14} />
                {state === 'open' ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Rooms</div>
                <div className="text-xs text-base-content/50">
                  State: <span className="font-semibold">{state}</span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  className="input input-bordered input-sm flex-1 font-mono"
                  value={roomId}
                  onChange={(event) => setRoomId(event.target.value)}
                  placeholder="Enter a room name"
                />
                <button className="btn btn-primary btn-sm" onClick={joinRoom}>
                  Attach to room
                </button>
                <button className="btn btn-ghost btn-sm" onClick={leaveRoom}>
                  Detach
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {rooms.length === 0 ? (
                  <div className="text-xs text-base-content/40">No rooms attached yet.</div>
                ) : (
                  rooms.map((room) => (
                    <button
                      key={room}
                      className="badge badge-ghost badge-lg font-mono text-[11px] gap-2"
                      onClick={() => setRoomId(room)}
                    >
                      {room}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="border border-base-200 rounded-2xl p-4 bg-base-100">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Connection</div>
                <div className="text-[11px] text-base-content/50">
                  {clientId ? (
                    <span className="inline-flex items-center gap-1">
                      <Check size={12} /> Identity ready
                    </span>
                  ) : (
                    'Waiting for identity'
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-3 text-xs text-base-content/60">
                <div className="flex items-center justify-between">
                  <span>Preferred</span>
                  <select
                    className="select select-bordered select-sm"
                    value={prefer}
                    onChange={(event) => setPrefer(event.target.value)}
                  >
                    <option value="ws">WebSocket</option>
                    <option value="sse">SSE</option>
                  </select>
                </div>
                {secretError ? (
                  <div className="text-xs text-error flex items-center gap-2">
                    <ShieldAlert size={14} />
                    {secretError}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="border border-base-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr_1fr_0.8fr] bg-base-200/50 text-xs font-semibold text-base-content/60">
              <div className="px-4 py-3">Event name</div>
              <div className="px-4 py-3">Message data</div>
              <div className="px-4 py-3">Client ID</div>
              <div className="px-4 py-3 text-right">Action</div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.1fr_1fr_0.8fr] gap-3 p-4">
              <select
                className="select select-bordered select-sm"
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
              >
                <option value="message.send">message.send</option>
                <option value="message.broadcast">message.broadcast</option>
                <option value="message.direct">message.direct</option>
              </select>
              <input
                className="input input-bordered input-sm"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Message data"
              />
              <input
                className="input input-bordered input-sm font-mono"
                value={eventType === 'message.direct' ? directId : ''}
                onChange={(event) => setDirectId(event.target.value)}
                placeholder={eventType === 'message.direct' ? 'Target client ID' : '—'}
                disabled={eventType !== 'message.direct'}
              />
              <button className="btn btn-primary btn-sm justify-self-end" onClick={sendPayload}>
                <Send size={14} />
                Publish message
              </button>
            </div>
            <div className="px-4 pb-4 text-[11px] text-base-content/50">
              Uses rooms instead of channels. Attach a room and publish events cleanly.
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-200 shadow-none">
        <div className="card-body p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Event Log</div>
            <button className="btn btn-ghost btn-xs" onClick={() => setLogs([])}>
              Clear
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra text-xs">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
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
                      <td className="font-mono">
                        {entry.time ? entry.time.toLocaleTimeString() : '--'}
                      </td>
                      <td>
                        <span className="badge badge-ghost text-[10px] uppercase">{entry.type}</span>
                      </td>
                      <td className="text-[11px]">
                        <div className="font-semibold">{entry.message}</div>
                        {entry.meta ? (
                          <pre className="text-[11px] text-base-content/60 whitespace-pre-wrap">
                            {JSON.stringify(entry.meta, null, 2)}
                          </pre>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlayground;
