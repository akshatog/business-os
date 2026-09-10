import type { DashboardWidget } from "@/core/dashboard/registry";
import { SalesTodayWidget } from "@/core/components/dashboard/SalesTodayWidget";
import { TotalCustomersWidget } from "@/core/components/dashboard/TotalCustomersWidget";

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
];
