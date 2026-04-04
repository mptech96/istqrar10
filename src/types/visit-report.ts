export interface CriterionScore {
  criteria_name: string;
  earned_points: number;
  possible_points: number;
  percentage: number;
  level: string;
  level_color: string;
  weight: string;
}

export interface VisitReportData {
  total_questions: number;
  critical_errors: number;
  correct_answers: number;
  incorrect_answers: number;
  score_percentage: number;
  criteria_scores: CriterionScore[];
}
