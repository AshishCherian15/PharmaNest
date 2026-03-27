'use client'; // Needs to be a client component to use state for dialog

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockSuppliers } from "@/lib/data"
import type { Supplier } from "@/lib/types"
import { AddSupplierDialog } from "./_components/add-supplier-dialog";
import { PlusCircle } from "lucide-react";

async function getData(): Promise<Supplier[]> {
  return mockSuppliers
}

export default function SuppliersPage() {
  const [data, setData] = React.useState<Supplier[]>([]);
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    getData().then(setData);
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
      <AddSupplierDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
    </>
  );
}
