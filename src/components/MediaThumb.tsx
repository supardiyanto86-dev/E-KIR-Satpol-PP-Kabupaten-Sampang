import React, { useState } from 'react';
import { Package, User } from 'lucide-react';

interface MediaThumbProps {
  src?: string;
  alt: string;
  variant: 'asset' | 'avatar';
  className?: string;
  onClick?: () => void;
  title?: string;
}

function getInitials(name: string): string {
  const cleaned = name
    .replace(/^(Drs\.|Dr\.|H\.|Ir\.|Hj\.)\s*/i, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ASN';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const MediaThumb: React.FC<MediaThumbProps> = ({
  src,
  alt,
  variant,
  className = '',
  onClick,
  title,
}) => {
  const [hasError, setHasError] = useState(false);

  const showFallback = !src || hasError;

  if (showFallback) {
    if (variant === 'avatar') {
      return (
        <div
          onClick={onClick}
          title={title || alt}
          className={`flex items-center justify-center bg-slate-200 text-slate-700 font-semibold select-none shrink-0 ${
            onClick ? 'cursor-pointer' : ''
          } ${className}`}
          aria-label={alt}
        >
          {alt ? (
            <span className="text-xs tracking-tight">{getInitials(alt)}</span>
          ) : (
            <User className="w-4 h-4 text-slate-500" />
          )}
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        title={title || alt}
        className={`flex items-center justify-center bg-slate-100 text-slate-400 border border-slate-200 select-none shrink-0 ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        aria-label={alt}
      >
        <Package className="w-5 h-5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      title={title}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      onClick={onClick}
      className={`object-cover shrink-0 ${
        onClick ? 'cursor-zoom-in' : ''
      } ${className}`}
    />
  );
};
