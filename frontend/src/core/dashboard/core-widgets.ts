import type { DashboardWidget } from "@/core/dashboard/registry";
import { SalesTodayWidget } from "@/core/components/dashboard/SalesTodayWidget";
import { TotalCustomersWidget } from "@/core/components/dashboard/TotalCustomersWidget";
import { TotalProductsWidget } from "@/core/components/dashboard/TotalProductsWidget";
import { LowStockWidget } from "@/core/components/dashboard/LowStockWidget";
import { TotalSuppliersWidget } from "@/core/components/dashboard/TotalSuppliersWidget";
import { TodaysTransactionsWidget } from "@/core/components/dashboard/TodaysTransactionsWidget";
import { OutstandingPaymentsWidget } from "@/core/components/dashboard/OutstandingPaymentsWidget";
import { RecentSalesWidget } from "@/core/components/dashboard/RecentSalesWidget";

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
  {
    id: "core-todays-transactions",
    title: "Today's Transactions",
    component: TodaysTransactionsWidget,
    requiredPermission: "create_sale",
    priority: 60,
  },
  {
    id: "core-outstanding-payments",
    title: "Outstanding Payments",
    component: OutstandingPaymentsWidget,
    requiredPermission: "view_financials",
    priority: 70,
  },
  {
    id: "core-recent-sales",
    title: "Recent Sales",
    component: RecentSalesWidget,
    requiredPermission: "view_financials",
    priority: 80,
  },
];
