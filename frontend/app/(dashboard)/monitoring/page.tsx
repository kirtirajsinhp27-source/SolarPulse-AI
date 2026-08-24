'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useWebSocket } from '@/lib/useWebSocket';
import { useRouter } from 'next/navigation';
import {
  Activity,
  Zap,
  Radio,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Thermometer,
  Gauge,
  Sliders,
  TrendingUp,
} from 'lucide-react';

export default function MonitoringPage() {
  const router = useRouter();

  const { metrics, pingLatencyMs, lastUpdated, isStreaming, selectedTimeframe } = useWebSocket();
  const [selectedInverter, setSelectedInverter] = useState<string>('ALL');

  const [registeredInverters, setRegisteredInverters] = useState<any[]>([]);

  useEffect(() => {
    const loadRegisteredInverters = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8001/api/v1/inverters',
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load registered inverters');
        }

        const data = await response.json();

        setRegisteredInverters(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load registered inverters:', error);
      }
    };

    loadRegisteredInverters();
  }, []);

  const timeframeScale = {
    Today: 1,
    '7 Days': 0.94,
    '30 Days': 0.88,
    Year: 0.76,
  }[selectedTimeframe] ?? 1;
  const liveScale = metrics.currentPowerKW > 0 ? metrics.currentPowerKW / 188.4 : 1;

  const inverters = [
    {
      id: 'INV-01',
      name: 'Inverter #01 (Sungrow SG50CX)',
      status: 'Optimal',
      dcPowerKW: 49.8,
      acPowerKW: 48.9,
      efficiency: '98.2%',
      tempC: 42.1,
      voltageV: 412.4,
      currentA: 12.1,
      gridFreqHz: 50.02,
      powerFactor: 0.99,
      mppt1: { v: '412V', a: '12.1A', p: '24.9 kW' },
      mppt2: { v: '415V', a: '12.0A', p: '24.9 kW' },
      dailyYieldKWh: 358.4,
      electricityLossKWh: 4.2,
      financialLossINR: 21.0,
      lossReason: 'Normal operating variation',
    },
    {
      id: 'INV-02',
      name: 'Inverter #02 (Sungrow SG50CX)',
      status: 'Optimal',
      dcPowerKW: 48.5,
      acPowerKW: 47.6,
      efficiency: '98.1%',
      tempC: 43.4,
      voltageV: 408.8,
      currentA: 11.9,
      gridFreqHz: 50.01,
      powerFactor: 0.99,
      mppt1: { v: '408V', a: '11.9A', p: '24.2 kW' },
      mppt2: { v: '410V', a: '11.8A', p: '24.3 kW' },
      dailyYieldKWh: 349.1,
      electricityLossKWh: 6.8,
      financialLossINR: 34.0,
      lossReason: 'Minor conversion loss',
    },
    {
      id: 'INV-03',
      name: 'Inverter #03 (Sungrow SG50CX)',
      status: 'Attention',
      dcPowerKW: 44.2,
      acPowerKW: 43.1,
      efficiency: '97.5%',
      tempC: 48.2,
      voltageV: 372.1,
      currentA: 9.8,
      gridFreqHz: 49.98,
      powerFactor: 0.98,
      mppt1: { v: '372V', a: '9.8A', p: '20.1 kW' },
      mppt2: { v: '411V', a: '12.1A', p: '24.1 kW' },
      dailyYieldKWh: 312.8,
      electricityLossKWh: 185.4,
      financialLossINR: 927.0,
      lossReason: 'MPPT underperformance / thermal derating',
    },
    {
      id: 'INV-04',
      name: 'Inverter #04 (Sungrow SG50CX)',
      status: 'Optimal',
      dcPowerKW: 50.1,
      acPowerKW: 49.2,
      efficiency: '98.2%',
      tempC: 41.8,
      voltageV: 418.2,
      currentA: 12.2,
      gridFreqHz: 50.02,
      powerFactor: 0.99,
      mppt1: { v: '418V', a: '12.2A', p: '25.0 kW' },
      mppt2: { v: '416V', a: '12.1A', p: '25.1 kW' },
      dailyYieldKWh: 362.5,
      electricityLossKWh: 3.6,
      financialLossINR: 18.0,
      lossReason: 'Normal operating variation',
    },
    ];

  const registeredInverterCards = registeredInverters
    .filter(
      (registered) =>
        !inverters.some(
          (existing) => existing.id === registered.inverter_id
        )
    )
    .map((registered) => ({
      id: registered.inverter_id,
      name: registered.name,
      status: 'Registered',
      dcPowerKW: 0,
      acPowerKW: 0,
      efficiency: '—',
      tempC: 0,
      voltageV: 0,
      currentA: 0,
      gridFreqHz: 0,
      powerFactor: 0,
      mppt1: { v: '—', a: '—', p: '—' },
      mppt2: { v: '—', a: '—', p: '—' },
      dailyYieldKWh: 0,
      electricityLossKWh: 0,
      financialLossINR: 0,
      lossReason: 'Awaiting live telemetry connection',
    }));

  const allInverters = [...inverters, ...registeredInverterCards];
  // Inverter Telemetry Live Telemetry Points (High Frequency)
  const telemetryHistory = [
    { time: '14:00', inv1: 48.2, inv2: 47.1, inv3: 42.8, inv4: 48.5 },
    { time: '14:05', inv1: 48.6, inv2: 47.4, inv3: 43.0, inv4: 48.9 },
    { time: '14:10', inv1: 49.1, inv2: 47.9, inv3: 43.5, inv4: 49.3 },
    { time: '14:15', inv1: 49.5, inv2: 48.2, inv3: 43.8, inv4: 49.7 },
    { time: '14:20', inv1: 49.8, inv2: 48.5, inv3: 44.2, inv4: 50.1 },
  ];

    const timeframeInverters = allInverters.map((inverter) => ({
    ...inverter,
    dcPowerKW: Number((inverter.dcPowerKW * timeframeScale * liveScale).toFixed(1)),
    acPowerKW: Number((inverter.acPowerKW * timeframeScale * liveScale).toFixed(1)),
    dailyYieldKWh: Number((inverter.dailyYieldKWh * timeframeScale * liveScale).toFixed(1)),
  }));

  const timeframeTelemetryHistory = telemetryHistory.map((row) => ({
    ...row,
    inv1: Number((row.inv1 * timeframeScale * liveScale).toFixed(1)),
    inv2: Number((row.inv2 * timeframeScale * liveScale).toFixed(1)),
    inv3: Number((row.inv3 * timeframeScale * liveScale).toFixed(1)),
    inv4: Number((row.inv4 * timeframeScale * liveScale).toFixed(1)),
  }));

  const filteredInverters =
    selectedInverter === 'ALL'
      ? timeframeInverters
      : timeframeInverters.filter((inv) => inv.id === selectedInverter);

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: DEDICATED MONITORING HEADER CARD                   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Live Inverter & String Telemetry
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                {selectedTimeframe} Data
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time MPPT channel tracking, high-frequency AC/DC power electronics & grid synchronization
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-slate-50 p-2 rounded-xl border border-slate-200 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold text-slate-700">Ping: {pingLatencyMs}ms</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono">Telemetry: {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: INVERTER SELECTOR TABS & LIVE HARDWARE CARDS       */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200/90 shadow-xs text-xs font-semibold">
          {[
  'ALL',
  ...inverters.map((inverter) => inverter.id),
  ...registeredInverters
    .map((inverter) => inverter.inverter_id)
    .filter((id) => !inverters.some((inverter) => inverter.id === id)),
].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedInverter(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedInverter === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All Inverters' : tab}
            </button>
          ))}

	  <button
            type="button"
            onClick={() => router.push('/monitoring/add-inverter')}
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-     all"
	  >
	    + Add Inverter
	  </button>
          </div>

        <div className="text-xs text-slate-500 font-medium">
          Total String Inverters: <strong className="text-slate-900">4x 50kW Sungrow SG50CX</strong>
        </div>
      </div>

      {/* Inverter Detailed Hardware Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInverters.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 space-y-4 hover:shadow-2xl transition-all"
          >
            {/* Unit Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{inv.name}</h3>
                <span className="text-[11px] text-slate-400 font-mono">{inv.id} • 3-Phase 415V</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  inv.status === 'Optimal'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {inv.status}
              </span>
            </div>

            {/* Metric Cubes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <div className="text-[10px] text-slate-400 font-medium">DC Input Power</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{inv.dcPowerKW} kW</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <div className="text-[10px] text-slate-400 font-medium">AC Output Power</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5">{inv.acPowerKW} kW</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <div className="text-[10px] text-slate-400 font-medium">Euro Efficiency</div>
                <div className="font-bold text-emerald-700 text-xs mt-0.5">{inv.efficiency}</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                <div className="text-[10px] text-slate-400 font-medium">Internal Temp</div>
                <div className="font-bold text-slate-900 text-xs mt-0.5 flex items-center">
                  <Thermometer className="w-3 h-3 mr-0.5 text-slate-400" />
                  {inv.tempC}°C
                </div>
              </div>
            </div>

            {/* Electricity & Financial Loss */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div
                className={`p-2.5 rounded-xl border ${
                inv.electricityLossKWh > 50
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-slate-50 border-slate-200/70'
                 }`}
              >
                <div className="text-[10px] text-slate-400 font-medium">
                  Electricity Loss
                </div>
              <div
                className={`font-bold text-xs mt-0.5 ${
                  inv.electricityLossKWh > 50
                    ? 'text-amber-700'
                    : 'text-slate-900'
                }`}
              >
                {inv.electricityLossKWh} kWh
              </div>
            </div>

            <div
              className={`p-2.5 rounded-xl border ${
                inv.financialLossINR > 500
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-slate-50 border-slate-200/70'
              }`}
            >
              <div className="text-[10px] text-slate-400 font-medium">
                Financial Loss
              </div>
              <div
                className={`font-bold text-xs mt-0.5 ${
                  inv.financialLossINR > 500
                    ? 'text-amber-700'
                    : 'text-slate-900'
              }`}
            >
              ₹{inv.financialLossINR.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Loss Reason */}
        <div className="p-2.5 rounded-xl border border-slate-200/70 bg-slate-50">
          <div className="text-[10px] text-slate-400 font-medium">
            Loss Reason
          </div>
          <div
            className={`font-semibold text-xs mt-0.5 ${
              inv.electricityLossKWh > 50
                ? 'text-amber-700'
                : 'text-slate-700'
            }`}
          >
            {inv.lossReason}
          </div>
        </div>

            {/* MPPT Channels Breakdown */}
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-2 text-xs">
              <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>MPPT Channels</span>
                <span className="text-[10px] font-normal text-slate-400">Independent DC Trackers</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-600 block">MPPT 1</span>
                  <div className="font-mono text-slate-900 text-xs mt-0.5">
                    {inv.mppt1.v} / {inv.mppt1.a}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Yield: {inv.mppt1.p}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-600 block">MPPT 2</span>
                  <div className="font-mono text-slate-900 text-xs mt-0.5">
                    {inv.mppt2.v} / {inv.mppt2.a}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Yield: {inv.mppt2.p}</div>
                </div>
              </div>
            </div>

            {/* Grid Synchronization Row */}
            <div className="pt-2 border-t border-slate-100 text-xs flex flex-wrap items-center justify-between text-slate-600 gap-2">
              <span className="flex items-center space-x-1">
                <Radio className="w-3 h-3 text-slate-400" />
                <span>Grid Freq: <strong className="text-slate-900">{inv.gridFreqHz} Hz</strong></span>
              </span>
              <span>Power Factor: <strong className="text-slate-900">{inv.powerFactor}</strong></span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                {inv.dailyYieldKWh} kWh {selectedTimeframe}
              </span>
            </div>
          </div>
        ))}
      </div>
            {/* ------------------------------------------------------------- */}
      {/* TOTAL PLANT LOSS SUMMARY                                     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Total Plant Loss
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Combined electricity and financial loss across all 4 inverters
            </p>
          </div>

          <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            INV-03 requires attention
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <div className="text-[10px] text-slate-400 font-medium">
              Total Electricity Loss
            </div>
            <div className="font-bold text-slate-900 text-lg mt-0.5">
              200.0 kWh
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <div className="text-[10px] text-slate-400 font-medium">
              Total Financial Loss
            </div>
            <div className="font-bold text-slate-900 text-lg mt-0.5">
              ₹1,000
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <div className="text-[10px] text-slate-400 font-medium">
              Primary Loss Reason
            </div>
            <div className="font-semibold text-amber-700 text-xs mt-1">
              MPPT underperformance / thermal derating
            </div>
          </div>
        </div>
      </div>-

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: INVERTER POWER BALANCE & STRING TELEMETRY LOGS     */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Live DC Bus & Inverter Load Balancing
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              High-resolution 5-minute sampling across all 4 string converters
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            98.1% Average Efficiency
          </span>
        </div>

        {/* Telemetry Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Inv #01 (kW)</th>
                <th className="py-2.5 px-3">Inv #02 (kW)</th>
                <th className="py-2.5 px-3">Inv #03 (kW)</th>
                <th className="py-2.5 px-3">Inv #04 (kW)</th>
                <th className="py-2.5 px-3">Total AC (kW)</th>
                <th className="py-2.5 px-3">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeframeTelemetryHistory.map((row, idx) => {
                const total = +(row.inv1 + row.inv2 + row.inv3 + row.inv4).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{row.time}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.inv1}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.inv2}</td>
                    <td className="py-2.5 px-3 text-amber-700 font-medium">{row.inv3}</td>
                    <td className="py-2.5 px-3 text-slate-700">{row.inv4}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{total} kW</td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Synchronized
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
