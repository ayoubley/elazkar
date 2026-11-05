import { PublicShell } from "@/components/layout/public-shell";
import { AdhkarListView } from "@/components/adhkar/adhkar-list-view";
import { SAMPLE_EVENING_ADHKAR } from "@/lib/sample-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أذكار المساء مكتوبة ومسموعة بالتكرار وفضلها",
  description:
    "اقرأ واستمع إلى أذكار المساء كاملة وصحيحة مع عداد التكرار وفضل كل ذكر ومصدره من الكتاب والسنة لحفظ المسلم وتحصينه.",
  alternates: {
    canonical: "/adhkar/evening",
  },
};

export default function EveningAdhkarPage() {
  return (
    <PublicShell>
      <AdhkarListView
        title="أذكــار المسـاء"
        subtitle="«أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ» — قراءة وتلاوة الأذكار المأثورة عن النبي ﷺ في المساء للحفظ والسكينة."
        category="evening"
        adhkar={SAMPLE_EVENING_ADHKAR}
      />
    </PublicShell>
  );
}
