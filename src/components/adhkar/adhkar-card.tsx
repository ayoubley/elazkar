"use client";

import { useState, useEffect, useRef } from "react";
import { Dhikr } from "@/types/adhkar";
import {
  Copy,
  Check,
  Share2,
  Bookmark,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Info,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdhkarCardProps {
  dhikr: Dhikr;
  index: number;
  fontSizeClass?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onCountChange?: (id: string, count: number, isComplete: boolean) => void;
}

export function AdhkarCard({
  dhikr,
  index,
  fontSizeClass = "text-xl md:text-2xl leading-relaxed",
  isFavorite = false,
  onToggleFavorite,
  onCountChange,
}: AdhkarCardProps) {
  // Counter state
  const [count, setCount] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [showVirtue, setShowVirtue] = useState<boolean>(false);

  // Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const storageKey = `adhkar_counter_${dhikr.id}`;
  const isComplete = count >= dhikr.repeat_count;

  // Load saved count from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) {
          setCount(val);
          onCountChange?.(dhikr.id, val, val >= dhikr.repeat_count);
        }
      }
    } catch {
      // ignore
    }
  }, [dhikr.id, storageKey]);

  // Global audio coordinator: Stop playing if another audio starts
  useEffect(() => {
    const handleOtherAudioPlay = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id !== dhikr.id && isPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      }
    };

    window.addEventListener("adhkar_audio_play", handleOtherAudioPlay);
    return () => {
      window.removeEventListener("adhkar_audio_play", handleOtherAudioPlay);
    };
  }, [dhikr.id, isPlaying]);

  // Handle count increment
  const handleIncrement = () => {
    if (isComplete) return;

    const next = count + 1;
    setCount(next);

    try {
      sessionStorage.setItem(storageKey, next.toString());
    } catch {
      // ignore
    }

    // Gentle haptic feedback if available on mobile
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }

    onCountChange?.(dhikr.id, next, next >= dhikr.repeat_count);
  };

  // Reset counter
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(0);
    try {
      sessionStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    onCountChange?.(dhikr.id, 0, false);
  };

  // Copy pure Arabic text only
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dhikr.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: dhikr.title || `من أذكار ${dhikr.category === "morning" ? "الصباح" : "المساء"}`,
      text: `${dhikr.text}\n\n[منصة الأذكــار]`,
      url: typeof window !== "undefined" ? window.location.href : "",
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share not supported, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // ignore
    }
  };

  // Audio playback handler
  const toggleAudio = () => {
    if (!dhikr.audio_url || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Dispatch event to pause other playing items
      window.dispatchEvent(
        new CustomEvent("adhkar_audio_play", { detail: { id: dhikr.id } })
      );

      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.max(0, Math.min(1, clickX / width));
    const newTime = newProgress * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setAudioProgress(newProgress * 100);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <article
      id={`dhikr-${dhikr.id}`}
      className={cn(
        "group relative rounded-2xl border transition-all duration-200 overflow-hidden",
        "bg-card border-border-subtle shadow-xs hover:border-accent/40",
        isComplete && "ring-1 ring-accent/30 bg-card/90"
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-border-subtle/50 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-site flex items-center justify-center font-semibold text-secondary text-[11px] border border-border-subtle">
            {index}
          </span>
          {dhikr.title && (
            <h3 className="font-semibold text-primary text-sm">
              {dhikr.title}
            </h3>
          )}
          {dhikr.is_quranic && (
            <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-medium">
              نص قرآني
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isComplete ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-medium text-[11px]">
              <Check className="w-3 h-3" />
              <span>اكتمل التكرار</span>
            </span>
          ) : (
            <span className="text-secondary text-[11px]">
              التكرار المطلوب:{" "}
              <strong className="text-primary font-bold">
                {dhikr.repeat_count}
              </strong>
            </span>
          )}
        </div>
      </div>

      {/* Main Dhikr Content */}
      <div className="px-5 py-6">
        <p
          className={cn(
            "text-primary text-center font-medium select-text tracking-wide leading-relaxed",
            fontSizeClass,
            dhikr.is_quranic && "font-quran"
          )}
        >
          {dhikr.text}
        </p>

        {/* Source / Hadith Reference */}
        {(dhikr.source || dhikr.reference || dhikr.grade) && (
          <div className="mt-5 pt-4 border-t border-border-subtle/60 flex flex-wrap items-center justify-between gap-2 text-xs text-secondary">
            <div className="flex items-center gap-2 flex-wrap">
              {dhikr.source && (
                <span className="font-medium text-primary">
                  {dhikr.source}
                </span>
              )}
              {dhikr.reference && (
                <span>• {dhikr.reference}</span>
              )}
              {dhikr.grade && (
                <span className="px-2 py-0.5 rounded-md bg-site border border-border-subtle text-[11px] text-secondary">
                  {dhikr.grade}
                </span>
              )}
            </div>

            {dhikr.virtue && (
              <button
                type="button"
                onClick={() => setShowVirtue(!showVirtue)}
                className="inline-flex items-center gap-1 text-[11px] text-accent hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>{showVirtue ? "إخفاء الفضل" : "فضل الذكر"}</span>
              </button>
            )}
          </div>
        )}

        {/* Expandable Virtue Box */}
        {showVirtue && dhikr.virtue && (
          <div className="mt-3 p-3.5 rounded-xl bg-site/70 border border-border-subtle text-xs text-secondary leading-relaxed">
            <div className="flex items-center gap-1.5 font-medium text-accent mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>فضل هذا الذكر:</span>
            </div>
            <p>{dhikr.virtue}</p>
          </div>
        )}

        {/* Audio Player Component */}
        {dhikr.audio_url ? (
          <div className="mt-4 p-3 rounded-xl bg-site/60 border border-border-subtle flex flex-col sm:flex-row items-center gap-3">
            <audio
              ref={audioRef}
              src={dhikr.audio_url}
              preload="none"
              onEnded={() => {
                setIsPlaying(false);
                setAudioProgress(0);
                setCurrentTime(0);
              }}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  setDuration(audioRef.current.duration || 0);
                }
              }}
              onTimeUpdate={() => {
                if (audioRef.current) {
                  const curr = audioRef.current.currentTime;
                  const dur = audioRef.current.duration || 1;
                  setCurrentTime(curr);
                  setAudioProgress((curr / dur) * 100);
                }
              }}
            />
            <button
              type="button"
              onClick={toggleAudio}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border-subtle text-xs font-semibold text-primary hover:text-accent transition-colors cursor-pointer shrink-0"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-accent" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-accent" />
                  <span>استماع</span>
                </>
              )}
            </button>

            {/* Progress and Timeline */}
            <div
              onClick={handleSeek}
              className="flex-1 w-full h-2 bg-card rounded-full overflow-hidden border border-border-subtle cursor-pointer relative"
              title="انقر للتنقل في التلاوة"
            >
              <div
                className="h-full bg-accent transition-all duration-75"
                style={{ width: `${audioProgress}%` }}
              />
            </div>

            <div className="text-[10px] font-mono text-secondary shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer Interactive Row: Counter & Actions */}
      <div className="px-5 py-3.5 bg-site/40 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Secondary Action Buttons */}
        <div className="flex items-center gap-1 w-full sm:w-auto justify-start">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-card hover:bg-hover text-secondary hover:text-primary text-xs font-medium transition-colors cursor-pointer"
            title="نسخ نص الذكر"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent" />
                <span className="text-accent font-semibold">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-card hover:bg-hover text-secondary hover:text-primary text-xs font-medium transition-colors cursor-pointer"
            title="مشاركة الذكر"
          >
            {shared ? (
              <>
                <Check className="w-3.5 h-3.5 text-accent" />
                <span className="text-accent font-semibold">تم نسخ الرابط</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>مشاركة</span>
              </>
            )}
          </button>

          {/* Favorite Button */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(dhikr.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-card hover:bg-hover text-xs font-medium transition-colors cursor-pointer",
                isFavorite
                  ? "text-accent border-accent/40 bg-accent/10"
                  : "text-secondary hover:text-primary"
              )}
              title={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            >
              <Bookmark
                className={cn("w-3.5 h-3.5", isFavorite && "fill-accent")}
              />
              <span className="hidden sm:inline">
                {isFavorite ? "محفوظ" : "المفضلة"}
              </span>
            </button>
          )}

          {/* Reset button if started */}
          {count > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-hover border border-border-subtle cursor-pointer transition-colors"
              title="إعادة ضبط العداد"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Large Thumb-Friendly Counter Button */}
        <div className="w-full sm:w-auto flex items-center justify-end">
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isComplete}
            className={cn(
              "w-full sm:w-44 py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-150 cursor-pointer select-none active:scale-95 shadow-xs",
              isComplete
                ? "bg-accent/20 text-accent border border-accent/40 cursor-default"
                : "bg-btn text-btn-text hover:bg-btn-hover hover:shadow-md"
            )}
            aria-label={`تكرار الذكر، تم ${count} من ${dhikr.repeat_count}`}
          >
            {isComplete ? (
              <>
                <Check className="w-4 h-4" />
                <span className="text-sm">اكتمل ({dhikr.repeat_count})</span>
              </>
            ) : (
              <>
                <span className="text-base tracking-wider font-mono">
                  {count} / {dhikr.repeat_count}
                </span>
                <span className="text-xs font-medium opacity-90 border-r border-current/30 pr-2">
                  اضغط للتكرار
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
