/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const createCompanySchema = (t: any, isEditMode: boolean = false) =>
  z.object({
    // Company Details
    name: z.string().min(1, t("Company name is required")),
    email: z.string().email(t("Invalid email address")),
    phone: z.string()
    .min(1, { message: t('Phone number is required') }) // ensures non-empty input
    .transform((val) =>{
       if (!val) return undefined;
        
        // Remove all non-digit characters
        return val.replace(/\D/g, '');
    }) // remove all non-digits
    .pipe(
      z.string().refine(
        (val) => {
          // Local: 10 digits starting with 0, second digit 1-8 (covers mobile & landline)
          const localPattern = /^0[1-8][0-9]{8}$/;
          // International: 12 digits starting with 966
          const intlPattern = /^966[0-9]{9}$/;
          return localPattern.test(val) || intlPattern.test(val);
        },
        {
          message:
            t('SAUDI_PHONE_VALIDATION_ERROR'),
        }
      )
    ),
    commercial_registration: z.string().min(1, t("Commercial registration is required")),
    city: z.string().optional(),
    address: z.string().optional(),
    contact_person: z.string(),
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
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    max_allowed_branches: z.coerce.number().min(1, t("Max branches must be at least 1")),
    max_allowed_users: z.coerce.number().min(1, t("Max users must be at least 1")),

    // User Selection
    use_existing_user: z.boolean().default(false),
    user_id: z.string().optional(),

    // User Details (Conditional)
    user_name: z.string().optional(),
    user_email: z.string().optional(),
    user_password: z.string().optional(),
    user_password_confirmation: z.string().optional(),
    user_phone: z.string().optional().transform(
      (val) =>{
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
        .optional() // Allows undefined (when input was empty)
    
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
    user_birth_date: z.string().optional(),
    user_gender: z.coerce.number().min(1, t("Gender is required")), 
    user_status: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    // If use_existing_user is TRUE, user_id is required
    if (data.use_existing_user) {
      if (!data.user_id || data.user_id === "new" || data.user_id === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("Please select an existing admin"),
          path: ["user_id"],
        });
      }
    } else {
      // If use_existing_user is FALSE, then user details are required
      if (!data.user_name || data.user_name.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("User name is required"),
          path: ["user_name"],
        });
      }
      if (!data.user_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user_email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("Invalid user email address"),
          path: ["user_email"],
        });
      }
      
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
      
      if (!isEditMode) {
        if (!data.user_password || !passwordRegex.test(data.user_password)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one special character '!@$%^&*#', and one number"),
            path: ["user_password"],
          });
        }
        if (!data.user_password_confirmation || data.user_password_confirmation !== data.user_password) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("Passwords do not match"),
            path: ["user_password_confirmation"],
          });
        }
      } else {
        // In Edit Mode, password is only required if password or confirmation is provided
        if (data.user_password || data.user_password_confirmation) {
          if (!data.user_password || !passwordRegex.test(data.user_password)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one special character '!@$%^&*#', and one number"),
              path: ["user_password"],
            });
          }
          if (data.user_password_confirmation !== data.user_password) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t("Passwords do not match"),
              path: ["user_password_confirmation"],
            });
          }
        }
      }
    }
  });
