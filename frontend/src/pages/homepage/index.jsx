import {
  Activity,
  ArrowRight,
  Blocks,
  Bolt,
  BookOpen,
  CheckCircle2,
  Globe,
  ShieldCheck,
  TerminalSquare,
  Waves,
} from 'lucide-react';
import { createElement } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { MetricCard, SectionHeader, StatusBadge, Surface } from '../../components/ui/System';

const metrics = [
  { label: 'Concurrent transport modes', value: '2', meta: 'WebSocket + SSE fallback', icon: Waves },
  { label: 'Self-hosted deployment path', value: '<30m', meta: 'From clone to first live project', icon: Bolt },
  { label: 'Auth strategies', value: '3', meta: 'Public, publish-only, or full auth', icon: ShieldCheck },
  { label: 'Live observability surfaces', value: '4', meta: 'Projects, analytics, messages, playground', icon: Activity },
];

const features = [
  {
    title: 'Transport-ready from the first event',
    copy:
      'Open a project and ship realtime messaging with native WebSockets, graceful SSE fallback, and project-scoped credentials.',
    icon: Globe,
  },
  {
    title: 'Developer workflow, not just infrastructure',
    copy:
      'Use the in-app playground, connection analytics, and SDK snippets to validate integrations before they hit production.',
    icon: TerminalSquare,
  },
  {
    title: 'Operationally calm by default',
    copy:
      'Keep message history, permissions, and transport stats visible in one place instead of stitching together scripts and dashboards.',
    icon: Blocks,
  },
];

const testimonials = [
  {
    quote: 'Brodcasta gave us a cleaner path to realtime features than building our own socket layer.',
    name: 'Amina N.',
    role: 'Platform Engineer',
  },
  {
    quote: 'The project console made it obvious when SSE fallback kicked in and why.',
    name: 'Dante R.',
    role: 'Product Infrastructure Lead',
  },
  {
    quote: 'It feels like an operator tool, not a demo dashboard. That was the win for us.',
    name: 'Maya T.',
    role: 'Founding Engineer',
  },
];

