'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Grid3X3,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Info,
  Radio,
  LogOut,
  ChevronRight,
  X,
  Thermometer,
  CloudSun,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  irradianceWm2?: number;
  ambientTempC?: number;
}

export default function Sidebar({
  isOpenMobile = false,
  onCloseMobile,
  irradianceWm2 = 842,
  ambientTempC = 28.5,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Monitoring', href: '/monitoring', icon: Activity, badge: 'Live' },
    { name: 'Panels', href: '/panels', icon: Grid3X3 },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Faults', href: '/faults', icon: AlertTriangle, badge: '2 Alerts', badgeColor: 'bg-amber-100 text-amber-800' },
    { name: 'ROI & Yield', href: '/roi', icon: DollarSign },
    { name: 'About', href: '/about', icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Active Facility Card Header (Shifted to top) */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span className="font-semibold text-slate-600">Active Facility</span>
              <div className="flex items-center space-x-1.5">
                <span className="flex items-center text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping" />
                  250 kWp
                </span>
                {onCloseMobile && (
                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              Plant Alpha • Rooftop Array 01
            </div>
            <div className="text-[11px] text-slate-500 flex items-center mt-1">
              <Radio className="w-3 h-3 mr-1 text-slate-400" />
              48 Modules • 4 Inverters
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href === '/monitoring' && pathname === '/');

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          item.badgeColor
                            ? item.badgeColor
                            : isActive
                            ? 'bg-slate-800 text-slate-200'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Environmental Telemetry Mini Widget */}
          <div className="mx-3 mt-2 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <div className="flex items-center space-x-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                <span>Site Telemetry</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
                Optimal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-400">Irradiance</div>
                <div className="font-bold text-slate-900 text-xs">
                  {irradianceWm2}{' '}
                  <span className="text-[10px] font-normal text-slate-500">
                    W/m²
                  </span>
                </div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-400">Ambient</div>
                <div className="font-bold text-slate-900 text-xs flex items-center">
                  <Thermometer className="w-3 h-3 mr-0.5 text-slate-400" />
                  {ambientTempC}°C
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom User Profile & Sign Out Section */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                Jane Doe
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                Chief PV Engineer
              </p>
            </div>

            <Link
              href="/login"
              title="Return to Login"
              className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
