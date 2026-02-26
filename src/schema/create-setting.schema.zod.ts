/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const createSettingSchema = (t: any) =>
  z.object({
    group: z.string().min(1, t("Group is required")),
    key: z.string().min(1, t("Key is required")),
    value: z.any().refine((val) => val !== undefined && val !== null && val !== "", {
      message: t("Value is required"),
    }),
    type: z.enum(["string", "number", "boolean", "select", "json"]),
    label: z.string().min(1, t("Label is required")),
    description: z.string().optional().default(""),
    is_public: z.boolean().optional().default(false),
  });

export type SettingFormValues = z.infer<ReturnType<typeof createSettingSchema>>;
