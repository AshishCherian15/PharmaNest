'use client';

import * as React from "react";
import { useMemo } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { columns } from "./_components/columns"
import { DataTable } from "@/app/dashboard/_components/data-table"
import type { Supplier } from "@/lib/types"
import { SupplierFormDialog } from "./_components/add-supplier-dialog";
import { PlusCircle, Download, Building2, Phone, Mail } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "../_components/stat-card";

export default function SuppliersPage() {
  const { toast } = useToast();
  const [data, setData] = React.useState<Supplier[]>([]);
  const [isFormDialogOpen, setFormDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingSupplier, setEditingSupplier] = React.useState<Supplier | undefined>(undefined);
  const [selectedSupplierId, setSelectedSupplierId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadSuppliers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/suppliers', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load suppliers');
      const json = (await res.json()) as { suppliers?: Supplier[] };
      setData(json.suppliers ?? []);
    } catch {
      toast({ variant: 'destructive', title: 'Load failed', description: 'Unable to fetch suppliers.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    void loadSuppliers();
  }, [loadSuppliers]);

  const metrics = useMemo(() => {
    return {
      total: data.length,
      withEmail: data.filter(s => s.email).length,
      withPhone: data.filter(s => s.phone).length,
    };
  }, [data]);

  const handleExportSuppliers = () => {
    const rows = [
      ['ID', 'Name', 'Contact Person', 'Email', 'Phone'],
      ...data.map(supplier => [
        supplier.id,
        supplier.name,
        supplier.contactPerson,
        supplier.email,
        supplier.phone,
      ]),
    ];
    const csv = rows.map(row => row.map(value => `"${value}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pharma-nest-suppliers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSupplierSaved = async (supplier: Supplier) => {
    try {
      if (editingSupplier) {
        const res = await fetch(`/api/admin/suppliers/${encodeURIComponent(supplier.id)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supplier),
        });
        if (!res.ok) throw new Error('Update failed');
        toast({ title: 'Supplier Updated', description: `${supplier.name} has been successfully updated.` });
      } else {
        const res = await fetch('/api/admin/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supplier),
        });
        if (!res.ok) throw new Error('Create failed');
        toast({ title: 'Supplier Added', description: `${supplier.name} has been successfully added.` });
      }
      setEditingSupplier(undefined);
      await loadSuppliers();
    } catch {
      toast({ variant: 'destructive', title: 'Save failed', description: 'Unable to save supplier changes.' });
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

  const handleDelete = (supplierId: string) => {
    setSelectedSupplierId(supplierId);
    setDeleteDialogOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!selectedSupplierId) return;

    try {
      const supplier = data.find((s) => s.id === selectedSupplierId);
      const res = await fetch(`/api/admin/suppliers/${encodeURIComponent(selectedSupplierId)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      toast({ title: 'Supplier Deleted', description: `${supplier?.name || 'Item'} has been removed.` });
      await loadSuppliers();
    } catch {
      toast({ variant: 'destructive', title: 'Delete failed', description: 'Unable to delete the supplier.' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSupplierId(null);
    }
  }

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader
          title="Suppliers"
          description="Manage your supplier partnerships."
          action={
            <>
              <Button variant="outline" onClick={handleExportSuppliers}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Suppliers"
            value={metrics.total.toString()}
            description="Active supplier partnerships"
            icon={Building2}
          />
          <StatCard
            title="Email Contacts"
            value={metrics.withEmail.toString()}
            description="Suppliers with email addresses"
            icon={Mail}
          />
          <StatCard
            title="Phone Contacts"
            value={metrics.withPhone.toString()}
            description="Suppliers with phone numbers"
            icon={Phone}
          />
          <StatCard
            title="Contact Coverage"
            value={`${data.length > 0 ? Math.round((metrics.withEmail + metrics.withPhone) / (data.length * 2) * 100) : 0}%`}
            description="Communication method availability"
            icon={Building2}
          />
        </div>
        <DataTable 
          columns={columns} 
          data={data}
          filterColumn="name"
          filterPlaceholder="Filter suppliers..."
          meta={{ onEdit: handleEdit, onDelete: handleDelete }} 
        />
      </div>
      <SupplierFormDialog 
        key={editingSupplier?.id}
        open={isFormDialogOpen} 
        onOpenChange={setFormDialogOpen}
        onSave={handleSupplierSaved}
        supplier={editingSupplier}
      />
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this supplier?"
        description="This action cannot be undone. This will permanently delete the supplier and any associated data."
      />
    </>
  );
}
