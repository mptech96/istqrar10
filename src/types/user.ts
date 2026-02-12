type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: number;
  created_at: string; // or Date if you convert it
};

export type { User };
