"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface VisitTimerProps {
  actualStartTime: string;
  estimatedDuration?: number; // In minutes
  compact?: boolean;
}

export function VisitTimer({
  actualStartTime,
  estimatedDuration = 60,
  compact = false,
}: VisitTimerProps) {
  const t = useTranslations();
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const toastFiredRef = useRef(false);

  useEffect(() => {
    // Robust date parsing (handle "YYYY-MM-DD HH:mm:ss" and add UTC intent)
    const normalizeDate = (dateStr: string) => {
      if (!dateStr) return new Date();
      
      // If it's already a Date object (not expected here based on types but for safety)
      // or looks like a ISO string with T, new Date() is usually fine.
      let normalized = dateStr.replace(" ", "T");
      
      // If the string is just "YY-MM-DD HH:mm:ss", ensure we can parse it.
      // Many browsers fail on "2024-05-20T14:30:00" without timezone
      // We add "Z" to assume UTC if no offset is present.
      if (
        !normalized.endsWith("Z") &&
        !normalized.match(/[\+\-]\d{2}:\d{2}$/) &&
        normalized.includes("T")
      ) {
        normalized += "Z";
      }
      
      const parsedDate = new Date(normalized);
      // Fallback for cases like "2024-05-20 14:30:00" failing if the browser is strict
      if (isNaN(parsedDate.getTime())) {
        // Try fallback parsing for common date-only or time-only strings
        return new Date(); 
      }
      return parsedDate;
    };

    const parsedStartTime = normalizeDate(actualStartTime);
    const startTimeMs = parsedStartTime.getTime();
    
    // Safety check: if startTime is NaN, use 0
    const safeStartTime = isNaN(startTimeMs) ? Date.now() : startTimeMs;
    const durationMs = (Number(estimatedDuration) || 60) * 60 * 1000;
    const endTime = safeStartTime + durationMs;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = endTime - now;
      // Ensure we don't set NaN
      setRemainingMs(isNaN(remaining) ? 0 : remaining);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [actualStartTime, estimatedDuration]);

  useEffect(() => {
    if (isNaN(remainingMs)) return;
    
    if (remainingMs <= 0 && !toastFiredRef.current) {
      toast.warning(
        t("Visit time out, please complete the visit soon"),
      );
      toastFiredRef.current = true;
    }
  }, [remainingMs, t]);

  // Format Elapsed Time (MM:SS or HH:MM:SS)
  const safeRemaining = isNaN(remainingMs) ? 0 : remainingMs;
  const absRemaining = Math.abs(safeRemaining);
  const totalSeconds = Math.floor(absRemaining / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const isOverdue = safeRemaining < 0;
  const timeString =
    h > 0
      ? `${isOverdue ? "-" : ""}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${isOverdue ? "-" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  // Determine UX color logic
  let variant: "default" | "secondary" | "destructive" = "default";

  if (isOverdue) {
    variant = "destructive"; // Time is up (Red)
  } else if (remainingMs <= estimatedDuration * 60 * 1000 * 0.2) {
    variant = "secondary"; // Less than 20% remaining
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 leading-none">
        <span
          className={cn(
            "font-mono text-xs font-bold tabular-nums",
            isOverdue ? "text-destructive" : "text-primary",
          )}
        >
          {timeString}
        </span>
        <span className="text-[10px] text-muted-foreground opacity-60">
          / {estimatedDuration} min
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-start">
      <Badge variant={variant} className="font-mono text-sm tracking-wider">
        {timeString}
      </Badge>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        / {estimatedDuration} {t("min")}
      </span>
    </div>
  );
}
