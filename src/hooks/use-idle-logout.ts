"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { logout as logoutAction } from "@/features/auth-slice";
import { useLogoutMutation } from "@/services/api/auth";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const IDLE_TIMEOUT = 60 * 60 * 1000; // 1 hour in ms

export function useIdleLogout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutApi] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const t = useTranslations();
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      await logoutApi({}).unwrap();
    } catch (error) {
      console.error("Auto-logout API call failed", error);
    } finally {
      dispatch(logoutAction());
      toast.info(t("Session expired due to inactivity"));
      router.push("/login");
    }
  }, [isAuthenticated, logoutApi, dispatch, router, t]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(handleLogout, IDLE_TIMEOUT);
    }
  }, [isAuthenticated, handleLogout]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const resetTimerOnActivity = () => {
      resetTimer();
    };

    // Initial set
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimerOnActivity);
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimerOnActivity);
      });
    };
  }, [isAuthenticated, resetTimer]);
}
