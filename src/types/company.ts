export interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  commercial_registration: string;
  city: string;
  address: string;
  contact_person: string;
  logo: string | null;
  subscription_start: string;
  subscription_end: string;
  subscription_status: "active" | "inactive" | "expired";
  category: string;
  status: boolean;
  is_verified: boolean;
  user?: User; // Depending on if user details are nested in response
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  personal_photo: string | null;
  gender: number;
  birth_date: string | null;
  status: boolean;
}

export interface CreateCompanyResponse {
  message: string;
  company: Company;
  user: User;
}
