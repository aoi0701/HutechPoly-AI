/**
 * Định nghĩa kiểu dữ liệu (TypeScript Types) cho danh mục chủ đề HutechPoly-AI.
 */

export interface VocabItem {
  word?: string;
  ipa?: string;
  part_of_speech?: string;
  word_ruby?: string;
  romaji?: string;
  hangeul?: string;
  romaja?: string;
  honorific_type?: string;
  meaning_vi?: string;
  [key: string]: any;
}

export interface Topic {
  id?: string;
  topic_code: string;
  language: "en" | "ja" | "ko" | string;
  faculty: string;
  level: "easy" | "medium" | "hard" | "beginner" | "intermediate" | "advanced" | string;
  title_vi: string;
  title_native: string;
  category: string;
  ai_persona: string;
  opening_line: string;
  system_instruction?: string;
  key_vocab: VocabItem[];
  metadata?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
}

export interface TopicListResponse {
  total: number;
  items: Topic[];
}
