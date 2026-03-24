"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Book } from "@/types";
import { AppDispatch, RootState } from "@/store/store";
import { openModal } from "@/store/modalSlice";
import { loadSubscription } from "@/store/subscriptionSlice";
import { addToLibrary, removeFromLibrary } from "@/store/library/librarySlice";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import {
  BsBookmark,
  BsBookmarkFill,
  BsStar,
  BsClock,
  BsLightbulb,
  BsList,
} from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import BookImage from "@/components/BookImage";
import { useAudioDuration } from "@/hooks/useAudioDuration";
import SkeletonBookDetail from "@/components/SkeletonBookDetail";

function formatDuration(seconds: number | null): string {
  if (!seconds || isNaN(seconds)) return "--:--";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { subscription, loading: subscriptionLoading } = useSelector(
    (state: RootState) => state.subscription,
  );
  const { savedBooks } = useSelector((state: RootState) => state.library);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isBookSaved = savedBooks.some((b) => b.bookId === id);

  useEffect(() => {
    if (user) {
      dispatch(loadSubscription());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`,
        );
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setBook(null);
      }
      setLoading(false);
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const audioDuration = useAudioDuration(book?.audioLink);

  const handleAddToLibrary = async () => {
    if (!user) {
      dispatch(openModal("login"));
      return;
    }

    setIsAdding(true);
    try {
      if (isBookSaved) {
        // Remove from library
        await dispatch(removeFromLibrary(id as string)).unwrap();
        alert("Removed from library!");
      } else {
        // Add to library
        await dispatch(addToLibrary(id as string)).unwrap();
        alert("Added to library!");
      }
    } catch (error: any) {
      console.error("Full error:", error);
      alert(`Failed to update library: ${error.message || error}`);
    }
    setIsAdding(false);
  };

  if (loading) {
    return <SkeletonBookDetail />;
  }

  if (!book) return <div>Book not found</div>;

  const isPremiumUser =
    subscription?.role === "premium" || subscription?.role === "premium-plus";
  const showPremiumLabel = book.subscriptionRequired && !isPremiumUser;
  const needsSubscription = book.subscriptionRequired === true;

  const handleReadListen = () => {
    if (!user) {
      dispatch(openModal("login"));
      return;
    }

    if (subscriptionLoading) {
      alert("Please wait, checking your subscription...");
      return;
    }

    // Check if guest or no active subscription
    const isGuest = user?.email === "guest@gmail.com";
    if (needsSubscription && (isGuest || !subscription)) {
      router.push("/choose-plan");
      return;
    }

    router.push(`/player/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 md:ml-64 min-w-0 w-full">
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 z-10 shadow-sm flex items-center justify-end">
          <SearchBar />

          {/* Hamburger - appears at ≤768px */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-[#032b41] hover:bg-gray-100 rounded-lg ml-4 flex-shrink-0"
          >
            <BsList className="w-6 h-6" />
          </button>
        </header>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {subscriptionLoading && needsSubscription && (
            <div className="text-sm text-gray-500 mb-4">
              Checking subscription...
            </div>
          )}

          {/* Stacked Layout (≤1024px): Book cover on top */}
          <div className="lg:hidden">
            <div className="w-full flex justify-center mb-6">
              <div className="relative">
                {showPremiumLabel && (
                  <div className="absolute top-2 right-2 z-20 bg-[#032b41] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Premium
                  </div>
                )}
                <BookImage
                  book={book}
                  className="w-[280px] h-[380px] md:w-[320px] md:h-[440px]"
                  showHoverEffect={false}
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#032b41] mb-2">
                {book.title}
                {showPremiumLabel && (
                  <span className="text-gray-400 font-normal ml-2">
                    (Premium)
                  </span>
                )}
              </h1>
              <p className="text-base text-gray-600 mb-1">{book.author}</p>
              <p className="text-base text-gray-500 mb-4">{book.subTitle}</p>

              <div className="w-full h-px bg-gray-200 mb-4"></div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 font-semibold">
                <div className="flex items-center gap-2">
                  <BsStar className="w-4 h-4 text-black fill-black" />
                  <span className="text-black">{book.averageRating}</span>
                  <span>({book.totalRating} ratings)</span>
                </div>
                <div className="flex items-center gap-2">
                  <BsClock className="w-4 h-4" />
                  <span>{formatDuration(audioDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMicrophone className="w-4 h-4" />
                  <span>{book.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BsLightbulb className="w-4 h-4" />
                  <span>{book.keyIdeas} Key ideas</span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-200 mb-6"></div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleReadListen}
                  disabled={subscriptionLoading && needsSubscription}
                  className={`flex items-center gap-2 bg-black text-white border border-black rounded px-6 py-3 hover:bg-gray-800 transition-colors cursor-pointer ${subscriptionLoading && needsSubscription ? "opacity-50 cursor-wait" : ""}`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                  >
                    <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z" />
                  </svg>
                  <span className="font-medium">Read</span>
                </button>
                <button
                  onClick={handleReadListen}
                  disabled={subscriptionLoading && needsSubscription}
                  className={`flex items-center gap-2 bg-black text-white border border-black rounded px-6 py-3 hover:bg-gray-800 transition-colors cursor-pointer ${subscriptionLoading && needsSubscription ? "opacity-50 cursor-wait" : ""}`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                  >
                    <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z" />
                  </svg>
                  <span className="font-medium">Listen</span>
                </button>
              </div>

              {/* MOBILE: Bookmark Button */}
              <button
                onClick={handleAddToLibrary}
                disabled={isAdding}
                className={`flex items-center gap-2 text-[#0365f2] hover:text-blue-700 mb-10 transition-colors font-bold cursor-pointer ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <BsBookmark
                  className={`w-5 h-5 ${isBookSaved ? "fill-[#0365f2] text-[#0365f2]" : ""}`}
                />
                <span className="text-sm">
                  {isBookSaved
                    ? "In My Library"
                    : isAdding
                      ? "Processing..."
                      : "Add title to My Library"}
                </span>
              </button>

              <h2 className="text-lg font-bold text-[#032b41] mb-4">
                What's it about?
              </h2>
              <div className="flex flex-wrap gap-3 mb-6">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-gray-300 text-black px-4 py-2 text-sm font-bold bg-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-10 text-sm">
                {book.bookDescription}
              </p>

              <h2 className="text-lg font-bold text-[#032b41] mb-4">
                About the author
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {book.authorDescription}
              </p>
            </div>
          </div>

          {/* Side by Side Layout (>1024px) */}
          <div className="hidden lg:flex gap-12">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#032b41] mb-2">
                {book.title}
                {showPremiumLabel && (
                  <span className="text-gray-400 font-normal ml-2">
                    (Premium)
                  </span>
                )}
              </h1>
              <p className="text-lg text-gray-600 mb-1">{book.author}</p>
              <p className="text-[18px] text-gray-500 mb-4">{book.subTitle}</p>

              <div className="w-full h-px bg-gray-200 mb-4"></div>

              <div className="flex flex-col gap-3 mb-4 text-sm text-gray-600 font-semibold">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <BsStar className="w-4 h-4 text-black fill-black" />
                    <span className="text-black">{book.averageRating}</span>
                    <span>({book.totalRating} ratings)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsClock className="w-4 h-4" />
                    <span>{formatDuration(audioDuration)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <FaMicrophone className="w-4 h-4" />
                    <span>{book.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsLightbulb className="w-4 h-4" />
                    <span>{book.keyIdeas} Key ideas</span>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-200 mb-6"></div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={handleReadListen}
                  disabled={subscriptionLoading && needsSubscription}
                  className={`flex items-center gap-2 bg-black text-white border border-black rounded px-6 py-3 hover:bg-gray-800 transition-colors cursor-pointer ${subscriptionLoading && needsSubscription ? "opacity-50 cursor-wait" : ""}`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                  >
                    <path d="M928 161H699.2c-49.1 0-97.1 14.1-138.4 40.7L512 233l-48.8-31.3A255.2 255.2 0 0 0 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.4 40.7l44.4 28.6c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.4-28.6C602 807.1 650.1 793 699.2 793H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v462c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.8-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488zM396.9 361H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm223.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c0-4.1-3.2-7.5-7.1-7.5H627.1c-3.9 0-7.1 3.4-7.1 7.5zM396.9 501H211.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5zm416 0H627.1c-3.9 0-7.1 3.4-7.1 7.5v45c0 4.1 3.2 7.5 7.1 7.5h185.7c3.9 0 7.1-3.4 7.1-7.5v-45c.1-4.1-3.1-7.5-7-7.5z" />
                  </svg>
                  <span className="font-medium">Read</span>
                </button>
                <button
                  onClick={handleReadListen}
                  disabled={subscriptionLoading && needsSubscription}
                  className={`flex items-center gap-2 bg-black text-white border border-black rounded px-6 py-3 hover:bg-gray-800 transition-colors cursor-pointer ${subscriptionLoading && needsSubscription ? "opacity-50 cursor-wait" : ""}`}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                  >
                    <path d="M842 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 140.3-113.7 254-254 254S258 594.3 258 454c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8 0 168.7 126.6 307.9 290 327.6V884H326.7c-13.7 0-24.7 14.3-24.7 32v36c0 4.4 2.8 8 6.2 8h407.6c3.4 0 6.2-3.6 6.2-8v-36c0-17.7-11-32-24.7-32H548V782.1c165.3-18 294-158 294-328.1zM512 624c93.9 0 170-75.2 170-168V232c0-92.8-76.1-168-170-168s-170 75.2-170 168v224c0 92.8 76.1 168 170 168zm-94-392c0-50.6 41.9-92 94-92s94 41.4 94 92v224c0 50.6-41.9 92-94 92s-94-41.4-94-92V232z" />
                  </svg>
                  <span className="font-medium">Listen</span>
                </button>
              </div>

              {/* DESKTOP: Bookmark Button */}
              <button
                onClick={handleAddToLibrary}
                disabled={isAdding}
                className={`flex items-center gap-2 text-[#0365f2] hover:text-blue-700 mb-10 transition-colors font-bold cursor-pointer ${isAdding ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isBookSaved ? (
                  <BsBookmarkFill className="w-5 h-5 text-[#0365f2]" />
                ) : (
                  <BsBookmark className="w-5 h-5 text-[#0365f2]" />
                )}
                <span className="text-sm">
                  {isBookSaved
                    ? "In My Library"
                    : isAdding
                      ? "Processing..."
                      : "Add title to My Library"}
                </span>
              </button>

              <h2 className="text-lg font-bold text-[#032b41] mb-4">
                What's it about?
              </h2>
              <div className="flex gap-3 mb-6">
                {book.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-gray-300 text-black px-4 py-2 text-sm font-bold bg-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-10 text-sm">
                {book.bookDescription}
              </p>

              <h2 className="text-lg font-bold text-[#032b41] mb-4">
                About the author
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {book.authorDescription}
              </p>
            </div>

            <div className="w-80 flex-shrink-0 relative">
              {showPremiumLabel && (
                <div className="absolute top-2 right-2 z-20 bg-[#032b41] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Premium
                </div>
              )}
              <BookImage
                book={book}
                className="w-full h-[420px]"
                showHoverEffect={false}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
