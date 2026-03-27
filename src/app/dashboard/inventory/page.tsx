'use client'; 

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockMedicines } from "@/lib/data"
import type { Medicine } from "@/lib/types"
import { MedicineFormDialog } from "./_components/medicine-form-dialog";
import { PlusCircle } from "lucide-react";

export default function InventoryPage() {
  const [data, setData] = React.useState<Medicine[]>([]);
  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false);
  const [editingMedicine, setEditingMedicine] = React.useState<Medicine | undefined>(undefined);


  React.useEffect(() => {
    // In a real app, you would fetch this data.
    setData(mockMedicines);
  }, []);

  const handleMedicineSaved = (medicine: Medicine) => {
    if (editingMedicine) {
      // Update existing medicine
      setData(currentData => currentData.map(m => m.id === medicine.id ? medicine : m));
    } else {
      // Add new medicine
      setData(currentData => [{...medicine, id: `MED${Date.now()}`}, ...currentData]);
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormDialogOpen(true);
  }
  
  const handleAdd = () => {
    setEditingMedicine(undefined);
    setFormDialogOpen(true);
  }

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
        <DataTable columns={columns} data={data} meta={{ onEdit: handleEdit }} />
      </div>
      <MedicineFormDialog 
        key={editingMedicine?.id} // Force re-render when editing a new item
        open={isFormDialogOpen} 
        onOpenChange={setFormDialogOpen}
        onSave={handleMedicineSaved}
        medicine={editingMedicine}
      />
    </>
  );
}
