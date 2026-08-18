'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useWebSocket } from '@/lib/useWebSocket';
import { AuthUser, getSessionUser } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const {
    metrics,
    isStreaming,
    toggleStreaming,
    triggerAnomaly,
    pingLatencyMs,
    lastUpdated,
    alerts,
    selectedTimeframe,
    setSelectedTimeframe,
    telemetryStatus,
  } = useWebSocket();

  useEffect(() => {
    const sessionUser = getSessionUser();
    if (!sessionUser) {
      router.replace('/login');
      return;
    }
    if (pathname === '/admin' && sessionUser.role !== 'admin') {
      router.replace('/monitoring');
      return;
    }
    setUser(sessionUser);
    setAuthChecked(true);
  }, [pathname, router]);

  if (!authChecked) return null;

  // Dynamic titles based on active route
  const getPageInfo = () => {
    switch (pathname) {
      case '/analytics':
        return {
          title: 'Solar PV Analytics',
          subtitle: 'Plant Alpha • Yield Efficiency, Degradation & Irradiance Analysis',
        };
      case '/panels':
        return {
          title: 'Solar PV Panels',
          subtitle: 'Plant Alpha • 48-Module Array Diagnostics & Health Matrix',
        };
      case '/faults':
        return {
          title: 'System Faults & Diagnostic Feed',
          subtitle: 'Plant Alpha • Automated Diagnostics, Arc-Fault Detection & Rapid Response Center',
        };
      case '/roi':
        return {
          title: 'Solar PV ROI & Yield',
          subtitle: 'Plant Alpha • Financial Return, Tariff Arbitrage & Payback Tracker',
        };
      case '/about':
        return {
          title: 'Solar PV System Specifications',
          subtitle: 'Plant Alpha • Technical Hardware & Plant Metadata',
        };
      case '/admin':
        return {
          title: 'Administration',
          subtitle: 'User access, workspace controls, and system administration',
        };
      default:
        return {
          title: 'Solar PV Monitoring',
          subtitle: 'Plant Alpha • 250 kWp Commercial Rooftop Grid-Tied System',
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-[#475569] flex font-sans antialiased text-slate-900">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        irradianceWm2={metrics.irradianceWm2}
        ambientTempC={metrics.ambientTempC}
        user={user}
      />

      {/* Main Viewport Container (offset for fixed sidebar on lg screens) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Top Header */}
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          isStreaming={isStreaming}
          onToggleStreaming={toggleStreaming}
          onTriggerAnomaly={triggerAnomaly}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          pingLatencyMs={pingLatencyMs}
          lastUpdated={lastUpdated}
          activeAlertCount={alerts.filter((a) => a.status === 'active').length}
          selectedTimeframe={selectedTimeframe}
          onSelectTimeframe={setSelectedTimeframe}
          telemetryStatus={telemetryStatus}
          user={user}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {children}

          {/* Footer matching /login */}
          <footer className="pt-6 pb-4 text-center text-[11px] text-slate-200 font-medium">
            &copy; {new Date().getFullYear()} Acme Inc. All rights reserved. &bull; Privacy & Terms
          </footer>
        </main>
      </div>
    </div>
  );
}
