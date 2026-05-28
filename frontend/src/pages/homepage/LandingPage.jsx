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
    initials: 'AC',
    avatar: '👨‍💼',
  },
  {
    quote: 'Room-based messaging simplified our multi-tenant architecture. Each customer gets isolated channels without any extra infrastructure — it just works out of the box.',
    name: 'Sarah Mitchell',
    position: 'Engineering Lead, Dataview',
    initials: 'SM',
    avatar: '👩‍💼',
  },
  {
    quote: 'The analytics dashboard gives us real-time visibility into every message and connection. Debugging production issues went from hours to minutes after switching to Brodcasta.',
    name: 'Priya Kapoor',
    position: 'VP Engineering, Nexa',
    initials: 'PK',
    avatar: '👩‍💻',
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

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      {/* ─── Top Bar ─── */}
      <nav className="sticky top-4 z-50 mx-4 sm:mx-6">
        <div className="mx-auto max-w-6xl rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Brodcasta" className="h-5 w-5" />
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
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {STATS.map((stat) => (
              <div key={stat.value} className="text-center">
                <div className="lp-stat-value text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
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

          <div className="max-w-3xl mx-auto">
            {/* Quote */}
            <div className="relative">
              <blockquote className="text-lg sm:text-xl leading-relaxed mb-6">
                &ldquo;{TESTIMONIALS[testimonialIndex].quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--app-surface-2)] border border-[var(--app-border)] flex items-center justify-center text-xs font-bold">
                  {TESTIMONIALS[testimonialIndex].initials}
                </div>
                <div>
                  <div className="text-sm font-semibold">{TESTIMONIALS[testimonialIndex].name}</div>
                  <div className="text-xs text-[var(--app-muted)]">{TESTIMONIALS[testimonialIndex].position}</div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <button
                className="w-9 h-9 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] flex items-center justify-center text-sm hover:bg-[var(--app-surface-2)] transition-colors"
                onClick={prevSlide}
                aria-label="Previous"
              >
                ←
              </button>
              <div className="flex flex-1 gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <span
                    key={i}
                    className={`lp-testimonial-dot${i === testimonialIndex ? ' is-active' : ''}`}
                    onClick={() => handleDotClick(i)}
                  />
                ))}
              </div>
              <button
                className="w-9 h-9 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] flex items-center justify-center text-sm hover:bg-[var(--app-surface-2)] transition-colors"
                onClick={nextSlide}
                aria-label="Next"
              >
                →
              </button>
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
                <li><a href="#" className="hover:text-[var(--app-text)] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[var(--app-text)] transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-[var(--app-text)] transition-colors">Privacy Policy</a></li>
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
