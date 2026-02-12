export type Visit = {
  id: number;
  branch_id: number;
  auditor_id: number;
  checklist_id: number;
  scheduled_date: string;
  scheduled_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
  visit_date?: string;
  status: string;
  status_text?: string;
  total_score?: number;
  percentage?: number;
  category?: string;
  category_text?: string;
  estimated_duration?: number;
  internal_notes?: string;
  created_at?: string;
  updated_at?: string;
  branch?: {
    id: number;
    name: string;
    code: string;
  };
  auditor?: {
    id: number;
    name: string;
    email: string;
  };
  checklist?: {
    id: number;
    name: string;
    code: string;
  };
};
