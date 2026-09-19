import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("../db/client.js", () => ({
  default: {
    auditLog: {
      create: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    }
  },
}));

import prisma from "../db/client.js";
import { writeAuditLog } from "./audit.service.js";

const mockPrisma = prisma as {
  auditLog: { create: ReturnType<typeof vi.fn> };
  user: { findUnique: ReturnType<typeof vi.fn> };
};

describe("audit.service — writeAuditLog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the user's businessId and creates an AuditLog entry", async () => {
    // Arrange
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "user-1",
      businessId: "biz-1",
    });

    mockPrisma.auditLog.create.mockResolvedValue({
      id: "audit-1",
    });

    // Act
    await writeAuditLog({
      userId: "user-1",
      action: "create",
      entityType: "product",
      entityId: "prod-1",
      oldValue: null,
      newValue: { name: "Aspirin" },
      reason: "New stock setup",
    });

    // Assert
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { businessId: true },
    });

    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        businessId: "biz-1",
        action: "create",
        entityType: "product",
        entityId: "prod-1",
        oldValue: null,
        newValue: { name: "Aspirin" },
        reason: "New stock setup",
      },
    });
  });

  it("throws an error if the user is not found", async () => {
    // Arrange
    mockPrisma.user.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(
      writeAuditLog({
        userId: "unknown-user",
        action: "delete",
        entityType: "product",
        entityId: "prod-2",
      })
    ).rejects.toThrow("User not found to associate with audit log");
  });
  
  it("can accept an open transaction client (tx) instead of using the global prisma", async () => {
    // Arrange
    mockPrisma.user.findUnique.mockResolvedValue({ businessId: "biz-1" });
    
    const fakeTx = {
      user: {
        findUnique: vi.fn().mockResolvedValue({ businessId: "biz-1" })
      },
      auditLog: {
        create: vi.fn().mockResolvedValue({ id: "audit-2" })
      }
    };

    // Act
    await writeAuditLog({
      userId: "user-1",
      action: "update",
      entityType: "sale",
      entityId: "sale-1",
    }, fakeTx as any);

    // Assert
    expect(fakeTx.user.findUnique).toHaveBeenCalled();
    expect(fakeTx.auditLog.create).toHaveBeenCalled();
    expect(mockPrisma.auditLog.create).not.toHaveBeenCalled(); // Global prisma wasn't touched
  });
});
