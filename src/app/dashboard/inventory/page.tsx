'use client'; 

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "@/app/dashboard/_components/data-table"
import { mockMedicines } from "@/lib/data"
import type { Medicine } from "@/lib/types"
import { MedicineFormDialog } from "./_components/add-medicine-dialog";
import { PlusCircle } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const { toast } = useToast();
  const [data, setData] = React.useState<Medicine[]>([]);
  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingMedicine, setEditingMedicine] = React.useState<Medicine | undefined>(undefined);
  const [selectedMedicineId, setSelectedMedicineId] = React.useState<string | null>(null);


  React.useEffect(() => {
    setData(mockMedicines);
  }, []);

  const handleMedicineSaved = (medicine: Medicine) => {
    if (editingMedicine) {
      setData(currentData => currentData.map(m => m.id === medicine.id ? medicine : m));
    } else {
      setData(currentData => [{...medicine, id: `MED${Date.now()}`}, ...currentData]);
    }
    setEditingMedicine(undefined);
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormDialogOpen(true);
  }
  
  const handleAdd = () => {
    setEditingMedicine(undefined);
    setFormDialogOpen(true);
  }

  const handleDelete = (medicineId: string) => {
    setSelectedMedicineId(medicineId);
    setDeleteDialogOpen(true);
  }

  const handleConfirmDelete = () => {
    if (selectedMedicineId) {
      setData(currentData => currentData.filter(m => m.id !== selectedMedicineId));
      toast({
        title: "Medicine Deleted",
        description: "The medicine has been successfully removed from inventory.",
      });
    }
    setDeleteDialogOpen(false);
    setSelectedMedicineId(null);
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </div>
        </div>
        <DataTable 
          columns={columns} 
          data={data} 
          filterColumn="name"
          filterPlaceholder="Filter medicines..."
          meta={{ onEdit: handleEdit, onDelete: handleDelete }} 
        />
      </div>
      <MedicineFormDialog 
        key={editingMedicine?.id} // Force re-render when editing a new item
        open={isFormDialogOpen} 
        onOpenChange={setFormDialogOpen}
        onSave={handleMedicineSaved}
        medicine={editingMedicine}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this medicine?"
        description="This action cannot be undone. This will permanently delete the medicine from your inventory."
      />
    </>
  );
}
