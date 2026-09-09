import { describe, it, expect, vi } from "vitest";
import { type Request, type Response, type NextFunction } from "express";
import { requirePermission } from "./permission.middleware.js";
import { type Permission } from "../lib/permissions.js";
import { Role } from "@prisma/client";

function makeReq(
  role?: Role,
): Partial<Request> & {
  user?: { id: string; role: Role; businessId: string; isActive: boolean };
} {
  if (!role) return {};
  return { user: { id: "u1", role, businessId: "b1", isActive: true } };
}

describe("requirePermission middleware", () => {
  it("returns 403 when the role lacks the required permission", () => {
    const req = makeReq(Role.cashier) as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    requirePermission("manage_users" as Permission)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() when the role has the required permission", () => {
    const req = makeReq(Role.owner) as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    requirePermission("manage_users" as Permission)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 401 when there is no user attached to the request", () => {
    const req = makeReq() as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    requirePermission("create_sale" as Permission)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
