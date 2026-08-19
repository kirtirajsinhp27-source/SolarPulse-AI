'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Grid3X3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Thermometer,
  Zap,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { SolarPanelModule } from '@/types';

interface PanelGridProps {
  panels: SolarPanelModule[];
}

export default function PanelGrid({ panels }: PanelGridProps) {
  const [selectedArray, setSelectedArray] = useState<string>('All');
  const [selectedModule, setSelectedModule] = useState<SolarPanelModule | null>(
    panels.find((p) => p.status === 'warning') || panels[0]
  );

  const arrays = ['All', 'Array A', 'Array B', 'Array C', 'Array D'];

  const filteredPanels =
    selectedArray === 'All'
      ? panels
      : panels.filter((p) => p.arrayId === selectedArray);

  const optimalCount = panels.filter((p) => p.status === 'optimal').length;
  const warningCount = panels.filter((p) => p.status === 'warning').length;
  const criticalCount = panels.filter((p) => p.status === 'critical' || p.status === 'offline').length;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all">
      {/* Header with Title & Array Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Solar PV Array Health Grid
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            48 Monocrystalline PERC Modules (4 Strings)
          </p>
        </div>

        <Link
          href="/panels"
          className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center group self-start sm:self-auto"
        >
          <span>Full Matrix View</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Filter Tabs & Quick Health Counters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        {/* Array Filter Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold overflow-x-auto">
          {arrays.map((arr) => (
            <button
              key={arr}
              type="button"
              onClick={() => setSelectedArray(arr)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                selectedArray === arr
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {arr}
            </button>
          ))}
        </div>

        {/* Health Counters */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{optimalCount} Nominal</span>
          </span>
          {warningCount > 0 && (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{warningCount} Attention</span>
            </span>
          )}
          {criticalCount > 0 && (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-red-50 text-red-800 border border-red-200 font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>{criticalCount} Offline</span>
            </span>
          )}
        </div>
      </div>

      {/* Solar Panel Matrix Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4">
        {filteredPanels.map((mod) => {
          const isSelected = selectedModule?.id === mod.id;
          const isWarning = mod.status === 'warning';
          const isCritical = mod.status === 'critical' || mod.status === 'offline';

          let bgClass = 'bg-emerald-500 hover:bg-emerald-600';
          let borderClass = 'border-emerald-600/40';

          if (isWarning) {
            bgClass = 'bg-amber-500 hover:bg-amber-600 animate-pulse';
            borderClass = 'border-amber-600';
          } else if (isCritical) {
            bgClass = 'bg-red-500 hover:bg-red-600';
            borderClass = 'border-red-600';
          }

          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setSelectedModule(mod)}
              title={`${mod.id} (${mod.arrayId}) - ${mod.powerW}W - ${mod.status.toUpperCase()}`}
              className={`h-9 rounded-lg border flex flex-col items-center justify-center text-[10px] font-bold text-white transition-all shadow-2xs ${bgClass} ${borderClass} ${
                isSelected
                  ? 'ring-2 ring-slate-900 ring-offset-1 scale-105 z-10'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              <span>{mod.id.replace('MOD-', '')}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Module Detail Inspector */}
      {selectedModule && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-sm">
                Module {selectedModule.id}
              </span>
              <span className="text-slate-500 font-medium">
                ({selectedModule.arrayId} • {selectedModule.stringId})
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedModule.status === 'optimal'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedModule.status === 'warning'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedModule.status}
              </span>
            </div>

            <div className="text-[11px] text-slate-500">
              Channel: <strong className="text-slate-800">{selectedModule.mpptChannel}</strong>
            </div>
          </div>

          {/* Module Live Telemetry Values */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2.5">
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-400 font-medium">Power Output</div>
              <div className="font-bold text-slate-900 text-xs mt-0.5">
                {selectedModule.powerW.toFixed(1)} W
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-400 font-medium">Voltage (Vmp)</div>
              <div className="font-bold text-slate-900 text-xs mt-0.5">
                {selectedModule.voltageV.toFixed(1)} V
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-400 font-medium">Current (Imp)</div>
              <div className="font-bold text-slate-900 text-xs mt-0.5">
                {selectedModule.currentA.toFixed(1)} A
              </div>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-400 font-medium">Cell Temperature</div>
              <div className="font-bold text-slate-900 text-xs mt-0.5 flex items-center">
                <Thermometer className="w-3 h-3 mr-0.5 text-slate-400" />
                {selectedModule.temperatureC.toFixed(1)}°C
              </div>
            </div>
          </div>

          {/* Issue Alert description if warning */}
          {selectedModule.issueDescription && (
            <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Diagnostic Note:</strong> {selectedModule.issueDescription}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
