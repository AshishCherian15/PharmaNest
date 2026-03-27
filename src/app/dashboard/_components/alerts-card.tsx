import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockMedicines } from '@/lib/data';
import { AlertTriangle, Archive, ArrowRight } from 'lucide-react';

export function AlertsCard() {
    const lowStockItems = mockMedicines.filter(m => m.quantity < 10);
    const expiringItems = mockMedicines.filter(m => new Date(m.expiryDate) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Alerts</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Expiring Soon</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>{expiringItems.length} items are expiring within 60 days.</span>
                <Button variant="link" size="sm" className="h-auto p-0">View Items <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </AlertDescription>
        </Alert>
        <Alert>
            <Archive className="h-4 w-4" />
            <AlertTitle>Low Stock</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
                <span>{lowStockItems.length} items are running low on stock.</span>
                <Button variant="link" size="sm" className="h-auto p-0">View Items <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
