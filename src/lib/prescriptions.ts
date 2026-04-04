import { mockPrescriptions } from '@/lib/data';
import type { Prescription } from '@/lib/types';

function normalizePatientId(value: string): string {
  return value.replace(/[^a-z0-9]/gi, '').toUpperCase();
}

export function getPrescriptionsForCustomer(customerId: string): Prescription[] {
  const normalizedCustomerId = normalizePatientId(customerId);
  return mockPrescriptions.filter(
    (item) => normalizePatientId(item.patientId) === normalizedCustomerId
  );
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
