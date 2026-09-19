import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../db/client.js", () => ({
  default: {
    product: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    category: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  },
}));

import prisma from "../db/client.js";
import { createProduct } from "./product.service.js";
import * as auditService from "./audit.service.js";

const mockPrisma = prisma as any;
vi.mock("./audit.service.js", () => ({
  writeAuditLog: vi.fn(),
}));

describe("product.service — createProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a product and writes an audit log", async () => {
    mockPrisma.product.findFirst.mockResolvedValue(null);
    mockPrisma.category.findFirst.mockResolvedValue({ id: "cat-1", businessId: "biz-1" });
    mockPrisma.product.create.mockResolvedValue({ id: "prod-1", name: "Paracetamol" });

    const result = await createProduct({
      businessId: "biz-1",
      userId: "user-1",
      name: "Paracetamol",
      sku: "PARA-500",
      price: 1500, // 15.00 INR
      categoryId: "cat-1",
    });

    expect(result.id).toBe("prod-1");
    expect(mockPrisma.product.create).toHaveBeenCalled();
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "create",
        entityType: "product",
      }),
      mockPrisma
    );
  });

  it("rejects creation if the SKU already exists for the same business", async () => {
    mockPrisma.product.findFirst.mockResolvedValue({ id: "prod-2", sku: "PARA-500" });

    await expect(
      createProduct({
        businessId: "biz-1",
        userId: "user-1",
        name: "Different Paracetamol",
        sku: "PARA-500",
        price: 1000,
      })
    ).rejects.toThrow("A product with this SKU already exists in your business.");
  });

  it("rejects cross-tenant relations if categoryId belongs to another business", async () => {
    mockPrisma.product.findFirst.mockResolvedValue(null);
    
    // DB returns null because where { businessId: "biz-1" } does not match the actual "biz-2" row
    mockPrisma.category.findFirst.mockResolvedValue(null);

    await expect(
      createProduct({
        businessId: "biz-1", // User's actual business
        userId: "user-1",
        name: "Test",
        sku: "TEST-1",
        price: 100,
        categoryId: "cat-1",
      })
    ).rejects.toThrow("Invalid category: Does not exist or belongs to another business.");
  });
});

describe("product.service — updateProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a product and writes an audit log", async () => {
    mockPrisma.product.findFirst.mockResolvedValueOnce({ id: "prod-1", businessId: "biz-1", sku: "OLD-SKU" }); // 1. existingProduct
    mockPrisma.product.findFirst.mockResolvedValueOnce(null); // 2. sku conflict check
    mockPrisma.product.update.mockResolvedValue({ id: "prod-1", name: "Updated Paracetamol" });

    const result = await (await import("./product.service.js")).updateProduct({
      productId: "prod-1",
      businessId: "biz-1",
      userId: "user-1",
      name: "Updated Paracetamol",
      sku: "NEW-SKU",
      price: 1600,
    });

    expect(result.name).toBe("Updated Paracetamol");
    expect(mockPrisma.product.update).toHaveBeenCalled();
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "update", entityType: "product" }),
      mockPrisma
    );
  });

  it("rejects update if product does not belong to the business", async () => {
    mockPrisma.product.findFirst.mockResolvedValue(null); // Not found for this businessId

    await expect(
      (await import("./product.service.js")).updateProduct({
        productId: "prod-1",
        businessId: "biz-1",
        userId: "user-1",
        name: "Hacked",
      })
    ).rejects.toThrow("Product not found or access denied.");
  });

  it("rejects update if new SKU conflicts with another product in same business", async () => {
    // 1st call (checking product existence): found
    mockPrisma.product.findFirst.mockResolvedValueOnce({ id: "prod-1", businessId: "biz-1", sku: "OLD" });
    // 2nd call (checking SKU uniqueness): found ANOTHER product with the new SKU
    mockPrisma.product.findFirst.mockResolvedValueOnce({ id: "prod-2", businessId: "biz-1", sku: "DUPE" });

    await expect(
      (await import("./product.service.js")).updateProduct({
        productId: "prod-1",
        businessId: "biz-1",
        userId: "user-1",
        sku: "DUPE",
      })
    ).rejects.toThrow("A product with this SKU already exists in your business.");
  });
});

