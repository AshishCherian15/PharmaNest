'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "@/app/dashboard/users/_components/data-table" 
import { mockOrders } from "@/lib/data"
import type { PurchaseOrder } from "@/lib/types"
import { PlusCircle } from "lucide-react";

export default function OrdersPage() {
  const [data, setData] = React.useState<PurchaseOrder[]>([]);

  React.useEffect(() => {
    setData(mockOrders);
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
         <div className="flex items-center space-x-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>
      </div>
      <DataTable 
          columns={columns} 
          data={data}
          filterColumn="supplierName"
          filterPlaceholder="Filter by supplier..."
      />
    </div>
  );
}
