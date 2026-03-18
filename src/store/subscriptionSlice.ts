import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth } from 'firebase/auth';
import { doc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SubscriptionState {
  subscription: any | null;
  loading: boolean;
  error: string | null;
  processing: boolean;
}

const initialState: SubscriptionState = {
  subscription: null,
  loading: false,
  error: null,
  processing: false,
};

// Helper to serialize Firestore data
const serializeSubscription = (data: any) => {
  return {
    id: data.id,
    status: data.status,
    price_id: data.price_id,
    product_id: data.product_id,
    current_period_start: data.current_period_start?.toDate?.().toISOString() || data.current_period_start,
    current_period_end: data.current_period_end?.toDate?.().toISOString() || data.current_period_end,
    created: data.created?.toDate?.().toISOString() || data.created,
    cancel_at_period_end: data.cancel_at_period_end,
    canceled_at: data.canceled_at?.toDate?.().toISOString() || data.canceled_at,
    role: data.role,
    metadata: data.metadata,
    prices: [], // Don't include prices array from subscription
  };
};

export const loadSubscription = createAsyncThunk(
  'subscription/load',
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return null;
      
      const userRef = doc(db, 'users', user.uid);
      const subscriptionsRef = collection(userRef, 'subscriptions');
      const snapshot = await getDocs(subscriptionsRef);
      
      if (snapshot.empty) return null;
      
      const subscriptions = snapshot.docs.map(doc => {
        const data = doc.data();
        return serializeSubscription({
          id: doc.id,
          ...data
        });
      });
      
      return subscriptions.find(sub => 
        sub.status === 'active' || sub.status === 'trialing'
      ) || null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const startCheckout = createAsyncThunk(
  'subscription/checkout',
  async (priceId: string, { rejectWithValue }) => {
    try {
      const { createCheckoutSession } = await import('@/lib/payments');
      await createCheckoutSession(priceId);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(loadSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(startCheckout.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(startCheckout.fulfilled, (state) => {
        state.processing = false;
      })
      .addCase(startCheckout.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
