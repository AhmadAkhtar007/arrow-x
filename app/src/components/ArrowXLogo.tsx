'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ArrowXLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const ArrowXLogo: React.FC<ArrowXLogoProps> = ({ size = 32, className = '', showText = true }) => {
  const { themeConfig } = useTheme();

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic Logo Image from Uploaded Assets */}
      <div 
        className="relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <img
          src={themeConfig.logo}
          alt={`ArrowX Logo ${themeConfig.name}`}
          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
          onError={(e) => {
            // Fallback SVG if image not found
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white flex items-center gap-0.5">
          Arrow<span style={{ color: themeConfig.accent }}>X</span>
        </span>
      )}
    </div>
  );
};
