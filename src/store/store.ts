import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import modalReducer from "./modalSlice";
import subscriptionReducer from "./subscriptionSlice";
import libraryReducer from "./library/librarySlice";
import { useSelector as useReduxSelector, useDispatch as useReduxDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    subscription: subscriptionReducer,
    library: libraryReducer,
  },
});

export const useAppSelector = useReduxSelector.withTypes<RootState>();
export const useAppDispatch = useReduxDispatch.withTypes<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;