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
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isProfileDialogOpen, setProfileDialogOpen] = React.useState(false);
  const [categories, setCategories] = React.useState(['Painkiller', 'Antibiotic', 'Vitamins', 'Personal Care']);
  const [generics, setGenerics] = React.useState(['Paracetamol', 'Amoxicillin', 'Metformin', 'Cetirizine']);
  const [paymentMethods, setPaymentMethods] = React.useState([
    { name: 'UPI', enabled: true },
    { name: 'Cards', enabled: true },
    { name: 'Cash on Delivery', enabled: false },
    { name: 'Net Banking', enabled: true },
  ]);
  const [newCategory, setNewCategory] = React.useState('');
  const [newGeneric, setNewGeneric] = React.useState('');

  const handleStoreInfoSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Settings Saved',
      description: 'Your store information has been updated.',
    });
  };

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value) return;
    if (categories.some((category) => category.toLowerCase() === value.toLowerCase())) {
      toast({ variant: 'destructive', title: 'Category exists', description: 'This category is already listed.' });
      return;
    }
    setCategories((current) => [...current, value]);
    setNewCategory('');
    toast({ title: 'Category added', description: `${value} is now available in the catalog.` });
  };

  const addGeneric = () => {
    const value = newGeneric.trim();
    if (!value) return;
    if (generics.some((generic) => generic.toLowerCase() === value.toLowerCase())) {
      toast({ variant: 'destructive', title: 'Generic exists', description: 'This generic name is already listed.' });
      return;
    }
    setGenerics((current) => [...current, value]);
    setNewGeneric('');
    toast({ title: 'Generic added', description: `${value} was added to the reference list.` });
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Settings</h2>
            <p className="text-sm text-on-surface-variant">Control your storefront, workflow, and app appearance.</p>
          </div>
        </div>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="h-auto flex-wrap justify-start gap-2 bg-surface-container-low p-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="generics">Generics</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
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
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                </div>
                <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Density</Label>
                      <p className="text-xs text-muted-foreground">Better for desktop admin work.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Management</CardTitle>
                <CardDescription>Add, edit, or remove medicine categories.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a new category"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCategory();
                      }
                    }}
                  />
                  <Button onClick={addCategory}>Add Category</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setCategories((current) => current.filter((item) => item !== category))}
                      className="rounded-full border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-sm font-medium text-on-surface transition hover:border-stitch-primary hover:text-stitch-primary"
                    >
                      {category} ×
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="generics">
            <Card>
              <CardHeader>
                <CardTitle>Generic Name Management</CardTitle>
                <CardDescription>Manage generic names for medicines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    value={newGeneric}
                    onChange={(e) => setNewGeneric(e.target.value)}
                    placeholder="Add a generic name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGeneric();
                      }
                    }}
                  />
                  <Button onClick={addGeneric}>Add Generic</Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {generics.map((generic) => (
                    <div key={generic} className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
                      <span className="text-sm font-medium text-on-surface">{generic}</span>
                      <button
                        type="button"
                        onClick={() => setGenerics((current) => current.filter((item) => item !== generic))}
                        className="text-sm font-bold text-stitch-primary hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configure accepted payment methods for the POS.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{method.name}</p>
                      <p className="text-xs text-on-surface-variant">Accepted at checkout and POS terminals.</p>
                    </div>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={(checked) => {
                        setPaymentMethods((current) => current.map((item) => (item.name === method.name ? { ...item, enabled: checked } : item)));
                        toast({ title: checked ? `${method.name} enabled` : `${method.name} disabled` });
                      }}
                    />
                  </div>
                ))}
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
