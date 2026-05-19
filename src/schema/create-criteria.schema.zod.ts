/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const rangeSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t("Range name is required")),
    min_score: z.coerce.number().min(0, t("Minimum score must be at least 0")),
    max_score: z.coerce.number().max(100, t("Maximum score cannot exceed 100")),
    color: z.string().min(1, t("Color is required")),
    description: z.string().optional(),
  });

export const createCriteriaSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t("Criteria name is required")),
    description: z.string().optional(),
    category: z.string().min(1, t("Category is required")),

    is_active: z.boolean().optional().default(true),
    sort_order: z.coerce.number().optional().default(1),
    ranges: z.array(rangeSchema(t)).min(1, t("At least one range is required")),
  });

export type CriteriaFormValues = z.infer<
  ReturnType<typeof createCriteriaSchema>
>;
