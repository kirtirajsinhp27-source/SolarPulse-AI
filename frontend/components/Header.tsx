'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthUser, logout } from '@/lib/auth';
import {
  Menu,
  Activity,
  Bell,
  Calendar,
  Play,
  Pause,
  RefreshCw,
  Zap,
  CheckCircle2,
  Sparkles,
  Download,
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  isStreaming?: boolean;
  onToggleStreaming?: () => void;
  onTriggerAnomaly?: () => void;
  onOpenMobileMenu?: () => void;
  pingLatencyMs?: number;
  lastUpdated?: string;
  activeAlertCount?: number;
  selectedTimeframe?: string;
  onSelectTimeframe?: (tf: string) => void;
  telemetryStatus?: 'loading' | 'live' | 'no-data' | 'offline';
  user?: AuthUser | null;
}

export default function Header({
  title = 'Solar PV Overview',
  subtitle = 'Plant Alpha • 250 kWp Commercial Rooftop Grid-Tied System',
  isStreaming = true,
  onToggleStreaming,
  onTriggerAnomaly,
  onOpenMobileMenu,
  pingLatencyMs = 24,
  lastUpdated = 'Just now',
  activeAlertCount = 2,
  selectedTimeframe = 'Today',
  onSelectTimeframe,
  telemetryStatus = 'loading',
  user,
}: HeaderProps) {
  const router = useRouter();
  const timeframes = ['Today', '7 Days', '30 Days', 'Year'];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left Section: Title & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu on Mobile */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>

              {/* Live Status Indicator Pill */}
              <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-semibold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  {isStreaming && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{telemetryStatus === 'live' ? 'Telemetry Connected' : telemetryStatus === 'no-data' ? 'No Telemetry Data' : telemetryStatus === 'offline' ? 'Backend Offline' : 'Loading Telemetry'}</span>
                <span className="text-[10px] text-emerald-600 font-normal border-l border-emerald-200 pl-1.5 ml-0.5">
                  {telemetryStatus === 'live' ? `${pingLatencyMs}ms` : ''}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Section: Timeframe Picker, Live Controls, Actions & Profile */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 justify-between md:justify-end">
          {/* Quick Timeframe Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70 text-xs font-medium">
            {timeframes.map((tf) => {
              const isSelected = selectedTimeframe === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => onSelectTimeframe && onSelectTimeframe(tf)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>

          {/* Live Telemetry Stream Pause / Play Toggle */}
          {onToggleStreaming && (
            <button
              type="button"
              onClick={onToggleStreaming}
              title={isStreaming ? 'Pause live telemetry stream' : 'Resume live stream'}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isStreaming
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-xs'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Live Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>
          )}

          {/* Interactive Trigger Anomaly Demo Button */}
          {onTriggerAnomaly && (
            <button
              type="button"
              onClick={onTriggerAnomaly}
              title="Simulate a live string voltage fault for testing"
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-400"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Fault</span>
            </button>
          )}

          {/* Notification Alert Bell */}
          <Link
            href="/faults"
            className="relative p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs transition-all"
            title={`${activeAlertCount} active alerts`}
          >
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white shadow-xs">
                {activeAlertCount}
              </span>
            )}
          </Link>

          {/* User Profile Link */}
          <Link
            href="/profile"
            className="flex items-center pl-1 sm:pl-2 border-l border-slate-200 group text-left"
          >
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-slate-700">
                {user?.name ?? 'Account'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">{user?.role === 'admin' ? 'Administrator' : user?.role ?? 'Signed-in user'}</div>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-900"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
