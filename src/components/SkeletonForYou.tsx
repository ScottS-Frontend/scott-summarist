"use client";

import { Skeleton } from "@/components/ui/skeleton";

function SkeletonBookCard() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="w-full aspect-[2/3] rounded-lg" />
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-2/3 h-3" />
      <Skeleton className="w-1/2 h-3" />
    </div>
  );
}

function SkeletonSelectedBook() {
  return (
    <div className="bg-[#fbefd6] rounded-lg p-6 shadow-sm border border-[#f0e6d2] w-[624px] h-[188px] flex items-center">
      {/* Subtitle - left side */}
      <div className="flex-1 pr-6 space-y-2">
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-3/4 h-6" />
      </div>

      {/* Vertical line */}
      <div className="w-px h-24 bg-gray-300 mx-6"></div>

      {/* Content - right side */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Book Image */}
        <Skeleton className="w-[140px] h-[140px] rounded" />

        {/* Text content */}
        <div className="flex flex-col gap-2 w-[140px]">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-3/4 h-4" />
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-12 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkeletonForYou() {
  return (
    <div className="flex min-h-screen bg-[#f7faf9] overflow-x-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-[#f7faf9] border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <Skeleton className="w-[120px] h-[40px] mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-full h-[40px]" />
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 ml-64 min-w-0">
        {/* Header Skeleton */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 z-10 shadow-sm flex justify-end">
          <Skeleton className="w-[300px] h-[40px]" />
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Selected Book Section Skeleton */}
          <section className="mb-16">
            <Skeleton className="w-[250px] h-[28px] mb-6" />
            <SkeletonSelectedBook />
          </section>

          {/* Recommended Books Skeleton */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="w-[280px] h-[28px]" />
            </div>
            <div className="grid grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBookCard key={i} />
              ))}
            </div>
          </section>

          {/* Suggested Books Skeleton */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="w-[220px] h-[28px]" />
            </div>
            <div className="grid grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBookCard key={i} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
