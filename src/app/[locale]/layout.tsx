// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import StoreProvider from "@/providers/store-providers";
import ThemeWatcher from "@/providers/theme-watcher";
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
  params: Promise<{ locale?: string }>;
}) {
  // In Next.js 16+, params is a Promise and must be awaited
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "ar";
  // Middleware handles locale validation, so we can safely proceed
  const messages = await getMessages();

  return (
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
          {children}
        </DirectionProvider>
      </StoreProvider>
    </NextIntlClientProvider>
  );
}
