export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of your business performance and activities.
        </p>
      </div>

      {/* Empty container prepared for future dashboard widgets */}
      <div className="min-h-[400px] rounded-lg border border-dashed border-border bg-transparent flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Dashboard widgets will appear here
        </p>
      </div>
    </div>
  );
}
