export type Role = "auditor" | "super_admin" | "admin" | "company_admin" |"branch_manager";


type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: number;
  created_at: string; // or Date if you convert it
  branch_id?: number | null;
};

export type { User };
