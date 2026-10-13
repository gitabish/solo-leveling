import type {Metadata} from 'next';
import './globals.css'; // Global styles

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

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
