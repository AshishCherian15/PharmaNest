import Link from 'next/link';
import { cookies } from 'next/headers';
import { AUTH_COOKIE, parseSessionToken } from '@/lib/auth';
import { getPrescriptionsForCustomer, hasVerifiedPrescription } from '@/lib/prescriptions';

const statusConfig = {
  pending:  { label: 'Pending Review', color: 'bg-amber-100 text-amber-700',  icon: '⏳' },
  verified: { label: 'Verified',       color: 'bg-green-100 text-green-700',  icon: '✅' },
  rejected: { label: 'Rejected',       color: 'bg-red-100 text-red-700',      icon: '❌' },
};

export default async function CustomerPrescriptionsPage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  const session = parseSessionToken(token);
  const prescriptions = session ? getPrescriptionsForCustomer(session.id) : [];
  const verified = session ? hasVerifiedPrescription(session.id) : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl font-extrabold text-on-surface">My Prescriptions</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''} on file</p>
        </div>
        <button className="rounded-xl bg-stitch-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-stitch-primary-container">
          + Upload Rx
        </button>
      </div>

      {/* Verification status banner */}
      <div className={`flex items-start gap-3 rounded-xl p-4 ${verified ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
        <span className="text-xl">{verified ? '✅' : '⚠️'}</span>
        <div>
          <p className={`font-bold text-sm ${verified ? 'text-green-800' : 'text-amber-800'}`}>
            {verified ? 'Prescription Verified' : 'No Verified Prescription'}
          </p>
          <p className={`text-xs mt-0.5 ${verified ? 'text-green-700' : 'text-amber-700'}`}>
            {verified
              ? 'You have at least one verified prescription. Rx items can be ordered.'
              : 'No verified prescription found yet. Rx items cannot be ordered until verification.'}
          </p>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-16 text-center shadow-sm">
          <p className="text-5xl mb-4">📋</p>
          <p className="font-bold text-on-surface">No prescriptions yet</p>
          <p className="mt-1 text-sm text-on-surface-variant">Upload a prescription from your doctor to get started.</p>
          <button className="mt-5 rounded-xl bg-stitch-primary px-6 py-2.5 text-sm font-bold text-white">
            Upload Prescription
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => {
            const status = statusConfig[rx.status];
            return (
              <div key={rx.id} className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
                {/* Header */}
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

                {/* Doctor & date */}
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

                {/* Medicines */}
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
