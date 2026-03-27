import { SidebarTrigger } from '@/components/ui/sidebar';
import type { User } from '@/lib/types';
import { UserNav } from '@/components/user-nav';

type HeaderProps = {
  user: User;
};

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <SidebarTrigger className="sm:hidden" />
      <div className="flex-1" />
      <div className="hidden sm:block">
        <UserNav user={user} />
      </div>
    </header>
  );
}
