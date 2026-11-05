import { SURAH_LIST } from "@/lib/quran-surahs";

export interface AyahItem {
  numberInSurah: number;
  text: string;
  juz?: number;
  page?: number;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
  bismillahPre: boolean;
  ayahs: AyahItem[];
}

/**
 * Verified offline fallback data for key surahs
 * (Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas)
 */
const VERIFIED_FALLBACK_SURAHS: Record<number, AyahItem[]> = {
  1: [
    { numberInSurah: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
    { numberInSurah: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
    { numberInSurah: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ" },
    { numberInSurah: 4, text: "مَالِكِ يَوْمِ الدِّينِ" },
    { numberInSurah: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
    { numberInSurah: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
    { numberInSurah: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" },
  ],
  112: [
    { numberInSurah: 1, text: "قُلْ هُوَ اللَّهُ أَحَدٌ" },
    { numberInSurah: 2, text: "اللَّهُ الصَّمَدُ" },
    { numberInSurah: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ" },
    { numberInSurah: 4, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ" },
  ],
  113: [
    { numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ" },
    { numberInSurah: 2, text: "مِن شَرِّ مَا خَلَقَ" },
    { numberInSurah: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ" },
    { numberInSurah: 4, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ" },
    { numberInSurah: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ" },
  ],
  114: [
    { numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ" },
    { numberInSurah: 2, text: "مَلِكِ النَّاسِ" },
    { numberInSurah: 3, text: "إِلَٰهِ النَّاسِ" },
    { numberInSurah: 4, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ" },
    { numberInSurah: 5, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ" },
    { numberInSurah: 6, text: "مِنَ الْجِنَّةِ وَالنَّاسِ" },
  ],
};

/**
 * Fetches verified authentic Uthmanic text for any Surah (1-114).
 * Sourced from verified Al-Quran Cloud / Tanzil Uthmanic standard with offline fallback.
 */
export async function getSurahDetail(
  surahNumber: number
): Promise<SurahDetail | null> {
  const meta = SURAH_LIST.find((s) => s.number === surahNumber);
  if (!meta) return null;

  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`,
      {
        next: { revalidate: 604800 }, // Cache verified text for 7 days
      }
    );

    if (res.ok) {
      const json = await res.json();
      if (json?.data?.ayahs && Array.isArray(json.data.ayahs)) {
        const ayahs: AyahItem[] = json.data.ayahs.map((a: any) => ({
          numberInSurah: a.numberInSurah,
          text: a.text,
          juz: a.juz,
          page: a.page,
        }));

        return {
          number: meta.number,
          name: meta.name,
          englishName: meta.english_name,
          revelationType: meta.revelation_type,
          numberOfAyahs: meta.verses_count,
          bismillahPre: meta.number !== 1 && meta.number !== 9, // Surah 1 has it as verse 1; Surah 9 has no basmala
          ayahs,
        };
      }
    }
  } catch (err) {
    console.error(`Failed to fetch remote Quran data for Surah ${surahNumber}:`, err);
  }

  // Check verified fallback
  const fallbackAyahs = VERIFIED_FALLBACK_SURAHS[surahNumber];
  if (fallbackAyahs) {
    return {
      number: meta.number,
      name: meta.name,
      englishName: meta.english_name,
      revelationType: meta.revelation_type,
      numberOfAyahs: meta.verses_count,
      bismillahPre: meta.number !== 1 && meta.number !== 9,
      ayahs: fallbackAyahs,
    };
  }

  // When remote is unavailable and not in core fallback, return metadata with empty ayahs
  // so UI shows an informative retry state rather than fake data!
  return {
    number: meta.number,
    name: meta.name,
    englishName: meta.english_name,
    revelationType: meta.revelation_type,
    numberOfAyahs: meta.verses_count,
    bismillahPre: meta.number !== 1 && meta.number !== 9,
    ayahs: [],
  };
}
