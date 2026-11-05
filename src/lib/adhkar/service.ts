import { createClient } from "@/lib/supabase/server";
import { Dhikr, AdhkarCategory } from "@/types/adhkar";
import {
  SAMPLE_MORNING_ADHKAR,
  SAMPLE_EVENING_ADHKAR,
  SAMPLE_SLEEP_ADHKAR,
  ALL_SAMPLE_ADHKAR,
} from "@/lib/sample-data";

/**
 * Fetches published adhkar for a specific category.
 * Queries Supabase when configured, otherwise gracefully falls back to seed data.
 */
export async function getAdhkarByCategory(
  category: AdhkarCategory
): Promise<Dhikr[]> {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("adhkar")
        .select("*")
        .eq("category_slug", category)
        .eq("status", "published")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          category: item.category_slug as AdhkarCategory,
          order_index: item.sort_order,
          title: item.title || undefined,
          text: item.text,
          repeat_count: item.repeat_count,
          source: item.source_name || undefined,
          reference: item.reference || undefined,
          grade: item.grade || undefined,
          virtue: item.virtue || undefined,
          audio_url: item.audio_url || undefined,
          is_quranic: item.is_quranic,
          status: item.status,
        }));
      }
    } catch {
      // Graceful fallback to verified sample seed
    }
  }

  // Fallback to verified seed data
  switch (category) {
    case "morning":
      return SAMPLE_MORNING_ADHKAR;
    case "evening":
      return SAMPLE_EVENING_ADHKAR;
    case "sleep":
      return SAMPLE_SLEEP_ADHKAR;
    default:
      return [];
  }
}

/**
 * Fetches all published adhkar across all categories.
 */
export async function getAllPublishedAdhkar(): Promise<Dhikr[]> {
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("adhkar")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          category: item.category_slug as AdhkarCategory,
          order_index: item.sort_order,
          title: item.title || undefined,
          text: item.text,
          repeat_count: item.repeat_count,
          source: item.source_name || undefined,
          reference: item.reference || undefined,
          grade: item.grade || undefined,
          virtue: item.virtue || undefined,
          audio_url: item.audio_url || undefined,
          is_quranic: item.is_quranic,
          status: item.status,
        }));
      }
    } catch {
      // Fallback
    }
  }

  return ALL_SAMPLE_ADHKAR;
}
