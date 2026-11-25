/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from "zod";
// Zod Schema
const optionSchema = (t: any) =>
  z.object({
    value: z.string().min(1, t("Value is required")),
    score: z.coerce.number().min(0, t("Points must be 0 or more")),
    description: z.string().optional(),
  });

export const createConditionSchema = (t: any) =>
  z.object({
    checklist_id: z.coerce.number().min(1, t("Checklist ID is required")),
    criteria_id: z.coerce.number().min(1, t("Criteria ID is required")),
    question_text: z.string().min(1, t("Question text is required")),
    description: z.string().optional(),
    help_text: z.string().optional(),
    type: z.enum([
      "yes_no",
      "multiple_choice",
      "rating",
      "scale_1_5",
      "text",
      "number",
      "date",
    ]),
    weight: z.coerce.number().min(1, t("weight is required)")),
    options: z
      .array(optionSchema(t))
      .min(1, t("At least one option is required")),
    correct_answer: z.string().optional(),

    max_score: z.coerce.number().min(0, t("Max score is required")),
    passing_score: z.coerce.number().min(0, t("Passing score is required")),
    is_required: z.boolean(),
    is_critical: z.boolean(),
    has_attachment: z.boolean(),
    attachment_instructions: z.string().optional(),
    sort_order: z.coerce.number().min(1, t("Sort order is required")),
    is_active: z.boolean(),
  });
