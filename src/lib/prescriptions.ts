import { mockPrescriptions } from '@/lib/data';
import type { Prescription } from '@/lib/types';

type GlobalPrescriptionStore = {
  __pharmanestPrescriptions?: Prescription[];
};

function getStore(): Prescription[] {
  const globalStore = globalThis as unknown as GlobalPrescriptionStore;
  if (!globalStore.__pharmanestPrescriptions) {
    globalStore.__pharmanestPrescriptions = [...mockPrescriptions];
  }
  return globalStore.__pharmanestPrescriptions;
}

function normalizePatientId(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toUpperCase();
}

export function getPrescriptionsForCustomer(customerId: string): Prescription[] {
  const normalizedCustomerId = normalizePatientId(customerId);
  return getStore().filter(
    (item) => normalizePatientId(item.patientId) === normalizedCustomerId
  );
}

export function getAllPrescriptions(): Prescription[] {
  return [...getStore()];
}

export function createPrescription(input: {
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  notes?: string;
  imageDataUrl?: string;
  medicines: Array<{ name: string; dosage: string; quantity: number }>;
}): Prescription {
  const store = getStore();
  const created: Prescription = {
    id: `PRES${String(Date.now()).slice(-8)}`,
    patientId: input.patientId,
    patientName: input.patientName,
    doctorName: input.doctorName,
    date: input.date,
    status: 'pending',
    notes: input.notes,
    imageDataUrl: input.imageDataUrl,
    medicines: input.medicines,
  };
  store.unshift(created);
  return created;
}

export function updatePrescriptionStatus(id: string, status: Prescription['status']): Prescription | null {
  const store = getStore();
  const index = store.findIndex((item) => item.id === id);
  if (index < 0) return null;
  store[index] = { ...store[index], status };
  return store[index];
}

export function hasVerifiedPrescription(customerId: string): boolean {
  return getPrescriptionsForCustomer(customerId).some((item) => item.status === 'verified');
}

export function getPrescriptionEligibility(customerId: string): {
  hasVerifiedPrescription: boolean;
  total: number;
  verified: number;
  pending: number;
  rejected: number;
} {
  const prescriptions = getPrescriptionsForCustomer(customerId);
  const verified = prescriptions.filter((item) => item.status === 'verified').length;
  const pending = prescriptions.filter((item) => item.status === 'pending').length;
  const rejected = prescriptions.filter((item) => item.status === 'rejected').length;

  return {
    hasVerifiedPrescription: verified > 0,
    total: prescriptions.length,
    verified,
    pending,
    rejected,
  };
}
