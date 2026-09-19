import { z } from "zod";

export const stockMovementSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  productId: z.string().uuid(),
  type: z.enum([
    "purchase",
    "sale",
    "return",
    "damage",
    "adjustment",
    "transfer",
  ]),
  quantity: z.number().int(),
  referenceType: z.enum(["sale", "purchase", "manual"]).nullable(),
  referenceId: z.string().uuid().nullable(),
  reason: z.string().nullable(),
  userId: z.string().uuid(),
  createdAt: z.string().datetime(),
});
export type StockMovement = z.infer<typeof stockMovementSchema>;
