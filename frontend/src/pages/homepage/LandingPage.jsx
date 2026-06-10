import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const FEATURES = [
  {
    title: 'WebSocket & SSE',
    description:
      'Automatic fallback from WebSocket to Server-Sent Events ensures every client stays connected, no matter the network conditions.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--app-subtle)]">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M8 12h8" /><path d="M10 9l4 3-4 3" />
      </svg>
    ),
  },
  {
    title: 'Room-based Messaging',
    description:
      'Organize communication into rooms for clean separation. Clients join only what they need — perfect for multi-tenant apps.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--app-subtle)]">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    title: 'Analytics Dashboard',
    description:
      'Track connections, messages, and performance in real time. Monitor every metric that matters for your real-time infrastructure.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--app-subtle)]">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
  },
  {
    title: 'Flexible Auth',
    description:
      'Support for API keys, JWT, or no authentication. Choose the security model that fits your architecture — no compromises.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--app-subtle)]">
        <polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    title: 'Developer SDK',
    description:
      'TypeScript client with auto-reconnect, room management, and strongly typed events. Get started in minutes, not hours.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--app-subtle)]">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const BRANDS = ['WebSocket', 'SSE', 'Redis', 'Docker', 'React', 'TypeScript'];

const STEPS = [
  {
    number: '/ 01',
    title: 'Create a project',
    text: 'Set up a project in your dashboard, configure authentication, and get your credentials in seconds.',
    emoji: '🚀',
  },
  {
    number: '/ 02',
    title: 'Connect with the SDK',
    text: 'Install the brodcasta-sdk, configure your project ID and secret, and establish a real-time connection in minutes.',
    emoji: '🔗',
  },
  {
    number: '/ 03',
    title: 'Start broadcasting',
    text: 'Send messages to rooms, broadcast to all clients, or message directly. Monitor everything from your analytics dashboard.',
    emoji: '📡',
  },
];

const STATS = [
  { value: '99.9%', label: 'Uptime', highlight: 'SLA' },
  { value: '256', label: 'bit', highlight: 'AES Encryption' },
  { value: '10M+', label: 'Messages', highlight: 'Per Day' },
  { value: '100%', label: 'Audit Pass', highlight: 'Rate' },
];

const TESTIMONIALS = [
  {
    quote: 'We dropped in the brodcasta-sdk and had real-time messaging working in under an hour. The WebSocket-to-SSE fallback means we never lose a connection, even on spotty networks.',
    name: 'Alex Chen',
    position: 'CTO, Streamline',
    image: 'https://i.pravatar.cc/300?img=11',
  },
  {
    quote: 'Room-based messaging simplified our multi-tenant architecture. Each customer gets isolated channels without any extra infrastructure — it just works out of the box.',
    name: 'Sarah Mitchell',
    position: 'Engineering Lead, Dataview',
    image: 'https://i.pravatar.cc/300?img=32',
  },
  {
    quote: 'The analytics dashboard gives us real-time visibility into every message and connection. Debugging production issues went from hours to minutes after switching to Brodcasta.',
    name: 'Priya Kapoor',
    position: 'VP Engineering, Nexa',
    image: 'https://i.pravatar.cc/300?img=23',
  },
];

const DEVTOOLS = [
  {
    title: 'Robust API access',
    text: 'Connect workflows, sync data, and build custom experiences with REST and WebSocket APIs designed to give your team more control. Every endpoint is documented, versioned, and built to handle the scale your product demands.',
  },
  {
    title: 'Real-time data flow',
    text: 'Keep systems in sync with fast, reliable real-time connections that support messaging across products and processes. React to changes as they happen and eliminate the lag that slows down your team.',
  },
  {
    title: 'WebSocket events',
    text: 'Listen for connection, message, and room events with a flexible event system. Build reactive features without polling or manual intervention — from user activity to broadcast events.',
  },
  {
    title: 'Built for integration',
    text: 'Fit seamlessly into your stack with SDKs, webhooks, and APIs designed to work across tools and services. Whether it is your frontend, backend, or mobile app — connection is always one step away.',
  },
];

const FallingStars = () => {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const stars = [];
    for (let i = 0; i < 35; i++) {
      const star = document.createElement('div');
      star.className = 'lp-cta-star';
      const size = 1.5 + Math.random() * 4;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.animationDuration = (3 + Math.random() * 5) + 's';
      star.style.animationDelay = Math.random() * 6 + 's';
      layer.appendChild(star);
      stars.push(star);
    }
    return () => {
      stars.forEach((s) => s.remove());
    };
  }, []);

  return <div className="lp-cta-stars-layer absolute inset-0 pointer-events-none overflow-hidden" ref={layerRef} />;
};

