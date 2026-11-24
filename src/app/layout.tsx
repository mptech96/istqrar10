// src/app/layout.tsx — TRUE root layout shared by ALL routes (main app + docs).
// This is the ONLY place <html> and <body> live.
// The lang/dir attributes start as "ar" (the default locale) and are updated
// dynamically by HtmlAttrSync (main app) or DocsHtmlSync (docs).
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Istqrar",
  description: "Istqrar Inspection & Quality Auditing Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning because lang/dir are updated client-side
    // depending on the route. The initial values match the default locale (ar).
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
