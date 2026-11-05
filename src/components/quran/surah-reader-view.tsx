"use client";

import { useState, useEffect } from "react";
import { SurahDetail, AyahItem } from "@/lib/quran/service";
import { useQuranReader } from "@/hooks/use-quran-reader";
import { FontSizeController } from "@/components/adhkar/font-size-controller";
import { useFontSize } from "@/hooks/use-font-size";
import {
  BookOpen,
  Bookmark,
  Copy,
  Check,
  Share2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

interface SurahReaderViewProps {
  surah: SurahDetail;
}

export function SurahReaderView({ surah }: SurahReaderViewProps) {
  const { fontSize, changeFontSize } = useFontSize();
  const { saveLastRead, toggleBookmark, isBookmarked } = useQuranReader();
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);
  const [sharedAyah, setSharedAyah] = useState<number | null>(null);

  // Automatically save current surah as last read when opened
  useEffect(() => {
    saveLastRead({
      surahNumber: surah.number,
      surahName: surah.name,
      ayahNumber: 1,
    });
  }, [surah.number, surah.name]);

  const handleCopyAyah = async (ayah: AyahItem) => {
    const text = `${ayah.text} ﴿${ayah.numberInSurah}﴾ [سورة ${surah.name}]`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAyah(ayah.numberInSurah);
      setTimeout(() => setCopiedAyah(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleShareAyah = async (ayah: AyahItem) => {
    const text = `${ayah.text} ﴿${ayah.numberInSurah}﴾ [سورة ${surah.name}]`;
    const url = typeof window !== "undefined" ? `${window.location.href}#ayah-${ayah.numberInSurah}` : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: `سورة ${surah.name} - آية ${ayah.numberInSurah}`,
          text,
          url,
        });
        return;
      } catch {
        // fallback
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setSharedAyah(ayah.numberInSurah);
      setTimeout(() => setSharedAyah(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleBookmarkClick = (ayah: AyahItem) => {
    toggleBookmark({
      surahNumber: surah.number,
      surahName: surah.name,
      ayahNumber: ayah.numberInSurah,
      textSnippet: ayah.text.slice(0, 60),
    });
    saveLastRead({
      surahNumber: surah.number,
      surahName: surah.name,
      ayahNumber: ayah.numberInSurah,
    });
  };

  const getQuranTextSize = () => {
    switch (fontSize) {
      case "sm":
        return "text-xl md:text-2xl leading-[2.3]";
      case "md":
        return "text-2xl md:text-3xl leading-[2.5]";
      case "lg":
        return "text-3xl md:text-4xl leading-[2.8]";
      case "xl":
        return "text-4xl md:text-5xl leading-[3.1]";
    }
  };

  const prevSurahNumber = surah.number > 1 ? surah.number - 1 : null;
  const nextSurahNumber = surah.number < 114 ? surah.number + 1 : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Bar */}
      <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-3xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link
            href="/quran"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>فهرس السور</span>
          </Link>

          <FontSizeController
            currentSize={fontSize}
            onChange={changeFontSize}
          />
        </div>

        {/* Surah Title Banner */}
        <div className="text-center space-y-2 py-4 border-y border-border-subtle/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
            <span>سورة رقم {surah.number}</span>
            <span>•</span>
            <span>{surah.revelationType === "Meccan" ? "مكية" : "مدنية"}</span>
            <span>•</span>
            <span>{surah.numberOfAyahs} آية</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold font-arabic text-primary">
            سورة {surah.name}
          </h1>
          <p className="text-xs text-secondary font-mono">
            {surah.englishName}
          </p>
        </div>

        {/* Basmala */}
        {surah.bismillahPre && (
          <div className="text-center pt-6 pb-2">
            <p className="font-quran text-2xl md:text-3xl text-primary font-medium">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}
      </div>

      {/* Ayahs Display */}
      {surah.ayahs.length > 0 ? (
        <div className="p-6 md:p-10 bg-card border border-border-subtle rounded-3xl space-y-8 shadow-xs">
          <div className="space-y-6 divide-y divide-border-subtle/50">
            {surah.ayahs.map((ayah) => {
              const bookmarked = isBookmarked(surah.number, ayah.numberInSurah);
              const isCopied = copiedAyah === ayah.numberInSurah;
              const isShared = sharedAyah === ayah.numberInSurah;

              return (
                <div
                  key={ayah.numberInSurah}
                  id={`ayah-${ayah.numberInSurah}`}
                  className="pt-6 first:pt-0 space-y-3 group"
                >
                  {/* Ayah Text */}
                  <p
                    className={`font-quran text-primary text-justify text-right select-text ${getQuranTextSize()}`}
                  >
                    {ayah.text}{" "}
                    <span className="inline-flex items-center justify-center text-accent font-arabic font-normal text-sm md:text-base mx-1 px-1 align-middle select-none">
                      ﴿{ayah.numberInSurah}﴾
                    </span>
                  </p>

                  {/* Actions Bar for each Ayah */}
                  <div className="flex items-center justify-between text-xs text-secondary pt-2">
                    <span className="font-mono text-[11px] text-secondary/70">
                      آية {ayah.numberInSurah}
                    </span>

                    <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Copy */}
                      <button
                        type="button"
                        onClick={() => handleCopyAyah(ayah)}
                        className="p-1.5 rounded-lg border border-border-subtle hover:bg-site hover:text-primary transition-colors cursor-pointer"
                        title="نسخ الآية"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={() => handleShareAyah(ayah)}
                        className="p-1.5 rounded-lg border border-border-subtle hover:bg-site hover:text-primary transition-colors cursor-pointer"
                        title="مشاركة الآية"
                      >
                        {isShared ? (
                          <Check className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Bookmark */}
                      <button
                        type="button"
                        onClick={() => handleBookmarkClick(ayah)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          bookmarked
                            ? "bg-accent/15 border-accent/40 text-accent"
                            : "border-border-subtle hover:bg-site hover:text-primary"
                        }`}
                        title={
                          bookmarked
                            ? "إزالة العلامة المرجعية"
                            : "حفظ علامة مرجعية هنا"
                        }
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            bookmarked ? "fill-accent" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-card border border-border-subtle rounded-3xl space-y-3">
          <Info className="w-10 h-10 text-accent mx-auto" />
          <h2 className="text-lg font-bold text-primary">
            بيانات السورة قيد التحميل المعتمد
          </h2>
          <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
            وفقاً لضوابط المنصة الصارمة، لا يتم عرض أي نصوص غير موثقة. يرجى
            التأكد من اتصال الإنترنت لجلب المصحف الشريف بالرسم العثماني.
          </p>
        </div>
      )}

      {/* Surah Navigation (Prev / Next) */}
      <div className="flex items-center justify-between gap-4 p-4 bg-card border border-border-subtle rounded-2xl">
        {nextSurahNumber ? (
          <Link
            href={`/quran/${nextSurahNumber}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-site border border-border-subtle text-secondary hover:text-primary text-xs font-semibold transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السورة التالية</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/quran"
          className="text-xs text-secondary hover:text-primary font-medium"
        >
          فهرس المصحف
        </Link>

        {prevSurahNumber ? (
          <Link
            href={`/quran/${prevSurahNumber}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-site border border-border-subtle text-secondary hover:text-primary text-xs font-semibold transition-colors"
          >
            <span>السورة السابقة</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
