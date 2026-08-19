'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  KPIMetrics,
  GenerationDataPoint,
  SolarPanelModule,
  FaultAlert,
  AIInsightItem,
} from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

async function fetchDashboardData(): Promise<{
  metrics: KPIMetrics;
  chartData: GenerationDataPoint[];
  panels: SolarPanelModule[];
  alerts: FaultAlert[];
  insights: AIInsightItem[];
}> {
  const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/overview`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.status}`);
  }

  return response.json();
}

export interface UseWebSocketReturn {
  metrics: KPIMetrics;
  chartData: GenerationDataPoint[];
  panels: SolarPanelModule[];
  alerts: FaultAlert[];
  insights: AIInsightItem[];
  isConnected: boolean;
  isStreaming: boolean;
  lastUpdated: string;
  pingLatencyMs: number;
  toggleStreaming: () => void;
  triggerAnomaly: () => void;
  resolveAlert: (alertId: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (tf: string) => void;
}

export function useWebSocket(): UseWebSocketReturn {
  const [metrics, setMetrics] = useState<KPIMetrics>({
    currentPowerKW: 0,
    ratedCapacityKW: 0,
    dailyGenerationKWh: 0,
    dailyTargetKWh: 0,
    activeFaultsCount: 0,
    warningCount: 0,
    criticalCount: 0,
    carbonOffsetTons: 0,
    treesEquivalent: 0,
    dailyRevenueUSD: 0,
    efficiencyPercent: 0,
    irradianceWm2: 0,
    ambientTempC: 0,
    pvTempC: 0,
    performanceRatio: 0,
  });
  const [chartData, setChartData] = useState<GenerationDataPoint[]>([]);
  const [panels, setPanels] = useState<SolarPanelModule[]>([]);
  const [alerts, setAlerts] = useState<FaultAlert[]>([]);
  const [insights, setInsights] = useState<AIInsightItem[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [pingLatencyMs, setPingLatencyMs] = useState<number>(24);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('Today');

  // Toggle live streaming on/off
  const toggleStreaming = useCallback(() => {
    setIsStreaming((prev) => !prev);
  }, []);

  // Resolve an alert
  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) =>
        alt.id === alertId ? { ...alt, status: 'resolved' as const } : alt
      )
    );
    setMetrics((prev) => ({
      ...prev,
      activeFaultsCount: Math.max(0, prev.activeFaultsCount - 1),
      warningCount: Math.max(0, prev.warningCount - 1),
    }));
  }, []);

  const triggerAnomaly = useCallback(() => undefined, []);

  useEffect(() => {
    let isCancelled = false;

    const loadDashboardData = async () => {
      const startedAt = performance.now();
      try {
        const data = await fetchDashboardData();
        if (isCancelled) return;

        setMetrics(data.metrics);
        setChartData(data.chartData);
        setPanels(data.panels);
        setAlerts(data.alerts);
        setInsights(data.insights);
        setIsConnected(true);
        setPingLatencyMs(Math.round(performance.now() - startedAt));
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (error) {
        console.error('Dashboard API unavailable:', error);
        setIsConnected(false);
      }
    };

    loadDashboardData();
    if (isStreaming) {
      const refreshTimer = window.setInterval(loadDashboardData, 3000);
      return () => {
        isCancelled = true;
        window.clearInterval(refreshTimer);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [isStreaming]);

  return {
    metrics,
    chartData,
    panels,
    alerts,
    insights,
    isConnected,
    isStreaming,
    lastUpdated,
    pingLatencyMs,
    toggleStreaming,
    triggerAnomaly,
    resolveAlert,
    selectedTimeframe,
    setSelectedTimeframe,
  };
}
