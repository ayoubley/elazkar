import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div className="max-w-md w-full p-8 bg-card border border-border-subtle rounded-3xl space-y-5 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-site border border-border-subtle flex items-center justify-center text-accent mx-auto">
          <BookOpen className="w-8 h-8 text-accent" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-bold font-mono text-accent">404</span>
          <h2 className="text-xl font-bold text-primary font-arabic">
            الصفحة غير موجودة
          </h2>
          <p className="text-xs text-secondary leading-relaxed">
            عذراً، الرابط الذي تبحث عنه غير متاح أو تم نقله. يمكنك العودة للصفحة
            الرئيسية وقراءة أذكار الصباح.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-btn text-btn-text hover:bg-btn-hover font-semibold text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
