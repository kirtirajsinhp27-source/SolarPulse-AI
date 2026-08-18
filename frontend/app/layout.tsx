import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Solar PV Monitoring & Analytics | Helios PV Pro',
  description: 'Real-time Solar Photovoltaic Plant Telemetry, Array Diagnostics, and AI Yield Optimization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#475569] antialiased">{children}</body>
    </html>
  );
}