const StatPulse = () => {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const glows = [];

    for (let i = 0; i < 2; i++) {
      const g = document.createElement('div');
      g.className = 'lp-stat-pulse';
      g.style.width = (300 + Math.random() * 400) + 'px';
      g.style.height = g.style.width;
      g.style.left = (5 + Math.random() * 50) + '%';
      g.style.top = (10 + Math.random() * 50) + '%';
      g.style.animationDuration = (8 + i * 4) + 's';
      g.style.animationDelay = (i * 3) + 's';
      layer.appendChild(g);
      glows.push(g);
    }

    return () => {
      glows.forEach((g) => g.remove());
    };
  }, []);

  return <div className="absolute inset-0 pointer-events-none overflow-hidden" ref={layerRef} />;
};

const AmbientFog = () => {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const blobs = [];

    for (let i = 0; i < 3; i++) {
      const blob = document.createElement('div');
      blob.className = 'lp-fog-blob';
      const size = 200 + Math.random() * 400;
      blob.style.width = size + 'px';
      blob.style.height = size + 'px';
      blob.style.left = (10 + Math.random() * 60) + '%';
      blob.style.top = (10 + Math.random() * 60) + '%';
      blob.style.animationDuration = (30 + i * 15) + 's';
      blob.style.animationDelay = (i * 8) + 's';
      blob.style.opacity = '0.03';
      layer.appendChild(blob);
      blobs.push(blob);
    }

    return () => {
      blobs.forEach((b) => b.remove());
    };
  }, []);

  return <div className="absolute inset-0 pointer-events-none overflow-hidden" ref={layerRef} />;
};

const SignalWaves = () => {
  const layerRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const particles = [];

    // Small floating data particles (packets)
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement('div');
      dot.className = 'lp-demo-particle';
      const size = 2 + Math.random() * 3;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.bottom = '0';
      dot.style.animationDuration = (6 + Math.random() * 10) + 's';
      dot.style.animationDelay = Math.random() * 8 + 's';
      layer.appendChild(dot);
      particles.push(dot);
    }

    // Signal rings expanding outward
    for (let i = 0; i < 3; i++) {
      const ring = document.createElement('div');
      ring.className = 'lp-demo-ring';
      ring.style.width = ring.style.height = (40 + Math.random() * 80) + 'px';
      ring.style.left = (10 + Math.random() * 60) + '%';
      ring.style.top = (10 + Math.random() * 60) + '%';
      ring.style.animationDuration = (3 + i * 1.5) + 's';
      ring.style.animationDelay = (i * 1.2) + 's';
      layer.appendChild(ring);
      particles.push(ring);
    }

    // Orbiting dots
    for (let i = 0; i < 4; i++) {
      const orb = document.createElement('div');
      orb.className = 'lp-demo-orb';
      const dirs = ['right', 'down', 'left', 'up'];
      orb.dataset.dir = dirs[i];
      orb.style.width = orb.style.height = (4 + Math.random() * 4) + 'px';
      orb.style.animationDuration = (10 + Math.random() * 8) + 's';
      orb.style.animationDelay = (i * 2.5) + 's';
      layer.appendChild(orb);
      particles.push(orb);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, []);

  return <div className="absolute inset-0 pointer-events-none overflow-hidden" ref={layerRef} />;
};

const LandingPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const autoplayRef = useRef(null);

  const goToSlide = useCallback((index) => {
    setTestimonialIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    autoplayRef.current = setInterval(nextSlide, 8000);
    return () => clearInterval(autoplayRef.current);
  }, [nextSlide]);

  const handleDotClick = (index) => {
    goToSlide(index);
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(nextSlide, 8000);
  };

  /* ─── Demo live-ticker ─── */
  const [demoMessages, setDemoMessages] = useState([
    {
      id: 0,
      text: 'Hello from Brodcasta!',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      sender: 'system',
    },
  ]);
  const [demoConnected, setDemoConnected] = useState(false);
  const [demoRoomReady, setDemoRoomReady] = useState(false);
  const [demoRoomId] = useState(() => {
    const cached = localStorage.getItem('brodcasta_demo_room');
    if (cached) return cached;
    const fresh = crypto.randomUUID();
    localStorage.setItem('brodcasta_demo_room', fresh);
    return fresh;
  });
  const wsRef = useRef(null);
  const demoContainerRef = useRef(null);
  const copyBtnRef = useRef(null);
  const notifEnabledRef = useRef(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );
  const API_BASE = import.meta.env.VITE_API_URL || 'https://adverse-celie-techwithdunamix-125d8784.koyeb.app';
  const WS_BASE = API_BASE.replace('http://', 'ws://').replace('https://', 'wss://');

  useEffect(() => {
    let ws;
    let reconnectTimer;
    let cancelled = false;

    const connect = () => {
      ws = new WebSocket(`${WS_BASE}/ws/demo-client`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        setDemoConnected(true);
      };
      ws.onclose = () => {
        setDemoConnected(false);
        setDemoRoomReady(false);
        if (cancelled) return;
        reconnectTimer = setTimeout(connect, 3000);
      };
      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const payload = JSON.parse(event.data);
          const eventType = payload.event_type;

          if (eventType === 'connection.established') {
            ws.send(
              JSON.stringify({
                event_type: 'room.subscribe',
                data: { room_id: demoRoomId },
              })
            );
            return;
          }

          if (eventType === 'room.subscribe.ok') {
            setDemoRoomReady(true);
            return;
          }

          if (eventType === 'message.received') {
            const msg = payload.data;
            if (
              notifEnabledRef.current &&
              typeof Notification !== 'undefined' &&
              Notification.permission === 'granted'
            ) {
              new Notification('Brodcasta', {
                body: msg.message,
                icon: '/logo.svg',
              });
            }
            setDemoMessages((prev) =>
              prev.concat({
                id: Date.now(),
                text: msg.message,
                time: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                sender: msg.sender_id === 'demo-curl' ? 'user' : 'system',
              })
            );
          }
        } catch {
          /* ignore malformed frames */
        }
      };
    };

    connect();
    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [WS_BASE, demoRoomId]);

  const handleRequestNotification = async () => {
    if (typeof Notification === 'undefined') return;
    if (notifEnabledRef.current) {
      notifEnabledRef.current = false;
      setNotificationsEnabled(false);
      return;
    }
    if (Notification.permission === 'granted') {
      notifEnabledRef.current = true;
      setNotificationsEnabled(true);
      return;
    }
    const result = await Notification.requestPermission();
    const enabled = result === 'granted';
    notifEnabledRef.current = enabled;
    setNotificationsEnabled(enabled);
  };

  useEffect(() => {
    if (demoContainerRef.current) {
      demoContainerRef.current.scrollTop = demoContainerRef.current.scrollHeight;
    }
  }, [demoMessages]);

  const handleCopy = async () => {
    const cmd = `curl -X POST ${API_BASE}/api/public/demo-client/messages \\\n  -H "Content-Type: application/json" \\\n  -d '{"room_id":"${demoRoomId}","message":"Hello from Brodcasta!"}'`;
    try {
      await navigator.clipboard.writeText(cmd);
      if (copyBtnRef.current) {
        copyBtnRef.current.textContent = 'Copied!';
        setTimeout(() => { if (copyBtnRef.current) copyBtnRef.current.textContent = 'Copy'; }, 2000);
      }
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      {/* ─── Top Bar ─── */}
      <nav className="sticky top-4 z-50 mx-4 sm:mx-6">
        <div className="mx-auto max-w-6xl rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Brodcasta" className="h-15 w-15" />
              <span className="text-sm font-medium">Brodcasta</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/pricing" className="hidden sm:inline text-sm text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                Pricing
              </Link>
              <Link to="/login" className="hidden sm:inline text-sm text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                Sign in
              </Link>
              <Link to="/signup" className="button-primary px-3 py-1.5 text-sm">
                Sign up
              </Link>
              <button
                type="button"
                className="p-2 lg:hidden text-[var(--app-muted)]"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Menu ─── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--app-bg)]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 lg:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-6 right-6 text-[var(--app-muted)] text-2xl"
            aria-label="Close menu"
          >
            ✕
          </button>
          <Link to="/" className="text-[var(--app-muted)] text-lg" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link to="/pricing" className="text-[var(--app-muted)] text-lg" onClick={() => setMobileOpen(false)}>
            Pricing
          </Link>
          <Link to="/login" className="text-[var(--app-muted)] text-lg" onClick={() => setMobileOpen(false)}>
            Sign in
          </Link>
          <Link
            to="/signup"
            className="button-primary px-6 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}

      {/* ─── Hero ─── */}
      <section id="hero" className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <div className="lp-hero-grid" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6">
          <div className="section-eyebrow mb-6 inline-flex">
            <span className="relative overflow-hidden rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-1.5 text-xs">
              <span className="relative z-10"><strong className="text-[var(--app-text)]">New ·</strong>{' '}Real-time messaging infrastructure</span>
            </span>
          </div>
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            Real-time messaging that<br />
            <span className="text-[var(--app-muted)]">just works</span>
          </h1>
          <p className="max-w-2xl text-center text-lg text-[var(--app-muted)] mb-10">
            WebSockets with automatic SSE fallback. Room-based messaging, analytics dashboards,
            and developer tools — everything you need to build real-time features your users will love.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/signup" className="button-primary px-8 py-3 text-base">
              Get started
            </Link>
            <Link to="/login" className="button-secondary px-8 py-3 text-base">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Live Demo ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <SignalWaves />
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <div className="section-eyebrow justify-center mb-4">Try it live</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Real-time in action
            </h2>
            <p className="section-copy text-lg max-w-xl mx-auto">
              Copy the curl command, paste it in your terminal, and watch the message appear here instantly.
            </p>
          </div>

          <div className="border border-[var(--app-border)] rounded-xl overflow-hidden">
            {/* Terminal header */}
            <div className="px-5 py-3 border-b border-[var(--app-border)] flex items-center justify-between bg-[var(--app-surface)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--app-subtle)] ml-2">Terminal</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRequestNotification}
                  className={`text-xs transition-colors cursor-pointer ${notificationsEnabled ? 'text-[var(--app-text)]' : 'text-[var(--app-muted)] hover:text-[var(--app-text)]'}`}
                  title={notificationsEnabled ? 'Notifications on' : 'Enable notifications'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {notificationsEnabled ? (
                      <>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </>
                    ) : (
                      <>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
                <button
                  ref={copyBtnRef}
                  onClick={handleCopy}
                  className="text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Curl command */}
            <pre className="p-5 text-sm font-mono leading-relaxed text-[var(--app-muted)] overflow-x-auto border-b border-[var(--app-border)]">
              <span className="text-[var(--app-subtle)]">$ </span>curl -X POST {API_BASE}/api/public/demo-client/messages \<br />
              <span className="text-[var(--app-subtle)]">  </span>-H <span className="text-[var(--app-text)]">"Content-Type: application/json"</span> \<br />
              <span className="text-[var(--app-subtle)]">  </span>-d <span className="text-[var(--app-text)]">{'{"room_id":"'}{demoRoomId}{'","message":"Hello from Brodcasta!"}'}</span>
            </pre>

            {/* Chat messages */}
            <div ref={demoContainerRef} className="h-72 overflow-y-auto p-5 space-y-4 bg-[var(--app-bg)]">
              {demoMessages.map((msg) =>
                msg.sender === 'user' ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-2.5 bg-[var(--app-text)] text-[var(--app-bg)]">
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className="text-[10px] opacity-60 mt-1 text-right">{msg.time}</p>
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--app-surface-2)] border border-[var(--app-border)] flex items-center justify-center text-xs">
                      ⌨
                    </span>
                    <div className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-2.5 bg-[var(--app-surface-2)] border border-[var(--app-border)]">
                      <p className="text-sm text-[var(--app-text)] break-words">{msg.text}</p>
                      <p className="text-[10px] text-[var(--app-subtle)] mt-1">{msg.time}</p>
                    </div>
                  </div>
                )
              )}
              {demoMessages.length === 1 && !demoRoomReady && (
                <p className="text-xs text-[var(--app-subtle)] text-center pt-4">
                  {demoConnected ? 'Joining room…' : 'Connecting…'}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Brand Marquee ─── */}
      <section className="relative overflow-hidden py-16">
        <div className="lp-marquee-mask">
          <div className="lp-marquee-track">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="text-sm font-semibold uppercase tracking-widest text-[var(--app-subtle)]"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="relative overflow-hidden py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="section-eyebrow justify-center mb-4">Core features</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need for<br />real-time communication
            </h2>
            <p className="section-copy text-lg">
              From WebSocket connections to analytics dashboards — every feature is designed
              to make real-time messaging simple, reliable, and scalable.
            </p>
          </div>
              <div className="border border-[var(--app-border)] overflow-hidden">
                {/* Top row — 2 items */}
                <div className="grid grid-cols-2">
                  {FEATURES.slice(0, 2).map((feature, i) => (
                    <div
                      key={feature.title}
                      className={`p-8 border-b ${i === 0 ? 'border-r' : ''} border-[var(--app-border)]`}
                    >
                      <div className="w-12 h-12 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-[var(--app-muted)] leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
                {/* Bottom row — 3 items */}
                <div className="grid grid-cols-3">
                  {FEATURES.slice(2).map((feature, i) => (
                    <div
                      key={feature.title}
                      className={`p-8 ${i < 2 ? 'border-r' : ''} border-[var(--app-border)]`}
                    >
                      <div className="w-12 h-12 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] flex items-center justify-center mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-[var(--app-muted)] leading-relaxed">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <AmbientFog />
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="section-eyebrow mb-4">How it works</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                From first connection<br />to live in minutes
              </h2>
              <p className="section-copy text-lg">
                Get your real-time infrastructure up and running quickly. Create a project,
                connect with our SDK, and start broadcasting messages.
              </p>
            </div>
            <div className="border border-[var(--app-border)]">
              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className={`lp-step-card relative overflow-hidden p-6 ${i > 0 ? 'border-t border-[var(--app-border)]' : ''}`}
                >
                  <div className="lp-step-hover-image">{step.emoji}</div>
                  <div className="relative z-10">
                    <div className="text-xs font-bold text-[var(--app-subtle)] tracking-wider mb-2">{step.number}</div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-[var(--app-muted)] leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <StatPulse />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="border border-[var(--app-border)] grid grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.value}
                className={`p-6 sm:p-8 text-center ${i < 3 ? 'border-r border-[var(--app-border)]' : ''}`}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--app-text)] mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-[var(--app-muted)]">
                  <span className="font-semibold text-[var(--app-text)]">{stat.highlight}</span>{' '}
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <div className="section-eyebrow justify-center mb-4">Testimonials</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Loved by teams<br />building real-time products
            </h2>
            <p className="section-copy text-lg">
              See what our users say about building with Brodcasta.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Left — image */}
              <div className="lg:col-span-2 flex justify-center lg:justify-end">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64">
                  <img
                    src={TESTIMONIALS[testimonialIndex].image}
                    alt={TESTIMONIALS[testimonialIndex].name}
                    className="w-full h-full object-cover rounded-2xl grayscale contrast-125"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
                </div>
              </div>

              {/* Right — quote, name, controls */}
              <div className="lg:col-span-3">
                <blockquote className="text-lg sm:text-xl leading-relaxed mb-6 text-[var(--app-text)]">
                  &ldquo;{TESTIMONIALS[testimonialIndex].quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3 mb-8">
                  <div>
                    <div className="text-sm font-semibold text-[var(--app-text)]">{TESTIMONIALS[testimonialIndex].name}</div>
                    <div className="text-xs text-[var(--app-muted)]">{TESTIMONIALS[testimonialIndex].position}</div>
                  </div>
                </div>

                {/* Controls — left-aligned under text */}
                <div className="flex items-center gap-3">
                  <button
                    className="w-8 h-8 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] flex items-center justify-center text-xs hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                    onClick={prevSlide}
                    aria-label="Previous"
                  >
                    ←
                  </button>
                  <div className="flex gap-2">
                    {TESTIMONIALS.map((_, i) => (
                      <span
                        key={i}
                        className={`lp-testimonial-dot${i === testimonialIndex ? ' is-active' : ''}`}
                        onClick={() => handleDotClick(i)}
                      />
                    ))}
                  </div>
                  <button
                    className="w-8 h-8 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] flex items-center justify-center text-xs hover:bg-[var(--app-surface-2)] transition-colors cursor-pointer"
                    onClick={nextSlide}
                    aria-label="Next"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dev Tools ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="section-eyebrow mb-4">Built for developers</div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Built to fit how<br />you already work
              </h2>
              <p className="section-copy text-lg">
                Everything you need to add real-time messaging to your stack, without the friction.
              </p>
            </div>
            <div className="border border-[var(--app-border)]">
              {DEVTOOLS.map((tool, i) => (
                <div key={tool.title} className={`p-6 ${i > 0 ? 'border-t border-[var(--app-border)]' : ''}`}>
                  <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                  <p className="text-sm text-[var(--app-muted)] leading-relaxed">{tool.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <FallingStars />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="section-eyebrow justify-center mb-4">Get started today</div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Your users deserve<br />real-time experiences
          </h2>
          <p className="section-copy text-lg mb-10 max-w-xl mx-auto">
            Deploy real-time messaging that connects faster, scales effortlessly,
            and keeps every message flowing reliably.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="button-primary px-8 py-3 text-base">
              Get started
            </Link>
            <Link to="/login" className="button-secondary px-8 py-3 text-base">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--app-border)] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src="/logo.svg" alt="Brodcasta" className="h-6 w-6" />
                <span className="text-base font-semibold">Brodcasta</span>
              </Link>
              <p className="text-sm text-[var(--app-muted)] leading-relaxed">
                Real-time messaging and event broadcasting platform. WebSockets with SSE fallback,
                room-based messaging, and developer tools for modern applications.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--app-subtle)] mb-4">Platform</h4>
              <ul className="flex flex-col gap-2 text-sm text-[var(--app-muted)]">
                <li><Link to="/" className="hover:text-[var(--app-text)] transition-colors">Home</Link></li>
                <li><a href="#features" className="hover:text-[var(--app-text)] transition-colors">Features</a></li>
                <li><a href="https://docs.brodcasta.dev" className="hover:text-[var(--app-text)] transition-colors">Docs</a></li>
                <li><a href="https://docs.brodcasta.dev/api" className="hover:text-[var(--app-text)] transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--app-subtle)] mb-4">Connect</h4>
              <ul className="flex flex-col gap-2 text-sm text-[var(--app-muted)]">
                <li><a href="https://github.com" className="hover:text-[var(--app-text)] transition-colors">GitHub</a></li>
                <li><a href="https://twitter.com" className="hover:text-[var(--app-text)] transition-colors">Twitter / X</a></li>
                <li><a href="https://linkedin.com" className="hover:text-[var(--app-text)] transition-colors">LinkedIn</a></li>
                <li><a href="https://discord.com" className="hover:text-[var(--app-text)] transition-colors">Discord</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--app-subtle)] mb-4">Legal</h4>
              <ul className="flex flex-col gap-2 text-sm text-[var(--app-muted)]">
                <li><Link to="/terms" className="hover:text-[var(--app-text)] transition-colors">Terms</Link></li>
                <li><Link to="/terms" className="hover:text-[var(--app-text)] transition-colors">Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-[var(--app-text)] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--app-border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--app-subtle)]">
            <span>Brodcasta, all rights reserved 2026</span>
            <div className="flex gap-6">
              <a href="https://status.brodcasta.dev" className="hover:text-[var(--app-text)] transition-colors">Status</a>
              <a href="https://docs.brodcasta.dev/changelog" className="hover:text-[var(--app-text)] transition-colors">Changelog</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
