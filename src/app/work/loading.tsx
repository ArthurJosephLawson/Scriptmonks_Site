import { SkeletonBlock, SkeletonCard, SkeletonHeading } from "@/components/ui/skeleton";

export default function WorkLoading() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonHeading className="mt-4 w-64" />
      <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />

      <div className="mt-12 flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-11 w-32" />
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </main>
  );
}
