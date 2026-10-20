import { SkeletonBlock, SkeletonHeading, SkeletonLines } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <main className="mx-auto max-w-content px-6 py-24">
      <SkeletonBlock className="h-3 w-32" />
      <SkeletonHeading className="mt-4 w-80" />
      <SkeletonLines count={3} />

      <SkeletonBlock className="mt-10 h-3 w-24" />
      <SkeletonBlock className="mt-4 h-64 w-full" />

      <SkeletonBlock className="mt-10 h-3 w-20" />
      <SkeletonLines count={5} />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <SkeletonBlock className="h-44 w-full" />
        <SkeletonBlock className="h-44 w-full" />
      </div>
    </main>
  );
}
