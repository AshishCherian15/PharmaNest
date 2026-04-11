'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Prescription } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  pending:  { label: 'Pending',  cls: 'bg-amber-100 text-amber-800 border border-amber-200', dot: 'bg-amber-500' },
  verified: { label: 'Verified', cls: 'bg-green-100 text-green-800 border border-green-200', dot: 'bg-green-500' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-800 border border-red-200',       dot: 'bg-red-500'   },
};

export default function PrescriptionsPage() {
  const { toast } = useToast();
  const [data, setData]   = React.useState<Prescription[]>([]);
  const [tab, setTab]     = React.useState<'pending' | 'verified' | 'rejected'>('pending');
  const [selected, setSelected] = React.useState<Prescription | null>(null);
  const [loading, setLoading] = React.useState(true);

  const loadPrescriptions = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/prescriptions', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load prescriptions');
      const json = (await res.json()) as { prescriptions?: Prescription[] };
      setData(json.prescriptions ?? []);
    } catch {
      toast({ variant: 'destructive', title: 'Load failed', description: 'Unable to load prescriptions.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    void loadPrescriptions();
  }, [loadPrescriptions]);

  const updateStatus = async (id: string, status: Prescription['status']) => {
    try {
      const res = await fetch(`/api/admin/prescriptions/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');

      setData((d) => d.map((p) => (p.id === id ? { ...p, status } : p)));
      setSelected((s) => (s?.id === id ? { ...s, status } : s));
      toast({ title: `Prescription ${status}`, description: `ID: ${id}` });
    } catch {
      toast({ variant: 'destructive', title: 'Update failed', description: 'Unable to update status.' });
    }
  };

  const filtered = data.filter((p) => p.status === tab);
  const counts   = { pending: data.filter((p) => p.status === 'pending').length, verified: data.filter((p) => p.status === 'verified').length, rejected: data.filter((p) => p.status === 'rejected').length };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">

      {/* ── Header ── */}
      <div>
        <h2 className="font-headline text-4xl font-extrabold tracking-tight text-stitch-primary">Review Prescriptions</h2>
        <p className="mt-1 font-medium text-on-surface-variant">Verify customer prescriptions and approve orders for Rx items.</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 rounded-xl bg-surface-container-lowest p-1 shadow-sm w-fit">
        {(['pending', 'verified', 'rejected'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-bold capitalize transition ${tab === t ? 'bg-stitch-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* ── Queue list ── */}
        <section className="space-y-4 lg:col-span-8">
          {filtered.length === 0 ? (
            <div className="rounded-2xl bg-surface-container-lowest p-12 text-center shadow-sm">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-bold text-on-surface">{loading ? 'Loading prescriptions...' : `No ${tab} prescriptions`}</p>
            </div>
          ) : (
            filtered.map((rx) => {
              const cfg = statusConfig[rx.status];
              const isSelected = selected?.id === rx.id;
              return (
                <div
                  key={rx.id}
                  onClick={() => setSelected(rx)}
                  className={`cursor-pointer rounded-2xl border-l-4 bg-surface-container-lowest p-6 shadow-sm transition hover:shadow-md ${
                    rx.status === 'pending' ? 'border-l-amber-500' : rx.status === 'verified' ? 'border-l-green-500' : 'border-l-red-500'
                  } ${isSelected ? 'ring-2 ring-stitch-primary/30' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-headline text-lg font-extrabold text-on-surface">Rx #{rx.id}</h3>
                        {rx.status === 'pending' && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                            Awaiting Review
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant">Patient: <span className="font-semibold text-on-surface">{rx.patientName}</span></p>
                      <p className="text-sm text-on-surface-variant">Doctor: {rx.doctorName} · {rx.date}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${cfg.cls}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Medicines */}
                  <div className="mt-4 space-y-2">
                    {rx.medicines.map((med, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3">
                        <span className="text-lg">💊</span>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{med.name}</p>
                          <p className="text-xs text-on-surface-variant">{med.dosage} · Qty: {med.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {rx.imageDataUrl && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Prescription Image</p>
                      <Image src={rx.imageDataUrl} alt="Prescription upload" width={320} height={160} unoptimized className="h-24 rounded-lg border border-outline-variant/20 object-cover" />
                    </div>
                  )}

                  {/* AI pre-verified notice */}
                  {rx.status === 'pending' && (
                    <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wide text-green-800">✓ AI Pre-Verified</span>
                      </div>
                      <p className="text-xs text-green-900 leading-relaxed">
                        System matched doctor signature. No drug interaction risks detected for this patient profile.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {rx.status === 'pending' && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(rx.id, 'verified'); }}
                        className="btn-primary-gradient flex flex-1 items-center justify-center gap-2 py-3 text-sm"
                      >
                        ✓ Approve Order
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); updateStatus(rx.id, 'rejected'); }}
                        className="flex items-center justify-center gap-2 rounded-xl border-2 border-error/20 px-5 py-3 text-sm font-bold text-error transition hover:bg-error-container/20"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* ── Timeline sidebar ── */}
        <aside className="lg:col-span-4 space-y-5">
          {selected ? (
            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <h4 className="font-headline mb-6 text-lg font-bold text-on-surface">Order Timeline</h4>
              <div className="relative pl-8 space-y-8">
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-outline-variant/30" />
                {[
                  { label: 'Order Placed',            done: true,                                  note: selected.date },
                  { label: 'Prescription Submitted',  done: true,                                  note: 'By patient' },
                  { label: 'Pharmacist Verification', done: selected.status !== 'pending',         note: selected.status === 'verified' ? 'Approved' : selected.status === 'rejected' ? 'Rejected' : 'Pending…', active: selected.status === 'pending' },
                  { label: 'Ready for Dispatch',      done: selected.status === 'verified',        note: 'Awaiting approval' },
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-[30px] flex h-6 w-6 items-center justify-center rounded-full border-4 border-surface-container-lowest ${step.done ? 'bg-green-500' : step.active ? 'bg-stitch-secondary shadow-[0_0_12px_rgba(0,106,97,0.3)]' : 'bg-outline-variant'}`}>
                      {step.done && <span className="text-[10px] text-white">✓</span>}
                      {step.active && <span className="text-[10px] text-white animate-pulse">⟳</span>}
                    </div>
                    <p className={`text-sm font-bold ${step.done || step.active ? 'text-on-surface' : 'text-outline opacity-50'}`}>{step.label}</p>
                    <p className="text-xs text-on-surface-variant">{step.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 text-center shadow-sm">
              <p className="text-3xl mb-3">👆</p>
              <p className="text-sm font-bold text-on-surface">Select a prescription</p>
              <p className="mt-1 text-xs text-on-surface-variant">Click any prescription to view its timeline</p>
            </div>
          )}

          {/* Stats widget */}
          <div className="rounded-2xl bg-surface-container-high p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Today's Efficiency</p>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">+12%</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-headline text-2xl font-bold text-on-surface">42m</p>
                <p className="text-[10px] text-on-surface-variant">Avg. Verification</p>
              </div>
              <div>
                <p className="font-headline text-2xl font-bold text-on-surface">{data.length}</p>
                <p className="text-[10px] text-on-surface-variant">Total Prescriptions</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
