"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { PublicShell } from "@/components/layout/public-shell";
import { SAMPLE_MORNING_ADHKAR, SAMPLE_EVENING_ADHKAR } from "@/lib/sample-data";
import { Bookmark, Trash2, ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite, mounted } = useFavorites();

  const allAdhkar = useMemo(() => {
    return [...SAMPLE_MORNING_ADHKAR, ...SAMPLE_EVENING_ADHKAR];
  }, []);

  const favoriteList = useMemo(() => {
    return allAdhkar.filter((item) => favoriteIds.includes(item.id));
  }, [allAdhkar, favoriteIds]);

  if (!mounted) {
    return (
      <PublicShell>
        <div className="p-8 text-center text-secondary">جاري تحميل المفضلة...</div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-accent" />
            <span>محفوظاتك الشخصية</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-arabic mb-2">
            الأذكـار المحفوظـة
          </h1>
          <p className="text-secondary text-sm leading-relaxed">
            قائمتك المفضلة محفوظة في متصفحك المحلي دون الحاجة إلى إنشاء حساب أو
            تسجيل دخول.
          </p>
        </div>

        {favoriteList.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-secondary px-1">
              <span>عدد العناصر المحفوظة: {favoriteList.length}</span>
            </div>

            <div className="space-y-3">
              {favoriteList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-card border border-border-subtle rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-site text-accent text-xs font-medium border border-border-subtle">
                      {item.category === "morning" ? "أذكار الصباح" : "أذكار المساء"}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className="text-secondary hover:text-red-500 transition-colors p-1 cursor-pointer"
                      title="إزالة من المفضلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-lg md:text-xl text-primary font-medium leading-relaxed">
                    {item.text}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-xs text-secondary">
                    <span>{item.source}</span>
                    <Link
                      href={
                        item.category === "morning"
                          ? `/#dhikr-${item.id}`
                          : `/adhkar/evening#dhikr-${item.id}`
                      }
                      className="inline-flex items-center gap-1 text-accent hover:underline font-medium"
                    >
                      <span>الانتقال للذكر</span>
                      <ArrowLeft className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-card border border-border-subtle rounded-2xl text-secondary space-y-3">
            <Bookmark className="w-10 h-10 mx-auto opacity-30 text-secondary" />
            <h3 className="text-base font-bold text-primary">
              لا توجد أذكار مفضلة بعد
            </h3>
            <p className="text-xs max-w-sm mx-auto">
              اضغط على زر «المفضلة» الموجود أسفل أي ذكر لحفظه والرجوع إليه بسرعة في
              أي وقت.
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
