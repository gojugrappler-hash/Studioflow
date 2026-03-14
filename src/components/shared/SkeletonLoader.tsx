export function SkeletonLoader({ className = '', variant = 'text' }: { className?: string; variant?: 'text' | 'card' | 'avatar' | 'row' }) {
  const base = 'animate-shimmer rounded';
  const variants: Record<string, string> = {
    text: `${base} h-4 w-full ${className}`,
    card: `${base} h-32 w-full rounded-lg ${className}`,
    avatar: `${base} w-10 h-10 rounded-full ${className}`,
    row: `${base} h-12 w-full ${className}`,
  };
  return <div className={variants[variant]} style={{ background: 'var(--bg-card)' }} />;
}

export function SkeletonGroup({ count = 3, variant = 'text' }: { count?: number; variant?: 'text' | 'card' | 'avatar' | 'row' }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonLoader key={i} variant={variant} />
      ))}
    </div>
  );
}
