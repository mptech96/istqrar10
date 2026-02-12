import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, deleteCookie, setCookie } from "cookies-next";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Check cookie on load (Client-side only)
const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? (getCookie("token") as string) || null : null,
  isAuthenticated: typeof window !== "undefined" ? !!getCookie("token") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Save to cookie so Middleware and Store (on refresh) can see it
      setCookie("token", action.payload.token, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      deleteCookie("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;