'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Sun,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Bot,
  RefreshCw,
} from 'lucide-react';
import { AIInsightItem } from '@/types';

interface AIInsightProps {
  insights: AIInsightItem[];
}

export default function AIInsight({ insights }: AIInsightProps) {
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const handleApplyAction = (id: string) => {
    setApplyingId(id);
    setTimeout(() => {
      setApplyingId(null);
      setAppliedActions((prev) => ({ ...prev, [id]: true }));
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                AI Efficiency & Yield Engine
              </h2>
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 text-amber-900 rounded-md">
                v2.4 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Autonomous PV optimization & yield recommendations
            </p>
          </div>
        </div>

        {/* Insights List */}
        <div className="space-y-3">
          {insights.map((item) => {
            const isApplied = appliedActions[item.id];
            const isApplying = applyingId === item.id;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs"
              >
                {/* Title and Category Badge */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-slate-900 leading-tight">
                      {item.title}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    {item.confidencePercent}% Match
                  </span>
                </div>

                {/* Impact Highlight Badge */}
                <div className="my-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[11px]">
                  <TrendingUp className="w-3 h-3 text-amber-600" />
                  <span>Impact: {item.impact}</span>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
                  {item.description}
                </p>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] text-slate-400">{item.timestamp}</span>

                  <button
                    type="button"
                    disabled={isApplied || isApplying}
                    onClick={() => handleApplyAction(item.id)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center space-x-1 shadow-xs ${
                      isApplied
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isApplying ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-white" />
                    ) : isApplied ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Optimized</span>
                      </>
                    ) : (
                      <>
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center space-x-1">
          <Bot className="w-3.5 h-3.5 text-slate-400" />
          <span>Neural MPPT & Weather Correlated</span>
        </span>
        <span className="text-slate-800 font-semibold">+4.6% Avg ROI</span>
      </div>
    </div>
  );
}
