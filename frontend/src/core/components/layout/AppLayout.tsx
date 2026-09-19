import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1 w-full md:pl-64">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="w-full p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
