'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "@/app/dashboard/_components/data-table" 
import { mockOrders, mockSuppliers } from "@/lib/data"
import type { PurchaseOrder } from "@/lib/types"
import { PlusCircle } from "lucide-react";
import { OrderFormDialog } from "./_components/add-order-dialog";

export default function OrdersPage() {
  const [data, setData] = React.useState<PurchaseOrder[]>([]);
  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setData(mockOrders);
  }, []);

  const handleOrderSaved = (order: PurchaseOrder) => {
    setData(currentData => [order, ...currentData]);
  };

  const handleUpdateStatus = (id: string, status: PurchaseOrder['status']) => {
    setData(currentData =>
      currentData.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
          <div className="flex items-center space-x-2">
              <Button onClick={() => setFormDialogOpen(true)}>
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
            meta={{ updateStatus: handleUpdateStatus }}
        />
      </div>
      <OrderFormDialog
        open={isFormDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSave={handleOrderSaved}
        suppliers={mockSuppliers}
      />
    </>
  );
}
