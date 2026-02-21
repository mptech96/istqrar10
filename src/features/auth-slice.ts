import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, deleteCookie, setCookie } from "cookies-next";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      const userCookie = getCookie("user");
      if (userCookie) {
        try {
          state.user = JSON.parse(userCookie as string) as User;
          state.isAuthenticated = true;
        } catch (e) {
          console.error("Failed to parse user cookie", e);
        }
      }
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      setCookie("user", JSON.stringify(action.payload.user), { maxAge: 60 * 60 * 24 }); // 24 hours
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      deleteCookie("user");
    },
  },
});

export const { setCredentials, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;