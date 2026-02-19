import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Theme = "dark" | "light";
export type Language = "en" | "ar";

interface SettingsState {
  theme: Theme;
  language: Language;
}

const initialState: SettingsState = {
  theme: "dark",
  language: "ar",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    hydrateSettings: (state) => {
      if (typeof window !== "undefined") {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark" || storedTheme === "light") {
          state.theme = storedTheme;
        }

        const storedLang = localStorage.getItem("language");
        if (storedLang === "en" || storedLang === "ar") {
          state.language = storedLang;
        }
      }
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
      }
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("language", action.payload);
      }
    },
  },
});

export const { setTheme, setLanguage, hydrateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;