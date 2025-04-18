import { cn } from '@/util/utils';

export default function Container({
  size,
  children,
  className,
}: {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        size === 'sm' && 'max-w-screen-sm',
        size === 'md' && 'max-w-screen-md',
        size === 'lg' && 'max-w-screen-lg',
        size === 'xl' && 'max-w-screen-xl',
        size === 'full' && 'max-w-full',
        className
      )}
    >
      {children}
    </div>
  );
}
