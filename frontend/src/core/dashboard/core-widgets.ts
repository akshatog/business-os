import type { DashboardWidget } from "@/core/dashboard/registry";
import { SalesTodayWidget } from "@/core/components/dashboard/SalesTodayWidget";
import { TotalCustomersWidget } from "@/core/components/dashboard/TotalCustomersWidget";
import { TotalProductsWidget } from "@/core/components/dashboard/TotalProductsWidget";
import { LowStockWidget } from "@/core/components/dashboard/LowStockWidget";
import { TotalSuppliersWidget } from "@/core/components/dashboard/TotalSuppliersWidget";

export const CORE_WIDGETS: DashboardWidget[] = [
  {
    id: "core-sales-today",
    title: "Sales Today",
    component: SalesTodayWidget,
    requiredPermission: "view_financials",
    priority: 10,
  },
  {
    id: "core-total-customers",
    title: "Total Customers",
    component: TotalCustomersWidget,
    requiredPermission: "manage_customers",
    priority: 20,
  },
  {
    id: "core-total-products",
    title: "Products",
    component: TotalProductsWidget,
    requiredPermission: "manage_products",
    priority: 30,
  },
  {
    id: "core-low-stock",
    title: "Low Stock",
    component: LowStockWidget,
    requiredPermission: "adjust_stock",
    priority: 40,
  },
  {
    id: "core-total-suppliers",
    title: "Total Suppliers",
    component: TotalSuppliersWidget,
    requiredPermission: "manage_suppliers",
    priority: 50,
  },
];
