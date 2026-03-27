'use client';

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { columns } from "./_components/columns"
import { DataTable } from "@/app/dashboard/users/_components/data-table" 
import { mockPrescriptions } from "@/lib/data"
import type { Prescription } from "@/lib/types"

export default function PrescriptionsPage() {
  const [data, setData] = React.useState<Prescription[]>([]);

  React.useEffect(() => {
    setData(mockPrescriptions);
  }, []);

  const handleUpdateStatus = (id: string, status: Prescription['status']) => {
    setData(currentData =>
      currentData.map(p => (p.id === id ? { ...p, status } : p))
    );
  };

  const pendingPrescriptions = data.filter(p => p.status === 'pending');
  const verifiedPrescriptions = data.filter(p => p.status === 'verified');
  const rejectedPrescriptions = data.filter(p => p.status === 'rejected');

  const tableMeta = {
    updateStatus: handleUpdateStatus
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Prescription Management</h2>
      </div>
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="verified">Verified Orders</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
            <DataTable 
                columns={columns} 
                data={pendingPrescriptions}
                filterColumn="patientName"
                filterPlaceholder="Filter by patient..."
                meta={tableMeta}
            />
        </TabsContent>
        <TabsContent value="verified" className="space-y-4">
            <DataTable 
                columns={columns} 
                data={verifiedPrescriptions}
                filterColumn="patientName"
                filterPlaceholder="Filter by patient..."
                meta={tableMeta}
            />
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
            <DataTable 
                columns={columns} 
                data={rejectedPrescriptions}
                filterColumn="patientName"
                filterPlaceholder="Filter by patient..."
                meta={tableMeta}
            />
        </TabsContent>
      </Tabs>
    </div>
  );
}
