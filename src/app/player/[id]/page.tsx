"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Book } from "@/types";
import { RootState, AppDispatch } from "@/store/store";
import { openModal } from "@/store/modalSlice";
import { loadLibrary, updateBookProgress } from "@/store/library/librarySlice";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  BsPlayFill,
  BsPauseFill,
  BsArrowCounterclockwise,
  BsArrowClockwise,
  BsList,
} from "react-icons/bs";

export default function PlayerPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { savedBooks } = useSelector((state: RootState) => state.library);
  const [book, setBook] = useState<Book | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [fontSize, setFontSize] = useState<
    "small" | "medium" | "large" | "xlarge"
  >("medium");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if this book is in user's library
  const savedBook = savedBooks.find((b) => b.bookId === id);
  const isInLibrary = !!savedBook;

  // Fetch book data
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

  // Load library and restore progress
  useEffect(() => {
    if (user) {
      dispatch(loadLibrary());
    }
  }, [user, dispatch]);

  // Restore saved progress when audio loads
  useEffect(() => {
    if (savedBook && audioRef.current && savedBook.currentTime > 0) {
      audioRef.current.currentTime = savedBook.currentTime;
      setCurrentTime(savedBook.currentTime);
    }
  }, [savedBook]);

  // Load font size preference
  useEffect(() => {
    const saved = localStorage.getItem("playerFontSize");
    if (saved) {
      setFontSize(saved as "small" | "medium" | "large" | "xlarge");
    }
  }, []);

  // Save progress periodically
  useEffect(() => {
    if (!user || !book || !audioRef.current) return;

    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        dispatch(
          updateBookProgress({
            bookId: book.id,
            currentTime: audioRef.current.currentTime,
            duration: audioRef.current.duration || 0,
          }),
        );
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [user, book, isPlaying, dispatch]);

  const handleFontSizeChange = (
    size: "small" | "medium" | "large" | "xlarge",
  ) => {
    setFontSize(size);
    localStorage.setItem("playerFontSize", size);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  // Handle audio ended - mark as finished
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (user && book && audioRef.current) {
      dispatch(
        updateBookProgress({
          bookId: book.id,
          currentTime: audioRef.current.duration,
          duration: audioRef.current.duration,
        }),
      );
    }
  }, [user, book, dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onFontSizeChange={handleFontSizeChange}
          currentFontSize={fontSize}
        />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-[#032b41] text-xl">Loading...</div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onFontSizeChange={handleFontSizeChange}
          currentFontSize={fontSize}
        />
        <main className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-[#032b41] text-xl">Book not found</div>
        </main>
      </div>
    );
  }

  // Check access after loading
  const isGuest = user?.email === "guest@gmail.com";
  const needsSubscription = book.subscriptionRequired === true;
  const isLoggedIn = !!user;
  const hasAccess = !needsSubscription || (isLoggedIn && !isGuest);

  // Show access denied screen
  if (!hasAccess) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onFontSizeChange={handleFontSizeChange}
          currentFontSize={fontSize}
        />
        <main className="flex-1 ml-64 flex flex-col items-center justify-center p-8">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-[#032b41] mb-4">
              {!isLoggedIn ? "Login Required" : "Premium Content"}
            </h2>
            <p className="text-gray-600 mb-6">
              {!isLoggedIn
                ? "Please log in to access this book."
                : "This book requires a premium subscription. Upgrade your plan to access this content."}
            </p>
            {!isLoggedIn ? (
              <Button
                onClick={() => dispatch(openModal("login"))}
                className="bg-[#032b41] text-white"
              >
                Login
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/choose-plan")}
                className="bg-[#2bd97c] hover:bg-[#20ba68] text-white"
              >
                Upgrade to Premium
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="ml-4"
            >
              Go Back
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onFontSizeChange={handleFontSizeChange}
        currentFontSize={fontSize}
      />

      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative w-full min-w-0">
        {/* Search Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 z-50 shadow-sm flex items-center justify-end">
          <SearchBar />

          {/* Hamburger - Mobile Only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-[#032b41] hover:bg-gray-100 rounded-lg ml-4 flex-shrink-0"
          >
            <BsList className="w-6 h-6" />
          </button>
        </header>

        {/* Summary Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full pb-24">
          <div className="audio__book--summary">
            <div className="audio__book--summary-title font-bold text-xl mb-4 text-[#032b41]">
              {book.title || "Unknown Title"}
            </div>
            <div
              className={`audio__book--summary-text text-gray-700 leading-relaxed whitespace-pre-line ${
                fontSize === "small"
                  ? "text-sm"
                  : fontSize === "medium"
                    ? "text-base"
                    : fontSize === "large"
                      ? "text-lg"
                      : "text-xl"
              }`}
            >
              {book.summary || "No summary available."}
            </div>
          </div>
        </div>

        {/* Audio Player - Fixed at bottom, full width */}
        <div className="fixed bottom-0 left-0 right-0 w-screen bg-[#042330] px-8 py-3 z-50">
          <audio
            ref={audioRef}
            src={book.audioLink || ""}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
          />

          <div className="flex items-center justify-between h-12">
            {/* Left side - Book image and details */}
            <div className="flex items-center gap-3 w-64">
              <div className="w-12 h-12">
                {book.imageLink ? (
                  <img
                    src={book.imageLink}
                    alt={book.title || "Book cover"}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 rounded flex items-center justify-center text-white text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-white text-sm truncate">
                  {book.title || "Unknown Title"}
                </div>
                <div className="text-gray-400 text-xs truncate">
                  {book.author || "Unknown Author"}
                </div>
              </div>
            </div>

            {/* Center - Controls (vertically centered) */}
            <div className="flex items-center justify-center gap-2">
              {/* Skip back 10s */}
              <button
                onClick={() => skipTime(-10)}
                className="relative p-1 hover:bg-gray-800 rounded-full transition-colors text-white flex items-center justify-center"
                title="Skip back 10s"
              >
                <BsArrowCounterclockwise className="w-7 h-7" />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold pt-0.5">
                  10
                </span>
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-all shadow-md"
              >
                {isPlaying ? (
                  <BsPauseFill className="w-5 h-5" />
                ) : (
                  <BsPlayFill className="w-5 h-5 ml-0.5" />
                )}
              </button>

              {/* Skip forward 10s */}
              <button
                onClick={() => skipTime(10)}
                className="relative p-1 hover:bg-gray-800 rounded-full transition-colors text-white flex items-center justify-center"
                title="Skip ahead 10s"
              >
                <BsArrowClockwise className="w-7 h-7" />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold pt-0.5">
                  10
                </span>
              </button>
            </div>

            {/* Right side - Progress bar with time */}
            <div className="flex items-center gap-3 w-80">
              <span className="text-xs text-gray-400">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#2bd97c]"
              />
              <span className="text-xs text-gray-400">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
