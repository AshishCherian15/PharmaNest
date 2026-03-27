'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockUsers } from "@/lib/data"
import type { User } from "@/lib/types"
import { PlusCircle } from "lucide-react";
import { UserFormDialog } from "./_components/user-form-dialog";

export default function UsersPage() {
  const [data, setData] = React.useState<User[]>([]);
  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | undefined>(undefined);

  React.useEffect(() => {
    setData(mockUsers);
  }, []);

  const handleUserSaved = (user: User) => {
    if (editingUser) {
      setData(currentData => currentData.map(u => u.id === user.id ? user : u));
    } else {
      setData(currentData => [{...user, id: `CUS${Date.now()}`}, ...currentData]);
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

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Filter users..." meta={{ onEdit: handleEdit }} />
      </div>
      <UserFormDialog 
        key={editingUser?.id}
        open={isFormDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSave={handleUserSaved}
        user={editingUser}
      />
    </>
  );
}
