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

export function RecentSales() {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made {mockSales.length} sales this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {mockSales.map((sale) => {
            const userAvatar = PlaceHolderImages.find(
              (img) => img.id === sale.avatarId
            );
            const userInitials = sale.customerName
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <div key={sale.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={userAvatar?.imageUrl}
                    alt={sale.customerName}
                    data-ai-hint={userAvatar?.imageHint}
                  />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {sale.customerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {sale.customerEmail}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  +${(sale.amount / 100).toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
