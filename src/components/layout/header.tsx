"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import {
  Home,
  Search,
  Bookmark,
  Info,
  Mail,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية", icon: Home },
  { href: "/search", label: "البحث", icon: Search },
  { href: "/favorites", label: "المفضلة", icon: Bookmark },
  { href: "/about", label: "من نحن", icon: Info },
  { href: "/contact", label: "تواصل معنا", icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-site/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md py-1"
            >
              <div className="w-9 h-9 rounded-lg bg-card border border-border-subtle flex items-center justify-center text-accent group-hover:border-accent/40 transition-colors">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-primary font-arabic">
                  الأذكــار
                </span>
                <span className="text-[10px] text-secondary -mt-1 hidden sm:block">
                  أذكار وأدعية مأثورة
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 mr-4">
              {NAV_LINKS.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-card text-primary border border-border-subtle shadow-xs"
                        : "text-secondary hover:text-primary hover:bg-hover"
                    )}
                  >
                    <Icon className="w-4 h-4 opacity-75" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Left Actions (RTL: appears on the left side of header) */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-border-subtle bg-card text-primary hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer/Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-subtle bg-site px-4 pt-2 pb-4 space-y-1">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-base font-medium transition-colors",
                  isActive
                    ? "bg-card text-primary border border-border-subtle font-semibold"
                    : "text-secondary hover:text-primary hover:bg-hover"
                )}
              >
                <Icon className="w-5 h-5 opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
