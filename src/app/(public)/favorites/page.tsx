"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { PublicShell } from "@/components/layout/public-shell";
import { AdhkarCard } from "@/components/adhkar/adhkar-card";
import { useFontSize } from "@/hooks/use-font-size";
import {
  SAMPLE_MORNING_ADHKAR,
  SAMPLE_EVENING_ADHKAR,
  SAMPLE_SLEEP_ADHKAR,
} from "@/lib/sample-data";
import { Bookmark, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite, isFavorite, mounted } = useFavorites();
  const { getDhikrTextClass } = useFontSize();

  const allAdhkar = useMemo(() => {
    return [
      ...SAMPLE_MORNING_ADHKAR,
      ...SAMPLE_EVENING_ADHKAR,
      ...SAMPLE_SLEEP_ADHKAR,
    ];
  }, []);

  const favoriteList = useMemo(() => {
    return allAdhkar.filter((item) => favoriteIds.includes(item.id));
  }, [allAdhkar, favoriteIds]);

  if (!mounted) {
    return (
      <PublicShell>
        <div className="p-8 text-center text-secondary">
          جاري تحميل محفوظاتك...
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Banner */}
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-accent" />
            <span>محفوظاتك المفضلة</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-arabic mb-2">
            الأذكـار المحفوظـة
          </h1>
          <p className="text-secondary text-sm leading-relaxed">
            قائمتك المفضلة محفوظة في متصفحك المحلي دون الحاجة إلى إنشاء حساب أو
            تسجيل دخول، يمكنك تكرارها والاستماع إليها مباشرة من هنا.
          </p>
        </div>

        {favoriteList.length > 0 ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs text-secondary px-1">
              <span>عدد العناصر المحفوظة: {favoriteList.length}</span>
            </div>

            <div className="space-y-4">
              {favoriteList.map((item, idx) => (
                <AdhkarCard
                  key={item.id}
                  dhikr={item}
                  index={idx + 1}
                  fontSizeClass={getDhikrTextClass(item.is_quranic)}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-card border border-border-subtle rounded-2xl text-secondary space-y-3">
            <Bookmark className="w-10 h-10 mx-auto opacity-30 text-secondary" />
            <h3 className="text-base font-bold text-primary">
              لا توجد أذكار مفضلة حتى الآن
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              انقر على زر «المفضلة» الموجود أسفل أي ذكر لحفظه هنا والوصول إليه
              بسرعة في أي وقت.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-btn text-btn-text hover:bg-btn-hover text-xs font-semibold transition-colors"
              >
                تصفح أذكار الصباح
              </Link>
            </div>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
