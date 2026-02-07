// lib/store.ts
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "@/features/setting-slice";
import loadingReducer from "@/features/loading-slice";
import api from "@/services/api"; // Your RTK Query API
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const makeStore = () => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
      [api.reducerPath]: api.reducer, // Add RTK Query reducer
      loading: loadingReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware), // Add RTK Query middleware
  });
};

// Infer types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];




// Custom hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;