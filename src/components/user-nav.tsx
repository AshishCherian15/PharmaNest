'use client'; // Need to make this a client component to use state

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Profile } from '@/lib/types';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { EditProfileDialog } from './edit-profile-dialog';

type UserNavProps = {
  user: Profile;
};

export function UserNav({ user }: UserNavProps) {
  const [isProfileDialogOpen, setProfileDialogOpen] = useState(false);
  const userAvatar = PlaceHolderImages.find((img) => img.id === user.avatarId);
  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={userAvatar?.imageUrl}
                alt={user.name}
                data-ai-hint={userAvatar?.imageHint}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setProfileDialogOpen(true)}>
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <Link href="/dashboard/settings" passHref legacyBehavior>
                <DropdownMenuItem>
                <Settings />
                Settings
                </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <Link href="/login" passHref legacyBehavior>
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditProfileDialog user={user} open={isProfileDialogOpen} onOpenChange={setProfileDialogOpen} />
    </>
  );
}
