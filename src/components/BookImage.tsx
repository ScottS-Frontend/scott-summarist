// src/components/BookImage.tsx
'use client';

import { Book } from '@/types';
import Image from 'next/image';

interface BookImageProps {
  book: Book;
  className?: string;
  showHoverEffect?: boolean;
  showHalfCircle?: boolean;
  circleSize?: 'small' | 'medium' | 'large';
}

export default function BookImage({ 
  book, 
  className = '',
  showHoverEffect = true,
  showHalfCircle = false,
  circleSize = 'medium'
}: BookImageProps) {
  // Circle size mapping
  const circleSizes = {
    small: { width: 40, height: 20 },
    medium: { width: 80, height: 40 },
    large: { width: 120, height: 60 }
  };

  const size = circleSizes[circleSize];

  return (
    <div className={`relative ${className}`}>
      {/* Half circle background if enabled */}
      {showHalfCircle && (
        <div 
          className="absolute left-1/2 rounded-t-full -z-10 bg-blue-300"
          style={{ 
            width: size.width,
            height: size.height,
            bottom: '10%',
            transform: 'translateX(-50%)',
          }}
        />
      )}
      
      {/* Book cover image - fill container, NO style prop */}
      <div className="relative w-full h-full">
        <Image
          src={book.imageLink || '/assets/landing.png'}
          alt={book.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-2 drop-shadow-lg"
          // REMOVED: style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    </div>
  );
}