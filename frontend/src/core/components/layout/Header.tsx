import { Menu, Search, Bell } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/core/components/ui/sheet';
import { Sidebar } from './Sidebar';

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <div className="flex-1 md:flex-initial">
          <h1 className="font-semibold text-lg hidden md:block">Business OS</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center ml-2">
          <span className="text-xs font-medium text-primary">JS</span>
        </div>
      </div>
    </header>
  );
}
