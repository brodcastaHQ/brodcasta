import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SectionHeader, StatusBadge, Surface } from '../components/ui/System';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    cadence: '/month',
    highlight: false,
    description: 'For internal tools, prototypes, and early realtime features.',
    features: [
      '1 project workspace',
      'Basic transport analytics',
      'WebSocket + SSE fallback',
      'Community support',
    ],
    cta: 'Start free',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '$29',
    cadence: '/month',
    highlight: true,
    description: 'For shipping teams that need observability, scale, and multiple environments.',
    features: [
      'Unlimited projects',
      'Advanced analytics and message history',
      'Credential rotation and playground tools',
      'Priority support',
    ],
    cta: 'Create workspace',
    href: '/signup',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    highlight: false,
    description: 'For regulated, high-volume, or deeply integrated self-hosted deployments.',
    features: [
      'Private infrastructure guidance',
      'Custom auth integration',
      'Operational onboarding',
      'SLA and platform support',
    ],
    cta: 'Contact us',
    href: 'mailto:sales@brodcasta.dev',
  },
];

const faqs = [
  {
    question: 'Can I self-host every plan?',
    answer:
      'Yes. The plan differences are about support, scale, and operational tooling rather than forcing a hosted-only path.',
  },
  {
    question: 'What transport does Brodcasta use?',
    answer:
      'Projects connect over WebSockets with SSE fallback available when the network or platform requires it.',
  },
  {
    question: 'Can I change auth rules later?',
    answer:
      'Yes. Projects can be public, publish-protected, or fully authenticated, and those settings can be updated from the dashboard.',
  },
];

const Pricing = () => {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="pb-24">
        <section className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8">
          <Surface tone="highlight" className="overflow-hidden rounded-[2.25rem] px-6 py-12 sm:px-10 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <StatusBadge tone="info">
                    <Sparkles className="h-3.5 w-3.5" />
                    Straightforward pricing
                  </StatusBadge>
                  <StatusBadge tone="success">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Self-hosted included
                  </StatusBadge>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl font-semibold leading-[1.02] text-white sm:text-6xl">
                    Pricing that matches how teams actually adopt realtime infrastructure.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[var(--app-muted)]">
                    Start with a single project, move into multi-project operations, and scale up
                    into custom deployment support only when the product demands it.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/signup" className="button-primary">
                    Create free workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="https://docs.Brodcasta.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="button-secondary"
                  >
                    View docs
                  </a>
                </div>
              </div>

              <Surface className="rounded-[2rem] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
                  Included on every plan
                </p>
                <div className="mt-5 space-y-4">
                  {[
                    'Realtime projects with scoped credentials',
                    'Analytics surfaces for traffic and transport behavior',
                    'Project-level auth configuration',
                    'A clean operator UI for messages and settings',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                    >
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/18 bg-cyan-400/10 text-cyan-200">
                        <Waves className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-7 text-slate-100">{item}</p>
                    </div>
                  ))}
                </div>
              </Surface>
            </div>
          </Surface>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Plans"
            title="Three paths, one product surface."
            description="The redesign keeps the pricing page clean and single-purpose: transparent choices, short copy, and obvious CTAs."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <Surface
                key={plan.name}
                tone={plan.highlight ? 'highlight' : 'default'}
                className="flex h-full flex-col rounded-[2rem] p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold text-white">{plan.name}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--app-muted)]">{plan.description}</p>
                  </div>
                  {plan.highlight ? <StatusBadge tone="success">Most adopted</StatusBadge> : null}
                </div>

                <div className="mt-8 flex items-end gap-2">
                  <span className="text-5xl font-semibold text-white">{plan.price}</span>
                  {plan.cadence ? <span className="pb-2 text-sm text-[var(--app-muted)]">{plan.cadence}</span> : null}
                </div>

                <div className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-300" />
                      <span className="text-sm leading-7 text-slate-100">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  {plan.href.startsWith('mailto:') ? (
                    <a href={plan.href} className={plan.highlight ? 'button-primary w-full' : 'button-secondary w-full'}>
                      {plan.cta}
                    </a>
                  ) : (
                    <Link to={plan.href} className={plan.highlight ? 'button-primary w-full' : 'button-secondary w-full'}>
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </Surface>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[960px] px-4 pt-20 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions teams usually ask before they commit."
            description="Short answers, no pricing games."
          />
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <Surface key={faq.question} className="rounded-[1.75rem] p-6">
                <h3 className="text-xl font-semibold text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--app-muted)]">{faq.answer}</p>
              </Surface>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
