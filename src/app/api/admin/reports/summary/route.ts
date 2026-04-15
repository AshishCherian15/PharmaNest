import { apiSuccess, apiError } from '@/lib/api-response';
import { requestLogger } from '@/lib/api-logger';
import { getAllCustomerOrdersDb } from '@/lib/customer-orders-db';
import { getMedicines } from '@/lib/medicines';

/**
 * GET /api/admin/reports/summary
 * Returns summary metrics for reports dashboard
 */
export async function GET() {
  const startTime = performance.now();

  try {
    const [orders, medicines] = await Promise.all([
      getAllCustomerOrdersDb(),
      getMedicines(),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalSales = orders.length;

    const lowStockMedicines = medicines.filter((m) => m.quantity > 0 && m.quantity < 10);
    const expiredMedicines = medicines.filter((m) => m.expiryDate && new Date(m.expiryDate) < new Date());

    const revenueByMedicine: Record<string, { name: string; revenue: number }> = {};
    for (const order of orders) {
      for (const item of order.items) {
        const current = revenueByMedicine[item.medicineId] ?? { name: item.name, revenue: 0 };
        current.revenue += item.unitPrice * item.quantity;
        revenueByMedicine[item.medicineId] = current;
      }
    }

    const topMedicines = Object.entries(revenueByMedicine)
      .map(([medicineId, info]) => ({
        medicineId,
        medicineName: info.name,
        estimatedRevenue: info.revenue,
      }))
      .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
      .slice(0, 4);

    requestLogger.logResponse('GET', '/api/admin/reports/summary', 200, startTime);
    return apiSuccess(
      {
        summary: {
          totalRevenue,
          totalSales,
          lowStockItems: lowStockMedicines.length,
          expiredItems: expiredMedicines.length,
          lowStockMedicines: lowStockMedicines.slice(0, 10).map((m) => ({
            id: m.id,
            name: m.name,
            quantity: m.quantity,
          })),
          topMedicines,
        },
      },
      200
    );
  } catch (error) {
    requestLogger.logError('GET', '/api/admin/reports/summary', error, startTime);
    return apiError('Failed to generate reports summary', 500, 'REPORT_ERROR');
  }
}
