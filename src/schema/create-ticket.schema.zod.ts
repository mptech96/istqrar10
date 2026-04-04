/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import {
  TICKET_TYPES,
  PRIORITIES,
  DEPARTMENTS,
} from "@/types/ticket";

export const createTicketSchema = (t: any) =>
  z.object({
    user_type: z.enum(["company", "individual" , "auditor"], {
      message: t("User type is required"),
    }),
    company_id: z.coerce.number().optional(),
    branch_id: z.coerce.number().optional(),
    visit_id: z.coerce.number().optional(),
    subject: z.string().min(1, t("Subject is required")),
    description: z  
      .string() 
      .min(1, t("Description is required")),
    ticket_type: z.enum([...TICKET_TYPES], {
      message: t("Ticket type is required"),
    }),
    priority: z.enum([...PRIORITIES]).optional(),
    department: z.enum([...DEPARTMENTS]).optional(),
    attachments: z.any().optional(),
  });

export type TicketFormValues = z.infer<
  ReturnType<typeof createTicketSchema>
>;
