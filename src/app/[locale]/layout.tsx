// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import StoreProvider from "@/providers/store-providers";
import ThemeWatcher from "@/providers/theme-watcher";
import "../globals.css";
import { routing } from "@/i18n/routing";
import LocaleSync from "@/providers/local-sync";
import { Toaster } from "sonner";
import Loader from "@/components/common/loader/loader";
import { DirectionProvider } from "@/components/ui/direction";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // In Next.js 16+, params is a Promise and must be awaited
  const { locale } = await params;
  // Middleware handles locale validation, so we can safely proceed
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="dark"
      style={{ colorScheme: "dark" }}
    >
      <body>
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
            <DirectionProvider
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <LocaleSync />
              <ThemeWatcher />
              <Toaster
                position={
                  locale === "ar"
                    ? "bottom-left"
                    : "bottom-right"
                }
                richColors
              />
              <Loader />
              {/* <LocaleSync /> */}

              {children}
            </DirectionProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
