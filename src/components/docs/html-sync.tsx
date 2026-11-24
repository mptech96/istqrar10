"use client";

// Updates <html lang> and <html dir> when inside the docs.
// Since we share one root <html> (in src/app/layout.tsx) across the whole app,
// the docs need to patch these attributes to match their locale on mount.
import { useEffect } from "react";

export function DocsHtmlSync({ lang, dir }: { lang: string; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = dir;
    if (lang === "ar") {
      html.classList.add("font-din");
    } else {
      html.classList.remove("font-din");
    }
    // Cleanup: restore app default when leaving docs via client navigation
    return () => {
      // Will be overwritten by LocaleSync in [locale]/layout.tsx anyway
    };
  }, [lang, dir]);

  return null;
}
