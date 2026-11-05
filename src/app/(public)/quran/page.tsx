"use client";

import { useState, useMemo } from "react";
import { PublicShell } from "@/components/layout/public-shell";
import { SURAH_LIST } from "@/lib/quran-surahs";
import { useQuranReader } from "@/hooks/use-quran-reader";
import {
  BookOpen,
  Search,
  Bookmark,
  ArrowLeft,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function QuranIndexPage() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "Meccan" | "Medinan">("all");
  const { lastRead, bookmarks, mounted } = useQuranReader();

  const filteredSurahs = useMemo(() => {
    return SURAH_LIST.filter((surah) => {
      const matchesQuery =
        surah.name.includes(query.trim()) ||
        surah.english_name.toLowerCase().includes(query.toLowerCase()) ||
        surah.number.toString() === query.trim();

      const matchesType =
        filterType === "all" || surah.revelation_type === filterType;

      return matchesQuery && matchesType;
    });
  }, [query, filterType]);

  return (
    <PublicShell>
      <div className="space-y-6">
        {/* Quran Header */}
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>المصحف الشريف بالرسم العثماني</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary font-arabic">
            القرآن الكريــم
          </h1>
          <p className="text-secondary text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
            فهرس سور القرآن الكريم الـ١١٤ بالرسم العثماني المعتمد، مرتبة وفق المصحف
            الشريف مع بيان عدد الآيات ومكان النزول وإمكانية حفظ مواضع القراءة.
          </p>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-secondary absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث باسم السورة أو رقمها (مثال: الكهف، 18، الملك)..."
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-site border border-border-subtle rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterType === "all"
                    ? "bg-card text-primary font-semibold shadow-xs"
                    : "text-secondary hover:text-primary"
                }`}
              >
                الكل (١١٤)
              </button>
              <button
                type="button"
                onClick={() => setFilterType("Meccan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterType === "Meccan"
                    ? "bg-card text-primary font-semibold shadow-xs"
                    : "text-secondary hover:text-primary"
                }`}
              >
                مكية
              </button>
              <button
                type="button"
                onClick={() => setFilterType("Medinan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filterType === "Medinan"
                    ? "bg-card text-primary font-semibold shadow-xs"
                    : "text-secondary hover:text-primary"
                }`}
              >
                مدنية
              </button>
            </div>
          </div>
        </div>

        {/* Continue Reading Banner */}
        {mounted && lastRead && (
          <div className="p-4 md:p-5 bg-card border border-accent/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-site border border-border-subtle flex items-center justify-center text-accent shrink-0">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xs font-semibold text-accent">
                  متابعة القراءة من حيث توقفت
                </div>
                <div className="text-sm font-bold text-primary mt-0.5">
                  سورة {lastRead.surahName} • الآية {lastRead.ayahNumber}
                </div>
              </div>
            </div>

            <Link
              href={`/quran/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-btn text-btn-text hover:bg-btn-hover text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>متابعة القراءة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Bookmarks Section (if any) */}
        {mounted && bookmarks.length > 0 && (
          <div className="p-4 bg-card border border-border-subtle rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Bookmark className="w-3.5 h-3.5 fill-accent text-accent" />
              <span>علاماتك المرجعية المحفوظة ({bookmarks.length})</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {bookmarks.map((bm) => (
                <Link
                  key={bm.id}
                  href={`/quran/${bm.surahNumber}#ayah-${bm.ayahNumber}`}
                  className="px-3 py-1.5 rounded-xl bg-site border border-border-subtle text-xs text-secondary hover:text-primary hover:border-accent/40 whitespace-nowrap transition-colors"
                >
                  سورة {bm.surahName} (آية {bm.ayahNumber})
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              href={`/quran/${surah.number}`}
              className="p-4 bg-card border border-border-subtle rounded-2xl hover:border-accent/50 hover:shadow-sm transition-all flex items-center justify-between group shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-site border border-border-subtle flex items-center justify-center font-bold text-sm text-primary group-hover:border-accent/40 transition-colors">
                  {surah.number}
                </span>
                <div>
                  <h3 className="font-bold text-base text-primary font-arabic group-hover:text-accent transition-colors">
                    سورة {surah.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-secondary mt-0.5">
                    <span>{surah.verses_count} آية</span>
                    <span>•</span>
                    <span>
                      {surah.revelation_type === "Meccan" ? "مكية" : "مدنية"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary/70 font-mono">
                  {surah.english_name}
                </span>
                <ArrowLeft className="w-4 h-4 text-secondary/50 group-hover:text-accent group-hover:-translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12 bg-card rounded-2xl border border-border-subtle text-secondary">
            لا توجد سور مطابقة لبحثك «{query}»
          </div>
        )}
      </div>
    </PublicShell>
  );
}
