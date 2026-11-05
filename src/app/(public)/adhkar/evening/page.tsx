import { PublicShell } from "@/components/layout/public-shell";
import { AdhkarListView } from "@/components/adhkar/adhkar-list-view";
import { getAdhkarByCategory } from "@/lib/adhkar/service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أذكار المساء مكتوبة ومسموعة بالتكرار وفضلها",
  description:
    "اقرأ واستمع إلى أذكار المساء كاملة وصحيحة مع عداد التكرار وفضل كل ذكر ومصدره من الكتاب والسنة لحفظ المسلم وتحصينه.",
  alternates: {
    canonical: "/adhkar/evening",
  },
};

export default async function EveningAdhkarPage() {
  const eveningAdhkar = await getAdhkarByCategory("evening");

  return (
    <PublicShell>
      <AdhkarListView
        title="أذكــار المسـاء"
        subtitle="«أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ» — قراءة وتلاوة الأذكار المأثورة عن النبي ﷺ في المساء للحفظ والسكينة."
        category="evening"
        adhkar={eveningAdhkar}
      />
    </PublicShell>
  );
}
