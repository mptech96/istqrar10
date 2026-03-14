export interface AIAnalysisResponse {
  message: string;
  data: AIAnalysisData;
}

export interface AIAnalysisData {
  id: number;
  visit_id: number;
  summary: string;
  full_analysis: {
    root_cause: RootCauseAnalysis;
    patterns: PatternsAnalysis;
    predictive: PredictiveAnalysis;
    comparative: ComparativeAnalysis;
    recommendations: RecommendationsAnalysis;
    risk_assessment: RiskAssessmentAnalysis;
    action_plan: ActionPlan;
  };
  tokens_used: number;
  processing_time_ms: number;
  estimated_cost_usd: number;
  created_at: string;
}

export interface RootCauseAnalysis {
  primary_causes: Cause[];
  secondary_causes: Cause[];
  contributing_factors: ContributingFactor[];
  systemic_issues: SystemicIssue[];
  summary: string;
}

export interface Cause {
  description: string;
  impact: string;
}

export interface ContributingFactor {
  description: string;
  type: string;
}

export interface SystemicIssue {
  description: string;
  impact: string;
}

export interface PatternsAnalysis {
  recurring_issues: unknown[];
  emerging_patterns: unknown[];
  correlations: unknown[];
  temporal_patterns: unknown[];
  summary: string;
}

export interface PredictiveAnalysis {
  forecast_next_score: number;
  confidence_interval: [number, number];
  risk_factors: string[];
  improvement_potential: number;
  critical_warnings: string[];
  summary: string;
}

export interface ComparativeAnalysis {
  peer_comparison: unknown[];
  ranking: string;
  strengths_vs_peers: string[];
  weaknesses_vs_peers: string[];
  best_practices: string[];
  summary: string;
}

export interface RecommendationsAnalysis {
  immediate_actions: ActionItem[];
  short_term: ActionItem[];
  long_term: ActionItem[];
  quick_wins: QuickWin[];
  training_needs: TrainingNeed[];
  resource_needs: ResourceNeed[];
  process_changes: ProcessChange[];
}

export interface ActionItem {
  task: string;
  estimated_impact: number;
  priority: "high" | "medium" | "low";
  timeline: string;
  responsible: string;
  resources: string[];
}

export interface QuickWin {
  task: string;
  estimated_impact: number;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  timeline: string;
  responsible: string;
}

export interface TrainingNeed {
  task: string;
  responsible_person: string;
  expected_impact: number;
  required_resources: string;
}

export interface ResourceNeed {
  task: string;
  responsible_person: string;
  expected_impact: number;
  required_resources: string;
}

export interface ProcessChange {
  task: string;
  responsible_person: string;
  expected_impact: number;
  required_resources: string;
}

export interface RiskAssessmentAnalysis {
  critical_risks: unknown[];
  high_risks: unknown[];
  medium_risks: unknown[];
  compliance_risks: unknown[];
  reputation_risks: unknown[];
  financial_risks: unknown[];
  summary: string;
}

export interface ActionPlan {
  tasks: ActionPlanTask[];
  milestones: Milestone[];
  dependencies: Dependency[];
  estimated_timeline: string;
  success_criteria: SuccessCriteria[];
  review_points: ReviewPoint[];
}

export interface ActionPlanTask {
  task: string;
  priority: string;
  responsible: string;
  timeline: string;
  resources: unknown[];
  success_metrics: unknown[];
  estimated_impact: number;
}

export interface Milestone {
  milestone: string;
  timeline: string;
}

export interface Dependency {
  task: string;
  dependent_task: string;
}

export interface SuccessCriteria {
  task: string;
  criteria: string;
}

export interface ReviewPoint {
  point: string;
  timeline: string;
}

export interface AIAnalysisMetadata {
  processing_time_ms: number;
  tokens_used: number;
  estimated_cost_usd: number;
  generated_at: string;
}
