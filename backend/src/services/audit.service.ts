import prisma from "../db/client.js";

type AuditLogParams = {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
};

/**
 * Writes an audit log.
 * Can accept an optional Prisma transactional client (`tx`) to participate in a larger transaction.
 */
export async function writeAuditLog(params: AuditLogParams, tx?: any) {
  const db = tx || prisma;

  const user = await db.user.findUnique({
    where: { id: params.userId },
    select: { businessId: true },
  });

  if (!user) {
    throw new Error("User not found to associate with audit log");
  }

  return db.auditLog.create({
    data: {
      userId: params.userId,
      businessId: user.businessId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      oldValue: params.oldValue ?? null,
      newValue: params.newValue ?? null,
      reason: params.reason ?? null,
    },
  });
}
