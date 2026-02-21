"use client";
import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useDispatch } from "react-redux"; // Your Redux hooks
import {
  setLanguage,
  hydrateSettings,
  type Language,
} from "@/features/setting-slice";
import { hydrateAuth } from "@/features/auth-slice";

export default function LocaleSync() {
  const locale = useLocale();
  const dispatch = useDispatch();
  useEffect(() => {
    // Sync URL locale to Redux store
    dispatch(setLanguage(locale as Language));
    // Hydrate state from browser storage
    dispatch(hydrateSettings());
    dispatch(hydrateAuth());
  }, [locale, dispatch]);

  return null;
}
