'use client';

import { useCallback, useEffect, useState } from 'react';
import { AIInsightItem, AlertSeverity, AlertStatus } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://solarpulse-api.onrender.com';

type MetricState = {
  currentPowerKW: number;
  ratedCapacityKW: number;
  dailyGenerationKWh: number;
  electricityLossKWh: number;
  financialLossINR: number;
  lossReason: string;
  lossConfidencePercent: number;
  dailyTargetKWh: number;
  activeFaultsCount: number;
  warningCount: number;
  criticalCount: number;
  carbonOffsetTons: number;
  treesEquivalent: number;
  dailyRevenueUSD: number;
  efficiencyPercent: number;
  irradianceWm2: number;
  ambientTempC: number;
  pvTempC: number;
  performanceRatio: number;
};

type Alert = {
  id: string;
  code: string;
  title: string;
  component: string;
  location: string;
  severity: AlertSeverity;
  timestamp: string;
  status: AlertStatus;
  description: string;
  recommendedAction: string;
};

export type SolarPanelModule = {
  id: string;
  arrayId: string;
  stringId: string;
  row: number;
  col: number;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
  voltageV: number;
  currentA: number;
  powerW: number;
  temperatureC: number;
  efficiencyPercent: number;
  mpptChannel: string;
  issueDescription?: string;
};

type ChartPoint = {
  time: string;
  actualKW: number;
  baselineKW: number;
  irradianceWm2: number;
  efficiencyPercent: number;
};

const defaultMetrics: MetricState = {
  currentPowerKW: 188.4,
  ratedCapacityKW: 250,
  dailyGenerationKWh: 1432.8,
  electricityLossKWh: 0,
  financialLossINR: 0,
  lossReason: 'No active loss detected',
  lossConfidencePercent: 0,
  dailyTargetKWh: 1650,
  activeFaultsCount: 2,
  warningCount: 2,
  criticalCount: 0,
  carbonOffsetTons: 1.15,
  treesEquivalent: 53,
  dailyRevenueUSD: 315.22,
  efficiencyPercent: 96.2,
  irradianceWm2: 842,
  ambientTempC: 28.5,
  pvTempC: 44.8,
  performanceRatio: 84.6,
};

const defaultInsights: AIInsightItem[] = [
  {
    id: 'INS-001',
    title: 'Generation Performance',
    category: 'efficiency',
    description: 'Current plant generation is operating close to the expected baseline.',
    impact: 'Low',
    confidencePercent: 94,
    actionLabel: 'Continue Monitoring',
    timestamp: '14:18',
  },
  {
    id: 'INS-002',
    title: 'Thermal Anomaly',
    category: 'maintenance',
    description: 'A thermal hotspot has been detected on Module MOD-B05.',
    impact: 'Medium',
    confidencePercent: 91,
    actionLabel: 'Inspect Module',
    timestamp: '14:18',
  },
];
const defaultAlerts: Alert[] = [
  {
    id: 'ALT-8092',
    code: 'WARN-THRM-05',
    title: 'Cell Hotspot Anomaly Detected',
    component: 'Module MOD-B05 (Array B / String 1)',
    location: 'Rooftop West Wing Zone 2',
    severity: 'warning',
    timestamp: '14:18',
    status: 'active',
    description: 'Operating temperature reached 56.4°C.',
    recommendedAction: 'Inspect with thermal imager.',
  },
];

export const buildDefaultPanels = (): SolarPanelModule[] => {
  const arrays = ['Array A', 'Array B', 'Array C', 'Array D'];
  const panels: SolarPanelModule[] = [];

  arrays.forEach((arrayName, arrayIndex) => {
    for (let i = 0; i < 12; i += 1) {
      const stringIndex = i < 6 ? 1 : 2;
      const row = i < 6 ? 1 : 2;
      const col = (i % 6) + 1;
      const moduleId = `MOD-${String.fromCharCode(65 + arrayIndex)}${String(i + 1).padStart(2, '0')}`;
      const isWarning = arrayName === 'Array B' && i === 5;

      panels.push({
        id: moduleId,
        arrayId: arrayName,
        stringId: `STR-${String.fromCharCode(65 + arrayIndex)}${stringIndex}`,
        row,
        col,
        status: isWarning ? 'warning' : 'optimal',
        voltageV: 41.4 + ((i % 4) * 0.7),
        currentA: 9.2 + ((i % 5) * 0.4),
        powerW: 390 + ((i % 6) * 14) + (arrayIndex * 10),
        temperatureC: isWarning ? 56.4 : 43.5 + (i % 4) * 0.9,
        efficiencyPercent: isWarning ? 81.2 : 96.4 - (i % 4) * 0.3,
        mpptChannel: `MPPT-${arrayIndex + 1}${stringIndex}`,
        issueDescription: isWarning ? 'Thermal hotspot detected.' : undefined,
      });
    }
  });

  return panels;
};

