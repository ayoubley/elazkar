export type AdhkarCategory = "morning" | "evening" | "sleep";

export type ContentStatus = "published" | "draft" | "needs_review";

export interface Dhikr {
  id: string;
  category: AdhkarCategory;
  order_index: number;
  title?: string;
  text: string;
  repeat_count: number;
  source?: string;
  reference?: string;
  grade?: string;
  virtue?: string;
  audio_url?: string;
  is_quranic?: boolean;
  status?: ContentStatus;
}

export type FontSizePreference = "sm" | "md" | "lg" | "xl";

export interface DuaCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  order_index: number;
}

export interface Dua {
  id: string;
  category_id: string;
  category_name?: string;
  title?: string;
  text: string;
  source?: string;
  reference?: string;
  explanation?: string;
  order_index: number;
  status?: ContentStatus;
}

export interface SurahMeta {
  number: number;
  name: string;
  english_name: string;
  verses_count: number;
  revelation_type: "Meccan" | "Medinan";
}