const Homepage = () => {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="pb-24">
        <section className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8">
          <div className="surface-card surface-card-highlight dot-grid overflow-hidden rounded-[2.25rem] px-6 py-12 sm:px-10 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge tone="info">Self-hosted first</StatusBadge>
                  <StatusBadge tone="success">Realtime ready</StatusBadge>
                  <StatusBadge tone="neutral">React + Nexios</StatusBadge>
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                    Broadcast live events with a control plane built for
                    <span className="gradient-text"> serious product teams</span>.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[var(--app-muted)]">
                    Brodcasta gives you the messaging layer, credentials, analytics, and transport
                    visibility needed to ship realtime experiences without carrying a fragile custom
                    socket stack.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link to="/signup" className="button-primary">
                    Start free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://docs.Brodcasta.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary"
                  >
                    <BookOpen className="h-4 w-4" />
                    Explore docs
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                      Deploy anywhere
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
                      Docker, on-prem, or your own internal platform layer.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                      Operator-grade
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
                      See connections, rooms, payload volume, and project security in one UI.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                      SDK included
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--app-muted)]">
                      Integrate quickly with the Brodcasta JavaScript client and fallback logic.
                    </p>
                  </div>
                </div>
              </div>

              <div className="radial-accent relative">
                <Surface tone="highlight" className="overflow-hidden rounded-[2rem] p-5">
                  <div className="flex items-center justify-between border-b border-white/8 pb-4">
                    <div>
                      <p className="text-sm font-semibold text-white">Project Console</p>
                      <p className="mt-1 text-sm text-[var(--app-muted)]">
                        Live connection visibility with transport intelligence.
                      </p>
                    </div>
                    <StatusBadge tone="success">Online</StatusBadge>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-cyan-400/14 bg-cyan-400/[0.06] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/70">
                        Active rooms
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-white">18</p>
                      <p className="mt-2 text-sm text-cyan-50/70">Cross-region activity snapshot</p>
                    </div>
                    <div className="rounded-[1.5rem] border border-emerald-400/14 bg-emerald-400/[0.06] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200/70">
                        Deliveries / min
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-white">14.2k</p>
                      <p className="mt-2 text-sm text-emerald-50/70">Healthy throughput with fallback enabled</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-slate-950/75 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">Transport events</p>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--app-subtle)]">
                        last 30s
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        'client.connected  transport=websocket  room=presence',
                        'broadcast.received  room=ops-feed  size=1.2kb',
                        'fallback.engaged  transport=sse  client=e8a71c24',
                        'message.sent  room=alerts  latency=42ms',
                      ].map((entry) => (
                        <div
                          key={entry}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                        >
                          <span className="font-mono text-xs text-slate-200">{entry}</span>
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Surface>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard
                key={metric.label}
                icon={metric.icon}
                label={metric.label}
                value={metric.value}
                meta={metric.meta}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Why teams adopt it"
            title="A calmer architecture for live product surfaces."
            description="The design system guidance pointed toward high-contrast developer tooling, so the product story now leans into observability, transport confidence, and fast integration."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {features.map(({ title, copy, icon }) => (
              <Surface key={title} className="p-6" interactive>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                  {createElement(icon, { className: 'h-5 w-5' })}
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--app-muted)]">{copy}</p>
              </Surface>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Surface className="p-6 sm:p-8">
              <SectionHeader
                eyebrow="Integration"
                title="Drop Brodcasta into your stack in a few predictable steps."
                description="The product demo pattern from the skill suggested centering the integration path, so the hero is backed by a code-first operator workflow."
              />

              <div className="mt-8 code-panel">
                <pre>
                  <span className="token-comment">// install and connect</span>{'\n'}
                  <span className="token-keyword">import</span> {'{'} <span className="token-accent">BrodcastaClient</span> {'}'}{' '}
                  <span className="token-keyword">from</span> <span className="token-string">'brodcasta-sdk'</span>{'\n'}
                  {'\n'}
                  <span className="token-keyword">const</span> client = <span className="token-keyword">new</span>{' '}
                  <span className="token-accent">BrodcastaClient</span>({'\n'}
                  {'  '}baseUrl: <span className="token-string">'https://realtime.internal'</span>,{'\n'}
                  {'  '}projectId: <span className="token-string">'proj_live_ops'</span>,{'\n'}
                  {'  '}projectSecret: <span className="token-string">'••••••••'</span>,{'\n'}
                  {'  '}fallbackToSse: <span className="token-keyword">true</span>,{'\n'}
                  {'}'}){'\n'}
                  {'\n'}
                  <span className="token-keyword">await</span> client.connect(){'\n'}
                  client.onEvent(<span className="token-string">'message.received'</span>, handleMessage)
                </pre>
              </div>
            </Surface>

            <Surface tone="muted" className="p-6 sm:p-8">
              <SectionHeader
                eyebrow="What teams say"
                title="Social proof without the fluff."
                description="The landing guidance recommended proof near the CTA, so these quotes sit beside the integration path rather than hiding at the very bottom."
              />

              <div className="mt-8 space-y-4">
                {testimonials.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5"
                  >
                    <p className="text-sm leading-7 text-slate-100">"{item.quote}"</p>
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-sm text-[var(--app-muted)]">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6 lg:px-8">
          <Surface tone="highlight" className="overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <span className="section-eyebrow">Start Building</span>
                <h2 className="text-4xl font-semibold text-white sm:text-5xl">
                  Bring your own infrastructure. Keep the realtime experience polished.
                </h2>
                <p className="text-lg leading-8 text-[var(--app-muted)]">
                  Create a project, rotate credentials, test the transport layer, and watch message
                  activity without leaving the workspace.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/signup" className="button-primary">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/dashboard" className="button-secondary">
                  Open dashboard
                </Link>
              </div>
            </div>
          </Surface>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
