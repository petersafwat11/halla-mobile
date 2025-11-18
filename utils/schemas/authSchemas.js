import { z } from "zod";

// Email Login Schema
export const emailLoginSchema = z.object({
  email: z
    .string()
    .min(1, "validation.required")
    .email("validation.invalidEmail"),
  password: z
    .string()
    .min(1, "validation.required")
    .min(8, "validation.passwordMinLength"),
});

// Mobile Login Schema
export const mobileLoginSchema = z.object({
  mobile: z
    .string()
    .min(1, "validation.required")
    .min(9, "validation.mobileMinLength")
    .max(15, "validation.mobileMaxLength")
    .regex(/^[0-9]+$/, "validation.invalidMobile"),
});

// OTP Verification Schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, "validation.otpRequired")
    .length(6, "validation.otpLength")
    .regex(/^[0-9]+$/, "validation.otpLength"),
});

// Signup Mobile Schema
export const signupMobileSchema = z.object({
  mobile: z
    .string()
    .min(1, "validation.required")
    .min(9, "validation.mobileMinLength")
    .max(15, "validation.mobileMaxLength")
    .regex(/^[0-9]+$/, "validation.invalidMobile"),
});

// Complete Profile Schema
export const completeProfileSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "validation.required")
      .min(2, "validation.nameMinLength"),
    email: z
      .string()
      .min(1, "validation.required")
      .email("validation.invalidEmail"),
    password: z
      .string()
      .min(1, "validation.required")
      .min(8, "validation.passwordMinLength"),
    confirmPassword: z.string().min(1, "validation.required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

// Forget Password Schema
export const forgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "validation.required")
    .email("validation.invalidEmail"),
});
