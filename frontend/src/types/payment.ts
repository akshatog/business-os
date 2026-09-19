import { z } from "zod";

export const paymentSchema = z.object({
  id: z.string().uuid(),
  saleId: z.string().uuid(),
  method: z.enum(["cash", "upi", "card"]),
  amountMinor: z.number().int().positive(),
  status: z.enum(["completed", "failed", "refunded"]),
  createdAt: z.string().datetime(),
});
export type Payment = z.infer<typeof paymentSchema>;
