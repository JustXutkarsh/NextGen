import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "NESTGEN '26 -- Physical AI & Autonomous Fleet Summit",
  description: "An interactive mission simulator showcasing real-world Physical AI deployments from Shell, Airbus, UK Police, SQM, and FlytBase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
