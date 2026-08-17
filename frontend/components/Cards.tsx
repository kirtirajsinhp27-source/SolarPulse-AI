'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Gauge,
  Zap,
  Sun,
  ShieldCheck,
  Percent,
  Layers,
  Sparkles,
} from 'lucide-react';

export interface AnalyticsKPIData {
  performanceRatio: number;
  performanceRatioDelta: number;
  specificYield: number;
  specificYieldDelta: number;
  degradationRate: number;
  degradationRateBenchmark: number;
  capacityUtilizationFactor: number;
  cufDelta: number;
}

interface CardsProps {
  data?: Partial<AnalyticsKPIData>;
}

export default function Cards({ data }: CardsProps) {
  const pr = data?.performanceRatio ?? 84.6;
  const prDelta = data?.performanceRatioDelta ?? 2.4;
  const specificYield = data?.specificYield ?? 5.73;
  const specificYieldDelta = data?.specificYieldDelta ?? 4.8;
  const degradation = data?.degradationRate ?? 0.42;
  const cuf = data?.capacityUtilizationFactor ?? 23.88;
  const cufDelta = data?.cufDelta ?? 1.8;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* ------------------------------------------------------------- */}
      {/* CARD 1: PERFORMANCE RATIO (PR %)                              */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Performance Ratio (PR)
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              IEC 61724
            </span>
          </div>

          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {pr.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-slate-500">%</span>
          </div>

          {/* Target Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 font-medium">Standard Target (80%)</span>
              <span className="text-slate-900 font-bold">105.7% of Goal</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (pr / 85) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center text-emerald-700 font-semibold space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{prDelta}% vs last month</span>
          </div>
          <span className="text-slate-400 text-[11px]">Benchmark: 78-85%</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 2: SPECIFIC YIELD (kWh/kWp)                              */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Specific Yield
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200">
              Daily
            </span>
          </div>

          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {specificYield.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-500">kWh/kWp</span>
          </div>

          {/* Plant Context */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 font-medium">Array Total Yield</span>
              <span className="text-slate-900 font-bold">1,432.8 kWh</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (specificYield / 6.5) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center text-emerald-700 font-semibold space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{specificYieldDelta}% vs baseline</span>
          </div>
          <span className="text-slate-400 text-[11px]">Regional avg: 5.47</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 3: SYSTEM DEGRADATION RATE (%)                           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Degradation Rate
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Tier-1 PERC
            </span>
          </div>

          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {degradation.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-500">% / year</span>
          </div>

          {/* Warranty Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 font-medium">Warranty Limit (0.50%)</span>
              <span className="text-emerald-700 font-bold">16% Better</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (degradation / 0.7) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center text-emerald-700 font-semibold space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Age: 2.5 Yrs • Optimal</span>
          </div>
          <span className="text-slate-400 text-[11px]">Limit: &lt;0.70%/yr</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CARD 4: CAPACITY UTILIZATION FACTOR (CUF %)                   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Capacity Utilization (CUF)
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              High Yield
            </span>
          </div>

          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">
              {cuf.toFixed(2)}
            </span>
            <span className="text-sm font-bold text-slate-500">%</span>
          </div>

          {/* CUF Sunshine Hours Equivalent */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 font-medium">Peak Sun Hours</span>
              <span className="text-slate-900 font-bold">5.73 PSH / day</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (cuf / 30) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center text-emerald-700 font-semibold space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{cufDelta}% vs Q2 average</span>
          </div>
          <span className="text-slate-400 text-[11px]">Utility Class</span>
        </div>
      </div>
    </div>
  );
}
