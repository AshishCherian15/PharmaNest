'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "@/app/dashboard/_components/data-table"
import { mockSuppliers } from "@/lib/data"
import type { Supplier } from "@/lib/types"
import { SupplierFormDialog } from "./_components/add-supplier-dialog";
import { PlusCircle } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/dashboard/page-header";

export default function SuppliersPage() {
  const { toast } = useToast();
  const [data, setData] = React.useState<Supplier[]>([]);
  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | undefined>(undefined);
  const [selectedSupplierId, setSelectedSupplierId] = React.useState<string | null>(null);


  React.useEffect(() => {
    setData(mockSuppliers);
  }, []);

  const handleSupplierSaved = (supplier: Supplier) => {
    if (editingSupplier) {
      setData(currentData => currentData.map(s => s.id === supplier.id ? supplier : s));
    } else {
      setData(currentData => [{...supplier, id: `SUP${Date.now()}`}, ...currentData]);
    }
    setEditingSupplier(undefined);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormDialogOpen(true);
  }
  
  const handleAdd = () => {
    setEditingSupplier(undefined);
    setFormDialogOpen(true);
  }

  const handleDelete = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setDeleteDialogOpen(true);
  }

  const handleConfirmDelete = () => {
    if (selectedSupplierId) {
      setData(currentData => currentData.filter(s => s.id !== selectedSupplierId));
       toast({
        title: "Supplier Deleted",
        description: "The supplier has been successfully removed.",
      });
    }
    setDeleteDialogOpen(false);
    setSelectedSupplierId(null);
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader
          title="Suppliers"
          description="Manage your supplier partnerships."
          action={
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          }
        />
        <DataTable 
          columns={columns} 
          data={data}
          filterColumn="name"
          filterPlaceholder="Filter suppliers..."
          meta={{ onEdit: handleEdit, onDelete: handleDelete }} 
        />
      </div>
      <SupplierFormDialog 
        key={editingSupplier?.id}
        open={isFormDialogOpen} 
        onOpenChange={setFormDialogOpen}
        onSave={handleSupplierSaved}
        supplier={editingSupplier}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this supplier?"
        description="This action cannot be undone. This will permanently delete the supplier and any associated data."
      />
    </>
  );
}
