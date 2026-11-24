"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  setLanguage,
  type Language,
} from "@/features/setting-slice";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useDispatch } from "react-redux";
import { useLocale, useTranslations } from "next-intl";

const LangSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = (newLanguage: Language) => {
    dispatch(setLanguage(newLanguage));
    router.replace(pathname, { locale: newLanguage });
  };

  // Render static placeholder during SSR to prevent Radix dynamic ID hydration mismatch
  if (!mounted) {
    return (
      <div className="w-[60px] h-9 px-3 py-2 text-sm bg-transparent border-0 flex items-center justify-between text-muted-foreground select-none">
        <span>{t(locale)}</span>
      </div>
    );
  }

  return (
    <Select
      value={locale}
      onValueChange={(value) =>
        toggleLanguage(value as Language)
      }
    >
      <SelectTrigger className="w-[60px] bg-transparent border-0 focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder={t("language")} />
      </SelectTrigger>
      <SelectContent className="mt-10 w-20">
        <SelectItem value="ar">{t("ar")}</SelectItem>
        <SelectItem value="en">{t("en")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LangSwitcher;
