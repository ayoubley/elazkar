import { createClient } from "@/lib/supabase/server";
import { verifySiteOwner } from "@/lib/auth/owner";
import { logoutOwnerAction } from "./login/actions";
import {
  Sun,
  Moon,
  Bed,
  HeartHandshake,
  BookOpen,
  FileText,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { isOwner, email } = await verifySiteOwner();

  // If Supabase is configured and user is not verified owner, redirect
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && !isOwner) {
    redirect("/admin/login");
  }

  // Fetch real counts if Supabase is connected
  let stats = {
    morningCount: 7,
    eveningCount: 3,
    sleepCount: 2,
    duasCount: 3,
    surahsCount: 114,
    publishedCount: 15,
    draftsCount: 0,
    categoriesCount: 7,
  };

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const [
        { count: morning },
        { count: evening },
        { count: sleep },
        { count: duas },
        { count: published },
        { count: drafts },
      ] = await Promise.all([
        supabase.from("adhkar").select("*", { count: "exact", head: true }).eq("category_slug", "morning"),
        supabase.from("adhkar").select("*", { count: "exact", head: true }).eq("category_slug", "evening"),
        supabase.from("adhkar").select("*", { count: "exact", head: true }).eq("category_slug", "sleep"),
        supabase.from("duas").select("*", { count: "exact", head: true }),
        supabase.from("adhkar").select("*", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("adhkar").select("*", { count: "exact", head: true }).eq("status", "draft"),
      ]);

      if (morning !== null) stats.morningCount = morning;
      if (evening !== null) stats.eveningCount = evening;
      if (sleep !== null) stats.sleepCount = sleep;
      if (duas !== null) stats.duasCount = duas;
      if (published !== null) stats.publishedCount = (published || 0) + (duas || 0);
      if (drafts !== null) stats.draftsCount = drafts || 0;
    } catch {
      // Graceful fallback to initial seed stats
    }
  }

  const statCards = [
    { title: "أذكار الصباح", count: stats.morningCount, icon: Sun, color: "text-amber-500" },
    { title: "أذكار المساء", count: stats.eveningCount, icon: Moon, color: "text-indigo-400" },
    { title: "أذكار النوم", count: stats.sleepCount, icon: Bed, color: "text-blue-400" },
    { title: "الأدعية المأثورة", count: stats.duasCount, icon: HeartHandshake, color: "text-rose-400" },
    { title: "سور القرآن الكريم", count: stats.surahsCount, icon: BookOpen, color: "text-emerald-500" },
    { title: "إجمالي التصنيفات", count: stats.categoriesCount, icon: Layers, color: "text-purple-400" },
    { title: "المحتوى المنشور", count: stats.publishedCount, icon: CheckCircle2, color: "text-accent" },
    { title: "المسودات", count: stats.draftsCount, icon: Clock, color: "text-secondary" },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Top Banner */}
      <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة تحكم المالك الوحيد</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-arabic">
            نظـرة عامـة على المنصـة
          </h1>
          <p className="text-xs text-secondary">
            مرحباً بك {email ? `(${email})` : "يا مالك الموقع"} • جميع الصلاحيات
            محمية عبر سياسات RLS وقاعدة بيانات Supabase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-site border border-border-subtle text-secondary hover:text-primary text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>معاينة الموقع</span>
          </Link>

          <form action={logoutOwnerAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-site border border-border-subtle text-red-500 hover:bg-red-500/10 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </div>

      {/* Supabase Connection Status Card */}
      <div className="p-5 rounded-2xl border border-border-subtle bg-card/60 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-site border border-border-subtle flex items-center justify-center text-accent shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5 text-accent" />
        </div>
        <div className="space-y-1 text-xs">
          <div className="font-bold text-sm text-primary">
            جاهزية قاعدة البيانات وسياسات الأمان RLS
          </div>
          <p className="text-secondary leading-relaxed">
            تم تجهيز ملفات الـ Migration وسياسات Row Level Security وجدول{" "}
            <code className="text-accent bg-site px-1.5 py-0.5 rounded">
              private.site_owner
            </code>{" "}
            ودالة الفحص الأمني{" "}
            <code className="text-accent bg-site px-1.5 py-0.5 rounded">
              is_site_owner()
            </code>
            .
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-5 bg-card border border-border-subtle rounded-2xl space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-secondary">
                  {card.title}
                </span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-2xl md:text-3xl font-bold font-mono text-primary">
                {card.count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
