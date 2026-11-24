"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export function DocsLanguageSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const isArabic = pathname.startsWith("/docs/ar");

  const toggleLanguage = () => {
    if (isArabic) {
      document.cookie = "NEXT_LOCALE=en; path=/; max-age=31536000; SameSite=Lax";
      // /docs/ar  → /docs/en
      // /docs/ar/features/visits → /docs/en/features/visits
      const enPath = pathname.replace(/^\/docs\/ar/, "/docs/en");
      router.push(enPath || "/docs/en");
    } else {
      document.cookie = "NEXT_LOCALE=ar; path=/; max-age=31536000; SameSite=Lax";
      // /docs/en  → /docs/ar
      // /docs/en/features/visits → /docs/ar/features/visits
      const arPath = pathname.replace(/^\/docs\/en/, "/docs/ar");
      router.push(arPath || "/docs/ar");
    }
  };

  const label = isArabic ? "EN" : "AR";
  const title = isArabic ? "Switch to English" : "التبديل إلى العربية";

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-foreground"
      title={title}
      aria-label={title}
    >
      <Globe className="w-3.5 h-3.5 text-primary" />
    </button>
  );
}
