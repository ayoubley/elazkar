"use client";

import { useState, useCallback } from "react";
import { Dhikr } from "@/types/adhkar";
import { AdhkarCard } from "./adhkar-card";
import { FontSizeController } from "./font-size-controller";
import { AdhkarProgress } from "./adhkar-progress";
import { useFontSize } from "@/hooks/use-font-size";
import { useFavorites } from "@/hooks/use-favorites";
import { Sparkles, Sun, Moon, Bed, ShieldAlert } from "lucide-react";

interface AdhkarListViewProps {
  title: string;
  subtitle: string;
  category: "morning" | "evening" | "sleep";
  adhkar: Dhikr[];
}

export function AdhkarListView({
  title,
  subtitle,
  category,
  adhkar,
}: AdhkarListViewProps) {
  const { fontSize, changeFontSize, getDhikrTextClass } = useFontSize();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Completed tracking
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});

  const handleCountChange = useCallback(
    (id: string, _count: number, isComplete: boolean) => {
      setCompletedIds((prev) => {
        if (prev[id] === isComplete) return prev;
        return { ...prev, [id]: isComplete };
      });
    },
    []
  );

  const completedTotal = Object.values(completedIds).filter(Boolean).length;

  const handleResetAll = () => {
    if (typeof window !== "undefined") {
      adhkar.forEach((item) => {
        try {
          sessionStorage.removeItem(`adhkar_counter_${item.id}`);
        } catch {
          // ignore
        }
      });
      setCompletedIds({});
      // Force reload state cleanly
      window.location.reload();
    }
  };

  const CategoryIcon =
    category === "morning" ? Sun : category === "evening" ? Moon : Bed;

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>
                {category === "morning"
                  ? "أذكار الصباح اليومية"
                  : category === "evening"
                  ? "أذكار المساء اليومية"
                  : "أذكار النوم والاستعداد"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-primary font-arabic">
              {title}
            </h1>
            <p className="text-sm md:text-base text-secondary max-w-2xl leading-relaxed">
              {subtitle}
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
      </div>

      {/* Phase Disclaimer Badge */}
      <div className="px-4 py-2.5 rounded-xl bg-site border border-border-subtle text-xs text-secondary flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent shrink-0" />
          <span>
            <strong>المرحلة الأولى:</strong> واجهة وتصميم تفاعلي مع نصوص تجريبية
            معتمدة تمهيداً لربط قاعدة البيانات في المرحلة التالية.
          </span>
        </div>
        <span className="text-[10px] text-accent font-medium hidden sm:inline">
          جاهز للمعاينة والاختبار
        </span>
      </div>

      {/* Progress tracker */}
      <AdhkarProgress
        completedCount={completedTotal}
        totalCount={adhkar.length}
        onResetAll={handleResetAll}
      />

      {/* Adhkar Cards */}
      <div className="space-y-5">
        {adhkar.map((item, idx) => (
          <AdhkarCard
            key={item.id}
            dhikr={item}
            index={idx + 1}
            fontSizeClass={getDhikrTextClass(item.is_quranic)}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={toggleFavorite}
            onCountChange={handleCountChange}
          />
        ))}
      </div>
    </div>
  );
}
