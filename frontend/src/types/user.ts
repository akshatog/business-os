import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  passwordHash: z.string(),
  role: z.enum(["owner", "manager", "cashier", "inventory_staff"]),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;
