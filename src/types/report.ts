import { Visit } from "./visit";

export type AuditorReport = {
  auditor_info: {
    id: number;
    name: string;
    email: string;
  };
  statistics: {
    total_visits: number;
    completed_visits: number;
    scheduled_visits: number;
    in_progress_visits: number;
    avg_score: number;
  };
  visits_by_month: {
    month: string;
    count: number;
    avg_percentage: string;
  }[];
  recent_verified_corrections: any[];
  upcoming_visits: Visit[];
};
