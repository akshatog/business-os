import prisma from "../db/client.js";

type StockMovementType = "purchase" | "sale" | "return" | "damage" | "adjustment" | "transfer";
type StockMovementReferenceType = "sale" | "purchase" | "manual";

type RecordStockMovementParams = {
  businessId: string;
  productId: string;
  userId: string;
  type: StockMovementType;
  quantity: number; // can be negative or positive
  referenceType?: StockMovementReferenceType;
  referenceId?: string;
  reason?: string;
};

/**
 * Calculates current stock by summing all historical movements.
 */
export async function getCurrentStock(businessId: string, productId: string, tx?: any): Promise<number> {
  const db = tx || prisma;
  
  const result = await db.stockMovement.aggregate({
    where: { businessId, productId },
    _sum: { quantity: true },
  });

  return result._sum.quantity || 0;
}

/**
 * Records a new stock movement. 
 * MUST be passed a transactional client (tx) when called as part of a larger operation (like a sale) 
 * to ensure atomicity. Will throw an error if attempting to deduct more stock than available.
 */
export async function recordStockMovement(
  params: RecordStockMovementParams,
  tx: any
) {
  if (!tx) {
    throw new Error("A transaction client (tx) must be provided to recordStockMovement to ensure atomicity");
  }

  // Edge case: Reason is required for adjustment and damage types
  if ((params.type === "adjustment" || params.type === "damage") && !params.reason?.trim()) {
    throw new Error("Reason is required for adjustment and damage movements");
  }

  // 1. LOCK the product row to prevent concurrent race conditions
  // We use Prisma's $queryRaw to execute SELECT ... FOR UPDATE
  await tx.$queryRaw`SELECT id FROM "Product" WHERE id = ${params.productId}::uuid FOR UPDATE`;

  // 2. SUM current stock
  const currentStock = await getCurrentStock(params.businessId, params.productId, tx);

  // 3. VALIDATE negative stock pushes
  if (params.quantity < 0 && currentStock + params.quantity < 0) {
    throw new Error(`Insufficient stock. Cannot deduct ${Math.abs(params.quantity)}, current stock is ${currentStock}.`);
  }

  // 4. INSERT new movement
  return tx.stockMovement.create({
    data: {
      businessId: params.businessId,
      productId: params.productId,
      userId: params.userId,
      type: params.type,
      quantity: params.quantity,
      referenceType: params.referenceType,
      referenceId: params.referenceId,
      reason: params.reason,
    },
  });
}
