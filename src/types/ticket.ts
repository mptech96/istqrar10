// =============================
// Ticket Constants (Tuples)
// =============================

import { Role } from "./user";

export const TICKET_TYPES = [
  "dispute",
  "complaint",
  "request",
  "inquiry",
  "technical",
  "feedback",
] as const;

export const PRIORITIES = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const DEPARTMENTS = [
  "support",
  "technical",
  "quality",
  "billing",
  "admin",
] as const;

export const TICKET_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;

export const SLA_STATUSES = [
  "ok",
  "warning",
  "breached",
] as const;

// =============================
// Derived Literal Types
// =============================

export type TicketType = typeof TICKET_TYPES[number];
export type Priority = typeof PRIORITIES[number];
export type Department = typeof DEPARTMENTS[number];
export type TicketStatus = typeof TICKET_STATUSES[number];
export type SlaStatus = typeof SLA_STATUSES[number];



export type UserType = "company" | "individual";

// =============================
// Nested Models
// =============================

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  role_text: string;
}

export interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Branch {
  id: number;
  name: string;
  code: string | null;
}

// =============================
// Main Ticket Model
// =============================

export interface Ticket {
  id: number;
  ticket_number: string;

  created_by: number;
  creator: User;

  user_type: UserType;
  user_type_text: string;

  company_id: number | null;
  company: Company | null;

  branch_id: number | null;
  branch: Branch | null;

  visit_id: number | null;

  subject: string;
  description: string;

  ticket_type: TicketType;
  ticket_type_text: string;

  priority: Priority;
  priority_text: string;

  department: Department;
  department_text: string;

  assigned_to: number | null;
  assigned_to_user: User | null;
  assigned_at: string | null;

  status: TicketStatus;
  status_text: string;

  resolution: string | null;
  resolved_by: number | null;
  resolved_at: string | null;

  sla_due_date: string;
  first_response_at: string | null;
  resolution_due_date: string;

  replies_count: number;
  customer_satisfaction: number | null;

  is_overdue: boolean;
  days_since_created: number;

  response_time: number | null;
  resolution_time: number | null;

  sla_status: SlaStatus;

  replies: unknown[];
  attachments: unknown[];

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
