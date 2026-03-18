'use client';

import { Skeleton } from '@/components/ui/skeleton';

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

export default function SkeletonLibrary() {
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
          {/* Saved Books Section */}
          <section className="mb-16">
            <Skeleton className="w-[200px] h-[28px] mb-6" />
            <div className="grid grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBookCard key={i} />
              ))}
            </div>
          </section>

          {/* Finished Books Section */}
          <section className="mb-16">
            <Skeleton className="w-[220px] h-[28px] mb-6" />
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