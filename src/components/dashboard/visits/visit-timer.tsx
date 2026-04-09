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
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const toastFiredRef = useRef(false);

  useEffect(() => {
    // Robust date parsing (handle "YYYY-MM-DD HH:mm:ss" and add UTC intent)
    const normalizeDate = (dateStr: string) => {
      if (!dateStr) return null;
      
      // Handle local time strings from Saudi Arabia (UTC+3) 
      // by normalizing into ISO formats the browser understands as Local.
      const normalized = dateStr.replace(/ /g, "T").replace(/\//g, "-");
      
      const parsedDate = new Date(normalized);
      if (!isNaN(parsedDate.getTime())) return parsedDate;

      // Numeric timestamp support
      if (/^\d+$/.test(dateStr)) return new Date(Number(dateStr));
      
      return null;
    };

    const parsedStartTime = normalizeDate(actualStartTime);
    const durationMinutes = Number(estimatedDuration) || 60;
    const durationMs = durationMinutes * 60 * 1000;
    
    // Calculate the fixed end time once when the input data changes.
    // If the start time is missing, we calculate based on a stable launch time.
    const startTimeMs = parsedStartTime ? parsedStartTime.getTime() : Date.now();
    const endTime = startTimeMs + durationMs;

    const updateTimer = () => {
      const remaining = endTime - Date.now();
      setRemainingMs(remaining);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [actualStartTime, estimatedDuration]);

  useEffect(() => {
    if (remainingMs === null || isNaN(remainingMs)) return;
    
    if (remainingMs <= 0 && !toastFiredRef.current) {
      toast.warning(
        t("Visit time out, please complete the visit soon"),
      );
      toastFiredRef.current = true;
    }
  }, [remainingMs, t]);

  // Format Elapsed Time (MM:SS or HH:MM:SS)
  const safeRemaining = remainingMs === null || isNaN(remainingMs) ? 0 : remainingMs;
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
  } else if (remainingMs !== null && remainingMs <= estimatedDuration * 60 * 1000 * 0.2) {
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
