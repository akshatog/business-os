import { describe, it, expect, vi, beforeEach } from "vitest";
import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

vi.mock("../db/client.js", () => ({
  default: {
    user: { findUnique: vi.fn() },
  },
}));

import prisma from "../db/client.js";
import { authenticateToken } from "./auth.middleware.js";

const mockPrisma = prisma as {
  user: { findUnique: ReturnType<typeof vi.fn> };
};

const SECRET = process.env["JWT_SECRET"] ?? "test-secret";

function makeToken(payload: object, secret = SECRET) {
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

function makeReq(token?: string): Partial<Request> {
  return {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  };
}

describe("authenticateToken middleware", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when no token is provided", async () => {
    const req = makeReq() as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for an invalid/tampered JWT", async () => {
    const req = makeReq("this.is.notvalid") as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for an expired JWT", async () => {
    const expiredToken = jwt.sign({ userId: "u1", role: "cashier" }, SECRET, {
      expiresIn: -1,
    });
    const req = makeReq(expiredToken) as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 for a valid JWT but deactivated user (DB check)", async () => {
    const token = makeToken({
      userId: "u1",
      role: "cashier",
      businessId: "b1",
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "u1",
      isActive: false,
      role: "cashier",
      businessId: "b1",
    });

    const req = makeReq(token) as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() and attaches user for a valid, active token", async () => {
    const token = makeToken({
      userId: "u1",
      role: "manager",
      businessId: "b1",
    });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: "u1",
      isActive: true,
      role: "manager",
      businessId: "b1",
    });

    const req = makeReq(token) as Request & { user?: unknown };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });
});
