import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("../db/client.js", () => ({
  default: {
    stockMovement: {
      aggregate: vi.fn(),
      create: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

import prisma from "../db/client.js";
import { recordStockMovement, getCurrentStock } from "./stock.service.js";

const mockPrisma = prisma as {
  stockMovement: { 
    aggregate: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  $queryRaw: ReturnType<typeof vi.fn>;
};

describe("stock.service — getCurrentStock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates current stock by summing stock movements", async () => {
    mockPrisma.stockMovement.aggregate.mockResolvedValue({
      _sum: { quantity: 15 },
    });

    const stock = await getCurrentStock("biz-1", "prod-1");
    
    expect(stock).toBe(15);
    expect(mockPrisma.stockMovement.aggregate).toHaveBeenCalledWith({
      where: { businessId: "biz-1", productId: "prod-1" },
      _sum: { quantity: true },
    });
  });

  it("returns 0 if there are no stock movements", async () => {
    mockPrisma.stockMovement.aggregate.mockResolvedValue({
      _sum: { quantity: null },
    });

    const stock = await getCurrentStock("biz-1", "prod-1");
    expect(stock).toBe(0);
  });
});

describe("stock.service — recordStockMovement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an adjustment that would push stock negative", async () => {
    const fakeTx = {
      $queryRaw: vi.fn().mockResolvedValue([]), // Locks product
      stockMovement: {
        aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: 5 } }),
      },
    };

    await expect(
      recordStockMovement({
        businessId: "biz-1",
        productId: "prod-1",
        userId: "user-1",
        type: "sale",
        quantity: -10, // Trying to deduct 10, but only 5 exist
      }, fakeTx as any)
    ).rejects.toThrow("Insufficient stock. Cannot deduct 10, current stock is 5.");
  });

  it("rejects adjustment or damage types without a required reason", async () => {
    const fakeTx = {
      $queryRaw: vi.fn().mockResolvedValue([]),
      stockMovement: {
        aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: 10 } }),
      },
    };

    await expect(
      recordStockMovement({
        businessId: "biz-1",
        productId: "prod-1",
        userId: "user-1",
        type: "damage",
        quantity: -2,
        reason: undefined, // Missing reason
      }, fakeTx as any)
    ).rejects.toThrow("Reason is required for adjustment and damage movements");
    
    await expect(
      recordStockMovement({
        businessId: "biz-1",
        productId: "prod-1",
        userId: "user-1",
        type: "adjustment",
        quantity: 5,
        reason: "", // Empty reason
      }, fakeTx as any)
    ).rejects.toThrow("Reason is required for adjustment and damage movements");
  });

  it("locks the product, checks stock, and creates a movement successfully within a transaction", async () => {
    const fakeTx = {
      $queryRaw: vi.fn().mockResolvedValue([]),
      stockMovement: {
        aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: 20 } }),
        create: vi.fn().mockResolvedValue({ id: "move-1" }),
      },
    };

    await recordStockMovement({
      businessId: "biz-1",
      productId: "prod-1",
      userId: "user-1",
      type: "sale",
      quantity: -5,
      referenceType: "sale",
      referenceId: "sale-1",
    }, fakeTx as any);

    // 1. Check lock
    expect(fakeTx.$queryRaw).toHaveBeenCalled();
    // 2. Check stock sum
    expect(fakeTx.stockMovement.aggregate).toHaveBeenCalled();
    // 3. Create movement
    expect(fakeTx.stockMovement.create).toHaveBeenCalledWith({
      data: {
        businessId: "biz-1",
        productId: "prod-1",
        userId: "user-1",
        type: "sale",
        quantity: -5,
        referenceType: "sale",
        referenceId: "sale-1",
        reason: undefined,
      }
    });
  });

  it("allows a positive stock movement without checking negative constraints", async () => {
    const fakeTx = {
      $queryRaw: vi.fn().mockResolvedValue([]),
      stockMovement: {
        aggregate: vi.fn().mockResolvedValue({ _sum: { quantity: 0 } }),
        create: vi.fn().mockResolvedValue({ id: "move-2" }),
      },
    };

    await recordStockMovement({
      businessId: "biz-1",
      productId: "prod-1",
      userId: "user-1",
      type: "purchase",
      quantity: 50,
      referenceType: "purchase",
      referenceId: "purch-1",
    }, fakeTx as any);

    expect(fakeTx.stockMovement.create).toHaveBeenCalled();
  });
});
