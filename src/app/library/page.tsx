"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/store/store";
import { loadLibrary, removeFromLibrary } from "@/store/library/librarySlice";
import { openModal } from "@/store/modalSlice";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/BookCard";
import SkeletonLibrary from "@/components/SkeletonLibrary";
import { Book } from "@/types";
import { BsList } from "react-icons/bs";

interface BookWithProgress extends Book {
  currentTime?: number;
  duration?: number;
  finished?: boolean;
}

export default function LibraryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { savedBooks, finishedBooks, loading } = useSelector(
    (state: RootState) => state.library,
  );

  const [savedBooksData, setSavedBooksData] = useState<BookWithProgress[]>([]);
  const [finishedBooksData, setFinishedBooksData] = useState<
    BookWithProgress[]
  >([]);
  const [fetchingBooks, setFetchingBooks] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      dispatch(openModal("login"));
      router.push("/");
    }
  }, [user, loading, dispatch, router]);

  // Load library data
  useEffect(() => {
    if (user) {
      dispatch(loadLibrary());
    }
  }, [user, dispatch]);

  // Fetch full book data for saved books
  useEffect(() => {
    const fetchBooks = async () => {
      if (!savedBooks.length && !finishedBooks.length) {
        setFetchingBooks(false);
        return;
      }

      // Filter out invalid book IDs
      const validSavedBooks = savedBooks.filter(
        (b) => b.bookId && typeof b.bookId === "string",
      );
      const validFinishedBooks = finishedBooks.filter(
        (b) => b.bookId && typeof b.bookId === "string",
      );

      const allBookIds = [
        ...new Set([
          ...validSavedBooks.map((b) => b.bookId),
          ...validFinishedBooks.map((b) => b.bookId),
        ]),
      ].filter((id) => id);

      if (allBookIds.length === 0) {
        setFetchingBooks(false);
        return;
      }

      try {
        const booksData = await Promise.all(
          allBookIds.map(async (bookId) => {
            try {
              const res = await fetch(
                `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`,
              );
              const text = await res.text();
              if (!text || text.trim() === "") return null;
              try {
                return JSON.parse(text);
              } catch (parseErr) {
                return null;
              }
            } catch (err) {
              return null;
            }
          }),
        );

        const validBooksData = booksData.filter(Boolean);

        const savedWithProgress = validSavedBooks
          .filter((saved) => !saved.finished)
          .map((saved) => {
            const bookData = validBooksData.find((b) => b?.id === saved.bookId);
            if (!bookData) return null;
            return {
              ...bookData,
              currentTime: saved.currentTime,
              duration: saved.duration,
              finished: saved.finished,
            };
          })
          .filter(Boolean) as BookWithProgress[];

        const finishedWithProgress = validFinishedBooks
          .map((finished) => {
            const bookData = validBooksData.find(
              (b) => b?.id === finished.bookId,
            );
            if (!bookData) return null;
            return {
              ...bookData,
              currentTime: finished.currentTime,
              duration: finished.duration,
              finished: true,
            };
          })
          .filter(Boolean) as BookWithProgress[];

        // Remove duplicates (book in both arrays)
        const savedIds = new Set(savedWithProgress.map((b) => b.id));
        const uniqueFinished = finishedWithProgress.filter(
          (b) => !savedIds.has(b.id),
        );

        setSavedBooksData(savedWithProgress);
        setFinishedBooksData(uniqueFinished);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
      setFetchingBooks(false);
    };

    if (savedBooks.length || finishedBooks.length) {
      fetchBooks();
    } else {
      setFetchingBooks(false);
    }
  }, [savedBooks, finishedBooks]);

  const handleRemove = (bookId: string) => {
    dispatch(removeFromLibrary(bookId));
  };

  if (loading || fetchingBooks) {
    return <SkeletonLibrary />;
  }

  return (
    <div className="flex min-h-screen bg-[#f7faf9] overflow-x-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 md:ml-64 min-w-0 w-full">
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-8 py-4 z-10 shadow-sm flex items-center justify-end">
          <SearchBar />

          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-[#032b41] hover:bg-gray-100 rounded-lg ml-4 flex-shrink-0"
          >
            <BsList className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {/* Saved Books Section */}
          <section className="mb-12 lg:mb-16">
            <h2 className="text-lg lg:text-[22px] font-bold text-[#032b41] mb-4 lg:mb-6">
              Saved Books ({savedBooksData.length})
            </h2>
            {savedBooksData.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
                {savedBooksData.map((book) => (
                  <div key={book.id} className="relative group">
                    <BookCard book={book} />                    
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 mb-4">Your saved books is empty</p>
                <button
                  onClick={() => router.push("/for-you")}
                  className="bg-[#2bd97c] hover:bg-[#20ba68] text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Discover Books
                </button>
              </div>
            )}
          </section>

          {/* Finished Books Section */}
          {finishedBooksData.length > 0 && (
            <section className="mb-12 lg:mb-16">
              <h2 className="text-lg lg:text-[22px] font-bold text-[#032b41] mb-4 lg:mb-6">
                Finished Books ({finishedBooksData.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
                {finishedBooksData.map((book) => (
                  <div key={book.id} className="relative">
                    <BookCard book={book} />
                    <div className="absolute top-2 left-2 bg-[#2bd97c] text-white text-xs font-bold px-2 py-1 rounded">
                      Finished
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
