/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

export const createInspectorSchema = (t: any) =>
  z.object({
    name: z.string().min(1, t("Name is required")),
    email: z.string().email(t("Invalid email address")),
    password: z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
        {
          message: t("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
        }
      ),
    password_confirmation: z.string().min(1, t("Password confirmation is required")),
    phone: z.string().min(1, t("Phone number is required")),
    role: z.string().min(1, t("Role is required")),
    department: z.string().optional(),
    position: z.string().optional(),
    national_number: z.string().min(10, t("ID must be 10 digits"))
    .max(10, t("ID must be 10 digits"))
    .regex(/^[12]\d{9}$/, t("Invalid Saudi National ID")),
    company_id: z.string().optional(),
    branch_id: z.string().optional(),
    
    municipality_certificate: z
      .any()
      .optional()
      .refine(
        (file) => !file || file instanceof File,
        t("Certificate must be a file")
      )
      .refine(
        (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
        t("Max file size is 2MB")
      ),

    driving_license: z
      .any()
      .optional()
      .refine(
        (file) => !file || file instanceof File,
        t("License must be a file")
      )
      .refine(
        (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
        t("Max file size is 2MB")
      ),

    personal_photo: z
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
        t("Only jpg, jpeg, png, webp and pdf formats are supported")
      ),

    certificate_expiry: z.string().optional(),
    license_expiry: z.string().optional(),
    id_expiry: z.string().optional(),
    birth_date: z.string().optional(),
    
    gender: z.string().optional(),
    status: z.coerce.number().optional().default(1),
    must_change_password: z.boolean().optional().default(false),
  }).refine((data) => data.password === data.password_confirmation, {
    message: t("Passwords do not match"),
    path: ["password_confirmation"],
  });
