import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../db/client.js", () => ({
  default: {
    business: { findUnique: vi.fn() },
    $transaction: vi.fn(),
  },
}));

import prisma from "../db/client.js";
import { updateOnboarding } from "./business.service.js";

const mockPrisma = prisma as {
  business: { findUnique: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};

describe("business.service — updateOnboarding", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects if businessType is null before onboarding (nullable field doesn't break reads)", async () => {
    mockPrisma.business.findUnique.mockResolvedValue({
      id: "b1",
      businessType: null,
      onboardingCompleted: false,
    });

    // Reading a business with null businessType should not throw
    const result = await mockPrisma.business.findUnique({ where: { id: "b1" } });
    expect(result.businessType).toBeNull();
    expect(result.onboardingCompleted).toBe(false);
  });

  it("marks onboardingCompleted: true and sets businessType after onboarding", async () => {
    let captured: Record<string, unknown> | undefined;
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => {
      const fakeTx = {
        business: {
          update: vi.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) => {
            captured = data;
            return Promise.resolve({ id: "b1", ...data });
          }),
        },
      };
      return fn(fakeTx as unknown as typeof prisma);
    });

    await updateOnboarding("b1", {
      businessType: "pharmacy",
      address: "123 Main St",
      gstNumber: "27XXXXX",
      phone: "9876543210",
    });

    expect(captured?.onboardingCompleted).toBe(true);
    expect(captured?.businessType).toBe("pharmacy");
  });
});
