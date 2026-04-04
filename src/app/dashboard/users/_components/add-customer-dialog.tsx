'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Loader2, User as UserIcon } from 'lucide-react';
import type { User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: User) => void;
  user?: User;
}

export function UserFormDialog({ open, onOpenChange, onSave, user }: UserFormDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const isEditing = !!user;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const randomAvatar = PlaceHolderImages.find(p => p.id.startsWith('user-avatar')) || PlaceHolderImages[0];
    
    const savedUser: User = {
        id: isEditing ? user.id : `CUS${Date.now()}`,
        name: data.name as string,
        email: data.email as string,
        phone: data.phone as string,
        role: data.role as User['role'],
        totalSpent: user?.totalSpent || 0,
        avatarId: user?.avatarId || randomAvatar.id,
    };

    setTimeout(() => {
      onSave(savedUser);
      setIsSaving(false);
      onOpenChange(false);
      toast({
        title: isEditing ? 'User Updated' : 'User Added',
        description: `${data.name} has been successfully saved.`,
      });
    }, 1000);
  };
  
  const userAvatar = PlaceHolderImages.find((img) => img.id === user?.avatarId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form id="user-form" onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
             <div className="flex items-center justify-center">
                <div className="relative">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview ?? userAvatar?.imageUrl} alt="New user avatar" />
                    <AvatarFallback><UserIcon className="h-10 w-10 text-muted-foreground" /></AvatarFallback>
                </Avatar>
                <Label htmlFor="avatar-upload" className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Upload avatar</span>
                </Label>
                <Input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" defaultValue={user?.name} placeholder="e.g., Jane Doe" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={user?.email} placeholder="e.g., jane.doe@example.com" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Phone</Label>
              <Input id="phone" name="phone" defaultValue={user?.phone} placeholder="e.g., +91-9876543210" required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
                <Select name="role" defaultValue={user?.role || 'Staff'}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
