import { NavLink } from 'react-router-dom';
import { Home, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Settings', href: '/app/settings', icon: Settings },
    { name: 'Design System', href: '/design-system', icon: LayoutDashboard },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-border/10">
      <div className="flex h-14 items-center px-4 font-bold text-lg border-b border-white/10 tracking-tight">
        Business OS
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-sidebar-foreground/80 hover:bg-white/5 hover:text-white',
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                )
              }
              end={item.href === '/app'}
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 text-sm">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground font-semibold">
            JS
          </div>
          <div>
            <p className="font-medium">Jane Smith</p>
            <p className="text-xs text-sidebar-foreground/60">jane@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
