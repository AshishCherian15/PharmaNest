import type { Prescription } from '@/lib/types';
import { prisma } from '@/lib/prisma';
import { ensurePrescriptionSeeded } from '@/lib/pharmanest-seed';

type DbPrescription = {
  id: string;
  customerId: string;
  patientName: string;
  doctorName: string;
  prescriptionDate: Date;
  status: 'pending' | 'verified' | 'rejected';
  documentUrl: string | null;
  notes: string | null;
  items: Array<{
    dosage: string | null;
    quantity: number;
    medicine: { name: string };
  }>;
};

function mapPrescription(record: DbPrescription): Prescription {
  return {
    id: record.id,
    patientId: record.customerId,
    patientName: record.patientName,
    doctorName: record.doctorName,
    date: record.prescriptionDate.toISOString().slice(0, 10),
    status: record.status,
    medicines: record.items.map((item) => ({
      name: item.medicine.name,
      dosage: item.dosage ?? '',
      quantity: item.quantity,
    })),
    notes: record.notes ?? undefined,
    imageDataUrl: record.documentUrl ?? undefined,
  };
}

export async function getPrescriptionsForCustomer(customerId: string): Promise<Prescription[]> {
  await ensurePrescriptionSeeded();
  const prescriptions = await prisma.prescription.findMany({
    where: { customerId },
    include: {
      items: {
        include: { medicine: { select: { name: true } } },
      },
    },
    orderBy: { prescriptionDate: 'desc' },
  });

  return prescriptions.map((prescription) => mapPrescription(prescription as DbPrescription));
}

export async function getAllPrescriptions(): Promise<Prescription[]> {
  await ensurePrescriptionSeeded();
  const prescriptions = await prisma.prescription.findMany({
    include: {
      items: {
        include: { medicine: { select: { name: true } } },
      },
    },
    orderBy: { prescriptionDate: 'desc' },
  });

  return prescriptions.map((prescription) => mapPrescription(prescription as DbPrescription));
}

export async function createPrescription(input: {
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  notes?: string;
  imageDataUrl?: string;
  medicines: Array<{ name: string; dosage: string; quantity: number }>;
}): Promise<Prescription> {
  await ensurePrescriptionSeeded();

  const medicineRecords = await prisma.medicine.findMany({
    where: {
      name: { in: input.medicines.map((item) => item.name) },
    },
    select: { id: true, name: true },
  });

  const medicineMap = new Map(medicineRecords.map((medicine) => [medicine.name, medicine.id]));

  const created = await prisma.prescription.create({
    data: {
      customerId: input.patientId,
      patientName: input.patientName,
      doctorName: input.doctorName,
      prescriptionDate: new Date(input.date),
      status: 'pending',
      notes: input.notes,
      documentUrl: input.imageDataUrl,
      items: {
        create: input.medicines
          .map((item) => {
            const medicineId = medicineMap.get(item.name);
            if (!medicineId) return null;
            return {
              medicineId,
              dosage: item.dosage,
              quantity: item.quantity,
              instructions: item.dosage,
            };
          })
          .filter((item): item is { medicineId: string; dosage: string; quantity: number; instructions: string } => Boolean(item)),
      },
    },
    include: {
      items: {
        include: { medicine: { select: { name: true } } },
      },
    },
  });

  return mapPrescription(created as DbPrescription);
}

export async function updatePrescriptionStatus(id: string, status: Prescription['status']): Promise<Prescription | null> {
  await ensurePrescriptionSeeded();
  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: {
      items: {
        include: { medicine: { select: { name: true } } },
      },
    },
  });

  if (!prescription) return null;

  const updated = await prisma.prescription.update({
    where: { id },
    data: { status },
    include: {
      items: {
        include: { medicine: { select: { name: true } } },
      },
    },
  });

  return mapPrescription(updated as DbPrescription);
}

export async function hasVerifiedPrescription(customerId: string): Promise<boolean> {
  const prescriptions = await getPrescriptionsForCustomer(customerId);
  return prescriptions.some((item) => item.status === 'verified');
}

export async function getPrescriptionEligibility(customerId: string): Promise<{
  hasVerifiedPrescription: boolean;
  total: number;
  verified: number;
  pending: number;
  rejected: number;
}> {
  const prescriptions = await getPrescriptionsForCustomer(customerId);
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
