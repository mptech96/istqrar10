export interface NotificationEntity {
  id: number;
  request_type?: string;
  request_type_text?: string;
  package_name?: string;
  customer_name?: string;
  company_name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  status?: string;
  status_text?: string;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  [key: string]: unknown;       // polymorphic — other entity shapes
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  body: string;
  scheduled_date: string;
  read_at: string | null;        // null = unread
  entity_id: number;
  entity_type: string;           // e.g. "App\Models\V1\ServiceRequest"
  url: string | null;
  entity: NotificationEntity | null;
  created_at: string;
}
