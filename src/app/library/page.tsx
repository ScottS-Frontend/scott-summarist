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
import { BsTrash, BsList } from "react-icons/bs";

interface BookWithProgress extends Book {
  currentTime?: number;
  duration?: number;
  finished?: boolean;
}

export default function LibraryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { savedBooks, finishedBooks, loading } = useSelector((state: RootState) => state.library);
  
  const [savedBooksData, setSavedBooksData] = useState<BookWithProgress[]>([]);
  const [finishedBooksData, setFinishedBooksData] = useState<BookWithProgress[]>([]);
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

      const allBookIds = [...new Set([...savedBooks.map(b => b.bookId), ...finishedBooks.map(b => b.bookId)])];
      
      try {
        const booksData = await Promise.all(
          allBookIds.map(async (bookId) => {
            const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${bookId}`);
            return res.json();
          })
        );

        // Merge book data with progress - ONLY include unfinished books in saved
        const savedWithProgress = savedBooks
          .filter(saved => !saved.finished)
          .map(saved => ({
            ...booksData.find(b => b.id === saved.bookId),
            currentTime: saved.currentTime,
            duration: saved.duration,
            finished: saved.finished,
          })).filter(Boolean);

        const finishedWithProgress = finishedBooks.map(finished => ({
          ...booksData.find(b => b.id === finished.bookId),
          currentTime: finished.currentTime,
          duration: finished.duration,
          finished: true,
        })).filter(Boolean);

        setSavedBooksData(savedWithProgress);
        setFinishedBooksData(finishedWithProgress);
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
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(book.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from library"
                    >
                      <BsTrash className="w-4 h-4" />
                    </button>
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