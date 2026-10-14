import type { Metadata } from 'next';
import { Montserrat, Source_Sans_3 } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-head',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SYSTEM - Solo Leveling Fitness RPG',
  description: 'Solo Leveling inspired real-life fitness leveling app with daily quests, hunter ranks, stat points, and penalty survival trials.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'SYSTEM - Solo Leveling Fitness RPG',
    description: 'Solo Leveling inspired real-life fitness leveling app with daily quests, hunter ranks, stat points, and penalty survival trials.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SYSTEM - Solo Leveling Fitness RPG',
    description: 'Solo Leveling inspired real-life fitness leveling app with daily quests, hunter ranks, stat points, and penalty survival trials.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark bg-[#01050d] text-[#f4faff] ${montserrat.variable} ${sourceSans.variable}`}
    >
      <body className="min-h-screen anime-system-bg overflow-x-hidden select-none font-body" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
