"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ChoosePlanSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <header className="bg-[#032b41] pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <Skeleton className="w-full max-w-[600px] h-[56px] mx-auto mb-6" />
          <Skeleton className="w-full max-w-[400px] h-[28px] mx-auto" />
        </div>
      </header>

      {/* Image Section Skeleton */}
      <section className="bg-[#032b41] pb-0 rounded-b-[260px]">
        <div className="mx-auto bg-white overflow-hidden max-w-[340px] rounded-t-[180px]">
          <Skeleton className="w-full h-[280px]" />
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-8 py-12">
        {/* Features Grid Skeleton */}
        <section className="grid grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="flex flex-col items-center text-center gap-2"
            >
              <Skeleton className="w-[60px] h-[60px] rounded-full" />
              <Skeleton className="w-[120px] h-[20px]" />
              <Skeleton className="w-[140px] h-[16px]" />
            </article>
          ))}
        </section>

        {/* Plan Selection Skeleton */}
        <section className="max-w-[680px] mx-auto">
          <Skeleton className="w-[280px] h-[28px] mx-auto mb-8" />

          {/* Plan Cards */}
          {[1, 2].map((i) => (
            <article
              key={i}
              className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-lg mb-4"
            >
              <Skeleton className="w-6 h-6 rounded-full" />
              <div className="flex-1">
                <Skeleton className="w-[150px] h-[20px] mb-2" />
                <Skeleton className="w-[100px] h-[24px] mb-2" />
                <Skeleton className="w-[200px] h-[16px]" />
              </div>
            </article>
          ))}
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <Skeleton className="w-[20px] h-[20px]" />
        </div>

        {/* CTA Button Skeleton */}
        <section className="text-center">
          <Skeleton className="w-[300px] h-[48px] rounded-lg mx-auto" />
          <Skeleton className="w-[350px] h-[16px] mx-auto mt-4" />
        </section>

        {/* FAQ Section Skeleton */}
        <section className="mt-12">
          {[1, 2, 3, 4].map((i) => (
            <article key={i} className="border-b border-gray-200">
              <div className="flex items-center justify-between py-4">
                <Skeleton className="w-[300px] h-[20px]" />
                <Skeleton className="w-4 h-4 rounded-full" />
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-[#f7faf9] py-12 px-8 mt-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-[80px] h-[20px] mb-4" />
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="w-[100px] h-[16px]" />
                ))}
              </div>
            ))}
          </div>

          <Skeleton className="w-[200px] h-[16px] mx-auto" />
        </div>
      </footer>
    </div>
  );
}
