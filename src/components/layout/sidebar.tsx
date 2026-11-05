"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Bed, HeartHandshake, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const SECTIONS = [
  {
    href: "/",
    label: "أذكار الصباح",
    icon: Sun,
    badge: "الرئيسية",
    description: "تبدأ بعد صلاة الفجر حتى طلوع الشمس",
  },
  {
    href: "/adhkar/evening",
    label: "أذكار المساء",
    icon: Moon,
    badge: "مساءً",
    description: "تبدأ بعد صلاة العصر حتى غروب الشمس",
  },
  {
    href: "/adhkar/sleep",
    label: "أذكار النوم",
    icon: Bed,
    badge: "ليلاً",
    description: "تقال عند الإيواء إلى الفراش",
  },
  {
    href: "/duas",
    label: "أدعية",
    icon: HeartHandshake,
    badge: "مأثورة",
    description: "أدعية من القرآن والسنة لمختلف الأحوال",
  },
  {
    href: "/quran",
    label: "القرآن الكريم",
    icon: BookOpen,
    badge: "١١٤ سورة",
    description: "قراءة المصحف الشريف بالرسم العثماني",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="sticky top-24 space-y-4">
        {/* Navigation Card */}
        <div className="p-3 bg-card border border-border-subtle rounded-2xl shadow-xs">
          <div className="px-3 py-2 text-xs font-semibold text-secondary flex items-center justify-between">
            <span>أقسام الأذكار والقرآن</span>
            <span className="w-2 h-2 rounded-full bg-accent" />
          </div>

          <nav className="mt-1 space-y-1">
            {SECTIONS.map((section) => {
              const isActive =
                section.href === "/"
                  ? pathname === "/"
                  : pathname === section.href ||
                    pathname.startsWith(section.href + "/");
              const Icon = section.icon;

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={cn(
                    "group flex items-center justify-between p-3 rounded-xl transition-all duration-150 text-right",
                    isActive
                      ? "bg-site border border-accent/30 text-primary shadow-xs font-medium"
                      : "text-secondary hover:text-primary hover:bg-hover border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                        isActive
                          ? "bg-accent/15 text-accent"
                          : "bg-site/60 text-secondary group-hover:text-primary"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium leading-none">
                        {section.label}
                      </div>
                      <div className="text-[11px] text-secondary/80 mt-1 line-clamp-1">
                        {section.description}
                      </div>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-md font-normal",
                      isActive
                        ? "bg-accent/15 text-accent font-medium"
                        : "bg-site/80 text-secondary"
                    )}
                  >
                    {section.badge}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Daily Hadith / Virtue Box */}
        <div className="p-4 bg-card/60 border border-border-subtle rounded-2xl text-xs space-y-2">
          <div className="flex items-center gap-2 text-accent font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>فضل المداومة على الأذكار</span>
          </div>
          <p className="text-secondary leading-relaxed text-[12px]">
            قال رسول الله ﷺ: «مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ
            رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ»
          </p>
          <div className="text-[10px] text-secondary/70 text-left">
            رواه البخاري (6407)
          </div>
        </div>
      </div>
    </aside>
  );
}
