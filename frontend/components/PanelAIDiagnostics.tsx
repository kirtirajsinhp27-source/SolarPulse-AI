'use client';

import React from 'react';
import { AlertTriangle, CalendarClock, IndianRupee, Thermometer, Wrench } from 'lucide-react';
import { SolarPanelModule } from '@/lib/mockData';

interface PanelAIDiagnosticsProps {
  panels: SolarPanelModule[];
}

const TARIFF_INR = 8.5;

export default function PanelAIDiagnostics({ panels }: PanelAIDiagnosticsProps) {
  const reports = panels
    .map((panel) => {
      const expectedPowerW = 400;
      const lossPercent = Math.max(0, ((expectedPowerW - panel.powerW) / expectedPowerW) * 100);
      const dailyLossKWh = Math.max(0, (expectedPowerW - panel.powerW) * 5 / 1000);
      const temperatureAlert = panel.temperatureC >= 55;
      const needsRepair = panel.status !== 'optimal' || temperatureAlert || lossPercent >= 12;
      const reason = panel.issueDescription ?? (
        temperatureAlert
          ? 'Cell temperature is above the safe operating threshold.'
          : 'Power output is below the expected module baseline.'
      );
      const solution = temperatureAlert
        ? 'Inspect thermal hotspot, clean the module, and test bypass diode continuity.'
        : 'Inspect connectors, clean the surface, and compare string current with adjacent modules.';
      const repairCostINR = temperatureAlert ? 3500 : 1500;
      const savedINR = dailyLossKWh * TARIFF_INR;
      const priority = temperatureAlert || lossPercent >= 30 ? 'Critical' : lossPercent >= 15 ? 'Medium' : 'Low';
      const repairWindow = priority === 'Critical' ? 'Within 24 hours' : priority === 'Medium' ? 'Within 7 days' : 'Next inspection';

      return {
        panel,
        lossPercent,
        dailyLossKWh,
        temperatureAlert,
        needsRepair,
        reason,
        solution,
        repairCostINR,
        savedINR,
        priority,
        repairWindow,
      };
    })
    .filter((report) => report.needsRepair)
    .sort((left, right) => right.lossPercent - left.lossPercent)
    .slice(0, 6);

  return (
    <section className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-5 h-5 text-amber-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900">AI Panel Repair Diagnostics</h2>
          <p className="text-xs text-slate-500">Predicted loss, root cause, temperature risk, repair timing, and savings.</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
          No panel currently crosses the repair threshold.
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.panel.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{report.panel.id}</span>
                    <span className="text-xs text-slate-500">{report.panel.arrayId} • {report.panel.stringId}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${report.priority === 'Critical' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                      {report.priority} priority
                    </span>
                    {report.temperatureAlert && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-bold text-red-700">
                        <Thermometer className="w-3 h-3" /> Temperature alert
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Reason: {report.reason}</p>
                </div>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-1 text-[11px] font-bold text-amber-800">
                  {report.lossPercent.toFixed(1)}% predicted loss
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs">
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-slate-400">Temperature</div>
                  <div className="font-bold text-slate-900">{report.panel.temperatureC.toFixed(1)}°C</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <div className="text-slate-400">Loss / day</div>
                  <div className="font-bold text-slate-900">{report.dailyLossKWh.toFixed(2)} kWh</div>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2">
                  <div className="text-emerald-700">Savings after repair</div>
                  <div className="font-bold text-emerald-800 flex items-center gap-1"><IndianRupee className="w-3 h-3" />{report.savedINR.toFixed(2)} / day</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-2 text-[11px]">
                <div><strong className="text-slate-700">Why:</strong> {report.reason}<br /><strong className="text-slate-700">AI solution:</strong> {report.solution}</div>
                <div className="flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5 text-slate-400" /><strong>Repair:</strong> {report.repairWindow}</div>
                <div className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5 text-slate-400" /><strong>Estimated cost:</strong> ₹{report.repairCostINR.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-[10px] text-slate-400 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Source: module-level telemetry estimate. Database panel records enable production-grade predictions.
      </div>
    </section>
  );
}
