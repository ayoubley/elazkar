import { PublicShell } from "@/components/layout/public-shell";
import { SurahReaderView } from "@/components/quran/surah-reader-view";
import { getSurahDetail } from "@/lib/quran/service";
import { SURAH_LIST } from "@/lib/quran-surahs";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ surahNumber: string }>;
}

export async function generateStaticParams() {
  return SURAH_LIST.map((surah) => ({
    surahNumber: surah.number.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { surahNumber } = await params;
  const num = parseInt(surahNumber, 10);
  const surah = SURAH_LIST.find((s) => s.number === num);

  if (!surah) {
    return { title: "السورة غير موجودة" };
  }

  return {
    title: `سورة ${surah.name} مكتوبة بالرسم العثماني كاملة (${surah.verses_count} آية)`,
    description: `اقرأ سورة ${surah.name} (${surah.english_name}) كاملة بالرسم العثماني مع إمكانية تكبير الخط وحفظ موضع القراءة ومشاركتها بتجربة هادئة ومريحة.`,
    alternates: {
      canonical: `/quran/${surah.number}`,
    },
  };
}

export default async function SurahPage({ params }: PageProps) {
  const { surahNumber } = await params;
  const num = parseInt(surahNumber, 10);

  if (isNaN(num) || num < 1 || num > 114) {
    notFound();
  }

  const surah = await getSurahDetail(num);

  if (!surah) {
    notFound();
  }

  return (
    <PublicShell>
      <SurahReaderView surah={surah} />
    </PublicShell>
  );
}
