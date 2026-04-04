"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function TimePicker({
  value,
  onChange,
  className,
  disabled,
}: TimePickerProps) {
  // Graceful fallback if value is empty or malformed
  const safeValue = value || "12:00";
  const [h, m] = safeValue.split(":");

  const hourRef = React.useRef<HTMLInputElement>(null);

  const handleHourChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let newH = e.target.value.replace(/[^0-9]/g, "");

    // Only allow max 2 chars
    if (newH.length > 2) newH = newH.slice(0, 2);

    if (newH.length === 2) {
      if (parseInt(newH, 10) > 23) {
        newH = "23";
      }
    }

    onChange(`${newH}:${m}`);
  };

  const handleHourBlur = () => {
    let newH = parseInt(h || "0", 10);
    if (isNaN(newH)) newH = 0;
    if (newH > 23) newH = 23;
    onChange(`${newH.toString().padStart(2, "0")}:${m}`);
  };

  const handleMinuteChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let newM = e.target.value.replace(/[^0-9]/g, "");

    // Only allow max 2 chars
    if (newM.length > 2) newM = newM.slice(0, 2);

    // Auto-advance if 2 digits entered
    if (newM.length === 2) {
      if (parseInt(newM, 10) > 59) {
        newM = "59";
      }
      hourRef.current?.focus();
    }

    onChange(`${h}:${newM}`);
  };

  const handleMinuteBlur = () => {
    let newM = parseInt(m || "0", 10);
    if (isNaN(newM)) newM = 0;
    if (newM > 59) newM = 59;
    onChange(`${h}:${newM.toString().padStart(2, "0")}`);
  };

  return (
    <div
      className={cn("flex items-center gap-2", className)}
    >
      <Input
        value={m}
        onChange={handleMinuteChange}
        onBlur={handleMinuteBlur}
        className="w-16 text-center text-base"
        placeholder="mm"
        disabled={disabled}
        aria-label="Minutes"
        type="number"
      />
      <span className="text-muted-foreground font-bold pb-1">
        :
      </span>
      <Input
        ref={hourRef}
        value={h}
        onChange={handleHourChange}
        onBlur={handleHourBlur}
        className="w-16 text-center text-base"
        placeholder="HH"
        disabled={disabled}
        aria-label="Hours"
        type="number"
      />
    </div>
  );
}
