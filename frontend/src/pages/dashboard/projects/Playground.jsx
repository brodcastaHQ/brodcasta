import { Bolt, PlugZap, RefreshCcw, Send, ShieldAlert, Terminal } from 'lucide-react';
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
  const [message, setMessage] = useState('');
  const [directId, setDirectId] = useState('');

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
        const response = await client.get('/');
        setProject(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load project.');
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
    pushLog({ type: 'action', level: 'info', message: `Joined ${roomId}`, time: new Date() });
  };

  const leaveRoom = async () => {
    if (!clientRef.current) return;
    await clientRef.current.leave(roomId);
    pushLog({ type: 'action', level: 'info', message: `Left ${roomId}`, time: new Date() });
  };

  const sendMessage = async () => {
    if (!clientRef.current || !message) return;
    await clientRef.current.sendMessage(roomId, message);
    pushLog({ type: 'action', level: 'info', message: `Sent to ${roomId}`, meta: message, time: new Date() });
    setMessage('');
  };

  const broadcast = async () => {
    if (!clientRef.current || !message) return;
    await clientRef.current.broadcast(message);
    pushLog({ type: 'action', level: 'info', message: 'Broadcast sent', meta: message, time: new Date() });
    setMessage('');
  };

  const direct = async () => {
    if (!clientRef.current || !directId || !message) return;
    await clientRef.current.direct(directId, message);
    pushLog({
      type: 'action',
      level: 'info',
      message: `Direct to ${directId}`,
      meta: message,
      time: new Date(),
    });
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
      <div className="flex flex-col gap-6">
        <div className="card bg-base-100 border border-base-200 shadow-none">
          <div className="card-body p-8 space-y-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <Terminal size={20} />
                  <h1 className="text-2xl font-bold">Project Playground</h1>
                </div>
                <p className="text-sm text-base-content/60 mt-1">
                  Live sandbox for {project?.name || projectId}. Connect, join rooms, and test realtime events.
                </p>
              </div>
              <div className="badge badge-neutral badge-lg font-mono text-[11px]">{projectId}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card bg-base-100 border border-base-200 shadow-none">
                <div className="card-body p-6 space-y-4">
                  <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Credentials</div>
                  <div className="space-y-3">
                    <label className="form-control w-full">
                      <span className="label-text text-xs font-semibold">Project Secret</span>
                      <input
                        type="password"
                        className="input input-bordered input-sm font-mono"
                        placeholder="project secret"
                        value={secret}
                        onChange={(event) => setSecret(event.target.value)}
                      />
                    </label>
                    <button
                      className="btn btn-outline btn-sm w-full"
                      onClick={fetchSecret}
                      disabled={secretLoading}
                    >
                      {secretLoading ? 'Fetching...' : 'Fetch Secret'}
                    </button>
                    {secretError ? (
                      <div className="text-xs text-error flex items-center gap-2">
                        <ShieldAlert size={14} />
                        {secretError}
                      </div>
                    ) : null}
                    <div className="text-[11px] text-base-content/50">
                      Secrets are shown once in the backend. Treat them like passwords.
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 border border-base-200 shadow-none">
                <div className="card-body p-6 space-y-4">
                  <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Connection</div>
                  <div className="space-y-3">
                    <label className="form-control w-full">
                      <span className="label-text text-xs font-semibold">Preferred Transport</span>
                      <select
                        className="select select-bordered select-sm"
                        value={prefer}
                        onChange={(event) => setPrefer(event.target.value)}
                      >
                        <option value="ws">WebSocket</option>
                        <option value="sse">SSE</option>
                      </select>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="btn btn-primary btn-sm" onClick={connect}>
                        <PlugZap size={14} />
                        Connect
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={disconnect}>
                        <RefreshCcw size={14} />
                        Disconnect
                      </button>
                    </div>
                    <div className="text-xs text-base-content/60 space-y-1">
                      <div>
                        State: <span className="font-semibold">{state}</span>
                      </div>
                      <div>
                        Transport: <span className="font-semibold">{transport || '—'}</span>
                      </div>
                      <div className="break-all">
                        Client ID: <span className="font-mono">{clientId || '—'}</span>
                      </div>
                      <div className="break-all">
                        Client Token: <span className="font-mono">{clientToken || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 border border-base-200 shadow-none">
                <div className="card-body p-6 space-y-4">
                  <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Room Actions</div>
                  <div className="space-y-3">
                    <label className="form-control w-full">
                      <span className="label-text text-xs font-semibold">Room ID</span>
                      <input
                        className="input input-bordered input-sm font-mono"
                        value={roomId}
                        onChange={(event) => setRoomId(event.target.value)}
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="btn btn-outline btn-sm" onClick={joinRoom}>
                        Join
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={leaveRoom}>
                        Leave
                      </button>
                    </div>
                    <button className="btn btn-ghost btn-sm w-full" onClick={() => clientRef.current?.ping()}>
                      <Bolt size={14} />
                      Ping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 border border-base-200 shadow-none lg:col-span-1">
            <div className="card-body p-6 space-y-4">
              <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Send Events</div>
              <label className="form-control w-full">
                <span className="label-text text-xs font-semibold">Message</span>
                <textarea
                  className="textarea textarea-bordered text-sm min-h-[120px]"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-xs font-semibold">Direct Target (optional)</span>
                <input
                  className="input input-bordered input-sm font-mono"
                  value={directId}
                  onChange={(event) => setDirectId(event.target.value)}
                  placeholder="client id"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn btn-primary btn-sm" onClick={sendMessage}>
                  <Send size={14} />
                  Room
                </button>
                <button className="btn btn-secondary btn-sm" onClick={broadcast}>
                  Broadcast
                </button>
                <button className="btn btn-accent btn-sm col-span-2" onClick={direct}>
                  Direct
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-200 shadow-none lg:col-span-2">
            <div className="card-body p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Event Log</div>
                <button className="btn btn-ghost btn-xs" onClick={() => setLogs([])}>
                  Clear
                </button>
              </div>
              <div className="bg-base-200/40 rounded-xl p-4 h-[360px] overflow-y-auto space-y-2 font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-base-content/40">No events yet.</div>
                ) : (
                  logs.map((entry, index) => (
                    <div key={`${entry.time?.getTime?.() || index}-${index}`} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-base-content/40">
                        <span>{entry.type}</span>
                        <span>{entry.time ? entry.time.toLocaleTimeString() : ''}</span>
                      </div>
                      <div className="text-base-content">{entry.message}</div>
                      {entry.meta ? (
                        <pre className="text-[11px] text-base-content/60 whitespace-pre-wrap">
                          {JSON.stringify(entry.meta, null, 2)}
                        </pre>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPlayground;
