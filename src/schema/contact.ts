import { z } from "zod";

export const contactSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t("Name must be at least 3 characters")),
    email: z.string().email(t("Invalid email address")),
    phone: z.string().optional(),
    message: z.string().min(10, t("Message must be at least 10 characters")),
  });

export type ContactFormData = z.infer<typeof contactSchema>;
