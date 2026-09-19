import { z } from "zod";

export const supplierSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  address: z.string().nullable(),
});
export type Supplier = z.infer<typeof supplierSchema>;
