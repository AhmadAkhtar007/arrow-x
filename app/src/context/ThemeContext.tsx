'use client';

import React, { createContext, useContext, useEffect } from 'react';

export type ThemeColor = 'green';

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  accent: string;
  accentHover: string;
  accentRgb: string;
  glow: string;
  logo: string;
  badgeBg: string;
  badgeBorder: string;
  buttonBg: string;
  buttonText: string;
  gradientText: string;
  surfaceBorder: string;
}

export const GREEN_THEME: ThemeConfig = {
  id: 'green',
  name: 'Cyber Emerald',
  accent: '#10b981',
  accentHover: '#34d399',
  accentRgb: '16, 185, 129',
  glow: 'rgba(16, 185, 129, 0.45)',
  logo: '/assets/logo-green.png',
  badgeBg: 'rgba(16, 185, 129, 0.12)',
  badgeBorder: 'rgba(16, 185, 129, 0.3)',
  buttonBg: '#10b981',
  buttonText: '#000000',
  gradientText: 'from-emerald-400 via-emerald-300 to-green-400',
  surfaceBorder: 'rgba(16, 185, 129, 0.18)',
};

interface ThemeContextType {
  theme: ThemeColor;
  themeConfig: ThemeConfig;
  setTheme?: (t: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'green',
  themeConfig: GREEN_THEME,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', GREEN_THEME.accent);
    root.style.setProperty('--theme-accent-hover', GREEN_THEME.accentHover);
    root.style.setProperty('--theme-accent-rgb', GREEN_THEME.accentRgb);
    root.style.setProperty('--theme-glow', GREEN_THEME.glow);
    root.style.setProperty('--theme-surface-border', GREEN_THEME.surfaceBorder);
    root.setAttribute('data-theme', 'green');
    localStorage.setItem('arrowx_theme', 'green');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'green', themeConfig: GREEN_THEME }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
