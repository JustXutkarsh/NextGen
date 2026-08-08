import type { Metadata } from 'next';
import './globals.css';
import NoiseOverlay from '@/components/ui/NoiseOverlay';

export const metadata: Metadata = {
  title: "NESTGEN '26 — Physical AI & Autonomous Fleet Summit",
  description:
    'An interactive classified briefing showcasing real BVLOS drone dock operations across North Sea offshore platforms, Atacama desert mines, and US rail infrastructure.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&family=JetBrains+Mono:wght@400;500;600&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
