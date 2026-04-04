'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { columns } from "./_components/columns"
import { DataTable } from "@/app/dashboard/_components/data-table"
import { mockUsers } from "@/lib/data"
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

  React.useEffect(() => {
    setData(mockUsers);
  }, []);

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

  const handleUserSaved = (user: User) => {
    if (editingUser) {
      setData(currentData => currentData.map(u => u.id === user.id ? user : u));
    } else {
      setData(currentData => [{...user, id: `CUS${Date.now()}`}, ...currentData]);
    }
    setEditingUser(undefined);
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

  const handleConfirmDelete = () => {
    if (selectedUserId) {
      setData(currentData => currentData.filter(u => u.id !== selectedUserId));
      toast({
        title: "User Deleted",
        description: "The user has been successfully removed.",
      });
    }
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
  };


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader
          title="User Management"
          description="Manage staff roles and access."
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
              <Badge variant="secondary" className="ml-2">
                {role === 'All' ? data.length : data.filter(user => user.role === role).length}
              </Badge>
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
