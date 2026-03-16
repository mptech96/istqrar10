export interface SubscriptionRequest {
  id: number;
  request_type: string;
  request_type_text: string;
  package_name: string;
  customer_name: string;
  company_name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  status_text: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
