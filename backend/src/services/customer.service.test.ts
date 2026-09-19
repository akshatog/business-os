import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../db/client.js", () => ({
  default: {
    customer: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(mockPrisma)),
  },
}));

import prisma from "../db/client.js";
import { createCustomer, updateCustomer } from "./customer.service.js";
import * as auditService from "./audit.service.js";

const mockPrisma = prisma as any;
vi.mock("./audit.service.js", () => ({
  writeAuditLog: vi.fn(),
}));

describe("customer.service — createCustomer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a customer with only a name (phone/email optional)", async () => {
    mockPrisma.customer.findFirst.mockResolvedValue(null);
    mockPrisma.customer.create.mockResolvedValue({ id: "cust-1", name: "Walk-in" });

    const result = await createCustomer({
      businessId: "biz-1",
      userId: "user-1",
      name: "Walk-in",
    });

    expect(result.id).toBe("cust-1");
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "create", entityType: "customer" }),
      mockPrisma
    );
  });

  it("rejects creation if phone already exists in the same business", async () => {
    mockPrisma.customer.findFirst.mockResolvedValue({ id: "cust-2", phone: "9876543210" });

    await expect(
      createCustomer({
        businessId: "biz-1",
        userId: "user-1",
        name: "Rahul",
        phone: "9876543210",
      })
    ).rejects.toThrow("A customer with this phone number already exists in your business.");
  });
});

describe("customer.service — updateCustomer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a customer and writes an audit log", async () => {
    mockPrisma.customer.findFirst.mockResolvedValueOnce({ id: "cust-1", businessId: "biz-1", phone: "111" }); // existing customer
    mockPrisma.customer.findFirst.mockResolvedValueOnce(null); // phone conflict check
    mockPrisma.customer.update.mockResolvedValue({ id: "cust-1", name: "Rahul Sharma" });

    const result = await updateCustomer({
      customerId: "cust-1",
      businessId: "biz-1",
      userId: "user-1",
      name: "Rahul Sharma",
      phone: "222",
    });

    expect(result.name).toBe("Rahul Sharma");
    expect(auditService.writeAuditLog).toHaveBeenCalledWith(
      expect.objectContaining({ action: "update", entityType: "customer" }),
      mockPrisma
    );
  });

  it("rejects update if customer does not belong to business", async () => {
    mockPrisma.customer.findFirst.mockResolvedValue(null);

    await expect(
      updateCustomer({
        customerId: "cust-1",
        businessId: "biz-1",
        userId: "user-1",
        name: "Hacked",
      })
    ).rejects.toThrow("Customer not found or access denied.");
  });
});
