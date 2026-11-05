import { PublicShell } from "@/components/layout/public-shell";
import { AdhkarListView } from "@/components/adhkar/adhkar-list-view";
import { SAMPLE_MORNING_ADHKAR } from "@/lib/sample-data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أذكار الصباح مكتوبة ومسموعة بالتكرار وفضلها",
  description:
    "اقرأ واستمع إلى أذكار الصباح كاملة وصحيحة مع عداد التكرار وفضل كل ذكر ومصدره من الكتاب والسنة بتجربة قراءة هادئة ومريحة.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <PublicShell>
      <AdhkarListView
        title="أذكــار الصبـاح"
        subtitle="«أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ» — قراءة وتلاوة الأذكار المأثورة عن النبي ﷺ في أول النهار لحفظ النفس والبركة."
        category="morning"
        adhkar={SAMPLE_MORNING_ADHKAR}
      />
    </PublicShell>
  );
}
