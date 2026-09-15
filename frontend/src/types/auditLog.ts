import { z } from "zod";

export const auditLogSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  userId: z.string().uuid(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string().uuid(),
  oldValue: z.any().nullable(),
  newValue: z.any().nullable(),
  reason: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type AuditLog = z.infer<typeof auditLogSchema>;
