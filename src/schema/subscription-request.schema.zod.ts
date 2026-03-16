import * as z from "zod";

export const createSubscriptionRequestSchema = (t: (key: string) => string) => {
  return z.object({
    request_type: z.literal("package_request"),
    package_name: z.string().min(1, t("Package name is required")),
    customer_name: z.string().min(1, t("Customer name is required")),
    company_name: z.string().min(1, t("Company name is required")),
    phone: z.string().min(1, t("Phone number is required")),
    email: z.string().email(t("Invalid email address")),
    subject: z.string().min(1, t("Subject is required")),
    message: z.string().min(1, t("Message is required")),
  });
};

export type SubscriptionRequestFormValues = z.infer<
  ReturnType<typeof createSubscriptionRequestSchema>
>;
