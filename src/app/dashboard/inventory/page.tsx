'use client'; // Needs to be a client component to use state for dialog

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockMedicines } from "@/lib/data"
import type { Medicine } from "@/lib/types"
import { AddMedicineDialog } from "./_components/add-medicine-dialog";
import { PlusCircle } from "lucide-react";

// Since we are not using a real DB, we can't really fetch new data.
async function getData(): Promise<Medicine[]> {
  // Fetch data from your API here.
  // For now, we'll use mock data.
  return mockMedicines
}

export default function InventoryPage() {
  const [data, setData] = React.useState<Medicine[]>([]);
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    getData().then(setData);
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
      <AddMedicineDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
    </>
  );
}
