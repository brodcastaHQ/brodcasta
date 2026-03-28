import { createElement } from 'react';
import { cn } from '../../utils/cn';

const surfaceToneClasses = {
  default: 'surface-card',
  muted: 'surface-card surface-card-muted',
  highlight: 'surface-card surface-card-highlight',
  danger: 'surface-card surface-card-danger',
};

const badgeToneClasses = {
  neutral: 'tag',
  info: 'tag tag-info',
  success: 'tag tag-success',
  warning: 'tag tag-warning',
  danger: 'tag tag-danger',
};

const metricToneClasses = {
  default: 'border-white/10 bg-white/5 text-[var(--app-primary)]',
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  warning: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  danger: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
};

export const StatusBadge = ({ tone = 'neutral', children, className = '' }) => (
  <span className={cn(badgeToneClasses[tone] || badgeToneClasses.neutral, className)}>
    {children}
  </span>
);

export const Surface = ({
  as = 'section',
  tone = 'default',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const elementType = as || 'section';

  return createElement(
    elementType,
    {
      className: cn(
        surfaceToneClasses[tone] || surfaceToneClasses.default,
        interactive && 'surface-card-interactive',
        className,
      ),
      ...props,
    },
    children,
  );
};

export const PageHeader = ({
  eyebrow,
  title,
  description,
  meta,
  actions,
  className = '',
}) => (
  <div
    className={cn(
      'flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between',
      className,
    )}
  >
    <div className="max-w-3xl space-y-5">
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="section-copy max-w-2xl text-base leading-7 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {meta ? <div className="flex flex-wrap gap-3">{meta}</div> : null}
    </div>
    {actions ? (
      <div className="flex flex-wrap items-center gap-3 lg:justify-end">{actions}</div>
    ) : null}
  </div>
);

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  actions,
  className = '',
}) => (
  <div
    className={cn(
      'flex flex-col gap-5 md:flex-row md:items-end md:justify-between',
      className,
    )}
  >
    <div className="space-y-3">
      {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {description ? <p className="section-copy">{description}</p> : null}
      </div>
    </div>
    {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
  </div>
);

export const MetricCard = ({
  icon: Icon,
  label,
  value,
  meta,
  trend,
  tone = 'default',
  className = '',
}) => (
  <Surface className={cn('p-6', className)} interactive>
    <div className="flex items-start justify-between gap-4">
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl border',
          metricToneClasses[tone] || metricToneClasses.default,
        )}
      >
        {Icon ? <Icon className="h-5 w-5" /> : null}
      </div>
      {trend ? <StatusBadge tone={tone === 'danger' ? 'danger' : 'info'}>{trend}</StatusBadge> : null}
    </div>
    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
      {label}
    </p>
    <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    {meta ? <p className="mt-3 text-sm text-[var(--app-muted)]">{meta}</p> : null}
  </Surface>
);

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => (
  <Surface className={cn('p-8 text-center', className)} tone="muted">
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
      {Icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--app-primary)]">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-7 text-[var(--app-muted)]">{description}</p>
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  </Surface>
);

export const Field = ({ htmlFor, label, hint, className = '', children }) => (
  <div className={cn('space-y-2', className)}>
    {label ? (
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-white">
        {label}
      </label>
    ) : null}
    {children}
    {hint ? <p className="text-sm text-[var(--app-muted)]">{hint}</p> : null}
  </div>
);

export const KeyValue = ({ label, value, className = '' }) => (
  <div className={cn('space-y-1', className)}>
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--app-subtle)]">
      {label}
    </p>
    <div className="text-sm font-medium text-white">{value}</div>
  </div>
);
