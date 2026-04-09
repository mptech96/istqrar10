/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createBranchSchema = (t: any) =>
  z.object({
    // Branch Details
    company_id: z.coerce.number({message: t("Please select a company")}).min(1, t("Company is required")),
    name: z.string().min(1, t("Branch name is required")),
    email: z.string().email(t("Invalid email address")),
    phone: z.string().min(1, t("Phone number is required")).transform(
      (val) => {
        if (!val) return undefined;
        
        // Remove all non-digit characters
        return val.replace(/\D/g, '');
      }).pipe(
      z
        .string()
        .refine(
          (val) => {
            // Accept local: 10 digits starting with 0, second digit 1-8
            const localPattern = /^0[1-8][0-9]{8}$/;
            // Accept international: 12 digits starting with 966
            const intlPattern = /^966[0-9]{9}$/;
            return localPattern.test(val) || intlPattern.test(val);
          },
          {
            message:
              t('SAUDI_PHONE_VALIDATION_ERROR'),
          }
        )
        // .optional()  Allows undefined (when input was empty)
    
    ),
    city: z.string().optional(),
    address: z.string().optional(),
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
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
        {
          message: t("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one special character '!@$%^&*#', and one number"),
        }
      ),
    user_password_confirmation: z.string().min(1, t("Password confirmation is required")),
    user_phone: z.string().min(1, t("User phone is required")).transform(
      (val) => {
        if (!val) return undefined;
        
        // Remove all non-digit characters
        return val.replace(/\D/g, '');
      }).pipe(
      z
        .string()
        .refine(
          (val) => {
            // Accept local: 10 digits starting with 0, second digit 1-8
            const localPattern = /^0[1-8][0-9]{8}$/;
            // Accept international: 12 digits starting with 966
            const intlPattern = /^966[0-9]{9}$/;
            return localPattern.test(val) || intlPattern.test(val);
          },
          {
            message:
              t('SAUDI_PHONE_VALIDATION_ERROR'),
          }
        )
        // .optional()  Allows undefined (when input was empty)
    
    ),
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
    user_birth_date: z.string().min(1, t("Birth date is required 18+ years")),
    user_gender: z.coerce.number().min(1, t("Gender is required")),
  }).refine((data) => data.user_password === data.user_password_confirmation, {
    message: t("Passwords do not match"),
    path: ["user_password_confirmation"],
  });
