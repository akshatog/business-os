import { z } from "zod";

export const purchaseItemSchema = z.object({
  id: z.string().uuid(),
  purchaseId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitCostMinor: z.number().int().nonnegative(),
  batchId: z.string().uuid().nullable(),
});
export type PurchaseItem = z.infer<typeof purchaseItemSchema>;

export const purchaseSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  supplierId: z.string().uuid(),
  invoiceNumber: z.string().nullable(),
  totalAmountMinor: z.number().int().nonnegative(),
  status: z.enum(["pending", "received"]),
  createdAt: z.string().datetime(),
});
export type Purchase = z.infer<typeof purchaseSchema>;
