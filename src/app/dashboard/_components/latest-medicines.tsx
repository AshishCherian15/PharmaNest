import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { mockMedicines } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

export function LatestMedicines() {
  const latestItems = mockMedicines.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Medicines</CardTitle>
        <CardDescription>The newest additions to your inventory.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {latestItems.map((item) => {
            const image = PlaceHolderImages.find(
              (img) => img.id === item.imageId
            );
            return (
              <div key={item.id} className="flex items-center">
                <div className="w-10 h-10 relative">
                    {image && (
                        <Image 
                            src={image.imageUrl} 
                            alt={item.name}
                            width={40}
                            height={40} 
                            className="rounded-md object-cover" 
                            data-ai-hint={image.imageHint} 
                        />
                    )}
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.category}
                  </p>
                </div>
                <div className="ml-auto">
                    <Badge variant="secondary">Added Today</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
