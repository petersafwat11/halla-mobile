import { z } from "zod";

// Ticket creation/update schema
export const ticketSchema = z.object({
  type: z.enum(["inquiry", "issue", "request", "suggestion", "other"], {
    required_error: "validation.ticketTypeRequired",
  }),
  message: z
    .string()
    .min(10, "validation.ticketMessageMin")
    .max(500, "validation.ticketMessageMax"),
});
