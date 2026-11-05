import { PublicShell } from "@/components/layout/public-shell";
import { AdhkarListView } from "@/components/adhkar/adhkar-list-view";
import { getAdhkarByCategory } from "@/lib/adhkar/service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أذكار الصباح مكتوبة ومسموعة بالتكرار وفضلها",
  description:
    "اقرأ واستمع إلى أذكار الصباح كاملة وصحيحة مع عداد التكرار وفضل كل ذكر ومصدره من الكتاب والسنة بتجربة قراءة هادئة ومريحة.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const morningAdhkar = await getAdhkarByCategory("morning");

  return (
    <PublicShell>
      <AdhkarListView
        title="أذكــار الصبـاح"
        subtitle="«أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ» — قراءة وتلاوة الأذكار المأثورة عن النبي ﷺ في أول النهار لحفظ النفس والبركة."
        category="morning"
        adhkar={morningAdhkar}
      />
    </PublicShell>
  );
}
