import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { mockSales } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

export function TodaysTopSales() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Today's Top Sales</CardTitle>
            <CardDescription className="mt-1">You made {mockSales.length} sales today.</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">{mockSales.length} transactions</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSales.map((sale) => {
            const userAvatar = PlaceHolderImages.find((img) => img.id === sale.avatarId);
            const userInitials = sale.customerName.split(' ').map((n) => n[0]).join('');
            return (
              <div key={sale.id} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                <Avatar className="h-9 w-9 border-2 border-border">
                  <AvatarImage src={userAvatar?.imageUrl} alt={sale.customerName} data-ai-hint={userAvatar?.imageHint} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{sale.customerName}</p>
                  <p className="truncate text-xs text-muted-foreground">{sale.customerEmail}</p>
                </div>
                <span className="text-sm font-semibold text-primary">
                  +{(sale.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
