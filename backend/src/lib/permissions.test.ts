import { describe, it, expect } from "vitest";
import { Role } from "@prisma/client";
import { hasPermission } from "./permissions.js";

describe("Permissions Map", () => {
  it("owner should have all permissions", () => {
    expect(hasPermission(Role.owner, "manage_users")).toBe(true);
    expect(hasPermission(Role.owner, "create_sale")).toBe(true);
  });

  it("manager should not have manage_users permission", () => {
    expect(hasPermission(Role.manager, "manage_users")).toBe(false);
    expect(hasPermission(Role.manager, "create_sale")).toBe(true);
  });

  it("cashier should only have basic sale permissions", () => {
    expect(hasPermission(Role.cashier, "create_sale")).toBe(true);
    expect(hasPermission(Role.cashier, "manage_products")).toBe(false);
  });

  it("inventory_staff should have stock but not sale permissions", () => {
    expect(hasPermission(Role.inventory_staff, "adjust_stock")).toBe(true);
    expect(hasPermission(Role.inventory_staff, "create_sale")).toBe(false);
  });
});
