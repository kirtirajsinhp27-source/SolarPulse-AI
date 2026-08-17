'use client';

import React from 'react';
import PanelGrid from '@/components/PanelGrid';
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
            High-resolution module-level diagnostics, string current matching & hotspot mapping
          </p>
        </div>
      </div>

      {/* Main Panel Grid Component */}
      <PanelGrid panels={panels} />
    </div>
  );
}
