import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Removes Arabic diacritics (tashkeel) and normalizes common letter variations
 * for clean, accurate searching without affecting display text.
 */
export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    // Remove diacritics (harakat / tashkeel)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    // Normalize alef forms (أ, إ, آ => ا)
    .replace(/[أإآء]/g, "ا")
    // Normalize taa marbuta (ة => ه)
    .replace(/ة/g, "ه")
    // Normalize alef maqsura (ى => ي)
    .replace(/ى/g, "ي")
    .trim()
    .toLowerCase();
}
