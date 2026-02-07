// components/LocaleSync.tsx
"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux"; // Your Redux hooks
import {
  setLanguage,
  type Language,
} from "@/features/setting-slice";

export default function LocaleSync() {
  const locale = useLocale();
  const dispatch = useDispatch();

  useEffect(() => {
    // Sync URL locale to Redux store
    dispatch(setLanguage(locale as Language));
  }, [locale, dispatch]);

  return null;
}
