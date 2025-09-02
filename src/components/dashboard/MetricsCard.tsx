import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
  };
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function MetricsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'default',
  className 
}: MetricsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'danger':
        return 'border-destructive/20 bg-destructive/5';
      default:
        return 'border-glass-border';
    }
  };

  const getChangeStyles = () => {
    if (!change) return '';
    return change.value >= 0 ? 'text-success' : 'text-destructive';
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `$${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `$${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className={cn(
      'glass-card p-6 hover-lift animate-fade-in',
      getVariantStyles(),
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-foreground">
              {formatValue(value)}
            </p>
            {change && (
              <div className={cn("flex items-center text-xs", getChangeStyles())}>
                <span className="font-medium">
                  {change.value >= 0 ? '+' : ''}{change.value}%
                </span>
                <span className="text-muted-foreground ml-1">{change.label}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          variant === 'success' && 'gradient-primary',
          variant === 'warning' && 'bg-warning/20',
          variant === 'danger' && 'bg-destructive/20',
          variant === 'default' && 'glass-surface'
        )}>
          <Icon className={cn(
            'w-6 h-6',
            variant === 'success' && 'text-white',
            variant === 'warning' && 'text-warning',
            variant === 'danger' && 'text-destructive',
            variant === 'default' && 'text-primary'
          )} />
        </div>
      </div>
    </div>
  );
}