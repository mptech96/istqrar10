import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Theme = "dark" | "light";
export type Language = "en" | "ar";

interface SettingsState {
  theme: Theme;
  language: Language;
}

const isBrowser = typeof window !== "undefined";

// Helper to get browser language
const getBrowserLanguage = (): Language => {
  if (!isBrowser) return "ar";
  
  const browserLang = navigator.language || navigator.languages?.[0];
  // Check if browser language starts with 'ar' (e.g., 'ar', 'ar-EG', 'ar-SA')
  if (browserLang?.startsWith('ar')) {
    return "ar";
  }
  // Check if it starts with 'en'
  if (browserLang?.startsWith('en')) {
    return "en";
  }
  // Default fallback
  return "ar";
};

const getInitialState = (): SettingsState => {
  if (!isBrowser) {
    return { theme: "dark", language: "ar" };
  }
  
  const storedTheme = localStorage.getItem("theme");
  const theme: Theme = (storedTheme === "dark" || storedTheme === "light") 
    ? storedTheme 
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "dark";
  
  const storedLang = localStorage.getItem("language");
  const language: Language = (storedLang === "en" || storedLang === "ar") 
    ? storedLang 
    : getBrowserLanguage(); // ← Use browser language detection
  
  return { theme, language };
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: getInitialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      if (isBrowser) {
        localStorage.setItem("theme", action.payload);
      }
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      if (isBrowser) {
        localStorage.setItem("language", action.payload);
      }
    },
  },
});

export const { setTheme, setLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;