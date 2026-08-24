'use client';

import React from 'react';
import Link from 'next/link';
import { useWebSocket } from '@/lib/useWebSocket';
import Charts from '@/components/Charts';
import { Activity, ArrowRight, ArrowUpRight, BrainCircuit, Gauge, PanelsTopLeft, Search, TrendingDown, Zap, BatteryCharging, SunMedium, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const { metrics, alerts, panels, chartData } = useWebSocket();
  const affectedPanel = panels.find((panel) => panel.status === 'warning') || panels[0];

  const cards = [
    {
      title: 'Current Output',
      value: `${metrics.currentPowerKW.toFixed(1)} kW`,
      delta: '+3.8%',
      icon: Zap,
      accent: 'text-emerald-600 bg-emerald-100',
    },
    {
      title: 'Daily Generation',
      value: `${metrics.dailyGenerationKWh.toFixed(1)} kWh`,
      delta: `${((metrics.dailyGenerationKWh / metrics.dailyTargetKWh) * 100).toFixed(0)}% target`,
      icon: SunMedium,
      accent: 'text-amber-600 bg-amber-100',
    },
    {
      title: 'Energy Loss',
      value: `${metrics.electricityLossKWh.toFixed(1)} kWh`,
      delta: `₹${metrics.financialLossINR.toFixed(0)}`,
      icon: TrendingDown,
      accent: 'text-rose-600 bg-rose-100',
    },
    {
      title: 'Performance Ratio',
      value: `${metrics.performanceRatio.toFixed(1)}%`,
      delta: `${metrics.efficiencyPercent.toFixed(1)}% efficiency`,
      icon: Gauge,
      accent: 'text-sky-600 bg-sky-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, delta, icon: Icon, accent }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{title}</span>
              <div className={`rounded-lg p-2 ${accent}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-900">{value}</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              <span>{delta}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800">Evaluation mode</span>
              <span className="text-xs font-semibold text-slate-500">Simulated telemetry stream</span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-slate-900">From panel signal to field action</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">SolarPulse correlates module telemetry, detects an anomaly, estimates lost yield, and gives the operator a next action.</p>
          </div>
          <Link href="/panels" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700">
            Inspect 48-panel matrix <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            { icon: PanelsTopLeft, label: 'Telemetry', value: '48 modules', detail: '4 arrays / 8 strings' },
            { icon: Search, label: 'Detection', value: affectedPanel ? affectedPanel.id : 'Module scan', detail: 'Thermal deviation' },
            { icon: BrainCircuit, label: 'Diagnosis', value: '94% confidence', detail: 'MPPT + thermal correlation' },
            { icon: Zap, label: 'Impact', value: '301 W output', detail: 'Prioritize inspection' },
          ].map(({ icon: Icon, label, value, detail }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-2 text-slate-500"><Icon className="h-4 w-4 text-emerald-600" /><span className="text-[10px] font-bold uppercase tracking-[0.16em]">{label}</span></div>
              <div className="mt-3 text-base font-bold text-slate-900">{value}</div>
              <div className="mt-1 text-xs text-slate-600">{detail}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Live plant profile</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">Power and generation overview</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live telemetry
            </div>
          </div>

          <div className="mt-6">
            <Charts data={chartData} livePowerKW={metrics.currentPowerKW} irradianceWm2={metrics.irradianceWm2} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Rated Capacity</div>
              <div className="mt-3 text-2xl font-bold text-slate-900">{metrics.ratedCapacityKW.toFixed(0)} kW</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Target</div>
              <div className="mt-3 text-2xl font-bold text-slate-900">{metrics.dailyTargetKWh.toFixed(0)} kWh</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Irradiance</div>
              <div className="mt-3 text-2xl font-bold text-slate-900">{metrics.irradianceWm2.toFixed(0)} W/m²</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <BatteryCharging className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em]">System health</span>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{metrics.lossConfidencePercent.toFixed(0)}%</div>
              <p className="mt-2 text-sm text-emerald-800">{metrics.lossReason}</p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em]">Fault watch</span>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{metrics.activeFaultsCount}</div>
              <p className="mt-2 text-sm text-amber-800">{metrics.warningCount} warnings • {metrics.criticalCount} critical</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-600" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Panel snapshot</p>
          </div>

          <div className="mt-5 space-y-3">
            {panels.slice(0, 4).map((panel) => (
              <div key={panel.id} className="rounded-xl border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{panel.id}</span>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${panel.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {panel.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Power</span>
                  <span className="font-semibold text-slate-900">{panel.powerW.toFixed(0)} W</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Temperature</span>
                  <span className="font-semibold text-slate-900">{panel.temperatureC.toFixed(1)}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active alerts</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">Operational notices</h3>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {alerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{alert.code}</span>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${alert.severity === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                  {alert.severity}
                </span>
              </div>
              <div className="mt-3 text-base font-bold text-slate-900">{alert.title}</div>
              <p className="mt-2 text-sm text-slate-600">{alert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
