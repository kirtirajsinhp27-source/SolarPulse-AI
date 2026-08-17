/**
 * Centralized TypeScript Type Definitions for Helios PV Solar Telemetry System
 */

export interface TelemetryData {
  currentPowerKW: number;
  ratedCapacityKW: number;
  dailyGenerationKWh: number;
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
  timestamp?: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'investigating' | 'resolved' | 'acknowledged';

export interface FaultAlert {
  id: string;
  title: string;
  component: string;
  location: string;
  severity: AlertSeverity;
  timestamp: string;
  status: AlertStatus;
  description: string;
  recommendedAction: string;
  code: string;
  rootCause?: string;
  resolvedAt?: string;
  assignedTechnician?: string;
}

export interface InverterStatus {
  id: string;
  name: string;
  model: string;
  dcInputKW: number;
  acOutputKW: number;
  efficiencyPercent: number;
  coreTempC: number;
  dailyYieldKWh: number;
  status: 'optimal' | 'warning' | 'critical' | 'offline';
  mpptChannelCount: number;
  mpptMatchingPercent: number;
  gridFrequencyHz: number;
  gridVoltageV: number;
  powerFactor: number;
}

export interface SolarPanelModule {
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
  issueDescription?: string;
  mpptChannel: string;
}

export type PanelData = SolarPanelModule;

export interface GenerationDataPoint {
  time: string;
  actualKW: number;
  baselineKW: number;
  irradianceWm2: number;
  efficiencyPercent: number;
}

export interface AIInsightItem {
  id: string;
  title: string;
  category: 'efficiency' | 'maintenance' | 'weather' | 'financial';
  impact: string;
  confidencePercent: number;
  actionLabel: string;
  description: string;
  timestamp: string;
  metricType?: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface PlantMetadata {
  plantId: string;
  plantName: string;
  capacityKWp: number;
  commissioningDate: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  inverterCount: number;
  moduleCount: number;
  tiltAngleDeg: number;
  azimuthDeg: number;
  lastMaintenance: string;
  nextScheduledInspection: string;
}

export interface FinancialMetrics {
  totalLifetimeRevenueUSD: number;
  currentMonthRevenueUSD: number;
  projectedAnnualRevenueUSD: number;
  initialCapexUSD: number;
  currentOpexUSD: number;
  paybackPeriodYears: number;
  elapsedYears: number;
  roiPercentage: number;
  lcoePerKWh: number;
  gridTariffPerKWh: number;
  feedInTariffPerKWh: number;
  carbonCreditPricePerTon: number;
}
