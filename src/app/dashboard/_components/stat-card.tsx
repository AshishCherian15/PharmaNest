import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'destructive';
  className?: string;
};

export function StatCard({ title, value, description, icon: Icon, variant = 'default', className }: StatCardProps) {
  const borderColor = variant === 'destructive' ? 'border-l-destructive' : 'border-l-primary';
  return (
    <Card className={cn('relative border-l-4 transition-shadow hover:shadow-md', borderColor, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
        <div className={cn(
          'flex h-8 w-8 items-center justify-center rounded-lg',
          variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', variant === 'destructive' ? 'text-destructive' : 'text-foreground')}>{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
