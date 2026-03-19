"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Book } from "@/types";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Use ref to persist timeout across renders
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchBooks = useCallback(async (search: string) => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(search)}`,
      );
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  }, []);

  // Debounce effect - 300ms after user stops typing
  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(() => {
      searchBooks(query);
    }, 300);

    // Cleanup on unmount or query change
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchBooks]);

  return (
    <div className="flex items-center">
      {/* Search Input with Dropdown */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search for books"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-4 pr-12 bg-gray-100 border border-gray-200 rounded-lg 
                     text-sm text-gray-700 placeholder-gray-500
                     focus:outline-none focus:border-gray-300 focus:bg-white
                     transition-all duration-200"
        />

        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
          </svg>
        </div>

        {/* Search Results Dropdown */}
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
            {results.map((book) => (
              <div
                key={book.id}
                onClick={() => {
                  router.push(`/book/${book.id}`);
                  setQuery("");
                  setResults([]);
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
              >
                <img
                  src={book.imageLink}
                  alt={book.title}
                  className="w-12 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold text-[#032b41]">{book.title}</h4>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}