import { z } from "zod";

export const saleItemSchema = z.object({
  id: z.string().uuid(),
  saleId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPriceMinor: z.number().int().nonnegative(),
  discountMinor: z.number().int().nonnegative(),
  taxAmountMinor: z.number().int().nonnegative(),
  lineTotalMinor: z.number().int().nonnegative(),
});
export type SaleItem = z.infer<typeof saleItemSchema>;

export const saleSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  invoiceNumber: z.string(),
  customerId: z.string().uuid().nullable(),
  userId: z.string().uuid(),
  subtotalMinor: z.number().int().nonnegative(),
  taxAmountMinor: z.number().int().nonnegative(),
  discountAmountMinor: z.number().int().nonnegative(),
  totalAmountMinor: z.number().int().nonnegative(),
  status: z.enum(["completed", "voided", "partially_refunded", "refunded"]),
  createdAt: z.string().datetime(),
});
export type Sale = z.infer<typeof saleSchema>;
