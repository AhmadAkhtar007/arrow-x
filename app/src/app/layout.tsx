import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SupportFAB } from '../components/SupportFAB';
import { MobileBottomNav } from '../components/MobileBottomNav';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://arrowx.shop'),
  title: {
    default: 'ArrowX | Undetected Game Cheats & Ring-0 Enhancements',
    template: '%s | ArrowX Game Cheats',
  },
  description: 'Precision-engineered undetected Ring-0 cheats for Valorant, CS2, Fortnite, Apex Legends, EFT, ARC Raiders, and 24+ titles with instant automated key delivery.',
  keywords: [
    'game cheats',
    'undetected cheats',
    'valorant cheats',
    'cs2 cheats',
    'fortnite cheats',
    'apex legends cheats',
    'tarkov cheats',
    'ring0 kernel aimbot',
    'hwid spoofer',
    'arrowx'
  ],
  authors: [{ name: 'ArrowX Security Team' }],
  creator: 'ArrowX',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arrowx.shop',
    siteName: 'ArrowX',
    title: 'ArrowX | Undetected Game Cheats & Ring-0 Enhancements',
    description: 'Precision-engineered undetected Ring-0 cheats for Valorant, CS2, Fortnite, Apex Legends, EFT, ARC Raiders, and 24+ titles with instant automated key delivery.',
    images: [
      {
        url: '/assets/logo-green.png',
        width: 800,
        height: 600,
        alt: 'ArrowX Security Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArrowX | Undetected Game Cheats & Ring-0 Enhancements',
    description: 'Precision-engineered undetected Ring-0 cheats for Valorant, CS2, Fortnite, and 24+ titles with instant 0s delivery.',
    images: ['/assets/logo-green.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/assets/logo-green.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#040705] text-white selection:bg-white/20 selection:text-white font-sans relative overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider>
          {/* Custom Precision Cursor */}
          <CustomCursor />

          {/* Navigation Header */}
          <Navbar />

          {/* Main Route Content */}
          <main className="relative z-10">
            {children}
          </main>

          {/* Footer Navigation */}
          <Footer />

          {/* 24/7 Support FAB Assistant */}
          <SupportFAB />

          {/* Mobile Bottom Bar Navigation */}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
