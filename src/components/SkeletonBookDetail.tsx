"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonBookDetail() {
  return (
    <div className="flex min-h-screen bg-white">
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

      <main className="flex-1">
        {/* Header Skeleton */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 z-50 shadow-sm flex justify-end">
          <Skeleton className="w-[300px] h-[40px]" />
        </header>

        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="flex gap-12">
            {/* Left Side - Book Info Skeleton */}
            <div className="flex-1">
              {/* Title with Premium label */}
              <div className="flex items-center gap-3 mb-2">
                <Skeleton className="w-[400px] h-[36px]" />
                <Skeleton className="w-[100px] h-[24px]" />
              </div>

              {/* Author */}
              <Skeleton className="w-[200px] h-[24px] mb-1" />

              {/* Subtitle */}
              <Skeleton className="w-[300px] h-[22px] mb-4" />

              {/* Divider */}
              <div className="w-full h-px bg-gray-200 mb-4"></div>

              {/* Stats Row - 2 rows */}
              <div className="flex flex-col gap-3 mb-4">
                {/* First row - Rating and Duration */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-[120px] h-[16px]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-[60px] h-[16px]" />
                  </div>
                </div>

                {/* Second row - Type and Key Ideas */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-[80px] h-[16px]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="w-[100px] h-[16px]" />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-200 mb-6"></div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <Skeleton className="w-[120px] h-[48px] rounded" />
                <Skeleton className="w-[120px] h-[48px] rounded" />
              </div>

              {/* Bookmark */}
              <div className="flex items-center gap-2 mb-10">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="w-[180px] h-[16px]" />
              </div>

              {/* What's it about? */}
              <Skeleton className="w-[200px] h-[24px] mb-4" />

              {/* Tags */}
              <div className="flex gap-3 mb-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="w-[80px] h-[36px]" />
                ))}
              </div>

              {/* Description */}
              <div className="space-y-2 mb-10">
                <Skeleton className="w-full h-[16px]" />
                <Skeleton className="w-full h-[16px]" />
                <Skeleton className="w-full h-[16px]" />
                <Skeleton className="w-[80%] h-[16px]" />
              </div>

              {/* About the author */}
              <Skeleton className="w-[200px] h-[24px] mb-4" />
              <div className="space-y-2">
                <Skeleton className="w-full h-[16px]" />
                <Skeleton className="w-full h-[16px]" />
                <Skeleton className="w-[90%] h-[16px]" />
              </div>
            </div>

            {/* Right Side - Book Cover */}
            <div className="w-80 flex-shrink-0">
              <Skeleton className="w-full h-[420px] rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
