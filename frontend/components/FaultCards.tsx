'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { FaultAlert } from '@/types';

interface FaultCardsProps {
  alerts: FaultAlert[];
  onResolveAlert?: (alertId: string) => void;
}

export default function FaultCards({ alerts, onResolveAlert }: FaultCardsProps) {
  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Live Alert & Fault Feed
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {activeAlerts.length} Active System Anomaly Events
            </p>
          </div>

          <Link
            href="/faults"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center group"
          >
            <span>All Logs</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-900">All Systems Nominal</h3>
              <p className="text-[11px] text-slate-500 mt-1">
                Zero active faults or warnings detected across all strings.
              </p>
            </div>
          ) : (
            activeAlerts.slice(0, 3).map((alert) => {
              const isWarning = alert.severity === 'warning';
              const isCritical = alert.severity === 'critical';

              return (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-xl border bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      {isCritical ? (
                        <span className="p-1 rounded-md bg-red-100 text-red-700">
                          <AlertCircle className="w-3.5 h-3.5" />
                        </span>
                      ) : isWarning ? (
                        <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1 rounded-md bg-sky-100 text-sky-700">
                          <Info className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <span className="font-bold text-slate-900 leading-tight">
                        {alert.title}
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                      {alert.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 truncate">
                      <span className="font-mono font-semibold text-slate-700 bg-slate-200/60 px-1 py-0.5 rounded">
                        {alert.code}
                      </span>
                      <span className="truncate">{alert.component}</span>
                    </div>

                    {onResolveAlert && (
                      <button
                        type="button"
                        onClick={() => onResolveAlert(alert.id)}
                        className="self-end sm:self-auto px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-[10px] font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center space-x-1 shadow-2xs"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Acknowledge</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Continuous string impedance telemetry active</span>
        <span className="text-emerald-700 font-semibold">Live Scanned</span>
      </div>
    </div>
  );
}
