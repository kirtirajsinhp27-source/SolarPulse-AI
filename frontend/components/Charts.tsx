'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Activity,
  Layers,
  Calendar,
  Sun,
  Zap,
  Info,
  Sliders,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { GenerationDataPoint } from '@/types';

interface InverterEfficiencyData {
  id: string;
  name: string;
  efficiency: number; // e.g. 98.2%
  yieldKWh: number;
  tempC: number;
  status: 'Optimal' | 'Attention' | 'Normal';
  clippingRisk: string;
}

interface ChartsProps {
  data: GenerationDataPoint[];
  livePowerKW?: number;
  irradianceWm2?: number;
  inverterData?: InverterEfficiencyData[];
}

export default function Charts({
  data,
  livePowerKW = 188.4,
  irradianceWm2 = 842,
  inverterData = [
    { id: 'INV-01', name: 'Inverter #01 (50kW)', efficiency: 98.2, yieldKWh: 358.4, tempC: 42.1, status: 'Optimal', clippingRisk: 'Low (0.2%)' },
    { id: 'INV-02', name: 'Inverter #02 (50kW)', efficiency: 98.1, yieldKWh: 349.1, tempC: 43.4, status: 'Optimal', clippingRisk: 'Low (0.4%)' },
    { id: 'INV-03', name: 'Inverter #03 (50kW)', efficiency: 97.5, yieldKWh: 312.8, tempC: 48.2, status: 'Attention', clippingRisk: 'Moderate (1.8%)' },
    { id: 'INV-04', name: 'Inverter #04 (50kW)', efficiency: 98.2, yieldKWh: 362.5, tempC: 41.8, status: 'Optimal', clippingRisk: 'Low (0.1%)' },
  ],
}: ChartsProps) {
  const [activeMetric, setActiveMetric] = useState<'generation_vs_irradiance' | 'pr_trend' | 'specific_yield'>('generation_vs_irradiance');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = { top: 25, right: 45, bottom: 40, left: 45 };

  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  // Max scale values for dual axis
  const maxPowerKW = useMemo(() => {
    const maxVal = Math.max(...data.map((d) => Math.max(d.actualKW, d.baselineKW)), 220);
    return Math.ceil(maxVal / 50) * 50;
  }, [data]);

  const maxIrradianceWm2 = 1000;

  // Generate SVG Points for Power & Irradiance
  const points = useMemo(() => {
    const step = innerWidth / (data.length - 1);
    return data.map((d, i) => {
      const x = padding.left + i * step;
      const actualPowerY = padding.top + innerHeight - (d.actualKW / maxPowerKW) * innerHeight;
      const baselinePowerY = padding.top + innerHeight - (d.baselineKW / maxPowerKW) * innerHeight;
      const irradianceY = padding.top + innerHeight - (d.irradianceWm2 / maxIrradianceWm2) * innerHeight;
      return { x, actualPowerY, baselinePowerY, irradianceY, data: d };
    });
  }, [data, innerWidth, innerHeight, maxPowerKW, padding.left, padding.top]);

  // Smooth Bezier Curve Path generator
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const controlX = (current.x + next.x) / 2;
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  };

  const actualPowerPath = useMemo(
    () => createSmoothPath(points.map((p) => ({ x: p.x, y: p.actualPowerY }))),
    [points]
  );

  const irradiancePath = useMemo(
    () => createSmoothPath(points.map((p) => ({ x: p.x, y: p.irradianceY }))),
    [points]
  );

  const baselinePath = useMemo(
    () => createSmoothPath(points.map((p) => ({ x: p.x, y: p.baselinePowerY }))),
    [points]
  );

  // Closed area path for gradient fill under actual power
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = padding.top + innerHeight;
    const first = points[0];
    const last = points[points.length - 1];
    return `${actualPowerPath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [actualPowerPath, points, innerHeight, padding.top]);

  // Left Y-axis ticks (Power kW)
  const yTicksPower = [0, maxPowerKW * 0.25, maxPowerKW * 0.5, maxPowerKW * 0.75, maxPowerKW];

  // Right Y-axis ticks (Irradiance W/m²)
  const yTicksIrradiance = [0, 250, 500, 750, 1000];

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 5];

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* MAIN GENERATION VS WEATHER IRRADIANCE ANALYTICS CHART         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all">
        {/* Header with Title, Metric Switchers & Legends */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Generation Trends vs. Weather Irradiance
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Dual-axis correlation of real-time solar AC generation (kW) vs. Pyranometer insolation (W/m²)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Mode Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveMetric('generation_vs_irradiance')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMetric === 'generation_vs_irradiance'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Power vs Irradiance
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('pr_trend')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMetric === 'pr_trend'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                PR % Curve
              </button>
              <button
                type="button"
                onClick={() => setActiveMetric('specific_yield')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeMetric === 'specific_yield'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Specific Yield
              </button>
            </div>

            {/* Legend Badges */}
            <div className="flex items-center space-x-3 text-xs font-medium pl-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-900 inline-block ring-2 ring-slate-900/30" />
                <span className="text-slate-700 font-bold">Generation (kW)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-1.5 rounded-full bg-amber-500 inline-block" />
                <span className="text-amber-700 font-semibold">Irradiance (W/m²)</span>
              </div>
              <div className="flex items-center space-x-1.5 hidden sm:flex">
                <span className="w-4 h-0.5 border-b-2 border-dashed border-slate-400 inline-block" />
                <span className="text-slate-500">Baseline</span>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Dual-Axis Chart Canvas */}
        <div className="relative w-full overflow-hidden select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible cursor-crosshair"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              {/* Actual Power Area Gradient */}
              <linearGradient id="analyticsPowerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F172A" stopOpacity="0.20" />
                <stop offset="60%" stopColor="#0F172A" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0.0" />
              </linearGradient>

              {/* Peak Window Highlight */}
              <linearGradient id="analyticsPeakWindow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Peak Window (11:00 to 14:00) */}
            {points.length >= 9 && (
              <rect
                x={points[5].x}
                y={padding.top}
                width={points[8].x - points[5].x}
                height={innerHeight}
                fill="url(#analyticsPeakWindow)"
                rx="4"
              />
            )}

            {/* Y-Axis Horizontal Grid Lines */}
            {yTicksPower.map((tick, idx) => {
              const yPos = padding.top + innerHeight - (tick / maxPowerKW) * innerHeight;
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={svgWidth - padding.right}
                    y2={yPos}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={idx === 0 ? '0' : '3 3'}
                  />
                  {/* Left Label: Power kW */}
                  <text
                    x={padding.left - 8}
                    y={yPos + 4}
                    textAnchor="end"
                    fontSize="11"
                    fontWeight="600"
                    fill="#64748B"
                  >
                    {Math.round(tick)}
                  </text>
                  {/* Right Label: Irradiance W/m² */}
                  <text
                    x={svgWidth - padding.right + 8}
                    y={yPos + 4}
                    textAnchor="start"
                    fontSize="11"
                    fontWeight="600"
                    fill="#D97706"
                  >
                    {yTicksIrradiance[idx]}
                  </text>
                </g>
              );
            })}

            {/* Area Fill Under Actual Power */}
            <path d={areaPath} fill="url(#analyticsPowerGradient)" />

            {/* Baseline Power Curve (Dashed) */}
            <path
              d={baselinePath}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2.0"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />

            {/* Irradiance Trend Curve (Amber) */}
            <path
              d={irradiancePath}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Actual Power Generation Curve (Dark Slate) */}
            <path
              d={actualPowerPath}
              fill="none"
              stroke="#0F172A"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* X-Axis Time Ticks & Hover Trigger Columns */}
            {points.map((p, idx) => {
              const isHovered = hoveredIndex === idx;
              const isCurrent = idx === 8;

              return (
                <g key={idx}>
                  {/* Invisible Hitbox */}
                  <rect
                    x={p.x - innerWidth / (data.length * 2)}
                    y={padding.top}
                    width={innerWidth / data.length}
                    height={innerHeight + padding.bottom}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                  />

                  {/* X-Axis Time Label */}
                  <text
                    x={p.x}
                    y={svgHeight - 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isHovered || isCurrent ? '700' : '500'}
                    fill={isHovered ? '#0F172A' : '#64748B'}
                  >
                    {p.data.time}
                  </text>

                  {/* Interactive Cursor Details on Hover */}
                  {isHovered && (
                    <>
                      <line
                        x1={p.x}
                        y1={padding.top}
                        x2={p.x}
                        y2={padding.top + innerHeight}
                        stroke="#0F172A"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      {/* Irradiance Marker */}
                      <circle
                        cx={p.x}
                        cy={p.irradianceY}
                        r="5"
                        fill="#F59E0B"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      {/* Power Marker */}
                      <circle
                        cx={p.x}
                        cy={p.actualPowerY}
                        r="6"
                        fill="#0F172A"
                        stroke="#F59E0B"
                        strokeWidth="2.5"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Telemetry Metric Inspector Bar */}
        {activePoint && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold font-mono">
                {activePoint.data.time}
              </div>
              <div>
                <span className="text-slate-500 font-medium">Generation:</span>{' '}
                <strong className="text-slate-900 text-sm font-bold">
                  {activePoint.data.actualKW.toFixed(1)} kW
                </strong>
              </div>
              <div className="hidden sm:block text-slate-300">|</div>
              <div className="hidden sm:block">
                <span className="text-slate-500 font-medium">Baseline:</span>{' '}
                <strong className="text-slate-700">
                  {activePoint.data.baselineKW.toFixed(1)} kW
                </strong>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-500">Irradiance:</span>
                <strong className="text-amber-700 font-bold font-mono">
                  {activePoint.data.irradianceWm2} W/m²
                </strong>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500">Instant PR:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {activePoint.data.efficiencyPercent}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INVERTER-LEVEL COMPARATIVE EFFICIENCY & PERFORMANCE BARS      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Inverter-Level Comparative Efficiency & Performance
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time Euro conversion efficiency benchmarks across all 4 string inverters (INV-01 to INV-04)
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Avg Efficiency: 98.0%
            </span>
          </div>
        </div>

        {/* 4 Inverter Efficiency Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inverterData.map((inv) => {
            const isOptimal = inv.status === 'Optimal';
            return (
              <div
                key={inv.id}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all space-y-3"
              >
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                      {inv.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{inv.name}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isOptimal
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                {/* Efficiency Bar Meter */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Conversion Efficiency</span>
                    <span className="font-extrabold text-slate-900 text-sm">{inv.efficiency}%</span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isOptimal ? 'bg-slate-900' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (inv.efficiency / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Submetrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Daily Yield</span>
                    <strong className="text-slate-800">{inv.yieldKWh} kWh</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Core Temp</span>
                    <strong className="text-slate-800">{inv.tempC}°C</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Clipping Loss</span>
                    <strong className={isOptimal ? 'text-emerald-700' : 'text-amber-700'}>
                      {inv.clippingRisk}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
