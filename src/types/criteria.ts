export type CriteriaRange = {
  id?: number;
  name: string;
  min_score: number;
  max_score: number;
  color: string;
  description?: string;
};

export type Criteria = {
  id: number;
  name: string;
  description?: string;
  category: string;
  weight: number;
  is_active: boolean;
  sort_order: number;
  ranges: CriteriaRange[];
  created_at?: string;
  updated_at?: string;
};
