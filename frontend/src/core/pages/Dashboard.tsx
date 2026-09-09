import { composeDashboardWidgets, type DashboardWidget } from "@/core/dashboard/registry";

// Conceptually, module widgets will be injected here later based on the active business type.
// For now, the registry is intentionally empty as we build out the foundation.
const CORE_WIDGETS: DashboardWidget[] = [];
const MODULE_WIDGETS: DashboardWidget[] = [];

export function Dashboard() {
  const activeWidgets = composeDashboardWidgets(CORE_WIDGETS, MODULE_WIDGETS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your business performance and activities.
        </p>
      </div>

      {activeWidgets.length === 0 ? (
        <div className="min-h-[400px] rounded-lg border border-dashed border-border bg-transparent flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Dashboard widgets will appear here
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeWidgets.map((widget) => {
            const WidgetComponent = widget.component;
            return <WidgetComponent key={widget.id} />;
          })}
        </div>
      )}
    </div>
  );
}
