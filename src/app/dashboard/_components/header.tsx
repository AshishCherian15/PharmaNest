import { SidebarTrigger } from '@/components/ui/sidebar';
import type { Profile } from '@/lib/types';
import { UserNav } from '@/components/user-nav';
import { Separator } from '@/components/ui/separator';
import { BackButton } from '@/components/navigation/back-button';
import { ThemeToggle } from '@/components/theme-toggle';

type HeaderProps = { user: Profile };

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-outline-variant/20 bg-surface-container-lowest/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-surface-container-lowest/80 sm:px-6">
      <SidebarTrigger className="flex-shrink-0 text-on-surface-variant hover:text-on-surface" />
      <Separator orientation="vertical" className="h-5 bg-outline-variant/30" />
      <BackButton fallbackHref="/dashboard" />
      <div className="flex-1" />
      <ThemeToggle />
      <UserNav user={user} />
    </header>
  );
}
