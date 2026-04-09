import { createElement } from 'react';
import { cn } from '../../utils/cn';

export const StatusBadge = ({ tone = 'neutral', children, className = '' }) => {
  const toneClasses = {
    neutral: '',
    info: 'tag tag-info',
    success: 'tag tag-success',
    warning: 'tag tag-warning',
    danger: 'tag tag-danger',
  };
  return (
    <span className={cn('tag', toneClasses[tone] || '', className)}>
      {children}
    </span>
  );
};

export const Surface = ({ as = 'section', tone = 'default', interactive = false, className = '', children, ...props }) => {
  const elementType = as || 'section';
  return createElement(
    elementType,
    { className: cn('rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-4', interactive && 'transition-colors hover:bg-[var(--app-surface-2)]', className), ...props },
    children,
  );
};

export const PageHeader = ({ eyebrow, title, description, meta, actions, className = '' }) => (
  <div className={cn('flex flex-col gap-4', className)}>
    <div className="space-y-2">
      {eyebrow ? <span className="text-xs font-medium uppercase tracking-wider text-[var(--app-subtle)]">{eyebrow}</span> : null}
      <h1 className="text-2xl font-semibold text-[var(--app-text)]">{title}</h1>
      {description ? <p className="text-sm text-[var(--app-muted)]">{description}</p> : null}
    </div>
    {meta ? <div className="flex flex-wrap gap-2">{meta}</div> : null}
    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
  </div>
);

export const SectionHeader = ({ eyebrow, title, description, actions, className = '' }) => (
  <div className={cn('flex flex-col gap-3', className)}>
    <div className="space-y-1">
      {eyebrow ? <span className="text-xs font-medium uppercase tracking-wider text-[var(--app-subtle)]">{eyebrow}</span> : null}
      <h2 className="text-lg font-semibold text-[var(--app-text)]">{title}</h2>
      {description ? <p className="text-sm text-[var(--app-muted)]">{description}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
  </div>
);

export const MetricCard = ({ icon: Icon, label, value, meta, tone = 'default', className = '' }) => (
  <div className={cn('rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3', className)}>
    <div className="flex items-center gap-2">
      {Icon ? <Icon className="h-4 w-4 text-[var(--app-muted)]" /> : null}
      <p className="text-xs font-medium text-[var(--app-subtle)]">{label}</p>
    </div>
    <p className="text-xl font-semibold text-[var(--app-text)]">{value}</p>
    {meta ? <p className="text-xs text-[var(--app-muted)]">{meta}</p> : null}
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div className={cn('rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center', className)}>
    <div className="flex flex-col items-center gap-3">
      {Icon ? <Icon className="h-8 w-8 text-[var(--app-muted)]" /> : null}
      <div className="space-y-1">
        <h3 className="font-semibold text-[var(--app-text)]">{title}</h3>
        <p className="text-sm text-[var(--app-muted)]">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  </div>
);

export const Field = ({ htmlFor, label, hint, className = '', children }) => (
  <div className={cn('space-y-1', className)}>
    {label ? (
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[var(--app-text)]">
        {label}
      </label>
    ) : null}
    {children}
    {hint ? <p className="text-xs text-[var(--app-muted)]">{hint}</p> : null}
  </div>
);

export const KeyValue = ({ label, value, className = '' }) => (
  <div className={cn('space-y-1', className)}>
    <p className="text-xs font-medium uppercase tracking-wider text-[var(--app-subtle)]">{label}</p>
    <p className="text-sm font-medium text-[var(--app-text)]">{value}</p>
  </div>
);