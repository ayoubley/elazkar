"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-border-subtle bg-site/80 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right gap-1.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="font-bold text-base text-primary font-arabic">
                الأذكــار
              </span>
            </div>
            <p className="text-xs text-secondary max-w-sm">
              منصة إسلامية متخصصة في أذكار الصباح والمساء وأذكار النوم والأدعية
              المأثورة والقرآن الكريم بتجربة قراءة هادئة ومريحة للعين.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-secondary">
            <Link href="/" className="hover:text-primary transition-colors">
              أذكار الصباح
            </Link>
            <Link
              href="/adhkar/evening"
              className="hover:text-primary transition-colors"
            >
              أذكار المساء
            </Link>
            <Link
              href="/adhkar/sleep"
              className="hover:text-primary transition-colors"
            >
              أذكار النوم
            </Link>
            <Link href="/duas" className="hover:text-primary transition-colors">
              الأدعية
            </Link>
            <Link href="/quran" className="hover:text-primary transition-colors">
              القرآن الكريم
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              من نحن
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-secondary gap-3 text-center">
          <div>
            جميع الحقوق محفوظة لمنصة{" "}
            <span className="font-semibold text-primary">الأذكــار</span> ©{" "}
            {year}
          </div>
          <div className="text-[11px] text-secondary/80">
            محتوى إسلامي موثق ومراجع لوجه الله تعالى
          </div>
        </div>
      </div>
    </footer>
  );
}
