/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const createVisitSchema = (t: any) =>
  z.object({
    company_id: z.coerce.number().min(1, t("Company is required")),
    branch_id: z.coerce.number().min(1, t("Branch is required")),
    auditor_id: z.coerce.number().min(1, t("Auditor is required")),
    checklist_id: z.coerce.number().min(1, t("Checklist is required")),
    scheduled_date: z.string().min(1, t("Scheduled date is required")),
    scheduled_time: z.string().min(1, t("Scheduled time is required")),
    estimated_duration: z.coerce.number().min(1).optional().default(60),
    internal_notes: z.string().optional(),
  });

export type VisitFormValues = z.infer<ReturnType<typeof createVisitSchema>>;
