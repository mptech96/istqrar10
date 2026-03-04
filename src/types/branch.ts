import { User } from "./company";

type Gender = 0 | 1 | 2; // adjust based on your system (e.g., 0=male,1=female,2=other)

export type Branch = {
  id: number;
  company_id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: string;
  compliance_score?: number;
  status?: boolean;
  manager?: User;
};

