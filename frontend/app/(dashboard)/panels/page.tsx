'use client';

import React from 'react';
import PanelGrid from '@/components/PanelGrid';
import PanelAIDiagnostics from '@/components/PanelAIDiagnostics';
import { useWebSocket } from '@/lib/useWebSocket';
import { Grid3X3, Layers, Filter, Download } from 'lucide-react';

export default function PanelsPage() {
  const { panels } = useWebSocket();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Solar Panel Array Matrix
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Total plant capacity: 48 panels across 4 arrays with module-level diagnostics and hotspot mapping.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          48 Panels Total
        </div>
      </div>

      {/* Main Panel Grid Component */}
      <PanelGrid panels={panels} />
      <PanelAIDiagnostics panels={panels} />
    </div>
  );
}
