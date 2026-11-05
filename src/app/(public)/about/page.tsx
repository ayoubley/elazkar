import { PublicShell } from "@/components/layout/public-shell";
import { BookOpen, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | منصة الأذكــار",
  description:
    "تعرف على رسالة منصة الأذكــار الإسلامية وأهدافها في تيسير قراءة الأذكار النبوية والقرآن الكريم بتجربة هادئة وموثوقة.",
};

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Hero */}
        <div className="p-8 md:p-10 bg-card border border-border-subtle rounded-3xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-site border border-border-subtle flex items-center justify-center text-accent mx-auto">
            <BookOpen className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary font-arabic">
            منصـة الأذكــار
          </h1>
          <p className="text-secondary text-base leading-relaxed max-w-xl mx-auto">
            مشروع رقمي إسلامي غير ربحي، صُمم ليكون رفيقك اليومي في قراءة أذكار
            الصباح والمساء، أذكار النوم، الأدعية المأثورة، والقرآن الكريم.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-card border border-border-subtle rounded-2xl text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-site flex items-center justify-center text-accent mx-auto">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-bold text-base text-primary">الموثوقية والتثبت</h2>
            <p className="text-xs text-secondary leading-relaxed">
              عناية فائقة بتخريج الأحاديث وصحة النصوص والآيات القرآنية بالرسم العثماني.
            </p>
          </div>

          <div className="p-5 bg-card border border-border-subtle rounded-2xl text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-site flex items-center justify-center text-accent mx-auto">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-bold text-base text-primary">هدوء التصميم</h2>
            <p className="text-xs text-secondary leading-relaxed">
              ألوان مدروسة بعناية مريحة للعين، وتجربة قراءة خالية من المشتتات
              والإعلانات.
            </p>
          </div>

          <div className="p-5 bg-card border border-border-subtle rounded-2xl text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-site flex items-center justify-center text-accent mx-auto">
              <Heart className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-bold text-base text-primary">سهولة وتفاعل</h2>
            <p className="text-xs text-secondary leading-relaxed">
              عداد تكرار تفاعلي، إمكانية تكبير الخط، ومفضلة سريعة دون الحاجة لتسجيل
              حساب.
            </p>
          </div>
        </div>

        {/* Vision details */}
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-3xl space-y-4 text-sm text-secondary leading-relaxed">
          <h2 className="text-lg font-bold text-primary">رسالتنا</h2>
          <p>
            نهدف في منصة <strong>الأذكــار</strong> إلى إحياء سُنَّة النبي صلى الله
            عليه وسلم في المحافظة على الأذكار في آناء الليل وأطراف النهار، عبر
            أدوات تقنية معاصرة وسريعة تحترم خصوصية المستخدم ولا تجمع أي بيانات
            شخصية دون مبرر.
          </p>
          <p>
            نسأل الله تعالى أن يتقبل هذا العمل خالصاً لوجهه الكريم، وأن ينفع به كل
            من قرأ منه أو شاركه.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
