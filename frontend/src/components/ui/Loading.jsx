const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

const Loading = ({ size = 'md', fullScreen = false, label = 'Loading control panel' }) => {
  const content = (
    <div className="surface-card inline-flex min-w-[220px] flex-col items-center gap-4 px-8 py-7 text-center">
      <div
        className={`${sizeMap[size] || sizeMap.md} animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300`}
      />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-sm text-[var(--app-muted)]">Syncing live context and UI state.</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 px-4 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-6">{content}</div>;
};

export default Loading;
