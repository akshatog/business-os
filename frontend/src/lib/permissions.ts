export enum Role {
  owner = "owner",
  manager = "manager",
  cashier = "cashier",
  inventory_staff = "inventory_staff",
}

export const PERMISSIONS = [
  "manage_users",
  "manage_products",
  "manage_categories",
  "manage_customers",
  "manage_suppliers",
  "create_sale",
  "void_sale",
  "adjust_stock",
  "view_financials",
  "view_reports",
  "manage_purchases",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.owner]: [
    "manage_users",
    "manage_products",
    "manage_categories",
    "manage_customers",
    "manage_suppliers",
    "create_sale",
    "void_sale",
    "adjust_stock",
    "view_financials",
    "view_reports",
    "manage_purchases",
  ],
  [Role.manager]: [
    "manage_products",
    "manage_categories",
    "manage_customers",
    "manage_suppliers",
    "create_sale",
    "void_sale",
    "adjust_stock",
    "view_financials",
    "view_reports",
    "manage_purchases",
  ],
  [Role.cashier]: ["create_sale", "manage_customers"],
  [Role.inventory_staff]: [
    "manage_products",
    "manage_categories",
    "adjust_stock",
    "manage_purchases",
    "manage_suppliers",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
