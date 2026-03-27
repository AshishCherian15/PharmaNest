'use client';

import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { mockUser } from '@/lib/data';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isProfileDialogOpen, setProfileDialogOpen] = React.useState(false);

  const handleStoreInfoSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Settings Saved',
      description: 'Your store information has been updated.',
    });
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  This is your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input defaultValue={mockUser.name} readOnly />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input defaultValue={mockUser.email} readOnly />
                </div>
                <Button onClick={() => setProfileDialogOpen(true)}>
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Tab */}
          <TabsContent value="store" className="space-y-4">
            <Card>
              <form onSubmit={handleStoreInfoSave}>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>
                    Manage your pharmacy's public details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" defaultValue="Pharma Nest" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="storeAddress">Address</Label>
                    <Input id="storeAddress" defaultValue="123 Health St, Wellness City, 110001" />
                  </div>
                   <div className="space-y-1">
                    <Label htmlFor="storePhone">Contact Phone</Label>
                    <Input id="storePhone" defaultValue="+91-9876543210" />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </CardContent>
              </form>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
           <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <Label>Dark Mode</Label>
                        <p className="text-xs text-muted-foreground">
                            Toggle the application theme between light and dark.
                        </p>
                    </div>
                    <Switch
                        // Note: Theme switching logic is not implemented yet.
                        // This would require a ThemeProvider context.
                        onCheckedChange={() => toast({ title: "Theme switching coming soon!" })}
                    />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <EditProfileDialog
        user={mockUser}
        open={isProfileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />
    </>
  );
}
