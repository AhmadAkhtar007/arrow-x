export interface ThemeConfig {
  id: string;
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

export const blueTheme: ThemeConfig = {
  id: 'blue',
  name: 'Cobalt Neon',
  accent: '#3b82f6',
  accentHover: '#60a5fa',
  accentRgb: '59, 130, 246',
  glow: 'rgba(59, 130, 246, 0.45)',
  logo: '/assets/logo-blue.png',
  badgeBg: 'rgba(59, 130, 246, 0.12)',
  badgeBorder: 'rgba(59, 130, 246, 0.3)',
  buttonBg: '#3b82f6',
  buttonText: '#ffffff',
  gradientText: 'from-blue-400 via-cyan-300 to-blue-500',
  surfaceBorder: 'rgba(59, 130, 246, 0.18)',
};

export default blueTheme;
