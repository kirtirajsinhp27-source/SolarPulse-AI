'use client';

import React, { useState } from 'react';
import Cards from '@/components/Cards';
import Charts from '@/components/Charts';
import { useWebSocket } from '@/lib/useWebSocket';
import {
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Sun,
  Zap,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Percent,
  Sliders,
  ChevronDown,
  Cpu,
  Thermometer,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { chartData, metrics, selectedTimeframe, setSelectedTimeframe } = useWebSocket();
  const [exportFeedback, setExportFeedback] = useState<string>('');

  const timeRanges = ['Today', '7 Days', '30 Days', 'Year'] as const;

  // Inverter Comparative Performance Telemetry Data
  const invertersComparative = [
    {
      id: 'INV-01',
      model: 'Sungrow SG50CX (50kW)',
      dcInputKW: '49.8 kW',
      acOutputKW: '48.9 kW',
      efficiency: '98.2%',
      tempC: '42.1°C',
      dailyYieldKWh: '358.4 kWh',
      mpptEfficiency: '99.4%',
      status: 'Optimal',
    },
    {
      id: 'INV-02',
      model: 'Sungrow SG50CX (50kW)',
      dcInputKW: '48.5 kW',
      acOutputKW: '47.6 kW',
      efficiency: '98.1%',
      tempC: '43.4°C',
      dailyYieldKWh: '349.1 kWh',
      mpptEfficiency: '99.2%',
      status: 'Optimal',
    },
    {
      id: 'INV-03',
      model: 'Sungrow SG50CX (50kW)',
      dcInputKW: '44.2 kW',
      acOutputKW: '43.1 kW',
      efficiency: '97.5%',
      tempC: '48.2°C',
      dailyYieldKWh: '312.8 kWh',
      mpptEfficiency: '98.1%',
      status: 'Attention',
    },
    {
      id: 'INV-04',
      model: 'Sungrow SG50CX (50kW)',
      dcInputKW: '50.1 kW',
      acOutputKW: '49.2 kW',
      efficiency: '98.2%',
      tempC: '41.8°C',
      dailyYieldKWh: '362.5 kWh',
      mpptEfficiency: '99.5%',
      status: 'Optimal',
    },
  ];

  // Monthly Analytics & Insolation Historical Data
  const monthlyData = [
    { month: 'January 2026', yieldKWh: '38,240', baselineKWh: '36,000', insolation: '142.5', pr: '84.1%', specificYield: '152.9', psh: '4.6', revenue: '₹8,412.80', delta: '+6.2%' },
    { month: 'February 2026', yieldKWh: '42,180', baselineKWh: '40,000', insolation: '158.2', pr: '84.8%', specificYield: '168.7', psh: '5.6', revenue: '₹9,279.60', delta: '+5.4%' },
    { month: 'March 2026', yieldKWh: '49,850', baselineKWh: '48,000', insolation: '184.0', pr: '85.2%', specificYield: '199.4', psh: '5.9', revenue: '₹10,967.00', delta: '+3.8%' },
    { month: 'April 2026', yieldKWh: '54,220', baselineKWh: '52,000', insolation: '198.6', pr: '84.9%', specificYield: '216.8', psh: '6.6', revenue: '₹11,928.40', delta: '+4.2%' },
    { month: 'May 2026', yieldKWh: '58,940', baselineKWh: '56,000', insolation: '214.2', pr: '84.3%', specificYield: '235.7', psh: '6.9', revenue: '₹12,966.80', delta: '+5.2%' },
    { month: 'June 2026', yieldKWh: '61,420', baselineKWh: '60,000', insolation: '221.8', pr: '83.9%', specificYield: '245.6', psh: '7.4', revenue: '₹13,512.40', delta: '+2.3%' },
    { month: 'July 2026', yieldKWh: '63,110', baselineKWh: '61,000', insolation: '228.4', pr: '84.2%', specificYield: '252.4', psh: '7.4', revenue: '₹13,884.20', delta: '+3.4%' },
    { month: 'August (MTD)', yieldKWh: '34,280', baselineKWh: '32,500', insolation: '124.0', pr: '84.6%', specificYield: '137.1', psh: '5.7', revenue: '₹7,541.60', delta: '+5.5%' },
  ];

  // Loss Factor Distribution
  const lossBreakdown = [
    { label: 'Soiling / Dust Occlusion', lossPct: '2.8%', kwhLoss: '43.7 kWh', color: 'bg-amber-500', note: 'Recoverable via scheduled rinse' },
    { label: 'Thermal Cell Derating', lossPct: '3.4%', kwhLoss: '53.1 kWh', color: 'bg-red-400', note: 'Ambient temperature delta (+16°C)' },
    { label: 'Inverter & MPPT Clipping', lossPct: '1.1%', kwhLoss: '17.2 kWh', color: 'bg-indigo-400', note: 'Peak noon DC:AC saturation' },
    { label: 'Cable & Resistance Loss', lossPct: '0.9%', kwhLoss: '14.0 kWh', color: 'bg-slate-400', note: 'Standard DC bus impedance' },
  ];

  // Handle Export Actions with Simulated Downloads
  const handleExportCSV = () => {
    setExportFeedback('Exporting Analytics Dataset (CSV)...');
    setTimeout(() => {
      // Build mock CSV string
      const headers = 'Month,AC Yield (kWh),Expected Baseline (kWh),Insolation (kWh/m2),Performance Ratio,Specific Yield (kWh/kWp),Peak Sun Hours,Revenue USD,Variance Delta\n';
      const rows = monthlyData
        .map(
          (m) =>
            `"₹{m.month}",₹{m.yieldKWh.replace(',', '')},₹{m.baselineKWh.replace(',', '')},₹{m.insolation},₹{m.pr},₹{m.specificYield},₹{m.psh},₹{m.revenue.replace(/[₹,]/g, '')},₹{m.delta}`
        )
        .join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `solar_analytics_report_₹{selectedTimeframe.toLowerCase().replace(' ', '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportFeedback('CSV Report Downloaded Successfully');
      setTimeout(() => setExportFeedback(''), 3000);
    }, 600);
  };

  const handleExportPDF = () => {
    setExportFeedback('Generating Comprehensive PDF Report...');
    setTimeout(() => {
      window.print();
      setExportFeedback('');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: CONTROLS & DATE FILTER HEADER CARD                 */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Solar PV Analytics
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                IEC 61724 Benchmarked
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Plant Alpha • Comprehensive Performance Ratio (PR), Specific Yield, and weather insolation correlation models
            </p>
          </div>

          {/* Actionable Controls & Date Range Selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe Selector Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setSelectedTimeframe(range)}
                  className={`px-3 py-1.5 rounded-lg transition-all ₹{
                    selectedTimeframe === range
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Export Actions */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-400"
                title="Download CSV raw analytics data"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportPDF}
                className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
                title="Print or export summary PDF report"
              >
                <FileText className="w-3.5 h-3.5 text-slate-200" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Status Toast Feedback */}
        {exportFeedback && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{exportFeedback}</span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: 4 FULLY FILLED KPI METRIC CARDS (Cards.tsx)        */}
      {/* ------------------------------------------------------------- */}
      <Cards
        data={{
          performanceRatio: 84.6,
          performanceRatioDelta: 2.4,
          specificYield: 5.73,
          specificYieldDelta: 4.8,
          degradationRate: 0.42,
          capacityUtilizationFactor: 23.88,
          cufDelta: 1.8,
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: GENERATION TRENDS OVERLAID WITH IRRADIANCE CHART   */}
      {/* ------------------------------------------------------------- */}
      <Charts
        data={chartData}
        livePowerKW={metrics.currentPowerKW}
        irradianceWm2={metrics.irradianceWm2}
      />

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: INVERTER COMPARATIVE PERFORMANCE DATA TABLE        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Inverter Comparative Telemetry & Efficiency Matrix
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Multi-unit power electronics benchmarking across all 4 string inverters (INV-01 to INV-04)
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Fleet Efficiency: 98.0%
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                <th className="py-3 px-3.5 rounded-l-lg">Unit ID</th>
                <th className="py-3 px-3.5">Hardware Model</th>
                <th className="py-3 px-3.5">DC Input Power</th>
                <th className="py-3 px-3.5">AC Output Power</th>
                <th className="py-3 px-3.5">Conversion Efficiency</th>
                <th className="py-3 px-3.5">Core Temp</th>
                <th className="py-3 px-3.5">Daily Yield Today</th>
                <th className="py-3 px-3.5">MPPT Match</th>
                <th className="py-3 px-3.5 rounded-r-lg">Operating Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invertersComparative.map((inv) => {
                const isOptimal = inv.status === 'Optimal';
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {inv.id}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-slate-700 font-medium">{inv.model}</td>
                    <td className="py-3 px-3.5 font-semibold text-slate-900">{inv.dcInputKW}</td>
                    <td className="py-3 px-3.5 font-semibold text-slate-900">{inv.acOutputKW}</td>
                    <td className="py-3 px-3.5 font-extrabold text-emerald-700">{inv.efficiency}</td>
                    <td className="py-3 px-3.5 text-slate-700 flex items-center mt-2.5">
                      <Thermometer className="w-3 h-3 mr-0.5 text-slate-400" />
                      {inv.tempC}
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-900">{inv.dailyYieldKWh}</td>
                    <td className="py-3 px-3.5 text-slate-600 font-mono">{inv.mpptEfficiency}</td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ₹{
                          isOptimal
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 5: YIELD LOSS FACTOR ANALYSIS & ENERGY FLOW           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Energy Harvest & Yield Loss Factor Breakdown
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Calculated variance between theoretical insolation absorption and net AC power delivered to grid
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-slate-500">Net Efficiency:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              91.8% Delivered
            </span>
          </div>
        </div>

        {/* Multi-segment Loss Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex shadow-inner">
            <div className="bg-slate-900 h-full text-[9px] font-bold text-white flex items-center justify-center" style={{ width: '91.8%' }}>
              Net AC Yield (91.8%)
            </div>
            <div className="bg-amber-500 h-full" style={{ width: '2.8%' }} title="Soiling (2.8%)" />
            <div className="bg-red-400 h-full" style={{ width: '3.4%' }} title="Thermal (3.4%)" />
            <div className="bg-indigo-400 h-full" style={{ width: '1.1%' }} title="Clipping (1.1%)" />
            <div className="bg-slate-400 h-full" style={{ width: '0.9%' }} title="Cables (0.9%)" />
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {lossBreakdown.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ₹{item.color}`} />
                  <span className="font-bold text-slate-900">{item.label}</span>
                </div>
                <span className="font-extrabold text-slate-800">{item.lossPct}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Energy Loss:</span>
                <strong className="text-slate-700">{item.kwhLoss}</strong>
              </div>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 6: HISTORICAL MONTHLY INSOLATION & REVENUE TABLE      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Historical Monthly Generation & Weather Correlation
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Detailed solar insolation, performance ratios, and financial generation records for Plant Alpha
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">YTD Generation:</span>
            <strong className="text-slate-900">402,280 kWh</strong>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                <th className="py-3 px-3.5 rounded-l-lg">Billing Period</th>
                <th className="py-3 px-3.5">AC Yield (kWh)</th>
                <th className="py-3 px-3.5">Target Baseline</th>
                <th className="py-3 px-3.5">Insolation (kWh/m²)</th>
                <th className="py-3 px-3.5">PR (%)</th>
                <th className="py-3 px-3.5">Specific Yield</th>
                <th className="py-3 px-3.5">Peak Hours</th>
                <th className="py-3 px-3.5">Revenue (₹)</th>
                <th className="py-3 px-3.5 rounded-r-lg">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900">{row.month}</td>
                  <td className="py-3 px-3.5 font-bold text-slate-900">{row.yieldKWh}</td>
                  <td className="py-3 px-3.5 text-slate-500">{row.baselineKWh}</td>
                  <td className="py-3 px-3.5 font-mono text-slate-700">{row.insolation}</td>
                  <td className="py-3 px-3.5 font-semibold text-emerald-700">{row.pr}</td>
                  <td className="py-3 px-3.5 text-slate-700">{row.specificYield}</td>
                  <td className="py-3 px-3.5 font-mono text-slate-600">{row.psh} PSH</td>
                  <td className="py-3 px-3.5 font-bold text-slate-900">{row.revenue}</td>
                  <td className="py-3 px-3.5">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>{row.delta}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
