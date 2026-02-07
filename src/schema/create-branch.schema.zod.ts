/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createBranchSchema = (t: any) =>
  z.object({
    // Branch Details
    company_id: z.coerce.number().min(1, t("Company is required")),
    name: z.string().min(1, t("Branch name is required")),
    email: z.string().email(t("Invalid email address")),
    phone: z.string().min(1, t("Phone number is required")),
    city: z.string().min(1, t("City is required")),
    address: z.string().min(1, t("Address is required")),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    category: z.string().min(1, t("Category is required")),
    compliance_score: z.coerce.number().optional(),
    status: z.boolean().optional().default(true),

    // User Details (Branch Manager)
    user_name: z.string().min(1, t("User name is required")),
    user_email: z.string().email(t("Invalid user email address")),
    user_password: z
      .string()
      .min(8, t("Password must be at least 8 characters")),
    user_password_confirmation: z.string().min(1, t("Password confirmation is required")),
    user_phone: z.string().min(1, t("User phone is required")),
    user_personal_photo: z
      .any()
      .optional()
      .refine(
        (file) => !file || file instanceof File,
        t("Personal photo must be a file")
      )
      .refine(
        (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
        t("Max file size is 2MB")
      )
      .refine(
        (file) =>
          !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
        t("Only jpg, jpeg, png and webp formats are supported")
      ),
    user_birth_date: z.string().optional(),
    user_gender: z.coerce.number().optional(),
  }).refine((data) => data.user_password === data.user_password_confirmation, {
    message: t("Passwords do not match"),
    path: ["user_password_confirmation"],
  });
