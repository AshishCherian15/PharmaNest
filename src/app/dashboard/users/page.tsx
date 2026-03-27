'use client'; 

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockCustomers } from "@/lib/data"
import type { Customer } from "@/lib/types"
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

async function getData(): Promise<Customer[]> {
  return mockCustomers
}

export default function CustomersPage() {
  const { toast } = useToast();
  const [data, setData] = React.useState<Customer[]>([]);

  React.useEffect(() => {
    getData().then(setData);
  }, []);

  const handleAddCustomer = () => {
    // In a real app, this would open a dialog to add a new customer
    toast({
        title: "Feature Coming Soon",
        description: "The ability to add new customers will be implemented soon.",
    });
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={handleAddCustomer}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Filter customers..." />
      </div>
    </>
  );
}
