"use client";

import { useState, useMemo } from "react";
import { PublicShell } from "@/components/layout/public-shell";
import { SAMPLE_MORNING_ADHKAR, SAMPLE_EVENING_ADHKAR } from "@/lib/sample-data";
import { SURAH_LIST } from "@/lib/quran-surahs";
import { normalizeArabicText } from "@/lib/utils";
import { Search, X, BookOpen, Sun, Moon, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SearchResultItem {
  id: string;
  type: "أذكار الصباح" | "أذكار المساء" | "القرآن الكريم";
  title: string;
  text: string;
  href: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const results: SearchResultItem[] = useMemo(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return [];

    const normalizedQuery = normalizeArabicText(trimmed);
    const list: SearchResultItem[] = [];

    // Search morning adhkar
    SAMPLE_MORNING_ADHKAR.forEach((item) => {
      const matchText =
        normalizeArabicText(item.text).includes(normalizedQuery) ||
        (item.title && normalizeArabicText(item.title).includes(normalizedQuery));
      if (matchText) {
        list.push({
          id: item.id,
          type: "أذكار الصباح",
          title: item.title || "ذكر من أذكار الصباح",
          text: item.text,
          href: `/#dhikr-${item.id}`,
        });
      }
    });

    // Search evening adhkar
    SAMPLE_EVENING_ADHKAR.forEach((item) => {
      const matchText =
        normalizeArabicText(item.text).includes(normalizedQuery) ||
        (item.title && normalizeArabicText(item.title).includes(normalizedQuery));
      if (matchText) {
        list.push({
          id: item.id,
          type: "أذكار المساء",
          title: item.title || "ذكر من أذكار المساء",
          text: item.text,
          href: `/adhkar/evening#dhikr-${item.id}`,
        });
      }
    });

    // Search Surahs
    SURAH_LIST.forEach((surah) => {
      const match =
        normalizeArabicText(surah.name).includes(normalizedQuery) ||
        surah.english_name.toLowerCase().includes(normalizedQuery);
      if (match) {
        list.push({
          id: `surah-${surah.number}`,
          type: "القرآن الكريم",
          title: `سورة ${surah.name}`,
          text: `سورة ${surah.revelation_type === "Meccan" ? "مكية" : "مدنية"}، عدد آياتها ${surah.verses_count} آية، ترتيبها بالمصحف ${surah.number}.`,
          href: `/quran`,
        });
      }
    });

    return list;
  }, [searchTerm]);

  return (
    <PublicShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header Banner */}
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-arabic mb-2">
            البحث في المنصـة
          </h1>
          <p className="text-secondary text-sm">
            ابحث في أذكار الصباح والمساء، الأدعية المأثورة، وسور القرآن الكريم مع
            تجاهل التشكيل التلقائي.
          </p>

          {/* Search Box */}
          <div className="relative mt-6">
            <Search className="w-5 h-5 text-secondary absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="اكتب كلمة للبحث (مثال: الكرسي، ربي، استغفار، الفاتحة)..."
              className="w-full pr-12 pl-10 py-3.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/70 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-1 cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {searchTerm.trim() ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-secondary px-1">
              <span>نتائج البحث لـ «{searchTerm}»</span>
              <span>{results.length} نتيجة</span>
            </div>

            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((res) => (
                  <Link
                    key={res.id}
                    href={res.href}
                    className="block p-5 bg-card border border-border-subtle hover:border-accent/50 rounded-2xl transition-all shadow-xs group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-site text-accent border border-border-subtle text-[11px] font-semibold">
                          {res.type}
                        </span>
                        <h3 className="font-bold text-base text-primary group-hover:text-accent transition-colors">
                          {res.title}
                        </h3>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-secondary group-hover:text-accent group-hover:-translate-x-1 transition-all" />
                    </div>
                    <p className="text-secondary text-sm line-clamp-2 leading-relaxed">
                      {res.text}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-card border border-border-subtle rounded-2xl text-secondary space-y-2">
                <Search className="w-8 h-8 mx-auto opacity-40 text-secondary" />
                <p className="text-base font-semibold text-primary">
                  لم يتم العثور على نتائج
                </p>
                <p className="text-xs">
                  جرب البحث بكلمات أبسط أو راجع الحروف دون زوائد.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center bg-card/60 border border-border-subtle rounded-2xl text-secondary text-xs">
            اكتب في مربع البحث بالأعلى لعرض النتائج مباشرة.
          </div>
        )}
      </div>
    </PublicShell>
  );
}
