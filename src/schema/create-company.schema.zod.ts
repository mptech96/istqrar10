/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createCompanySchema = (t: any, isEditMode: boolean = false) =>
  z.object({
    // Company Details
    name: z.string().min(1, t("Company name is required")),
    email: z.string().email(t("Invalid email address")),
    phone: z.string().min(1, t("Phone number is required")),
    commercial_registration: z.string().min(1, t("Commercial registration is required")),
    city: z.string().min(1, t("City is required")),
    address: z.string().min(1, t("Address is required")),
    contact_person: z.string().min(1, t("Contact person is required")),
    logo: z
      .any()
      .optional()
      .refine(
        (file) => !file || file instanceof File,
        t("Logo must be a file")
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
    subscription_start: z.string().min(1, t("Subscription start date is required")),
    subscription_end: z.string().min(1, t("Subscription end date is required")),
    subscription_status: z.string().min(1, t("Subscription status is required")),
    category: z.string().min(1, t("Category is required")),
    status: z.boolean().optional().default(true),
    is_verified: z.boolean().optional().default(false),

    // User Details
    user_name: z.string().min(1, t("User name is required")),
    user_email: z.string().email(t("Invalid user email address")),
    user_password: isEditMode
      ? z.string()?.regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
        {
          message: t("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one special character '!@$%^&*#', and one number"),
        }
      ).optional()
      : z.string().regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
        {
          message: t("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one special character '!@$%^&*#', and one number"),
        }
      ),
    user_password_confirmation: isEditMode
      ? z.string().optional()
      : z.string().min(1, t("Password confirmation is required")),
    user_phone: z.string().optional(),
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
    user_status: z.boolean().optional().default(true),
  }).refine((data) => {
    if (isEditMode && (!data.user_password && !data.user_password_confirmation)) {
      return true;
    }
    return data.user_password === data.user_password_confirmation;
  }, {
    message: t("Passwords do not match"),
    path: ["user_password_confirmation"],
  });
