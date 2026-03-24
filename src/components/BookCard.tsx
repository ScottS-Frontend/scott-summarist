"use client";

import { Book } from "@/types";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import BookImage from "./BookImage";
import { useAudioDuration } from "@/hooks/useAudioDuration";
import { BsClock, BsStar } from "react-icons/bs";

// Helper to format seconds to MM:SS
function formatDuration(seconds: number | null): string {
  if (!seconds || isNaN(seconds)) return "--:--";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

interface BookCardProps {
  book: Book;
}

// THIS IS THE COMPONENT FOR RECOMMENDED/SUGGESTED GRID ITEMS
export default function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { subscription } = useSelector((state: RootState) => state.subscription);
  const audioDuration = useAudioDuration(book.audioLink);

  // Check if user is guest
  const isGuest = user?.email === "guest@gmail.com";

  // Check if user has active subscription from subscriptionSlice
  const hasActiveSubscription =
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

 // Show Premium pill if:
  // - Book requires subscription
  // - AND (user is guest OR user does NOT have active subscription)
  const showPremiumPill = book.subscriptionRequired && (isGuest || !hasActiveSubscription);

  const handleClick = () => {
  router.push(`/book/${book.id}`);
};

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group relative"
    >
      {/* Premium Pill - Upper Right Corner */}
      {showPremiumPill && (
        <div className="absolute top-2 right-2 z-20 bg-[#032b41] text-white text-xs font-bold px-3 py-1 rounded-full">
          Premium
        </div>
      )}

      {/* Fixed height container for BookImage */}
      <div className="w-full h-48 mb-2">
        <BookImage
          book={book}
          className="w-full h-full"
          showHoverEffect={true}
          showHalfCircle={true}
          circleSize="medium"
        />
      </div>

      {/* Book Info */}
      <div className="space-y-1">
        <h3 className="font-bold text-[#032b41] text-sm leading-tight line-clamp-2 group-hover:underline">
          {book.title}
        </h3>
        <p className="text-gray-500 text-xs">{book.author}</p>

        {/* Full subtitle - no truncation */}
        <p className="text-gray-400 text-xs leading-relaxed">
          {book.subTitle || ""}
        </p>

        {/* Bottom row - Duration and Rating */}
        <div className="flex items-center gap-3 text-gray-500 text-xs pt-2">
          {/* Duration */}
          <div className="flex items-center gap-1">
            <BsClock className="w-3 h-3" />
            <span>{formatDuration(audioDuration)}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <BsStar className="w-3 h-3 text-black fill-black" />
            <span className="text-black font-medium">{book.averageRating}</span>
            <span>({book.totalRating})</span>
          </div>
        </div>
      </div>
    </div>
  );
}