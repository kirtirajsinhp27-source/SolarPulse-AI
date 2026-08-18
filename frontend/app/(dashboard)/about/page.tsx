'use client';

import React from 'react';
import { Info, Sun, ShieldCheck, Zap, Cpu, MapPin, Calendar, Wrench } from 'lucide-react';
import { INITIAL_PLANT_INFO } from '@/lib/mockData';

export default function AboutPage() {
  const specs = [
    { label: 'Plant Name', value: INITIAL_PLANT_INFO.plantName },
    { label: 'Plant Identifier', value: INITIAL_PLANT_INFO.plantId },
    { label: 'Installed Capacity', value: `${INITIAL_PLANT_INFO.capacityKWp} kWp (DC)` },
    { label: 'Solar PV Modules', value: '48x Canadian Solar HiKu6 545W Mono-PERC' },
    { label: 'Inverters', value: '4x Sungrow SG50CX Commercial String Inverters' },
    { label: 'MPPT Trackers', value: '8 Independent High-Efficiency Channels' },
    { label: 'Grid Interconnection', value: '415V 3-Phase 50Hz Grid Tied' },
    { label: 'Commissioning Date', value: 'January 15, 2024' },
    { label: 'Facility Location', value: INITIAL_PLANT_INFO.location },
    { label: 'Last Preventative Service', value: INITIAL_PLANT_INFO.lastMaintenance },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            System Specifications & Plant Metadata
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Technical hardware details, plant architecture, and engineering documentation
          </p>
        </div>
      </div>

      {/* Specifications Table Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Hardware & Site Characteristics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex justify-between items-center"
            >
              <span className="text-slate-500 font-medium">{item.label}</span>
              <strong className="text-slate-900 text-right">{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
