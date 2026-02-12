// types/question.ts

export type QuestionType = 
  | "yes_no" 
  | "multiple_choice" 
  | "rating" 
  | "text" 
  | "number" 
  | "date";

export interface QuestionOption {
  value: string;
  score: string | number;
  description?: string | null;
}

export interface Question {
  id: number;
  checklist_id: number;
  criteria_id: number;
  question_text: string;
  description?: string | null;
  help_text?: string | null;
  type: QuestionType;
  type_text: string;
  options?: QuestionOption[];
  correct_answer?: string | null;
  weight: number;
  max_score: number;
  passing_score: number;
  is_required: boolean;
  is_required_text: string;
  is_critical: boolean;
  is_critical_text: string;
  has_attachment: boolean;
  attachment_instructions?: string | null;
  sort_order: number;
  is_active: boolean;
  is_active_text: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface QuestionAnswer {
  question_id: number;
  answer: string | number | boolean;
  score?: number;
  notes?: string;
  attachments?: File[];
}

export interface VisitAnswersForm {
  visit_id: number;
  checklist_id: number;
  answers: QuestionAnswer[];
}