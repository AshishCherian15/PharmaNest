import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getAllProducts } from '@/lib/product-store';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export async function LatestMedicines() {
  const latestItems = (await getAllProducts()).slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Inventory Snapshot</CardTitle>
        <CardDescription>Stock status of recent medicines.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {latestItems.map((item) => {
            const image = PlaceHolderImages.find((img) => img.id === item.imageId);
            const isLow = item.quantity > 0 && item.quantity < 10;
            const isOut = item.quantity === 0;
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border bg-muted">
                  {image && (
                    <Image src={image.imageUrl} alt={item.name} width={40} height={40}
                      className="h-full w-full object-cover" data-ai-hint={image.imageHint} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    className={cn(
                      'text-xs',
                      isOut && 'bg-destructive/10 text-destructive border-destructive/20',
                      isLow && 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20 dark:text-yellow-400',
                      !isOut && !isLow && 'bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400'
                    )}
                    variant="outline"
                  >
                    {isOut ? 'Out of Stock' : isLow ? `Low (${item.quantity})` : `${item.quantity} units`}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
