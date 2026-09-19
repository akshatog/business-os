import { z } from "zod";

export const productCategorySchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(1),
});
export type ProductCategory = z.infer<typeof productCategorySchema>;

export const productSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(1),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  categoryId: z.string().uuid().nullable(),
  priceMinor: z.number().int().nonnegative(),
  costPriceMinor: z.number().int().nonnegative(),
  taxRatePercent: z.number().min(0),
  unit: z.enum(["piece", "kg", "litre"]),
  lowStockThreshold: z.number().int().nonnegative(),
  imageUrl: z.string().url().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Product = z.infer<typeof productSchema>;
