import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { SidebarNav } from './_components/sidebar-nav';
import { Header } from './_components/header';
import { mockUser } from '@/lib/data';
import { UserNav } from '@/components/user-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon" className="bg-sidebar">
        <SidebarHeader>
          <Button
            variant="ghost"
            className="h-10 w-full justify-start gap-2 px-2 text-lg font-bold"
          >
            <Icons.Logo className="h-6 w-6 text-primary" />
            <span className="min-w-0 flex-1 truncate">Pharma Nest</span>
          </Button>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>

        <SidebarFooter>
          <div className="group-data-[collapsible=icon]:hidden">
             <UserNav user={mockUser} />
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Header user={mockUser} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
