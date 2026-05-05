import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({
  size = 'md',
  text,
  fullScreen = false,
  className,
}: LoadingProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      {/* DNA helix inspired spinner */}
      <div className="relative">
        <div
          className={cn(
            'rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin',
            sizes[size]
          )}
        />
        <div
          className={cn(
            'absolute inset-0 rounded-full border-2 border-amber-500/10 border-b-amber-500/50 animate-spin',
            sizes[size],
            'animation-direction-reverse'
          )}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-500/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
