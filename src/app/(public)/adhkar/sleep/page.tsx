import { PublicShell } from "@/components/layout/public-shell";
import { AdhkarListView } from "@/components/adhkar/adhkar-list-view";
import { Dhikr } from "@/types/adhkar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أذكار النوم الصحيحة والمأثورة",
  description: "أذكار النوم وسنن النوم المأثورة عن النبي ﷺ للنوم على طهارة وذكر.",
};

const SAMPLE_SLEEP_ADHKAR: Dhikr[] = [
  {
    id: "s-1",
    category: "sleep",
    order_index: 1,
    title: "باسمك ربي وضعت جنبي",
    text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.",
    repeat_count: 1,
    source: "صحيح البخاري ومسلم",
    reference: "البخاري: 6320، مسلم: 2714",
    grade: "متفق عليه",
    virtue: "من سنن النوم العظيمة لتفويض الأمر إلى الله عز وجل.",
    is_quranic: false,
    status: "published",
  },
  {
    id: "s-2",
    category: "sleep",
    order_index: 2,
    title: "التسبيح والتحميد والتكبير قبل النوم",
    text: "سُبْحَانَ اللَّهِ (٣٣)، وَالْحَمْدُ لِلَّهِ (٣٣)، وَاللَّهُ أَكْبَرُ (٣٤).",
    repeat_count: 1,
    source: "صحيح البخاري ومسلم",
    reference: "البخاري: 3705، مسلم: 2727",
    grade: "متفق عليه",
    virtue: "وصية النبي ﷺ لعلي وفاطمة رضي الله عنهما، وهي خير من خادم وتمنح القوة والنشاط.",
    is_quranic: false,
    status: "published",
  },
];

export default function SleepAdhkarPage() {
  return (
    <PublicShell>
      <AdhkarListView
        title="أذكــار النـوم"
        subtitle="«بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ» — أذكار وسنن الإيواء إلى الفراش لنوم هانئ وحفظ من وساوس الشيطان."
        category="sleep"
        adhkar={SAMPLE_SLEEP_ADHKAR}
      />
    </PublicShell>
  );
}
