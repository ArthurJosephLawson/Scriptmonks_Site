/** Shared shimmer skeleton primitives (SPEC_V4 §4 loading states). */
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-none bg-dark-raised ${className}`}
    />
  );
}

export function SkeletonHeading({ className = "" }: { className?: string }) {
  return <SkeletonBlock className={`h-8 ${className}`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-dark-border bg-dark-surface p-6 ${className}`}>
      <SkeletonBlock className="h-3 w-20" />
      <SkeletonBlock className="mt-4 h-5 w-3/4" />
      <SkeletonBlock className="mt-4 h-4 w-full" />
      <SkeletonBlock className="mt-2 h-4 w-2/3" />
    </div>
  );
}

export function SkeletonLines({ count = 4 }: { count?: number }) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonBlock key={index} className="h-4 w-full" />
      ))}
    </div>
  );
}
