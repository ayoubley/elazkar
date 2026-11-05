"use client";

import { useEffect, useState } from "react";
import { FontSizePreference } from "@/types/adhkar";

const STORAGE_KEY = "al_adhkar_font_size";

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSizePreference>("md");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as FontSizePreference | null;
      if (saved && ["sm", "md", "lg", "xl"].includes(saved)) {
        setFontSize(saved);
      }
    } catch {
      // LocalStorage unavailable
    }
    setMounted(true);
  }, []);

  const changeFontSize = (size: FontSizePreference) => {
    setFontSize(size);
    try {
      localStorage.setItem(STORAGE_KEY, size);
    } catch {
      // ignore
    }
  };

  const getDhikrTextClass = (isQuranic = false) => {
    if (isQuranic) {
      switch (fontSize) {
        case "sm":
          return "text-lg md:text-xl font-quran leading-[2.2]";
        case "md":
          return "text-xl md:text-2xl font-quran leading-[2.4]";
        case "lg":
          return "text-2xl md:text-3xl font-quran leading-[2.6]";
        case "xl":
          return "text-3xl md:text-4xl font-quran leading-[2.8]";
      }
    }

    switch (fontSize) {
      case "sm":
        return "text-base md:text-lg leading-relaxed";
      case "md":
        return "text-lg md:text-xl leading-relaxed";
      case "lg":
        return "text-xl md:text-2xl leading-loose";
      case "xl":
        return "text-2xl md:text-3xl leading-loose";
    }
  };

  return { fontSize, changeFontSize, getDhikrTextClass, mounted };
}
