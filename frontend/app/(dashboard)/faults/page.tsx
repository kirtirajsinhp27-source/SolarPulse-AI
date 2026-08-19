'use client';

import React, { useState } from 'react';
import { useWebSocket } from '@/lib/useWebSocket';
import AIInsight from '@/components/AIInsight';
import {
  ShieldAlert,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Wrench,
  UserCheck,
  Zap,
  Filter,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Cpu,
  Thermometer,
} from 'lucide-react';
import { FaultAlert } from '@/types';

export default function FaultsPage() {
  const { alerts, resolveAlert, triggerAnomaly, insights } = useWebSocket();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'warning' | 'resolved' | 'acknowledged'>('all');
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});
  const [dispatchedAlerts, setDispatchedAlerts] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string>('');

  // Extended initial mock alerts with resolved historical events
  const allAlerts: (FaultAlert & { rootCause?: string; resolutionSteps?: string })[] = [
    ...alerts.map((a) => ({
      ...a,
      rootCause:
        a.code === 'E-PV-104'
          ? 'Localized bird droppings & dust deposit causing reverse bias localized cell overheating'
          : a.code === 'E-INV-302'
          ? 'Ambient enclosure heat accumulation and dust filter airflow restriction on cooling intake'
          : 'DC string disconnect connector loose terminal pin or thermal expansion trip',
      resolutionSteps:
        a.code === 'E-PV-104'
          ? 'Schedule deionized water module rinse & inspect bypass diode continuity'
          : a.code === 'E-INV-302'
          ? 'Clean inverter intake fan filters & inspect thermal paste interface'
          : 'Perform string impedance continuity test and re-torque MC4 connector pins',
    })),
    {
      id: 'alert-hist-01',
      title: 'String 2 Ground Fault Isolation',
      component: 'String #02 • Array B1',
      location: 'Array B1, Roof Bay 2',
      severity: 'warning',
      timestamp: 'Yesterday at 16:45',
      status: 'resolved',
      description: 'Transient moisture ingress in junction box caused insulation resistance dip to 0.8 MΩ.',
      recommendedAction: 'Junction box seal replaced and desiccated.',
      code: 'E-ISO-201',
      rootCause: 'O-ring seal degraded by intense UV exposure over 2 years.',
      resolutionSteps: 'Installed IP68 dual-seal junction enclosure.',
    },
    {
      id: 'alert-hist-02',
      title: 'Grid Frequency Transient Spike',
      component: 'AC Switchgear Main Feed',
      location: 'Main Distribution Substation',
      severity: 'info',
      timestamp: '2 days ago at 11:20',
      status: 'resolved',
      description: 'Grid utility frequency fluctuated to 50.4Hz for 120ms during regional load shedding.',
      recommendedAction: 'Inverter ride-through algorithm handled autonomously without plant trip.',
      code: 'E-GRID-501',
      rootCause: 'External utility grid transmission fluctuation.',
      resolutionSteps: 'Auto-synchronized in 120ms per IEEE 1547 standards.',
    },
  ];

  // Filtering Logic
  const filteredAlerts = allAlerts.filter((item) => {
    const isAck = acknowledgedAlerts[item.id];
    if (selectedFilter === 'critical') return item.severity === 'critical' && item.status !== 'resolved';
    if (selectedFilter === 'warning') return item.severity === 'warning' && item.status !== 'resolved';
    if (selectedFilter === 'resolved') return item.status === 'resolved';
    if (selectedFilter === 'acknowledged') return isAck && item.status !== 'resolved';
    return true;
  });

  const activeCount = allAlerts.filter((a) => a.status === 'active').length;
  const criticalCount = allAlerts.filter((a) => a.severity === 'critical' && a.status === 'active').length;
  const warningCount = allAlerts.filter((a) => a.severity === 'warning' && a.status === 'active').length;

  const handleAcknowledge = (id: string, title: string) => {
    setAcknowledgedAlerts((prev) => ({ ...prev, [id]: true }));
    setToastMessage(`Acknowledged alert: "${title}"`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleDispatch = (id: string, title: string) => {
    const techName = 'Eng. Marcus Reed (Field Tech #4)';
    setDispatchedAlerts((prev) => ({ ...prev, [id]: techName }));
    setToastMessage(`Dispatched ${techName} for "${title}"`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSimulateNewFault = () => {
    triggerAnomaly();
    setToastMessage('Triggered live simulated anomaly on array strings!');
    setTimeout(() => setToastMessage(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: HEADER & STATUS FILTERS CARD                       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                System Faults & Diagnostic Feed
              </h1>
              <span
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                  activeCount > 0
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {activeCount} Active Anomaly Events
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time string impedance telemetry, arc-fault detection, thermal hotspots, and automated dispatch
            </p>
          </div>

          {/* Quick Filters and Simulation Trigger */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              {(['all', 'critical', 'warning', 'acknowledged', 'resolved'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  type="button"
                  onClick={() => setSelectedFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                    selectedFilter === filterKey
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filterKey}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSimulateNewFault}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Anomaly</span>
            </button>
          </div>
        </div>

        {/* Action Status Toast Feedback */}
        {toastMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: 4 FAULT SEVERITY METRIC CARDS                      */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Critical Alerts */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Critical Alerts
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-800 border border-red-200">
                Priority 1
              </span>
            </div>

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {criticalCount}
              </span>
              <span className="text-xs font-bold text-red-600">Immediate Action</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 font-medium">MOD-04 Hotspot</span>
                <span className="text-red-700 font-bold">68.4°C</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full w-full" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-red-700 font-semibold flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Cell Shading / Thermal</span>
            </span>
            <span className="text-slate-400 text-[11px]">Auto Dispatch</span>
          </div>
        </div>

        {/* Card 2: Active Warnings */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Warnings
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                Priority 2
              </span>
            </div>

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {warningCount}
              </span>
              <span className="text-xs font-bold text-amber-600">Moderate Derating</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 font-medium">INV-03 Temp Saturation</span>
                <span className="text-amber-700 font-bold">48.2°C</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-3/4" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-semibold flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Filter Airflow Check</span>
            </span>
            <span className="text-slate-400 text-[11px]">SLA: 4h</span>
          </div>
        </div>

        {/* Card 3: Mean Time to Repair (MTTR) */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mean Time to Repair
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                MTTR
              </span>
            </div>

            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                2.4
              </span>
              <span className="text-sm font-bold text-slate-500">Hours</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 font-medium">Benchmark Target (3.0h)</span>
                <span className="text-emerald-700 font-bold">20% Faster</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-4/5" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Resolution Rate: 99.1%</span>
            </span>
            <span className="text-slate-400 text-[11px]">Industry Leading</span>
          </div>
        </div>

        {/* Card 4: System Operational Health Score */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                System Health Score
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                Online
              </span>
            </div>

            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                96.2
              </span>
              <span className="text-sm font-bold text-slate-500">%</span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-500 font-medium">String Health</span>
                <span className="text-slate-900 font-bold">47/48 Active</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.2%' }} />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold flex items-center space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Plant Alpha Protected</span>
            </span>
            <span className="text-slate-400 text-[11px]">Target: &gt;95%</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: 2-COLUMN MAIN CONTENT (FAULT FEED & AI INSIGHT)   */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Interactive Fault List & Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Detailed Anomaly & Diagnostic Log
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Showing {filteredAlerts.length} diagnostic events matching filter
                </p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span className="capitalize">{selectedFilter} Events</span>
              </div>
            </div>

            {/* Alert List Cards */}
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200/70">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900">No Matching Fault Events</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    All telemetry logs within this category are clear and nominal.
                  </p>
                </div>
              ) : (
                filteredAlerts.map((alert) => {
                  const isCritical = alert.severity === 'critical';
                  const isWarning = alert.severity === 'warning';
                  const isResolved = alert.status === 'resolved';
                  const isAck = acknowledgedAlerts[alert.id];
                  const dispatchedTech = dispatchedAlerts[alert.id];

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all text-xs space-y-3 ${
                        isResolved
                          ? 'bg-slate-50/50 border-slate-200 opacity-80'
                          : isCritical
                          ? 'bg-red-50/30 border-red-200 hover:border-red-300'
                          : 'bg-amber-50/20 border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      {/* Top Row: Severity, Title, Code & Timestamp */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold uppercase text-[10px] tracking-wider ${
                              isResolved
                                ? 'bg-slate-200 text-slate-700'
                                : isCritical
                                ? 'bg-red-600 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {alert.severity}
                          </span>
                          <span className="font-mono font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {alert.code}
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm">{alert.title}</h3>
                        </div>

                        <span className="text-[11px] text-slate-400 font-medium">
                          {alert.timestamp}
                        </span>
                      </div>

                      {/* Component Location & Description */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center space-x-2 text-slate-700 font-medium">
                          <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>Component: <strong>{alert.component}</strong> ({alert.location})</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          {alert.description}
                        </p>
                      </div>

                      {/* Root Cause & Recommended Action */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                          <span className="font-bold text-slate-900 block">Root Cause Diagnosis:</span>
                          <p className="text-slate-600">{alert.rootCause}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 space-y-1">
                          <span className="font-bold text-slate-900 block">Action Protocol:</span>
                          <p className="text-slate-600">{alert.resolutionSteps}</p>
                        </div>
                      </div>

                      {/* Dispatched Technician Badge if active */}
                      {dispatchedTech && (
                        <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-[11px] flex items-center space-x-2">
                          <UserCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span><strong>Technician Assigned:</strong> {dispatchedTech} • En route to Site</span>
                        </div>
                      )}

                      {/* Interactive Actions Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/70">
                        <div className="flex items-center space-x-2">
                          {isAck ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-[10px]">
                              <Check className="w-3 h-3" />
                              <span>Acknowledged by Engineer</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAcknowledge(alert.id, alert.title)}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-700 hover:text-slate-900 transition-all shadow-2xs cursor-pointer text-[11px]"
                            >
                              Acknowledge Alert
                            </button>
                          )}

                          {!dispatchedTech && !isResolved && (
                            <button
                              type="button"
                              onClick={() => handleDispatch(alert.id, alert.title)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all shadow-xs flex items-center space-x-1 text-[11px] cursor-pointer"
                            >
                              <Wrench className="w-3 h-3 text-amber-400" />
                              <span>Dispatch Technician</span>
                            </button>
                          )}
                        </div>

                        {!isResolved && (
                          <button
                            type="button"
                            onClick={() => {
                              resolveAlert(alert.id);
                              setToastMessage(`Resolved event: "${alert.title}"`);
                              setTimeout(() => setToastMessage(''), 3500);
                            }}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-xs flex items-center space-x-1 text-[11px] cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Resolved</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: AI Diagnostics & Root Cause Side Panel */}
        <div className="space-y-4">
          <AIInsight insights={insights} />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: HISTORICAL RESOLUTION & PREVENTATIVE AUDIT LOG    */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Maintenance & Diagnostic Audit History
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Completed repair logs, verified engineer sign-offs, and compliance history
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            Plant Alpha Log Archive
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                <th className="py-3 px-3.5 rounded-l-lg">Event ID</th>
                <th className="py-3 px-3.5">Component</th>
                <th className="py-3 px-3.5">Fault Type</th>
                <th className="py-3 px-3.5">Assigned Engineer</th>
                <th className="py-3 px-3.5">Downtime Duration</th>
                <th className="py-3 px-3.5">Remediation Action</th>
                <th className="py-3 px-3.5 rounded-r-lg">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3.5 font-mono font-bold text-slate-900">EV-2026-0814</td>
                <td className="py-3 px-3.5 font-medium text-slate-800">String #02 • Array B1</td>
                <td className="py-3 px-3.5 text-slate-600">Insulation Resistance Low</td>
                <td className="py-3 px-3.5 font-semibold text-slate-800">David Vance (Cert #812)</td>
                <td className="py-3 px-3.5 font-mono text-slate-700">1h 14m</td>
                <td className="py-3 px-3.5 text-slate-600">Replaced IP68 Junction Seal & Re-torqued</td>
                <td className="py-3 px-3.5">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Closed & Verified</span>
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3.5 font-mono font-bold text-slate-900">EV-2026-0812</td>
                <td className="py-3 px-3.5 font-medium text-slate-800">Inverter #02 AC Filter</td>
                <td className="py-3 px-3.5 text-slate-600">Preventative Intake Clean</td>
                <td className="py-3 px-3.5 font-semibold text-slate-800">Marcus Reed (Cert #409)</td>
                <td className="py-3 px-3.5 font-mono text-slate-700">0h 45m</td>
                <td className="py-3 px-3.5 text-slate-600">Quarterly Filter Desilting & Thermal Test</td>
                <td className="py-3 px-3.5">
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Closed & Verified</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
