'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Prescription } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-700', icon: '⏳' },
  verified: { label: 'Verified', color: 'bg-green-100 text-green-700', icon: '✅' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: '❌' },
};

export default function CustomerPrescriptionsPage() {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>([]);
  const [doctorName, setDoctorName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [medicinesText, setMedicinesText] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [imageDataUrl, setImageDataUrl] = React.useState<string | undefined>();
  const [submitting, setSubmitting] = React.useState(false);

  const loadPrescriptions = React.useCallback(async () => {
    const res = await fetch('/api/customer/prescriptions', { cache: 'no-store' });
    if (!res.ok) return;
    const json = (await res.json()) as { prescriptions?: Prescription[] };
    setPrescriptions(json.prescriptions ?? []);
  }, []);

  React.useEffect(() => {
    void loadPrescriptions();
  }, [loadPrescriptions]);

  const hasVerified = prescriptions.some((rx) => rx.status === 'verified');

  const parseMedicines = () => {
    return medicinesText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, dosage = 'As prescribed', qty = '1'] = line.split('|').map((v) => v.trim());
        return { name, dosage, quantity: Math.max(1, Number.parseInt(qty, 10) || 1) };
      });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const medicines = parseMedicines();
    if (!doctorName || !date || medicines.length === 0) {
      toast({ variant: 'destructive', title: 'Missing details', description: 'Doctor, date, and medicines are required.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/customer/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorName, date, notes, imageDataUrl, medicines }),
      });
      if (!res.ok) throw new Error('Upload failed');
      toast({ title: 'Prescription uploaded', description: 'Your prescription was submitted for pharmacist review.' });
      setDoctorName('');
      setDate('');
      setMedicinesText('');
      setNotes('');
      setImageDataUrl(undefined);
      await loadPrescriptions();
    } catch {
      toast({ variant: 'destructive', title: 'Upload failed', description: 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-2xl font-extrabold text-on-surface">My Prescriptions</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''} on file</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-on-surface">Upload New Prescription</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Doctor name" className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm" />
        </div>
        <textarea
          value={medicinesText}
          onChange={(e) => setMedicinesText(e.target.value)}
          rows={4}
          placeholder="One medicine per line: Name | Dosage | Quantity"
          className="mt-3 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Optional notes"
          className="mt-3 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 py-2.5 text-sm"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
          {imageDataUrl && <Image src={imageDataUrl} alt="Prescription preview" width={64} height={64} unoptimized className="h-16 w-16 rounded-lg object-cover" />}
        </div>
        <button disabled={submitting} type="submit" className="mt-4 rounded-xl bg-stitch-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-stitch-primary-container disabled:opacity-60">
          {submitting ? 'Submitting...' : 'Submit Prescription'}
        </button>
      </form>

      <div className={`flex items-start gap-3 rounded-xl p-4 ${hasVerified ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
        <span className="text-xl">{hasVerified ? '✅' : '⚠️'}</span>
        <div>
          <p className={`font-bold text-sm ${hasVerified ? 'text-green-800' : 'text-amber-800'}`}>
            {hasVerified ? 'Prescription Verified' : 'No Verified Prescription'}
          </p>
          <p className={`text-xs mt-0.5 ${hasVerified ? 'text-green-700' : 'text-amber-700'}`}>
            {hasVerified ? 'Rx items can be ordered.' : 'Rx items require verification by a pharmacist.'}
          </p>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-16 text-center shadow-sm">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-bold text-on-surface">No prescriptions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => {
            const status = statusConfig[rx.status];
            return (
              <div key={rx.id} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Prescription ID</p>
                    <p className="font-headline font-bold text-on-surface">{rx.id}</p>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${status.color}`}>
                    <span>{status.icon}</span>
                    {status.label}
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-surface-container-low px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Doctor</p>
                    <p className="mt-0.5 font-semibold text-on-surface">{rx.doctorName}</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Date</p>
                    <p className="mt-0.5 font-semibold text-on-surface">{rx.date}</p>
                  </div>
                </div>

                {rx.imageDataUrl && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Uploaded Prescription Image</p>
                    <Image src={rx.imageDataUrl} alt="Prescription" width={320} height={160} unoptimized className="h-28 rounded-lg border border-outline-variant/20 object-cover" />
                  </div>
                )}

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Prescribed Medicines</p>
                  <div className="space-y-1.5">
                    {rx.medicines.map((med, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg bg-surface-container-low px-3 py-2 text-sm">
                        <div>
                          <p className="font-semibold text-on-surface">{med.name}</p>
                          <p className="text-xs text-on-surface-variant">{med.dosage}</p>
                        </div>
                        <span className="rounded-full bg-stitch-primary-fixed/20 px-2 py-0.5 text-xs font-bold text-stitch-primary">
                          Qty: {med.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
