import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";

// We mock prisma so tests run without a real DB connection
vi.mock("../db/client.js", () => ({
  default: {
    business: { create: vi.fn() },
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import prisma from "../db/client.js";
import { registerBusiness, login } from "./auth.service.js";

const mockPrisma = prisma as {
  business: { create: ReturnType<typeof vi.fn> };
  user: {
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

describe("auth.service — registerBusiness", () => {
  beforeEach(() => vi.clearAllMocks());

  it("hashes the password — plaintext is never stored", async () => {
    let capturedHash: string | undefined;

    mockPrisma.$transaction.mockImplementation(
      async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        const fakeTx = {
          business: {
            create: vi
              .fn()
              .mockResolvedValue({ id: "biz-1", name: "Test Pharma" }),
          },
          user: {
            create: vi
              .fn()
              .mockImplementation(
                ({ data }: { data: { passwordHash: string } }) => {
                  capturedHash = data.passwordHash;
                  return Promise.resolve({ id: "user-1", role: "owner" });
                },
              ),
          },
        };
        return fn(fakeTx as unknown as typeof prisma);
      },
    );

    await registerBusiness({
      businessName: "Test Pharma",
      ownerName: "Rahul",
      ownerEmail: "rahul@test.com",
      password: "secret123",
    });

    expect(capturedHash).toBeDefined();
    expect(capturedHash).not.toBe("secret123");
    expect(await bcrypt.compare("secret123", capturedHash!)).toBe(true);
  });

  it("creates business with onboardingCompleted: false", async () => {
    let capturedBusinessData: Record<string, unknown> | undefined;

    mockPrisma.$transaction.mockImplementation(
      async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        const fakeTx = {
          business: {
            create: vi
              .fn()
              .mockImplementation(
                ({ data }: { data: Record<string, unknown> }) => {
                  capturedBusinessData = data;
                  return Promise.resolve({ id: "biz-1", name: data.name });
                },
              ),
          },
          user: {
            create: vi.fn().mockResolvedValue({ id: "user-1", role: "owner" }),
          },
        };
        return fn(fakeTx as unknown as typeof prisma);
      },
    );

    await registerBusiness({
      businessName: "New Shop",
      ownerName: "Priya",
      ownerEmail: "priya@test.com",
      password: "pass",
    });

    expect(capturedBusinessData?.onboardingCompleted).toBe(false);
    expect(capturedBusinessData?.businessType).toBeUndefined();
  });

  it("returns a JWT string on success", async () => {
    mockPrisma.$transaction.mockImplementation(
      async (fn: (tx: typeof prisma) => Promise<unknown>) => {
        const fakeTx = {
          business: { create: vi.fn().mockResolvedValue({ id: "biz-1" }) },
          user: {
            create: vi.fn().mockResolvedValue({ id: "user-1", role: "owner" }),
          },
        };
        return fn(fakeTx as unknown as typeof prisma);
      },
    );

    const result = await registerBusiness({
      businessName: "Biz",
      ownerName: "Dev",
      ownerEmail: "dev@test.com",
      password: "pass",
    });

    expect(typeof result.token).toBe("string");
    expect(result.token.split(".").length).toBe(3); // valid JWT shape
  });
});

describe("auth.service — login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects with a generic error when email is not found", async () => {
    mockPrisma.user.findFirst.mockResolvedValue(null);

    await expect(
      login({
        email: "nobody@test.com",
        password: "pass",
        businessId: "biz-1",
      }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("rejects with a generic error when password is wrong", async () => {
    const hash = await bcrypt.hash("correctpass", 10);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: "user-1",
      passwordHash: hash,
      isActive: true,
      role: "cashier",
    });

    await expect(
      login({
        email: "user@test.com",
        password: "wrongpass",
        businessId: "biz-1",
      }),
    ).rejects.toThrow("Invalid credentials");
  });

  it("rejects a deactivated user even with correct password", async () => {
    const hash = await bcrypt.hash("pass123", 10);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: "user-1",
      passwordHash: hash,
      isActive: false,
      role: "cashier",
    });

    await expect(
      login({
        email: "inactive@test.com",
        password: "pass123",
        businessId: "biz-1",
      }),
    ).rejects.toThrow("Account is deactivated");
  });

  it("returns a JWT on successful login", async () => {
    const hash = await bcrypt.hash("pass123", 10);
    mockPrisma.user.findFirst.mockResolvedValue({
      id: "user-1",
      passwordHash: hash,
      isActive: true,
      role: "manager",
      businessId: "biz-1",
    });

    const result = await login({
      email: "ok@test.com",
      password: "pass123",
      businessId: "biz-1",
    });

    expect(typeof result.token).toBe("string");
    expect(result.token.split(".").length).toBe(3);
  });
});
