import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const fallbackIconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export default function Avatar({ 
  src, 
  alt = 'User avatar',
  size = 'md',
  fallback,
  className 
}: AvatarProps) {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // Reset error state if src changes
  React.useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  return (
    <div 
      className={cn(
        'relative rounded-full overflow-hidden bg-mono-100 flex-shrink-0',
        'transition-transform duration-200 ease-in-out transform',
        sizeClasses[size],
        className
      )}
    >
      {src && !error ? (
        <>
          {/* Low quality placeholder */}
          <div 
            className={cn(
              'absolute inset-0 bg-cover bg-center blur-sm scale-110',
              !loaded && 'animate-pulse'
            )}
            style={{ backgroundImage: `url(${src})` }}
          />

          {/* Main image */}
          <picture>
            {/* WebP format */}
            <source
              type="image/webp"
              srcSet={`${src}?w=96&fm=webp 1x, ${src}?w=192&fm=webp 2x`}
            />
            {/* Fallback format */}
            <source
              type="image/jpeg"
              srcSet={`${src}?w=96&q=80 1x, ${src}?w=192&q=80 2x`}
            />
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onError={() => setError(true)}
              onLoad={() => setLoaded(true)}
              className={cn(
                'w-full h-full object-cover',
                !loaded && 'opacity-0',
                'transition-opacity duration-200 ease-in-out'
              )}
            />
          </picture>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {fallback || <User className={cn('text-mono-400', fallbackIconSizes[size])} />}
        </div>
      )}
    </div>
  );
}