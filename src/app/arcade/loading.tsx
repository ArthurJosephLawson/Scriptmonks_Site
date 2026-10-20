import { SkeletonBlock, SkeletonCard, SkeletonHeading } from "@/components/ui/skeleton";

export default function ArcadeLoading() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonHeading className="mt-4 w-56" />
      <SkeletonBlock className="mt-4 h-4 w-full max-w-xl" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} className="min-h-52" />
        ))}
      </div>
    </main>
  );
}
