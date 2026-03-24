"use client";

import { useEffect, useState } from "react";
import { Book } from "@/types";
import BookCard from "@/components/BookCard";
import SearchBar from "@/components/SearchBar";
import Sidebar from "@/components/Sidebar";
import BookImage from "@/components/BookImage";
import { useRouter } from "next/navigation";
import { useAudioDuration } from "@/hooks/useAudioDuration";
import { useAppSelector, useAppDispatch } from "@/store/store";
import SkeletonForYou from "@/components/SkeletonForYou";
import { loadSubscription } from "@/store/subscriptionSlice";
import { BsList } from "react-icons/bs";

// Helper to format seconds to MM:SS
function formatDuration(seconds: number | null): string {
  if (!seconds || isNaN(seconds)) return "--:--";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

// Component for Selected Book with dynamic duration
function SelectedBookCard({ book }: { book: Book }) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { subscription } = useAppSelector((state) => state.subscription);
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

  return (
    <a
      href={`/book/${book.id}`}
      className="bg-[#fbefd6] rounded-lg p-4 md:p-6 shadow-sm border border-[#f0e6d2] cursor-pointer hover:shadow-md transition-shadow w-full max-w-[624px] block no-underline mb-6 relative"
      onClick={(e) => {
        e.preventDefault();
        router.push(`/book/${book.id}`);
      }}
    >
      {/* Premium Pill */}
      {showPremiumPill && (
        <div className="absolute top-3 right-3 z-20 bg-[#032b41] text-white text-xs font-bold px-3 py-1 rounded-full">
          Premium
        </div>
      )}

      {/* Mobile Layout (≤768px): Stacked vertically */}
      <div className="md:hidden">
        {/* Subtitle on top - full width */}
        <div className="text-sm text-gray-800 mb-4 leading-relaxed">
          {book.subTitle}
        </div>

        {/* Image + details row */}
        <div className="flex items-center gap-4">
          {/* Book Image */}
          <div className="w-[100px] h-[100px] flex-shrink-0">
            <BookImage
              book={book}
              className="w-full h-full"
              showHoverEffect={false}
              showHalfCircle={true}
              circleSize="medium"
            />
          </div>

          {/* Book Info */}
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="font-bold text-[#032b41] text-base line-clamp-2">
              {book.title}
            </div>
            <div className="text-gray-600 text-sm line-clamp-1">
              {book.author}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  stroke="currentColor"
                  fill="white"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  className="w-4 h-4 ml-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                </svg>
              </div>
              <span>{formatDuration(audioDuration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (>768px): Side by side */}
      <div className="hidden md:flex items-start min-h-[140px]">
        {/* Subtitle - left side */}
        <div className="flex-1 pr-6 text-lg text-gray-700 italic font-medium leading-relaxed self-center">
          &ldquo;{book.subTitle}&rdquo;
        </div>

        {/* Vertical line */}
        <div className="w-px self-stretch bg-gray-400 mx-6 flex-shrink-0"></div>

        {/* Content - right side */}
        <div className="flex items-center gap-4 flex-shrink-0 self-center">
          {/* Book Image */}
          <div className="w-[140px] h-[140px] flex-shrink-0">
            <BookImage
              book={book}
              className="w-full h-full"
              showHoverEffect={false}
              showHalfCircle={true}
              circleSize="medium"
            />
          </div>

          {/* Text content */}
          <div className="flex flex-col gap-1 min-w-0 w-[140px]">
            <div className="font-bold text-[#032b41] text-lg leading-tight">
              {book.title}
            </div>
            <div className="text-gray-600 text-sm">{book.author}</div>
            <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  stroke="currentColor"
                  fill="white"
                  strokeWidth="0"
                  viewBox="0 0 16 16"
                  className="w-4 h-4 ml-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                </svg>
              </div>
              <span>{formatDuration(audioDuration)}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

// MAIN PAGE COMPONENT
export default function ForYouPage() {
  const dispatch = useAppDispatch();
  
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load subscription
  useEffect(() => {
    dispatch(loadSubscription());
  }, [dispatch]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected",
          ),
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended",
          ),
          fetch(
            "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested",
          ),
        ]);

        const selectedData = await selectedRes.json();
        const selected =
          Array.isArray(selectedData) && selectedData.length > 0
            ? selectedData[0]
            : selectedData;
        const recommended = await recommendedRes.json();
        const suggested = await suggestedRes.json();

        setSelectedBook(selected);
        setRecommendedBooks(recommended);
        setSuggestedBooks(suggested);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
      setLoading(false);
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <SkeletonForYou />;
  }

  return (
    <div className="flex min-h-screen bg-[#f7faf9] overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 md:ml-64 min-w-0">
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 z-10 shadow-sm flex items-center justify-end">
          <SearchBar />

          {/* Hamburger Menu - Mobile Only (md breakpoint = 768px) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-[#032b41] hover:bg-gray-100 rounded-lg ml-4"
          >
            <BsList className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Selected Book Section */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-[18px] md:text-[22px] font-bold text-[#032b41] mb-4 md:mb-6">
              Selected just for you
            </h2>
            {selectedBook ? <SelectedBookCard book={selectedBook} /> : null}
          </section>

          {/* Recommended Books */}
          <section className="mb-12 md:mb-16">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-[18px] md:text-[22px] font-bold text-[#032b41]">
                Recommended For You
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {recommendedBooks.slice(0, 5).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>

          {/* Suggested Books */}
          <section className="mb-12 md:mb-16">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-[18px] md:text-[22px] font-bold text-[#032b41]">
                Suggested Books
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {suggestedBooks.slice(0, 5).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}