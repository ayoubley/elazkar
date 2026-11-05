"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";

interface AdhkarProgressProps {
  completedCount: number;
  totalCount: number;
  onResetAll?: () => void;
}

export function AdhkarProgress({
  completedCount,
  totalCount,
  onResetAll,
}: AdhkarProgressProps) {
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="p-4 bg-card border border-border-subtle rounded-2xl mb-6 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-primary">
            إنجاز الأذكار:
          </span>
          <span className="text-xs text-secondary">
            أتممت{" "}
            <strong className="text-primary font-bold">
              {completedCount}
            </strong>{" "}
            من أصل{" "}
            <strong className="text-primary font-bold">{totalCount}</strong> ذكراً
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-accent">
            {percentage}%
          </span>
          {completedCount > 0 && onResetAll && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1 text-[11px] text-secondary hover:text-primary hover:bg-hover px-2 py-1 rounded-md border border-border-subtle transition-colors cursor-pointer"
              title="بدء جلسة أذكار جديدة وتصفير العدادات"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة البدء</span>
            </button>
          )}
        </div>
      </div>

      <div className="w-full h-2 bg-site rounded-full overflow-hidden border border-border-subtle/50">
        <div
          className="h-full bg-accent transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
