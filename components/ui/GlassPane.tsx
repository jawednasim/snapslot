import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassPane({ children, className, ...props }: GlassPaneProps) {
  return (
    <div
      className={cn(
        "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
