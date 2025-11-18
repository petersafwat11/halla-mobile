import { z } from "zod";

// Account Settings Schema
export const accountSettingsSchema = z
  .object({
    username: z
      .string()
      .min(2, "validation.usernameMin")
      .max(50, "validation.usernameMax"),
    email: z.string().email("validation.emailInvalid"),
    newPassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, "validation.passwordMin"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return data.confirmPassword === data.newPassword;
      }
      return true;
    },
    {
      message: "validation.passwordsDoNotMatch",
      path: ["confirmPassword"],
    }
  );

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  appNotifications: z.object({
    eventUpdates: z.boolean(),
    eventDates: z.boolean(),
    packageRenewal: z.boolean(),
    systemInteractions: z.boolean(),
  }),
  emailNotifications: z.object({
    eventUpdates: z.boolean(),
    eventDates: z.boolean(),
    packageRenewal: z.boolean(),
    beforeSendingInvitations: z.boolean(),
    afterSendingInvitations: z.boolean(),
  }),
});