const defaultPanels = buildDefaultPanels();

const defaultChartData: ChartPoint[] = [
  { time: '06:00', actualKW: 4.2, baselineKW: 5.0, irradianceWm2: 120, efficiencyPercent: 92.1 },
  { time: '07:00', actualKW: 22.8, baselineKW: 25.0, irradianceWm2: 240, efficiencyPercent: 94.3 },
  { time: '08:00', actualKW: 68.5, baselineKW: 65.0, irradianceWm2: 410, efficiencyPercent: 95.8 },
  { time: '09:00', actualKW: 118.2, baselineKW: 120.0, irradianceWm2: 600, efficiencyPercent: 96.0 },
  { time: '10:00', actualKW: 162.4, baselineKW: 160.0, irradianceWm2: 740, efficiencyPercent: 96.4 },
  { time: '11:00', actualKW: 185.0, baselineKW: 182.0, irradianceWm2: 810, efficiencyPercent: 96.1 },
  { time: '12:00', actualKW: 204.6, baselineKW: 200.0, irradianceWm2: 865, efficiencyPercent: 96.5 },
  { time: '13:00', actualKW: 198.2, baselineKW: 195.0, irradianceWm2: 850, efficiencyPercent: 96.2 },
  { time: '14:00', actualKW: 188.4, baselineKW: 180.0, irradianceWm2: 842, efficiencyPercent: 96.2 },
  { time: '15:00', actualKW: 154.0, baselineKW: 150.0, irradianceWm2: 690, efficiencyPercent: 95.9 },
  { time: '16:00', actualKW: 98.6, baselineKW: 95.0, irradianceWm2: 480, efficiencyPercent: 95.2 },
  { time: '17:00', actualKW: 42.1, baselineKW: 45.0, irradianceWm2: 260, efficiencyPercent: 93.8 },
  { time: '18:00', actualKW: 8.5, baselineKW: 10.0, irradianceWm2: 110, efficiencyPercent: 90.5 },
];

