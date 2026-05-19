import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely parse and format a date string.
 * Handles various input formats and returns formatted date or empty string if invalid.
 * @param dateString - The date string to parse
 * @param outputFormat - The desired output format (default: "yyyy-MM-dd")
 * @returns Formatted date string or empty string if invalid
 */
export function safeFormatDate(
  dateString: string | null | undefined | Date,
  outputFormat: string = "yyyy-MM-dd",
): string {
  if (!dateString || typeof dateString !== "string") return "";

  try {
    // Handle custom API format: "2026-05-03 | 12:05:00 AM"
    let cleanDateString = dateString;
    if (dateString.includes("|")) {
      cleanDateString = dateString.split("|")[0].trim();
    }

    // Try parsing as ISO string or timestamp first
    let date = new Date(cleanDateString);

    // If the date is invalid, try common formats
    if (!isValid(date)) {
      // Remove any timezone info and try parsing
      const dateOnly = cleanDateString.split("T")[0] || cleanDateString;
      date = new Date(dateOnly);

      if (!isValid(date)) {
        // Try parsing with common formats
        const formats = [
          "yyyy-MM-dd",
          "yyyy/MM/dd",
          "dd-MM-yyyy",
          "dd/MM/yyyy",
          "yyyy-MM-dd HH:mm:ss",
          "dd/MM/yyyy HH:mm:ss",
        ];
        for (const fmt of formats) {
          date = parse(cleanDateString, fmt, new Date());
          if (isValid(date)) break;
        }
      }
    }

    // If still invalid, return empty string
    if (!isValid(date)) return "";

    return format(date, outputFormat);
  } catch (error) {
    // If any error occurs during parsing, return empty string
    return "";
  }
}
