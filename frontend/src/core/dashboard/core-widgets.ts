import type { DashboardWidget } from "@/core/dashboard/registry";
import { SalesTodayWidget } from "@/core/components/dashboard/SalesTodayWidget";

export const CORE_WIDGETS: DashboardWidget[] = [
  {
    id: "core-sales-today",
    title: "Sales Today",
    component: SalesTodayWidget,
    requiredPermission: "view_financials",
    priority: 10,
  },
];
