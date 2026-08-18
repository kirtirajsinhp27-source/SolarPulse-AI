'use client';

import React from 'react';
import { IndianRupee, Wrench, ShieldCheck } from 'lucide-react';
import { useWebSocket } from '@/lib/useWebSocket';

const USD_TO_INR = 83.5;

const formatINR = (usdAmount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(usdAmount * USD_TO_INR);

export default function ROIPage() {
  const { chartData, selectedTimeframe } = useWebSocket();
  const energyLossKWh = chartData.reduce(
    (total, point) => total + Math.max(0, point.baselineKW - point.actualKW) * 24,
    0
  );
  const recoverableLossKWh = energyLossKWh * 0.8;
  const tariffPerKWhINR = 8.5;
  const repairCostINR = 15000;
  const savingsINR = recoverableLossKWh * tariffPerKWhINR;
  const annualSavingsINR = savingsINR * 365;
  const paybackMonths = savingsINR > 0 ? repairCostINR / savingsINR : 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            ROI & Financial Yield Tracker
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Net energy savings, feed-in tariff arbitrage, carbon credits & payback period in INR
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Estimated Savings After Repair (INR)
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {formatINR(savingsINR / USD_TO_INR)}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center">
            <Wrench className="w-3.5 h-3.5 mr-1" />
            {selectedTimeframe} recoverable loss after repair
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Repair Payback Status
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {paybackMonths > 0 ? `${paybackMonths.toFixed(1)} Months` : 'Pending Data'}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Estimated repair cost: {formatINR(repairCostINR / USD_TO_INR)}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Annual Savings if Repaired (INR)
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">
            {formatINR(annualSavingsINR / USD_TO_INR)}
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            {recoverableLossKWh.toFixed(1)} kWh recoverable energy
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="text-base font-bold text-slate-900">Panel Problem to Savings Model</h2>
            <p className="text-xs text-slate-500">
              Detect the generation gap, repair the affected panel or string, and recover the lost yield.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">1. Problem detected</div>
            <div className="mt-2 text-xl font-extrabold text-slate-900">{energyLossKWh.toFixed(1)} kWh</div>
            <div className="text-xs text-slate-600 mt-1">Estimated generation loss vs expected baseline</div>
          </div>
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-800">2. Repair action</div>
            <div className="mt-2 text-xl font-extrabold text-slate-900">80% recovery</div>
            <div className="text-xs text-slate-600 mt-1">Clean, inspect, or replace the affected panel/string</div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">3. Owner saves</div>
            <div className="mt-2 text-xl font-extrabold text-slate-900">{formatINR(savingsINR / USD_TO_INR)}</div>
            <div className="text-xs text-slate-600 mt-1">At ₹{tariffPerKWhINR.toFixed(2)} per recovered kWh</div>
          </div>
        </div>
      </div>
    </div>
  );
}
