import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonBookCard() {
  return (
    <div className="w-40 flex-shrink-0">
      <Skeleton className="aspect-[2/3] mb-3 rounded-lg" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}