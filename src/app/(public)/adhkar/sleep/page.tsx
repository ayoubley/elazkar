import { PublicShell } from "@/components/layout/public-shell";
import { AdhkarListView } from "@/components/adhkar/adhkar-list-view";
import { getAdhkarByCategory } from "@/lib/adhkar/service";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أذكار النوم الصحيحة والمأثورة",
  description: "أذكار النوم وسنن النوم المأثورة عن النبي ﷺ للنوم على طهارة وذكر.",
  alternates: {
    canonical: "/adhkar/sleep",
  },
};

export default async function SleepAdhkarPage() {
  const sleepAdhkar = await getAdhkarByCategory("sleep");

  return (
    <PublicShell>
      <AdhkarListView
        title="أذكــار النـوم"
        subtitle="«بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ» — أذكار وسنن الإيواء إلى الفراش لنوم هانئ وحفظ من وساوس الشيطان."
        category="sleep"
        adhkar={sleepAdhkar}
      />
    </PublicShell>
  );
}
