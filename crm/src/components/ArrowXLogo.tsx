'use client';

import React from 'react';

interface ArrowXLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'green' | 'blue';
}

export const ArrowXLogo: React.FC<ArrowXLogoProps> = ({ 
  size = 36, 
  className = '', 
  showText = true,
  variant = 'green'
}) => {
  const logoSrc = variant === 'blue' ? '/assets/logo-blue.png' : '/assets/logo-green.png';
  const accentColor = variant === 'blue' ? '#3b82f6' : '#10b981';
  const glowClass = variant === 'blue' 
    ? 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
    : 'drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official ArrowX Brand Logo Image */}
      <div 
        className="relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <img
          src={logoSrc}
          alt={`ArrowX Official Logo (${variant})`}
          className={`w-full h-full object-contain filter ${glowClass}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = variant === 'blue' ? '/assets/logo-blue.png' : '/assets/logo-green.png';
          }}
        />
      </div>

      {showText && (
        <span className="font-display font-black text-lg md:text-xl tracking-tight text-white flex items-center">
          Arrow<span style={{ color: accentColor }}>X</span>
        </span>
      )}
    </div>
  );
};
