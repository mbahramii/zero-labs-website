import { z } from "zod";

// Custom validation for either a valid email or an Iranian phone number
const emailOrPhoneSchema = z.string().min(1, "This field is required").refine(
  (val) => {
    const isEmail = z.string().email().safeParse(val).success;
    const isPhone = /^09\d{9}$/.test(val); // Validates Iranian phone format (e.g., 09123456789)
    return isEmail || isPhone;
  },
  { message: "Please enter a valid email or phone number (e.g., 09123456789)" }
);

export const loginSchema = z.object({
  emailOrPhone: emailOrPhoneSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain both letters and numbers"),
  remember: z.boolean().optional(),
});

// Removed 'name' field from registration schema
export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^09\d{9}$/, "Phone number must be in correct format (e.g., 09123456789)"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain both letters and numbers"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;