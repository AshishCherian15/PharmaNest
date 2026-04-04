import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockMedicines } from '@/lib/data';
import { AlertTriangle, Archive, ArrowRight, PackageX } from 'lucide-react';
import Link from 'next/link';

export function AlertsCard() {
    const lowStockItems = mockMedicines.filter(m => m.quantity > 0 && m.quantity < 10);
    const outOfStockItems = mockMedicines.filter(m => m.quantity === 0);
    const expiringItems = mockMedicines.filter(m => new Date(m.expiryDate) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));
    const expiredItems = mockMedicines.filter(m => new Date(m.expiryDate) < new Date());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Alerts</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {expiredItems.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Expired Medicines</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{expiredItems.length} items have already expired.</span>
              <Button asChild variant="link" size="sm" className="h-auto p-0">
                <Link href="/dashboard/inventory">
                  View Items <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Expiring Soon</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>{expiringItems.length} items are expiring within 60 days.</span>
                <Button asChild variant="link" size="sm" className="h-auto p-0">
                  <Link href="/dashboard/inventory">
                    View Items <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
            </AlertDescription>
        </Alert>
        {outOfStockItems.length > 0 && (
          <Alert variant="destructive">
            <PackageX className="h-4 w-4" />
            <AlertTitle>Out of Stock</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{outOfStockItems.length} items are completely out of stock.</span>
              <Button asChild variant="link" size="sm" className="h-auto p-0">
                <Link href="/dashboard/inventory">
                  View Items <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <Alert>
            <Archive className="h-4 w-4" />
            <AlertTitle>Low Stock</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>{lowStockItems.length} items are running low on stock.</span>
                <Button asChild variant="link" size="sm" className="h-auto p-0">
                  <Link href="/dashboard/inventory">
                    View Items <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
