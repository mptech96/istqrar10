/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const signinSchema = (t: any) =>
  z.object({
    email: z.string().email(t("Invalid email")),
    password: z
      .string()
      .min(8,t("Too small: expected string to have >=8 characters"))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
        {
          message: t("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
        }
      ),
  });