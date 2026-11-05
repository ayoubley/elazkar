"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTIONS } from "./sidebar";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6">
      <div className="flex items-center gap-2 min-w-max pb-1">
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
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all whitespace-nowrap",
                isActive
                  ? "bg-card border-accent/40 text-primary shadow-xs"
                  : "bg-card/40 border-border-subtle text-secondary hover:text-primary hover:bg-hover"
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5",
                  isActive ? "text-accent" : "text-secondary"
                )}
              />
              <span>{section.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
