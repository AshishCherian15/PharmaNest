import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { SidebarNav } from './_components/sidebar-nav';
import { Header } from './_components/header';
import { mockUser } from '@/lib/data';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const currentUser = { name: session.name, email: session.email, avatarId: mockUser.avatarId };

  return (
    <SidebarProvider>
      {/* Sidebar — stitch admin_crm_dashboard_pharma_nest_3 style */}
      <Sidebar side="left" collapsible="icon" className="bg-surface-container-low border-r-0">
        <SidebarHeader className="border-b border-outline-variant/10 px-4 py-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl transition hover:bg-surface-container-high px-2 py-1"
          >
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="font-headline text-lg font-extrabold leading-tight">
                <span className="text-stitch-primary">Pharma</span>
                <span className="text-stitch-secondary">Nest</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
                Central Management
              </p>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-3">
          <SidebarNav />
        </SidebarContent>

        <SidebarFooter className="border-t border-outline-variant/10 p-3">
          {/* New Order CTA */}
          <Link
            href="/dashboard/sales"
            className="btn-primary-gradient mb-2 w-full py-2.5 text-sm group-data-[collapsible=icon]:hidden"
          >
            + New Order
          </Link>
          {/* User info */}
          <div className="flex items-center gap-3 rounded-xl bg-surface-container-lowest px-3 py-3 group-data-[collapsible=icon]:hidden">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-stitch-primary-fixed text-sm font-bold text-stitch-primary">
              {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-on-surface">{currentUser.name}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
                Head Pharmacist
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <Header user={currentUser} />
        <main className="flex-1 overflow-y-auto dot-pattern">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
