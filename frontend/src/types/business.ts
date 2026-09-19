import { z } from "zod";

export const businessSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  businessType: z.enum(["pharmacy", "clothing", "grocery"]).nullable(),
  address: z.string().nullable(),
  gstNumber: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  onboardingCompleted: z.boolean(),
  createdAt: z.string().datetime(),
});
export type Business = z.infer<typeof businessSchema>;
