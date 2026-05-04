const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface ContentRequest {
  board: string;
  subject: string;
  chapter: string;
  topic?: string;
}

export interface ContentVideo {
  title: string;
  link: string;
  duration?: string;
  channel?: string;
  thumbnail?: string | null;
}

export interface PracticeQuestion {
  question: string;
  answer: string;
  type: "mcq" | "short" | "long" | string;
}

export interface CuratedContent {
  summary: string;
  key_points: string[];
  important_formulas: string[];
  ncert_reference: string;
  suggested_videos: Array<{ title: string; search_query: string }>;
  practice_questions: PracticeQuestion[];
  youtube_videos: ContentVideo[];
}

export interface ContentResponse {
  success: boolean;
  data: CuratedContent;
  board: string;
  subject: string;
  source?: string;
  warning?: string;
  cached?: boolean;
}

export interface AskResponse {
  answer: string;
  source?: string;
}

export interface GeneratedPaper {
  mcqs: Array<{ q: string; options: string[]; correct: string }>;
  short: Array<{ q: string; answer: string }>;
  long: Array<{ q: string; answer: string }>;
  cached?: boolean;
}

async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function cachedApi<T>(cacheKey: string, endpoint: string, options: RequestInit = {}): Promise<T & { cached?: boolean }> {
  try {
    const data = await api<T>(endpoint, options);
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return { ...JSON.parse(cached), cached: true };
    throw error;
  }
}

export const contentAPI = {
  getContent: (board: string, subject: string, chapter: string, topic?: string) =>
    cachedApi<ContentResponse>(`content:${board}:${subject}:${chapter}:${topic || "overview"}`, "/api/content", {
      method: "POST",
      body: JSON.stringify({ board, subject, chapter, topic })
    }),

  askQuestion: (question: string, context: ContentRequest) =>
    api<AskResponse>("/api/ask", {
      method: "POST",
      body: JSON.stringify({ question, context })
    }),

  generatePaper: (board: string, subject: string, chapter: string, difficulty = "medium") =>
    cachedApi<GeneratedPaper>(`paper:${board}:${subject}:${chapter}:${difficulty}`, "/api/generate-paper", {
      method: "POST",
      body: JSON.stringify({ board, subject, chapter, difficulty })
    })
};
