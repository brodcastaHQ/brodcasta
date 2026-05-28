import { CreditCard, ExternalLink, Check, Loader2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import { createClient } from '../../utils/client';

const PLAN_LABELS = {
  starter: { name: 'Starter', color: 'text-[var(--app-muted)]' },
  pro: { name: 'Pro', color: 'text-[var(--app-text)]' },
  enterprise: { name: 'Enterprise', color: 'text-amber-500' },
};

const STATUS_BADGE = {
  active: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  pending: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  expired: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const Billing = () => {
  const [subData, setSubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const client = createClient('/api/payments');
        const resp = await client.get('/subscription');
        setSubData(resp.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || 'Failed to load billing info.');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  if (loading) {
    return <Loading fullScreen label="Loading billing info" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--app-muted)]">{error}</p>
      </div>
    );
  }

  const plan = subData?.plan || 'starter';
  const sub = subData?.subscription;
  const planInfo = PLAN_LABELS[plan] || PLAN_LABELS.starter;
  const isPaid = plan === 'pro' || plan === 'enterprise';

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-[var(--app-text)]">Billing</h1>
      <p className="text-sm text-[var(--app-muted)] mt-0.5">Manage your subscription and payment details</p>

      <div className="mt-6 border border-[var(--app-border)] rounded-xl">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-[var(--app-border)] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-[var(--app-muted)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--app-text)]">Current Plan</p>
                <p className={`text-lg font-semibold mt-0.5 ${planInfo.color}`}>
                  {planInfo.name}
                </p>
              </div>
            </div>

            {isPaid && sub ? (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_BADGE[sub.status] || STATUS_BADGE.pending}`}>
                {sub.status}
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                Free
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--app-border)] px-6 py-4 space-y-3">
          {sub ? (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--app-muted)]">Plan</span>
                <span className="text-[var(--app-text)] capitalize">{sub.plan_type}</span>
              </div>
              {sub.start_date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--app-muted)]">Start date</span>
                  <span className="text-[var(--app-text)]">
                    {new Date(sub.start_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {sub.end_date && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--app-muted)]">Renewal date</span>
                  <span className="text-[var(--app-text)]">
                    {new Date(sub.end_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-[var(--app-muted)]">
              <Check className="w-4 h-4 text-green-500" />
              No active paid subscription
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {!isPaid ? (
          <Link
            to="/pricing"
            className="button-primary px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Upgrade plan
          </Link>
        ) : (
          <Link
            to="/pricing"
            className="button-secondary px-4 py-2 text-sm inline-flex items-center gap-2 border border-[var(--app-border)]"
          >
            <ExternalLink className="w-4 h-4" />
            Change plan
          </Link>
        )}
      </div>

      {sub?.paystack_reference && (
        <details className="mt-8 group">
          <summary className="cursor-pointer text-sm text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors">
            Payment details
          </summary>
          <div className="mt-3 border border-[var(--app-border)] rounded-xl px-6 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--app-muted)]">Transaction reference</span>
              <code className="text-xs text-[var(--app-text)] bg-[var(--app-surface-2)] px-2 py-0.5 rounded">
                {sub.paystack_reference}
              </code>
            </div>
            {sub.amount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--app-muted)]">Amount</span>
                <span className="text-[var(--app-text)]">
                  {(sub.amount / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

export default Billing;
