import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    period: '/ month',
    description: 'For individuals and small projects getting started with real-time messaging.',
    features: [
      '1 project',
      '1,000 messages / day',
      'WebSocket & SSE',
      '3 rooms per project',
      '7-day message retention',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Get started',
    to: '/signup',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ month',
    description: 'For growing teams that need reliable real-time infrastructure.',
    features: [
      '10 projects',
      '100,000 messages / day',
      'WebSocket & SSE with auto-fallback',
      'Unlimited rooms',
      '30-day message retention',
      'Advanced analytics dashboard',
      'Full API access',
      'TypeScript SDK',
      'Email support',
    ],
    cta: 'Start free trial',
    to: '/signup',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations requiring dedicated infrastructure and support.',
    features: [
      'Unlimited projects',
      'Unlimited messages',
      'Everything in Pro',
      'Unlimited retention',
      'SSO / SAML',
      'Dedicated support',
      '99.9% SLA',
      'Custom integrations',
      'Priority onboarding',
    ],
    cta: 'Contact sales',
    to: '/login',
    featured: false,
  },
];

const PricingPage = () => {
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
              <Link to="/pricing" className="text-sm text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                Pricing
              </Link>
              <Link to="/login" className="text-sm text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
                Sign in
              </Link>
              <Link to="/signup" className="button-primary px-3 py-1.5 text-sm">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Header ─── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="section-eyebrow justify-center mb-4">Pricing</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="section-copy text-lg max-w-xl mx-auto">
            Start for free, scale as you grow. No hidden fees, no surprise charges.
          </p>
        </div>
      </section>

      {/* ─── Plans ─── */}
      <section className="pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-8 flex flex-col ${
                  plan.featured
                    ? 'border-[var(--app-text)] bg-[var(--app-surface)] shadow-lg scale-105 md:scale-110'
                    : 'border-[var(--app-border)] bg-[var(--app-surface)]'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--app-text)] text-[var(--app-bg)] text-xs font-semibold">
                    Most popular
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">{plan.name}</h2>
                  <p className="text-sm text-[var(--app-muted)] mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-[var(--app-muted)]">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[var(--app-muted)]">
                      <svg
                        className="w-4 h-4 mt-0.5 shrink-0 text-[var(--app-text)]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.to}
                  className={`block text-center rounded-full py-3 text-sm font-semibold transition-colors ${
                    plan.featured
                      ? 'button-primary'
                      : 'border border-[var(--app-border)] text-[var(--app-text)] hover:bg-[var(--app-surface-2)]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="border border-[var(--app-border)]">
            {[
              {
                q: 'Can I switch plans at any time?',
                a: 'Yes. You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to the new features and are prorated for the remainder of the billing cycle.',
              },
              {
                q: 'What happens if I exceed my message limit?',
                a: 'We will notify you when you approach your limit. If you exceed it, messages are queued until the next cycle or until you upgrade. No data is ever lost.',
              },
              {
                q: 'Do you offer a free trial for Pro?',
                a: 'Yes. You can try Pro free for 14 days with no credit card required. Full access to all features, no limitations.',
              },
              {
                q: 'How is messaging counted?',
                a: 'Every message published or delivered through Brodcasta counts toward your plan limit. System messages like connection acknowledgments are free.',
              },
            ].map((faq, i) => (
              <div
                key={faq.q}
                className={`p-6 ${i > 0 ? 'border-t border-[var(--app-border)]' : ''}`}
              >
                <h3 className="text-sm font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-[var(--app-muted)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="pb-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Ready to build real-time experiences?
          </h2>
          <p className="section-copy text-lg mb-8">
            Start with a free account, upgrade when you grow.
          </p>
          <Link to="/signup" className="button-primary px-8 py-3 text-base inline-block">
            Get started for free
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[var(--app-border)] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--app-subtle)]">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="Brodcasta" className="h-5 w-5" />
              <span className="text-sm font-medium text-[var(--app-text)]">Brodcasta</span>
            </Link>
            <span>Brodcasta, all rights reserved 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
