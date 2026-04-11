'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "@/app/dashboard/_components/data-table"
import type { User } from "@/lib/types"
import { Download, PlusCircle, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { UserFormDialog } from "./_components/add-customer-dialog";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "../_components/stat-card";

const ROLE_FILTERS: Array<User['role'] | 'All'> = ['All', 'Admin', 'Pharmacist', 'Staff'];

export default function UsersPage() {
  const { toast } = useToast();
  const [data, setData] = React.useState<User[]>([]);
  const [roleFilter, setRoleFilter] = React.useState<User['role'] | 'All'>('All');
  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | undefined>(undefined);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load users');
      const json = (await res.json()) as { users?: User[] };
      setData(json.users ?? []);
    } catch {
      toast({ variant: 'destructive', title: 'Load failed', description: 'Unable to fetch users.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredData = React.useMemo(
    () => (roleFilter === 'All' ? data : data.filter(user => user.role === roleFilter)),
    [data, roleFilter]
  );

  const adminCount = data.filter(user => user.role === 'Admin').length;
  const pharmacistCount = data.filter(user => user.role === 'Pharmacist').length;
  const staffCount = data.filter(user => user.role === 'Staff').length;

  const handleExportUsers = () => {
    const rows = [
      ['ID', 'Name', 'Email', 'Phone', 'Role'],
      ...filteredData.map(user => [user.id, user.name, user.email, user.phone, user.role]),
    ];
    const csv = rows.map(row => row.map(value => `"${value}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pharma-nest-users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUserSaved = async (user: User) => {
    try {
      if (editingUser) {
        const res = await fetch(`/api/admin/users/${encodeURIComponent(user.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Update failed');
        toast({ title: 'User Updated', description: `${user.name} has been successfully updated.` });
      } else {
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Create failed');
        toast({ title: 'User Added', description: `${user.name} has been successfully added.` });
      }
      setEditingUser(undefined);
      await loadUsers();
    } catch {
      toast({ variant: 'destructive', title: 'Save failed', description: 'Unable to save user changes.' });
    }
  };
  
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormDialogOpen(true);
  }

  const handleAdd = () => {
    setEditingUser(undefined);
    setFormDialogOpen(true);
  }

  const handleDelete = (userId: string) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUserId) return;

    try {
      const user = data.find((u) => u.id === selectedUserId);
      const res = await fetch(`/api/admin/users/${encodeURIComponent(selectedUserId)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      toast({ title: 'User Deleted', description: `${user?.name || 'Item'} has been removed.` });
      await loadUsers();
    } catch {
      toast({ variant: 'destructive', title: 'Delete failed', description: 'Unable to delete the user.' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader
          title="User Management"
          description={loading ? 'Loading users...' : 'Manage staff roles and access.'}
          action={
            <>
              <Button variant="outline" onClick={handleExportUsers}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Team Members"
            value={data.length.toString()}
            description="All active users in the system"
            icon={Users}
          />
          <StatCard
            title="Admins"
            value={adminCount.toString()}
            description="Platform and security administrators"
            icon={ShieldCheck}
          />
          <StatCard
            title="Pharmacists"
            value={pharmacistCount.toString()}
            description="Medication verification roles"
            icon={Stethoscope}
          />
          <StatCard
            title="Staff"
            value={staffCount.toString()}
            description="Operations and support users"
            icon={Users}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-md border p-3">
          {ROLE_FILTERS.map(role => (
            <Button
              key={role}
              variant={roleFilter === role ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoleFilter(role)}
            >
              {role}
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold">
                {role === 'All' ? data.length : data.filter(user => user.role === role).length}
              </span>
            </Button>
          ))}
        </div>
        <DataTable 
          columns={columns} 
          data={filteredData} 
          filterColumn="name" 
          filterPlaceholder="Filter users..." 
          meta={{ onEdit: handleEdit, onDelete: handleDelete }} 
        />
      </div>
      <UserFormDialog 
        key={editingUser?.id}
        open={isFormDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSave={handleUserSaved}
        user={editingUser}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this user?"
        description="This action cannot be undone. This will permanently delete the user's account."
      />
    </>
  );
}
