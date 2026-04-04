'use client';

import * as React from 'react';
import { mockMedicines } from '@/lib/data';
import type { Medicine } from '@/lib/types';
import { MedicineFormDialog } from './_components/add-medicine-dialog';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Download, Search, Filter } from 'lucide-react';

export default function InventoryPage() {
  const { toast } = useToast();
  const [data, setData]                   = React.useState<Medicine[]>([]);
  const [search, setSearch]               = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [statusFilter, setStatusFilter]   = React.useState('all');
  const [page, setPage]                   = React.useState(1);
  const [itemsPerPage, setItemsPerPage]   = React.useState(10);
  const [isFormOpen, setFormOpen]         = React.useState(false);
  const [isDeleteOpen, setDeleteOpen]     = React.useState(false);
  const [editing, setEditing]             = React.useState<Medicine | undefined>();
  const [deletingId, setDeletingId]       = React.useState<string | null>(null);

  React.useEffect(() => { setData(mockMedicines); }, []);

  const categories = ['all', ...Array.from(new Set(data.map((m) => m.category)))];

  const filtered = data.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.genericName.toLowerCase().includes(search.toLowerCase());
    const matchCat    = categoryFilter === 'all' || m.category === categoryFilter;
    const matchStatus = statusFilter === 'all'
      || (statusFilter === 'in_stock'  && m.quantity > 10)
      || (statusFilter === 'low_stock' && m.quantity > 0 && m.quantity <= 10)
      || (statusFilter === 'expired'   && new Date(m.expiryDate) < new Date())
      || (statusFilter === 'out'       && m.quantity === 0);
    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  // Reset to page 1 if current page exceeds total pages after filtering
  const currentPage = Math.min(page, totalPages);
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatus = (m: Medicine) => {
    if (new Date(m.expiryDate) < new Date()) return { label: 'EXPIRED',   cls: 'bg-surface-container-high text-outline border border-outline/10' };
    if (m.quantity === 0)                    return { label: 'OUT OF STOCK', cls: 'bg-error-container text-error border border-error/10' };
    if (m.quantity <= 10)                    return { label: 'LOW STOCK',  cls: 'bg-error-container text-error border border-error/10' };
    return { label: 'IN STOCK', cls: 'bg-[#f0fdf4] text-stitch-primary border border-stitch-primary/10' };
  };

  const handleSave = (m: Medicine) => {
    if (editing) {
      setData((d) => d.map((x) => (x.id === m.id ? m : x)));
      toast({ title: 'Medicine Updated', description: `${m.name} has been successfully updated.` });
    } else {
      setData((d) => [{ ...m, id: `MED${Date.now()}` }, ...d]);
      toast({ title: 'Medicine Added', description: `${m.name} has been successfully added to inventory.` });
    }
    setEditing(undefined);
  };

  const handleDelete = () => {
    if (deletingId) {
      const medicine = data.find(m => m.id === deletingId);
      setData((d) => d.filter((m) => m.id !== deletingId));
      toast({ title: 'Medicine Deleted', description: `${medicine?.name || 'Item'} has been removed from inventory.` });
    }
    setDeleteOpen(false);
    setDeletingId(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <>
      <div className="flex-1 space-y-6 p-4 md:p-8">

        {/* ── Header ── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Inventory Management</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Manage your medical supplies, stock levels, and expiry dates.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-surface-container-high px-5 py-2.5 text-sm font-semibold text-on-surface transition hover:bg-surface-variant">
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => { setEditing(undefined); setFormOpen(true); }}
              className="btn-primary-gradient flex items-center gap-2 px-5 py-2.5 text-sm shadow-lg"
            >
              <PlusCircle className="h-4 w-4" /> Add Medicine
            </button>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="rounded-2xl bg-surface-container-low p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                  className="w-full rounded-xl border-none bg-surface-container-lowest py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-stitch-secondary/20"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Stock Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="w-full rounded-xl border-none bg-surface-container-lowest py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-stitch-secondary/20"
                >
                  <option value="all">All Statuses</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out">Out of Stock</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search medicines, SKU..."
                    className="w-full rounded-xl border-none bg-surface-container-lowest py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-stitch-secondary/20"
                  />
                </div>
              </div>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-stitch-secondary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
              <Filter className="h-4 w-4" /> Apply
            </button>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-between border-b border-surface-container p-5">
            <div className="flex items-center gap-3">
              <h3 className="font-headline font-bold text-lg text-on-surface">Medicine List</h3>
              <span className="rounded-full bg-stitch-primary-fixed px-2.5 py-1 text-[10px] font-bold text-on-stitch-primary-fixed">
                {filtered.length} ITEMS
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/50 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                  <th className="px-5 py-4">Medicine Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4 text-center">Stock Level</th>
                  <th className="px-5 py-4">Expiry Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {paginated.map((m) => {
                  const status  = getStatus(m);
                  const pct     = Math.min(100, Math.round((m.quantity / 500) * 100));
                  const barColor = m.quantity === 0 ? 'rgb(var(--error))' : m.quantity <= 10 ? 'rgb(245 158 11)' : 'rgb(var(--stitch-secondary))';
                  const isExpired = new Date(m.expiryDate) < new Date();

                  return (
                    <tr key={m.id} className={`transition hover:bg-surface-container-low/30 ${isExpired ? 'opacity-60' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-stitch-primary-fixed/20 text-lg">
                            💊
                          </div>
                          <div>
                            <p className="font-bold text-sm text-on-surface">{m.name}</p>
                            <p className="text-xs text-on-surface-variant">{m.genericName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-on-surface-variant">{m.category}</td>
                      <td className="px-5 py-4">
                        <div className="mx-auto w-28 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className={m.quantity <= 10 ? 'text-error' : 'text-on-surface'}>{m.quantity}</span>
                            <span className="text-on-surface-variant">/ 500</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                        </div>
                      </td>
                      <td className={`px-5 py-4 text-sm ${isExpired ? 'font-bold italic text-error' : 'text-on-surface-variant'}`}>
                        {isExpired ? 'EXPIRED' : new Date(m.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => { setEditing(m); setFormOpen(true); }}
                            className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-high"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => { setDeletingId(m.id); setDeleteOpen(true); }}
                            className="rounded-lg p-2 text-error transition hover:bg-error-container/20"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-on-surface-variant">
                      No medicines found. Try adjusting your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination with improved UI */}
          <div className="px-5 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>
      </div>

      <MedicineFormDialog
        key={editing?.id ?? 'new'}
        open={isFormOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
        medicine={editing}
      />
      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Delete this medicine?"
        description="This action cannot be undone. The medicine will be permanently removed from inventory."
      />
    </>
  );
}
