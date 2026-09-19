import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../db/client.js", () => ({
  default: {
    supplier: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  },
}));

import prisma from "../db/client.js";
import { createSupplier, updateSupplier } from "./supplier.service.js";
import * as auditService from "./audit.service.js";

const mockPrisma = prisma as any;
vi.mock("./audit.service.js", () => ({
  writeAuditLog: vi.fn(),
}));

describe("supplier.service — createSupplier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a supplier and writes an audit log", async () => {
    mockPrisma.supplier.findFirst.mockResolvedValue(null);
    mockPrisma.supplier.create.mockResolvedValue({ id: "supp-1", name: "Pharma Dist" });

    const result = await createSupplier({
      businessId: "biz-1",
      userId: "user-1",
      name: "Pharma Dist",
    });

    expect(result.id).toBe("supp-1");
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "create", entityType: "supplier" }),
      mockPrisma
    );
  });
});

describe("supplier.service — updateSupplier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a supplier and writes an audit log", async () => {
    mockPrisma.supplier.findFirst.mockResolvedValueOnce({ id: "supp-1", businessId: "biz-1", phone: "111" }); 
    mockPrisma.supplier.findFirst.mockResolvedValueOnce(null); 
    mockPrisma.supplier.update.mockResolvedValue({ id: "supp-1", name: "New Name" });

    const result = await updateSupplier({
      supplierId: "supp-1",
      businessId: "biz-1",
      userId: "user-1",
      name: "New Name",
      phone: "222",
    });

    expect(result.name).toBe("New Name");
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "update", entityType: "supplier" }),
      mockPrisma
    );
  });
});
