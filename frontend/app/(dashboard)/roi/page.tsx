'use client';

import React from 'react';
import { DollarSign, TrendingUp, PiggyBank, Calendar, Leaf, Sparkles } from 'lucide-react';
import { useWebSocket } from '@/lib/useWebSocket';

export default function ROIPage() {
  const { metrics } = useWebSocket();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            ROI & Financial Yield Tracker
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Net energy savings, feed-in tariff arbitrage, carbon credits & payback period
          </p>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Lifetime Revenue Generated
          </div>
          <div className="text-3xl font-extrabold text-slate-900">$94,820.50</div>
          <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +18.4% ahead of original model
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            CapEx Payback Status
          </div>
          <div className="text-3xl font-extrabold text-slate-900">3.8 / 5.2 Yrs</div>
          <div className="text-xs text-slate-500 mt-2">
            73% of initial installation cost recovered
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Carbon Credits Value
          </div>
          <div className="text-3xl font-extrabold text-emerald-700">$6,450.00</div>
          <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center">
            <Leaf className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            418.5 Tons CO₂ Total Offset
          </div>
        </div>
      </div>
    </div>
  );
}
