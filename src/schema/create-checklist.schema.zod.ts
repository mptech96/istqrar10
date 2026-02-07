/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const createChecklistSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t("Checklist name is required")),
    code: z.string().min(1, t("Checklist code is required")),
    description: z.string().optional(),
    version: z.string().optional().default("1.0"),
    company_id: z.coerce.number().min(1, t("Company is required")),
    industry_type: z.string().optional(),
    total_score: z.coerce.number().min(0).default(100),
    passing_score: z.coerce.number().min(0).default(70),
    time_estimate: z.coerce.number().min(0).optional(),
    is_active: z.boolean().optional().default(true),
    is_template: z.boolean().optional().default(false),
  });

export type ChecklistFormValues = z.infer<ReturnType<typeof createChecklistSchema>>;
