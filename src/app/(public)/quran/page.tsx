"use client";

import { useState, useMemo } from "react";
import { PublicShell } from "@/components/layout/public-shell";
import { SURAH_LIST } from "@/lib/quran-surahs";
import { BookOpen, Search, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";

export default function QuranIndexPage() {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "Meccan" | "Medinan">("all");

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
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>المصحف الشريف</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary font-arabic">
            القرآن الكريــم
          </h1>
          <p className="text-secondary text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
            فهرس سور القرآن الكريم الـ١١٤ بالرسم العثماني المعتمد، مرتبة وفق المصحف
            الشريف مع بيان عدد الآيات ومكان النزول.
          </p>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-secondary absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث باسم السورة أو رقمها (مثال: الكهف، 18)..."
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

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              className="p-4 bg-card border border-border-subtle rounded-xl hover:border-accent/40 transition-all flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-9 h-9 rounded-lg bg-site border border-border-subtle flex items-center justify-center font-bold text-xs text-primary group-hover:border-accent/40">
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

              <span className="text-xs text-secondary/70 font-mono">
                {surah.english_name}
              </span>
            </div>
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
