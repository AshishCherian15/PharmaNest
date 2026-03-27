'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockSuppliers } from "@/lib/data"
import type { Supplier } from "@/lib/types"
import { SupplierFormDialog } from "./_components/supplier-form-dialog";
import { PlusCircle } from "lucide-react";

export default function SuppliersPage() {
  const [data, setData] = React.useState<Supplier[]>([]);
  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false);
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | undefined>(undefined);


  React.useEffect(() => {
    setData(mockSuppliers);
  }, []);

  const handleSupplierSaved = (supplier: Supplier) => {
    if (editingSupplier) {
      setData(currentData => currentData.map(s => s.id === supplier.id ? supplier : s));
    } else {
      setData(currentData => [{...supplier, id: `SUP${Date.now()}`}, ...currentData]);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormDialogOpen(true);
  }
  
  const handleAdd = () => {
    setEditingSupplier(undefined);
    setFormDialogOpen(true);
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} meta={{ onEdit: handleEdit }} />
      </div>
      <SupplierFormDialog 
        key={editingSupplier?.id}
        open={isFormDialogOpen} 
        onOpenChange={setFormDialogOpen}
        onSave={handleSupplierSaved}
        supplier={editingSupplier}
      />
    </>
  );
}
