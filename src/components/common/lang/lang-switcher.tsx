"use client";
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
import { useAppSelector } from "@/lib/store";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
const LangSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const dispatch = useDispatch();
  const { language } = useAppSelector(
    (state) => state.settings,
  );
  const toggleLanguage = (newLanguage: Language) => {
    console.log(newLanguage);
    dispatch(setLanguage(newLanguage));
    router.replace(pathname, { locale: newLanguage });
  };
  return (
    <Select
      value={language}
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
