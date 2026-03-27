'use client'; 

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockCustomers } from "@/lib/data"
import type { Customer } from "@/lib/types"
import { PlusCircle } from "lucide-react";
import { AddCustomerDialog } from "./_components/add-customer-dialog";

export default function CustomersPage() {
  const [data, setData] = React.useState<Customer[]>([]);
  const [isAddDialogOpen, setAddDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setData(mockCustomers);
  }, []);

  const handleCustomerAdded = (newCustomer: Customer) => {
    setData(currentData => [newCustomer, ...currentData]);
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Filter customers..." />
      </div>
      <AddCustomerDialog 
        open={isAddDialogOpen}
        onOpenChange={setAddDialogOpen}
        onCustomerAdded={handleCustomerAdded}
      />
    </>
  );
}
