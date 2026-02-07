"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/store";

export default function ThemeWatcher() {
  const { theme, language } = useAppSelector(
    (state) => state.settings,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Sync Theme
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    // Sync Language/Direction
    root.setAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr",
    );
    root.setAttribute("lang", language);
  }, [theme, language]);

  return null;
}
