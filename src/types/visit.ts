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
  max_possible_score?: number;
  percentage?: number;
  percentage_formatted?: string;
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
    latitude?: number;
    longitude?: number;
  };
  auditor?: {
    id: number;
    name: string;
    email: string;
    latitude?: number;
    longitude?: number;
  };
  checklist?: {
    id: number;
    name: string;
    code: string;
  };
  start_latitude?: string;
  start_longitude?: string;
};
