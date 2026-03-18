import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import modalReducer from "./modalSlice";
import subscriptionReducer from "./subscriptionSlice";
import libraryReducer from "./library/librarySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    subscription: subscriptionReducer,
    library: libraryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;