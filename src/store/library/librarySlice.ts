import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserBook } from '@/types';

interface LibraryState {
  savedBooks: UserBook[];
  finishedBooks: UserBook[];
  loading: boolean;
  error: string | null;
}

const initialState: LibraryState = {
  savedBooks: [],
  finishedBooks: [],
  loading: false,
  error: null,
};

// Helper to get user library ref
const getUserLibraryRef = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return doc(db, 'userLibraries', user.uid);
};

// Load user's library
export const loadLibrary = createAsyncThunk(
  'library/load',
  async (_, { rejectWithValue }) => {
    try {
      const libraryRef = getUserLibraryRef();
      const snapshot = await getDoc(libraryRef);
      
      if (!snapshot.exists()) {
        await setDoc(libraryRef, {
          savedBooks: [],
          finishedBooks: [],
          updatedAt: Timestamp.now(),
        });
        return { savedBooks: [], finishedBooks: [] };
      }
      
      const data = snapshot.data();
      return {
        savedBooks: data.savedBooks || [],
        finishedBooks: data.finishedBooks || [],
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add book to library
export const addToLibrary = createAsyncThunk(
  'library/add',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const libraryRef = getUserLibraryRef();
      const snapshot = await getDoc(libraryRef);
      
      const userBook: UserBook = {
        bookId,
        savedAt: new Date().toISOString(),
        currentTime: 0,
        duration: 0,
        finished: false,
        lastAccessedAt: new Date().toISOString(),
      };
      
      if (!snapshot.exists()) {
        await setDoc(libraryRef, {
          savedBooks: [userBook],
          finishedBooks: [],
          updatedAt: Timestamp.now(),
        });
      } else {
        const data = snapshot.data();
        const savedBooks = data.savedBooks || [];
        
        // Check if already saved
        if (!savedBooks.find((b: UserBook) => b.bookId === bookId)) {
          // Use spread instead of arrayUnion for complex objects
          await updateDoc(libraryRef, {
            savedBooks: [...savedBooks, userBook],
            updatedAt: Timestamp.now(),
          });
        }
      }
      
      return userBook;
    } catch (error: any) {
      console.error('Error adding to library:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Remove book from library
export const removeFromLibrary = createAsyncThunk(
  'library/remove',
  async (bookId: string, { rejectWithValue }) => {
    try {
      const libraryRef = getUserLibraryRef();
      const snapshot = await getDoc(libraryRef);
      
      if (!snapshot.exists()) return bookId;
      
      const data = snapshot.data();
      const savedBooks = data.savedBooks || [];
      const updatedBooks = savedBooks.filter((b: UserBook) => b.bookId !== bookId);
      
      await updateDoc(libraryRef, {
        savedBooks: updatedBooks,
        updatedAt: Timestamp.now(),
      });
      
      return bookId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update book progress
export const updateBookProgress = createAsyncThunk(
  'library/updateProgress',
  async ({ bookId, currentTime, duration }: { bookId: string; currentTime: number; duration: number }, { rejectWithValue }) => {
    try {
      const libraryRef = getUserLibraryRef();
      const snapshot = await getDoc(libraryRef);
      
      if (!snapshot.exists()) throw new Error('Library not found');
      
      const data = snapshot.data();
      const savedBooks = data.savedBooks || [];
      const finishedBooks = data.finishedBooks || [];
      
      let newlyFinished: UserBook | null = null;
      
      const updatedBooks = savedBooks.map((book: UserBook) => {
        if (book.bookId === bookId) {
          const isFinished = duration > 0 && currentTime >= duration - 10;
          const updatedBook = {
            ...book,
            currentTime,
            duration,
            finished: isFinished,
            finishedAt: isFinished && !book.finished ? new Date().toISOString() : book.finishedAt,
            lastAccessedAt: new Date().toISOString(),
          };
          
          if (isFinished && !book.finished) {
            newlyFinished = updatedBook;
          }
          
          return updatedBook;
        }
        return book;
      });
      
      const updatedFinishedBooks = newlyFinished 
        ? [...finishedBooks, newlyFinished]
        : finishedBooks;
      
      await updateDoc(libraryRef, {
        savedBooks: updatedBooks,
        finishedBooks: updatedFinishedBooks,
        updatedAt: Timestamp.now(),
      });
      
      return { bookId, currentTime, duration, finished: !!newlyFinished };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadLibrary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadLibrary.fulfilled, (state, action) => {
        state.loading = false;
        state.savedBooks = action.payload.savedBooks;
        state.finishedBooks = action.payload.finishedBooks;
      })
      .addCase(loadLibrary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToLibrary.fulfilled, (state, action) => {
        state.savedBooks.push(action.payload);
      })
      .addCase(removeFromLibrary.fulfilled, (state, action) => {
        state.savedBooks = state.savedBooks.filter(b => b.bookId !== action.payload);
      })
      .addCase(updateBookProgress.fulfilled, (state, action) => {
        const { bookId, currentTime, duration, finished } = action.payload;
        const book = state.savedBooks.find(b => b.bookId === bookId);
        if (book) {
          book.currentTime = currentTime;
          book.duration = duration;
          if (finished) {
            book.finished = true;
            book.finishedAt = new Date().toISOString();
            state.finishedBooks.push(book);
          }
        }
      });
  },
});

export default librarySlice.reducer;