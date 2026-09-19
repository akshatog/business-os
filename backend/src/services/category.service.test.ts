import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../db/client.js", () => ({
  default: {
    productCategory: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    product: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  },
}));

import prisma from "../db/client.js";
import { createCategory, updateCategory, deleteCategory } from "./category.service.js";
import * as auditService from "./audit.service.js";

const mockPrisma = prisma as any;
vi.mock("./audit.service.js", () => ({
  writeAuditLog: vi.fn(),
}));

describe("category.service — createCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a category and writes an audit log", async () => {
    mockPrisma.productCategory.findFirst.mockResolvedValue(null);
    mockPrisma.productCategory.create.mockResolvedValue({ id: "cat-1", name: "Tablets" });

    const result = await createCategory({
      businessId: "biz-1",
      userId: "user-1",
      name: "Tablets",
    });

    expect(result.id).toBe("cat-1");
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "create", entityType: "category" }),
      mockPrisma
    );
  });

  it("rejects creation if category name already exists in same business", async () => {
    mockPrisma.productCategory.findFirst.mockResolvedValue({ id: "cat-2", name: "Tablets" });

    await expect(
      createCategory({
        businessId: "biz-1",
        userId: "user-1",
        name: "Tablets",
      })
    ).rejects.toThrow("A category with this name already exists in your business.");
  });
});

describe("category.service — updateCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a category and writes an audit log", async () => {
    mockPrisma.productCategory.findFirst.mockResolvedValueOnce({ id: "cat-1", businessId: "biz-1", name: "Old" }); // 1. existing check
    mockPrisma.productCategory.findFirst.mockResolvedValueOnce(null); // 2. duplicate name check
    mockPrisma.productCategory.update.mockResolvedValue({ id: "cat-1", name: "New" });

    const result = await updateCategory({
      categoryId: "cat-1",
      businessId: "biz-1",
      userId: "user-1",
      name: "New",
    });

    expect(result.name).toBe("New");
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "update", entityType: "category" }),
      mockPrisma
    );
  });

  it("rejects update if category does not belong to business", async () => {
    mockPrisma.productCategory.findFirst.mockResolvedValue(null);

    await expect(
      updateCategory({
        categoryId: "cat-1",
        businessId: "biz-1",
        userId: "user-1",
        name: "Hacked",
      })
    ).rejects.toThrow("Category not found or access denied.");
  });
});

describe("category.service — deleteCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes a category and writes an audit log", async () => {
    mockPrisma.productCategory.findFirst.mockResolvedValue({ id: "cat-1", businessId: "biz-1" });
    mockPrisma.product.findFirst.mockResolvedValue(null); // No associated products
    mockPrisma.productCategory.delete.mockResolvedValue({ id: "cat-1" });

    await deleteCategory({
      categoryId: "cat-1",
      businessId: "biz-1",
      userId: "user-1",
    });

    expect(mockPrisma.productCategory.delete).toHaveBeenCalled();
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "delete", entityType: "category" }),
      mockPrisma
    );
  });

  it("rejects deletion if category is assigned to products", async () => {
    mockPrisma.productCategory.findFirst.mockResolvedValue({ id: "cat-1", businessId: "biz-1" });
    mockPrisma.product.findFirst.mockResolvedValue({ id: "prod-1" }); // Associated product found!

    await expect(
      deleteCategory({
        categoryId: "cat-1",
        businessId: "biz-1",
        userId: "user-1",
      })
    ).rejects.toThrow("Cannot delete category because it is currently assigned to one or more products.");
  });
});