export function useWebSocket() {
  const [metrics, setMetrics] = useState<MetricState>(defaultMetrics);
  const [panels, setPanels] = useState<SolarPanelModule[]>(defaultPanels);
  const [chartData, setChartData] = useState<ChartPoint[]>(defaultChartData);
  const [isStreaming, setIsStreaming] = useState(true);
  const [pingLatencyMs, setPingLatencyMs] = useState(42);
  const [lastUpdated, setLastUpdated] = useState('--');
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts);
  const [insights] = useState<AIInsightItem[]>(defaultInsights);

  const [selectedTimeframe, setSelectedTimeframe] = useState<
    'Today' | '7 Days' | '30 Days' | 'Year'
  >('Today');

  const [telemetryStatus, setTelemetryStatus] = useState<'loading' | 'live' | 'no-data' | 'offline'>  ('live');

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/dashboard/overview`
        );

        if (!response.ok) {
          throw new Error(`Dashboard request failed: ${response.status}`);
        }

        const data = await response.json();

        if (cancelled) return;

        if (data.metrics) {
          setMetrics((previous) => ({
            ...previous,
            ...data.metrics,
          }));
        }

        if (Array.isArray(data.panels) && data.panels.length >= 48) {
          setPanels(data.panels);
        } else {
          setPanels(buildDefaultPanels());
        }

        if (Array.isArray(data.chartData) && data.chartData.length > 0) {
          setChartData(data.chartData);
        } else {
          setChartData(defaultChartData);
        }

        if (Array.isArray(data.alerts) && data.alerts.length > 0) {
          setAlerts(data.alerts);
        } else {
          setAlerts(defaultAlerts);
        }

        setTelemetryStatus('live')

        setLastUpdated(new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Dashboard API error:', error);
        setTelemetryStatus('offline')
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = window.setInterval(() => {
      setPingLatencyMs(Math.floor(35 + Math.random() * 25));
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setLastUpdated(timeLabel);

      setMetrics((previous) => {
        const nextPower = Number(
          Math.min(240, Math.max(70, previous.currentPowerKW + (Math.random() - 0.5) * 12))
            .toFixed(1)
        );
        const nextIrradiance = Number(
          Math.min(980, Math.max(300, previous.irradianceWm2 + (Math.random() - 0.5) * 40))
            .toFixed(0)
        );
        const nextGeneration = Number((previous.dailyGenerationKWh + nextPower * 0.012).toFixed(1));
        const nextLoss = Number(
          Math.min(420, Math.max(120, previous.electricityLossKWh + (Math.random() - 0.35) * 18)).toFixed(1)
        );

        return {
          ...previous,
          currentPowerKW: nextPower,
          dailyGenerationKWh: nextGeneration,
          electricityLossKWh: nextLoss,
          financialLossINR: Number((nextLoss * 5).toFixed(1)),
          irradianceWm2: nextIrradiance,
          ambientTempC: Number((previous.ambientTempC + (Math.random() - 0.5) * 2).toFixed(1)),
          pvTempC: Number((previous.pvTempC + (Math.random() - 0.5) * 3).toFixed(1)),
          performanceRatio: Number((previous.performanceRatio + (Math.random() - 0.5) * 1.8).toFixed(1)),
          efficiencyPercent: Number((previous.efficiencyPercent + (Math.random() - 0.5) * 1.4).toFixed(1)),
        };
      });

      setChartData((previous) => {
        const current = previous[previous.length - 1];
        const nextPower = Math.max(20, Math.min(230, (current?.actualKW ?? 188.4) + (Math.random() - 0.5) * 16));
        const nextBaseline = nextPower * 1.03;
        const nextIrradiance = Math.max(280, Math.min(980, (current?.irradianceWm2 ?? 842) + (Math.random() - 0.5) * 42));
        const nextEfficiency = Math.min(99, Math.max(88, (current?.efficiencyPercent ?? 96.2) + (Math.random() - 0.5) * 1.8));

        const nextPoint = {
          time: timeLabel,
          actualKW: Number(nextPower.toFixed(1)),
          baselineKW: Number(nextBaseline.toFixed(1)),
          irradianceWm2: Number(nextIrradiance.toFixed(0)),
          efficiencyPercent: Number(nextEfficiency.toFixed(1)),
        };

        return [...previous.slice(-11), nextPoint];
      });

      setPanels((previous) =>
        previous.map((panel, index) => {
          const isWarning = panel.status === 'warning';
          const powerDelta = (Math.random() - 0.5) * (isWarning ? 38 : 20);
          const tempDelta = (Math.random() - 0.5) * (isWarning ? 6 : 3);

          return {
            ...panel,
            powerW: Number(
              Math.max(180, Math.min(520, panel.powerW + powerDelta)).toFixed(1)
            ),
            temperatureC: Number(
              Math.max(36, Math.min(68, panel.temperatureC + tempDelta)).toFixed(1)
            ),
            efficiencyPercent: Number(
              Math.max(75, Math.min(99, panel.efficiencyPercent + (Math.random() - 0.5) * 1.6)).toFixed(1)
            ),
          };
        })
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isStreaming]);

  const toggleStreaming = useCallback(() => {
    setIsStreaming((previous) => !previous);
  }, []);

  const triggerAnomaly = useCallback(() => {
    const newAlert: Alert = {
      id: `ALT-${Date.now()}`,
      code: 'AI-ANOM-01',
      title: 'AI Anomaly Detected',
      component: 'Solar PV Plant',
      location: 'Plant Alpha',
      severity: 'warning',
      timestamp: new Date().toLocaleTimeString(),
      status: 'active',
      description: 'AI monitoring detected an abnormal generation deviation.',
      recommendedAction: 'Inspect inverter and affected PV strings.',
    };

    setAlerts((previous) => [newAlert, ...previous]);

    setMetrics((previous) => ({
      ...previous,
      activeFaultsCount: previous.activeFaultsCount + 1,
      warningCount: previous.warningCount + 1,
    }));
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((previous) =>
      previous.map((alert) =>
        alert.id === alertId
          ? { ...alert, status: 'resolved' }
          : alert
      )
    );
  }, []);

  return {
    metrics,
    panels,
    chartData,
    isStreaming,
    toggleStreaming,
    triggerAnomaly,
    resolveAlert,
    pingLatencyMs,
    lastUpdated,
    alerts,
    insights,
    selectedTimeframe,
    setSelectedTimeframe,
    telemetryStatus,
  };
}
