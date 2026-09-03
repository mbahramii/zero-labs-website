import { z } from "zod";

// Iranian mobile phone format (e.g., 09123456789)
const phoneSchema = z
  .string()
  .regex(/^09\d{9}$/, "Invalid phone number (e.g., 09123456789)");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, "Password must contain both letters and numbers");

const otpSchema = z.string().regex(/^\d{6}$/, "Verification code must be 6 digits");

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerRequestSchema = z.object({
  phone: phoneSchema,
});

export const registerVerifySchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
  password: passwordSchema,
  display_name: z.string().max(100).optional(),
});

export const resetRequestSchema = z.object({
  phone: phoneSchema,
});

export const resetConfirmSchema = z.object({
  phone: phoneSchema,
  code: otpSchema,
  new_password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterRequestFormData = z.infer<typeof registerRequestSchema>;
export type RegisterVerifyFormData = z.infer<typeof registerVerifySchema>;
export type ResetRequestFormData = z.infer<typeof resetRequestSchema>;
export type ResetConfirmFormData = z.infer<typeof resetConfirmSchema>;