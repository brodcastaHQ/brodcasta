const numberFormatter = new Intl.NumberFormat('en-US');

export const formatCount = (value) => numberFormatter.format(Number(value || 0));

export const formatDate = (value, options) => {
  if (!value) return 'Not available';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return new Intl.DateTimeFormat(
    'en-US',
    options || { month: 'short', day: 'numeric', year: 'numeric' },
  ).format(date);
};

export const formatDateTime = (value) =>
  formatDate(value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export const formatAuthType = (value) => {
  if (value === 'all') return 'Full auth';
  if (value === 'publishing_only') return 'Publish protected';
  if (value === 'none') return 'Public';
  return 'Custom';
};

export const titleCase = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const maskSecret = (secret) => {
  if (!secret) return '';
  return `${secret.slice(0, 8)}...${secret.slice(-4)}`;
};

export const formatBytes = (value) => {
  const bytes = Number(value || 0);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};
