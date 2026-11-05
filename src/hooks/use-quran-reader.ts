"use client";

import { useState, useEffect } from "react";

const LAST_READ_KEY = "al_adhkar_last_read";
const BOOKMARKS_KEY = "al_adhkar_quran_bookmarks";

export interface LastReadPosition {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
}

export interface QuranBookmark {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  textSnippet: string;
  timestamp: number;
}

export function useQuranReader() {
  const [lastRead, setLastRead] = useState<LastReadPosition | null>(null);
  const [bookmarks, setBookmarks] = useState<QuranBookmark[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLast = localStorage.getItem(LAST_READ_KEY);
      if (savedLast) {
        setLastRead(JSON.parse(savedLast));
      }

      const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const saveLastRead = (pos: Omit<LastReadPosition, "timestamp">) => {
    const data: LastReadPosition = {
      ...pos,
      timestamp: Date.now(),
    };
    setLastRead(data);
    try {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  const toggleBookmark = (bm: Omit<QuranBookmark, "id" | "timestamp">) => {
    const id = `${bm.surahNumber}-${bm.ayahNumber}`;
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === id);
      const next = exists
        ? prev.filter((b) => b.id !== id)
        : [{ ...bm, id, timestamp: Date.now() }, ...prev];

      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isBookmarked = (surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );
  };

  return {
    lastRead,
    bookmarks,
    saveLastRead,
    toggleBookmark,
    isBookmarked,
    mounted,
  };
}
