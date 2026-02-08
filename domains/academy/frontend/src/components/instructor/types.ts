export type BlockType = "TEXT" | "VIDEO" | "PDF" | "QUIZ";

export interface LessonBlock {
  id: string;
  type: BlockType;
  body?: string;
  title?: string;
  url?: string;
  quizId?: number;
}
