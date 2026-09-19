import type { ComponentType } from "react";
import type { Permission } from "@/lib/permissions";

export interface DashboardWidget {
  id: string;
  title: string;
  component: ComponentType;
  requiredPermission?: Permission;
  priority?: number;
}

/**
 * Combines core widgets with vertical-specific module widgets.
 * Sorts them by priority (lower number = higher priority).
 */
export function composeDashboardWidgets(
  coreWidgets: DashboardWidget[],
  moduleWidgets: DashboardWidget[]
): DashboardWidget[] {
  return [...coreWidgets, ...moduleWidgets].sort((a, b) => {
    const priorityA = a.priority ?? 999;
    const priorityB = b.priority ?? 999;
    return priorityA - priorityB;
  });
}
