export type Checklist = {
  id: number;
  name: string;
  code: string;
  description?: string;
  version: string;
  company_id: number;
  company?: {
    id: number;
    name: string;
  };
  industry_type?: string;
  total_score: number;
  passing_score: number;
  time_estimate?: number;
  is_active: boolean;
  is_template: boolean;
  created_at?: string;
  updated_at?: string;
};
