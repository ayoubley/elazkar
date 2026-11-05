"use client";

import { useState, useMemo } from "react";
import { PublicShell } from "@/components/layout/public-shell";
import { DUA_CATEGORIES, AUTHENTIC_DUAS, DuaItem } from "@/lib/duas/data";
import { FontSizeController } from "@/components/adhkar/font-size-controller";
import { useFontSize } from "@/hooks/use-font-size";
import { useFavorites } from "@/hooks/use-favorites";
import { normalizeArabicText } from "@/lib/utils";
import {
  HeartHandshake,
  Search,
  Copy,
  Check,
  Share2,
  Bookmark,
  Info,
  Sparkles,
} from "lucide-react";

export default function DuasPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [expandedExplanation, setExpandedExplanation] = useState<
    Record<string, boolean>
  >({});

  const { fontSize, changeFontSize, getDhikrTextClass } = useFontSize();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredDuas = useMemo(() => {
    return AUTHENTIC_DUAS.filter((dua) => {
      const matchesCategory =
        selectedCategory === "all" || dua.categorySlug === selectedCategory;

      const normalizedQuery = normalizeArabicText(searchQuery);
      const matchesSearch =
        !searchQuery.trim() ||
        normalizeArabicText(dua.text).includes(normalizedQuery) ||
        normalizeArabicText(dua.title).includes(normalizedQuery) ||
        normalizeArabicText(dua.category).includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async (dua: DuaItem) => {
    const shareData = {
      title: dua.title,
      text: `${dua.text}\n\n[المصدر: ${dua.source} - ${dua.reference}]\n[منصة الأذكــار]`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // fallback
      }
    }

    try {
      await navigator.clipboard.writeText(
        `${shareData.text}\n${shareData.url}`
      );
      setSharedId(dua.id);
      setTimeout(() => setSharedId(null), 2000);
    } catch {
      // fallback
    }
  };

  const toggleExplanation = (id: string) => {
    setExpandedExplanation((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PublicShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Banner */}
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>الأدعية المأثورة الموثقة</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary font-arabic">
                الأدعيـة من الكتـاب والسنـة
              </h1>
              <p className="text-secondary text-sm md:text-base max-w-2xl leading-relaxed">
                «وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ» — أدعية مباركة
                مأثورة من القرآن الكريم والحديث الصحيح مرتبة بالأبواب والمقاصد.
              </p>
            </div>

            {/* Font Size Tool */}
            <div className="shrink-0 self-start md:self-center">
              <FontSizeController
                currentSize={fontSize}
                onChange={changeFontSize}
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mt-6">
            <Search className="w-4 h-4 text-secondary absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الأدعية (مثال: الاستغفار، الرزق، الهم، الوالدين)..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-site border border-border-subtle text-primary placeholder:text-secondary/70 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-4">
            {DUA_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.slug
                    ? "bg-site border-accent/40 text-primary font-bold shadow-xs"
                    : "bg-site/60 border-border-subtle text-secondary hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Duas List */}
        <div className="space-y-4">
          {filteredDuas.map((dua, idx) => {
            const isFav = isFavorite(`dua-${dua.id}`);
            const isCopied = copiedId === dua.id;
            const isShared = sharedId === dua.id;
            const showExp = Boolean(expandedExplanation[dua.id]);

            return (
              <article
                key={dua.id}
                id={dua.id}
                className="p-6 bg-card border border-border-subtle rounded-2xl shadow-xs space-y-4 hover:border-accent/40 transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between text-xs border-b border-border-subtle/50 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-site flex items-center justify-center font-bold text-secondary text-[11px] border border-border-subtle">
                      {idx + 1}
                    </span>
                    <h2 className="font-bold text-sm text-primary">
                      {dua.title}
                    </h2>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-site text-accent border border-border-subtle text-[11px] font-medium">
                    {dua.category}
                  </span>
                </div>

                {/* Main Dua Text */}
                <p
                  className={`text-primary text-center font-medium leading-relaxed py-2 select-text ${getDhikrTextClass(
                    dua.isQuranic
                  )}`}
                >
                  {dua.text}
                </p>

                {/* Source & Actions */}
                <div className="pt-3 border-t border-border-subtle/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-secondary flex-wrap">
                    <span className="font-semibold text-primary">
                      {dua.source}
                    </span>
                    <span>• {dua.reference}</span>
                    {dua.explanation && (
                      <button
                        type="button"
                        onClick={() => toggleExplanation(dua.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline cursor-pointer mr-2"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{showExp ? "إخفاء الشرح" : "شرح وفضل الدعاء"}</span>
                      </button>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopy(dua.id, dua.text)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-subtle bg-site hover:bg-hover text-secondary hover:text-primary transition-colors cursor-pointer"
                      title="نسخ الدعاء"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-accent" />
                          <span className="text-accent font-semibold">
                            تم النسخ
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(dua)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-subtle bg-site hover:bg-hover text-secondary hover:text-primary transition-colors cursor-pointer"
                      title="مشاركة الدعاء"
                    >
                      {isShared ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-accent" />
                          <span className="text-accent font-semibold">
                            تم نسخ الرابط
                          </span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>مشاركة</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(`dua-${dua.id}`)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-subtle bg-site hover:bg-hover transition-colors cursor-pointer ${
                        isFav
                          ? "text-accent border-accent/40 bg-accent/10"
                          : "text-secondary hover:text-primary"
                      }`}
                      title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${isFav ? "fill-accent" : ""}`}
                      />
                      <span>{isFav ? "محفوظ" : "المفضلة"}</span>
                    </button>
                  </div>
                </div>

                {/* Explanation Box */}
                {showExp && dua.explanation && (
                  <div className="p-3.5 rounded-xl bg-site/70 border border-border-subtle text-xs text-secondary leading-relaxed">
                    <div className="flex items-center gap-1 text-accent font-medium mb-1">
                      <Info className="w-3.5 h-3.5" />
                      <span>بيان وفضل هذا الدعاء:</span>
                    </div>
                    <p>{dua.explanation}</p>
                  </div>
                )}
              </article>
            );
          })}

          {filteredDuas.length === 0 && (
            <div className="p-12 text-center bg-card border border-border-subtle rounded-2xl text-secondary">
              لا توجد أدعية مطابقة لبحثك «{searchQuery}»
            </div>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
