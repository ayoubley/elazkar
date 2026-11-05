import { PublicShell } from "@/components/layout/public-shell";
import { Metadata } from "next";
import { HeartHandshake, Sparkles, Copy, Check, Share2 } from "lucide-react";

export const metadata: Metadata = {
  title: "الأدعية المأثورة من القرآن الكريم والسنة النبوية",
  description: "أدعية جامعة من الكتاب والسنة مرتبة حسب الأبواب والمناسبات.",
};

const SAMPLE_CATEGORIES = [
  "أدعية الاستغفار",
  "أدعية الرزق والبركة",
  "أدعية الهداية والتوفيق",
  "أدعية الحفظ والتحصين",
  "أدعية السفر",
  "أدعية الوالدين",
  "أدعية الكرب والهم",
  "أدعية الصحة والعافية",
  "أدعية جامعة",
];

const SAMPLE_DUAS = [
  {
    id: "dua-1",
    category: "أدعية جامعة",
    title: "دعاء جامع لخير الدنيا والآخرة",
    text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    source: "القرآن الكريم",
    reference: "سورة البقرة: الآية 201",
    is_quranic: true,
  },
  {
    id: "dua-2",
    category: "أدعية الكرب والهم",
    title: "دعاء ذي النون في بطن الحوت",
    text: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    source: "القرآن الكريم",
    reference: "سورة الأنبياء: الآية 87",
    is_quranic: true,
  },
  {
    id: "dua-3",
    category: "أدعية الوالدين",
    title: "الدعاء للوالدين بالرحمة",
    text: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    source: "القرآن الكريم",
    reference: "سورة الإسراء: الآية 24",
    is_quranic: true,
  },
];

export default function DuasPage() {
  return (
    <PublicShell>
      <div className="space-y-6">
        {/* Header banner */}
        <div className="p-6 md:p-8 bg-card border border-border-subtle rounded-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>الأدعية المأثورة</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary font-arabic">
            الأدعيـة من الكتـاب والسنـة
          </h1>
          <p className="text-secondary text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
            «وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ» — أدعية مباركة مستجابة
            مبوبة وموثقة من القرآن الكريم والسنة النبوية الصحيحة.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {SAMPLE_CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-colors ${
                i === 0
                  ? "bg-card border-accent/40 text-primary font-semibold shadow-xs"
                  : "bg-card/50 border-border-subtle text-secondary hover:text-primary hover:bg-hover"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Duas List */}
        <div className="space-y-4">
          {SAMPLE_DUAS.map((dua, idx) => (
            <div
              key={dua.id}
              className="p-6 bg-card border border-border-subtle rounded-2xl shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between text-xs border-b border-border-subtle/50 pb-2">
                <span className="font-semibold text-primary">{dua.title}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-site text-secondary border border-border-subtle text-[11px]">
                  {dua.category}
                </span>
              </div>

              <p className="text-xl md:text-2xl text-primary text-center font-quran leading-loose py-2">
                {dua.text}
              </p>

              <div className="flex items-center justify-between text-xs text-secondary pt-2 border-t border-border-subtle/50">
                <span>
                  {dua.source} — {dua.reference}
                </span>
                <span className="text-[11px] text-accent">موثق</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
