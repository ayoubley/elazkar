"use client";

import { FontSizePreference } from "@/types/adhkar";
import { Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface FontSizeControllerProps {
  currentSize: FontSizePreference;
  onChange: (size: FontSizePreference) => void;
}

const SIZES: { id: FontSizePreference; label: string; iconSize: string }[] = [
  { id: "sm", label: "صغير", iconSize: "text-xs" },
  { id: "md", label: "متوسط", iconSize: "text-sm" },
  { id: "lg", label: "كبير", iconSize: "text-base" },
  { id: "xl", label: "كبير جداً", iconSize: "text-lg font-bold" },
];

export function FontSizeController({
  currentSize,
  onChange,
}: FontSizeControllerProps) {
  return (
    <div className="inline-flex items-center gap-1.5 p-1 bg-card border border-border-subtle rounded-xl text-xs">
      <div className="flex items-center gap-1 px-2 text-secondary">
        <Type className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">الخط:</span>
      </div>
      <div className="flex items-center gap-0.5">
        {SIZES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer",
              currentSize === s.id
                ? "bg-site text-primary border border-border-subtle shadow-xs font-semibold"
                : "text-secondary hover:text-primary hover:bg-hover"
            )}
            title={`تغيير حجم الخط إلى ${s.label}`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
