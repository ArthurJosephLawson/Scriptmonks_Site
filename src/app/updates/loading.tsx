import { SkeletonBlock, SkeletonCard, SkeletonHeading } from "@/components/ui/skeleton";

export default function UpdatesLoading() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonHeading className="mt-4 w-72" />
      <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />

      <div className="mt-8 flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-11 w-28" />
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </main>
  );
}
