export interface KPIMetrics {
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
}

export interface GenerationDataPoint {
  time: string;
  actualKW: number;
  baselineKW: number;
  irradianceWm2: number;
  efficiencyPercent: number;
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

export interface FaultAlert {
  id: string;
  title: string;
  component: string;
  location: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  description: string;
  recommendedAction: string;
  code: string;
}

export interface AIInsightItem {
  id: string;
  title: string;
  category: 'efficiency' | 'maintenance' | 'weather' | 'financial';
  impact: string;
  impactType: 'positive' | 'warning' | 'alert';
  confidencePercent: number;
  description: string;
  recommendedAction: string;
  actionLabel: string;
  timestamp: string;
}

export interface SystemPlantInfo {
  plantName: string;
  plantId: string;
  capacityKWp: number;
  totalPanels: number;
  inverterCount: number;
  location: string;
  gridStatus: 'Connected' | 'Islanded' | 'Restricted';
  lastMaintenance: string;
}

/* Showcase data removed. Live values come from the backend. */
/*
  // Array A - 12 Panels (All optimal)
  { id: 'MOD-A01', arrayId: 'Array A', stringId: 'STR-A1', row: 1, col: 1, status: 'optimal', voltageV: 41.8, currentA: 9.6, powerW: 401.3, temperatureC: 43.5, efficiencyPercent: 97.2, mpptChannel: 'MPPT-1A' },
  { id: 'MOD-A02', arrayId: 'Array A', stringId: 'STR-A1', row: 1, col: 2, status: 'optimal', voltageV: 41.9, currentA: 9.5, powerW: 398.1, temperatureC: 43.8, efficiencyPercent: 96.8, mpptChannel: 'MPPT-1A' },
  { id: 'MOD-A03', arrayId: 'Array A', stringId: 'STR-A1', row: 1, col: 3, status: 'optimal', voltageV: 41.7, currentA: 9.6, powerW: 400.3, temperatureC: 44.0, efficiencyPercent: 97.0, mpptChannel: 'MPPT-1A' },
  { id: 'MOD-A04', arrayId: 'Array A', stringId: 'STR-A1', row: 1, col: 4, status: 'optimal', voltageV: 41.6, currentA: 9.5, powerW: 395.2, temperatureC: 44.1, efficiencyPercent: 96.5, mpptChannel: 'MPPT-1A' },
  { id: 'MOD-A05', arrayId: 'Array A', stringId: 'STR-A1', row: 1, col: 5, status: 'optimal', voltageV: 41.8, currentA: 9.6, powerW: 401.2, temperatureC: 43.6, efficiencyPercent: 97.1, mpptChannel: 'MPPT-1A' },
  { id: 'MOD-A06', arrayId: 'Array A', stringId: 'STR-A1', row: 1, col: 6, status: 'optimal', voltageV: 42.0, currentA: 9.6, powerW: 403.2, temperatureC: 43.2, efficiencyPercent: 97.4, mpptChannel: 'MPPT-1A' },
  { id: 'MOD-A07', arrayId: 'Array A', stringId: 'STR-A2', row: 2, col: 1, status: 'optimal', voltageV: 41.5, currentA: 9.5, powerW: 394.3, temperatureC: 44.2, efficiencyPercent: 96.3, mpptChannel: 'MPPT-1B' },
  { id: 'MOD-A08', arrayId: 'Array A', stringId: 'STR-A2', row: 2, col: 2, status: 'optimal', voltageV: 41.8, currentA: 9.6, powerW: 401.2, temperatureC: 43.9, efficiencyPercent: 97.0, mpptChannel: 'MPPT-1B' },
  { id: 'MOD-A09', arrayId: 'Array A', stringId: 'STR-A2', row: 2, col: 3, status: 'optimal', voltageV: 41.9, currentA: 9.6, powerW: 402.2, temperatureC: 43.7, efficiencyPercent: 97.2, mpptChannel: 'MPPT-1B' },
  { id: 'MOD-A10', arrayId: 'Array A', stringId: 'STR-A2', row: 2, col: 4, status: 'optimal', voltageV: 41.6, currentA: 9.5, powerW: 395.2, temperatureC: 44.3, efficiencyPercent: 96.4, mpptChannel: 'MPPT-1B' },
  { id: 'MOD-A11', arrayId: 'Array A', stringId: 'STR-A2', row: 2, col: 5, status: 'optimal', voltageV: 41.7, currentA: 9.6, powerW: 400.3, temperatureC: 44.0, efficiencyPercent: 96.9, mpptChannel: 'MPPT-1B' },
  { id: 'MOD-A12', arrayId: 'Array A', stringId: 'STR-A2', row: 2, col: 6, status: 'optimal', voltageV: 41.8, currentA: 9.6, powerW: 401.2, temperatureC: 43.8, efficiencyPercent: 97.1, mpptChannel: 'MPPT-1B' },

  // Array B - 12 Panels (1 Warning for minor hotspot)
  { id: 'MOD-B01', arrayId: 'Array B', stringId: 'STR-B1', row: 1, col: 1, status: 'optimal', voltageV: 41.6, currentA: 9.4, powerW: 391.0, temperatureC: 44.5, efficiencyPercent: 95.8, mpptChannel: 'MPPT-2A' },
  { id: 'MOD-B02', arrayId: 'Array B', stringId: 'STR-B1', row: 1, col: 2, status: 'optimal', voltageV: 41.7, currentA: 9.5, powerW: 396.1, temperatureC: 44.2, efficiencyPercent: 96.2, mpptChannel: 'MPPT-2A' },
  { id: 'MOD-B03', arrayId: 'Array B', stringId: 'STR-B1', row: 1, col: 3, status: 'optimal', voltageV: 41.5, currentA: 9.4, powerW: 390.1, temperatureC: 44.8, efficiencyPercent: 95.5, mpptChannel: 'MPPT-2A' },
  { id: 'MOD-B04', arrayId: 'Array B', stringId: 'STR-B1', row: 1, col: 4, status: 'optimal', voltageV: 41.8, currentA: 9.5, powerW: 397.1, temperatureC: 44.1, efficiencyPercent: 96.4, mpptChannel: 'MPPT-2A' },
  { id: 'MOD-B05', arrayId: 'Array B', stringId: 'STR-B1', row: 1, col: 5, status: 'warning', voltageV: 37.2, currentA: 8.1, powerW: 301.3, temperatureC: 56.4, efficiencyPercent: 81.2, issueDescription: 'Thermal hotspot detected (+12°C delta). Potential bypass diode activation.', mpptChannel: 'MPPT-2A' },
  { id: 'MOD-B06', arrayId: 'Array B', stringId: 'STR-B1', row: 1, col: 6, status: 'optimal', voltageV: 41.9, currentA: 9.5, powerW: 398.0, temperatureC: 44.0, efficiencyPercent: 96.6, mpptChannel: 'MPPT-2A' },
  { id: 'MOD-B07', arrayId: 'Array B', stringId: 'STR-B2', row: 2, col: 1, status: 'optimal', voltageV: 41.6, currentA: 9.4, powerW: 391.0, temperatureC: 44.6, efficiencyPercent: 95.9, mpptChannel: 'MPPT-2B' },
  { id: 'MOD-B08', arrayId: 'Array B', stringId: 'STR-B2', row: 2, col: 2, status: 'optimal', voltageV: 41.8, currentA: 9.5, powerW: 397.1, temperatureC: 44.2, efficiencyPercent: 96.3, mpptChannel: 'MPPT-2B' },
  { id: 'MOD-B09', arrayId: 'Array B', stringId: 'STR-B2', row: 2, col: 3, status: 'optimal', voltageV: 41.7, currentA: 9.5, powerW: 396.1, temperatureC: 44.4, efficiencyPercent: 96.1, mpptChannel: 'MPPT-2B' },
  { id: 'MOD-B10', arrayId: 'Array B', stringId: 'STR-B2', row: 2, col: 4, status: 'optimal', voltageV: 41.5, currentA: 9.4, powerW: 390.1, temperatureC: 44.7, efficiencyPercent: 95.7, mpptChannel: 'MPPT-2B' },
  { id: 'MOD-B11', arrayId: 'Array B', stringId: 'STR-B2', row: 2, col: 5, status: 'optimal', voltageV: 41.8, currentA: 9.5, powerW: 397.1, temperatureC: 44.1, efficiencyPercent: 96.4, mpptChannel: 'MPPT-2B' },
  { id: 'MOD-B12', arrayId: 'Array B', stringId: 'STR-B2', row: 2, col: 6, status: 'optimal', voltageV: 41.9, currentA: 9.6, powerW: 402.2, temperatureC: 43.9, efficiencyPercent: 97.0, mpptChannel: 'MPPT-2B' },

  // Array C - 12 Panels (1 Warning for dust/soiling accumulation)
  { id: 'MOD-C01', arrayId: 'Array C', stringId: 'STR-C1', row: 1, col: 1, status: 'optimal', voltageV: 41.4, currentA: 9.3, powerW: 385.0, temperatureC: 45.1, efficiencyPercent: 95.2, mpptChannel: 'MPPT-3A' },
  { id: 'MOD-C02', arrayId: 'Array C', stringId: 'STR-C1', row: 1, col: 2, status: 'optimal', voltageV: 41.5, currentA: 9.4, powerW: 390.1, temperatureC: 44.9, efficiencyPercent: 95.6, mpptChannel: 'MPPT-3A' },
  { id: 'MOD-C03', arrayId: 'Array C', stringId: 'STR-C1', row: 1, col: 3, status: 'warning', voltageV: 38.6, currentA: 8.5, powerW: 328.1, temperatureC: 47.3, efficiencyPercent: 86.4, issueDescription: 'Localized soiling / bird dropping accumulation. Degrading string yield by ~7.4%.', mpptChannel: 'MPPT-3A' },
  { id: 'MOD-C04', arrayId: 'Array C', stringId: 'STR-C1', row: 1, col: 4, status: 'optimal', voltageV: 41.3, currentA: 9.3, powerW: 384.0, temperatureC: 45.3, efficiencyPercent: 95.0, mpptChannel: 'MPPT-3A' },
  { id: 'MOD-C05', arrayId: 'Array C', stringId: 'STR-C1', row: 1, col: 5, status: 'optimal', voltageV: 41.6, currentA: 9.4, powerW: 391.0, temperatureC: 44.8, efficiencyPercent: 95.8, mpptChannel: 'MPPT-3A' },
  { id: 'MOD-C06', arrayId: 'Array C', stringId: 'STR-C1', row: 1, col: 6, status: 'optimal', voltageV: 41.7, currentA: 9.5, powerW: 396.1, temperatureC: 44.5, efficiencyPercent: 96.2, mpptChannel: 'MPPT-3A' },
  { id: 'MOD-C07', arrayId: 'Array C', stringId: 'STR-C2', row: 2, col: 1, status: 'optimal', voltageV: 41.5, currentA: 9.4, powerW: 390.1, temperatureC: 45.0, efficiencyPercent: 95.7, mpptChannel: 'MPPT-3B' },
  { id: 'MOD-C08', arrayId: 'Array C', stringId: 'STR-C2', row: 2, col: 2, status: 'optimal', voltageV: 41.6, currentA: 9.4, powerW: 391.0, temperatureC: 44.9, efficiencyPercent: 95.9, mpptChannel: 'MPPT-3B' },
  { id: 'MOD-C09', arrayId: 'Array C', stringId: 'STR-C2', row: 2, col: 3, status: 'optimal', voltageV: 41.4, currentA: 9.3, powerW: 385.0, temperatureC: 45.2, efficiencyPercent: 95.3, mpptChannel: 'MPPT-3B' },
  { id: 'MOD-C10', arrayId: 'Array C', stringId: 'STR-C2', row: 2, col: 4, status: 'optimal', voltageV: 41.8, currentA: 9.5, powerW: 397.1, temperatureC: 44.3, efficiencyPercent: 96.5, mpptChannel: 'MPPT-3B' },
  { id: 'MOD-C11', arrayId: 'Array C', stringId: 'STR-C2', row: 2, col: 5, status: 'optimal', voltageV: 41.5, currentA: 9.4, powerW: 390.1, temperatureC: 45.1, efficiencyPercent: 95.7, mpptChannel: 'MPPT-3B' },
  { id: 'MOD-C12', arrayId: 'Array C', stringId: 'STR-C2', row: 2, col: 6, status: 'optimal', voltageV: 41.7, currentA: 9.5, powerW: 396.1, temperatureC: 44.6, efficiencyPercent: 96.3, mpptChannel: 'MPPT-3B' },

  // Array D - 12 Panels (All optimal)
  { id: 'MOD-D01', arrayId: 'Array D', stringId: 'STR-D1', row: 1, col: 1, status: 'optimal', voltageV: 42.1, currentA: 9.6, powerW: 404.1, temperatureC: 43.1, efficiencyPercent: 97.5, mpptChannel: 'MPPT-4A' },
  { id: 'MOD-D02', arrayId: 'Array D', stringId: 'STR-D1', row: 1, col: 2, status: 'optimal', voltageV: 41.9, currentA: 9.6, powerW: 402.2, temperatureC: 43.4, efficiencyPercent: 97.2, mpptChannel: 'MPPT-4A' },
  { id: 'MOD-D03', arrayId: 'Array D', stringId: 'STR-D1', row: 1, col: 3, status: 'optimal', voltageV: 42.0, currentA: 9.6, powerW: 403.2, temperatureC: 43.3, efficiencyPercent: 97.4, mpptChannel: 'MPPT-4A' },
  { id: 'MOD-D04', arrayId: 'Array D', stringId: 'STR-D1', row: 1, col: 4, status: 'optimal', voltageV: 41.8, currentA: 9.5, powerW: 397.1, temperatureC: 43.7, efficiencyPercent: 96.9, mpptChannel: 'MPPT-4A' },
  { id: 'MOD-D05', arrayId: 'Array D', stringId: 'STR-D1', row: 1, col: 5, status: 'optimal', voltageV: 42.0, currentA: 9.6, powerW: 403.2, temperatureC: 43.2, efficiencyPercent: 97.3, mpptChannel: 'MPPT-4A' },
  { id: 'MOD-D06', arrayId: 'Array D', stringId: 'STR-D1', row: 1, col: 6, status: 'optimal', voltageV: 42.2, currentA: 9.7, powerW: 409.3, temperatureC: 42.9, efficiencyPercent: 97.8, mpptChannel: 'MPPT-4A' },
  { id: 'MOD-D07', arrayId: 'Array D', stringId: 'STR-D2', row: 2, col: 1, status: 'optimal', voltageV: 41.9, currentA: 9.6, powerW: 402.2, temperatureC: 43.5, efficiencyPercent: 97.1, mpptChannel: 'MPPT-4B' },
  { id: 'MOD-D08', arrayId: 'Array D', stringId: 'STR-D2', row: 2, col: 2, status: 'optimal', voltageV: 42.1, currentA: 9.6, powerW: 404.1, temperatureC: 43.2, efficiencyPercent: 97.5, mpptChannel: 'MPPT-4B' },
  { id: 'MOD-D09', arrayId: 'Array D', stringId: 'STR-D2', row: 2, col: 3, status: 'optimal', voltageV: 41.8, currentA: 9.5, powerW: 397.1, temperatureC: 43.8, efficiencyPercent: 96.8, mpptChannel: 'MPPT-4B' },
  { id: 'MOD-D10', arrayId: 'Array D', stringId: 'STR-D2', row: 2, col: 4, status: 'optimal', voltageV: 42.0, currentA: 9.6, powerW: 403.2, temperatureC: 43.3, efficiencyPercent: 97.4, mpptChannel: 'MPPT-4B' },
  { id: 'MOD-D11', arrayId: 'Array D', stringId: 'STR-D2', row: 2, col: 5, status: 'optimal', voltageV: 41.9, currentA: 9.6, powerW: 402.2, temperatureC: 43.6, efficiencyPercent: 97.2, mpptChannel: 'MPPT-4B' },
  { id: 'MOD-D12', arrayId: 'Array D', stringId: 'STR-D2', row: 2, col: 6, status: 'optimal', voltageV: 42.1, currentA: 9.6, powerW: 404.1, temperatureC: 43.1, efficiencyPercent: 97.6, mpptChannel: 'MPPT-4B' },
];

export const INITIAL_FAULT_ALERTS: FaultAlert[] = [
  {
    id: 'ALT-8092',
    code: 'WARN-THRM-05',
    title: 'Cell Hotspot Anomaly Detected',
    component: 'Module MOD-B05 (Array B / String 1)',
    location: 'Rooftop West Wing Zone 2',
    severity: 'warning',
    timestamp: '14:18 (12 mins ago)',
    status: 'active',
    description: 'Operating temperature reached 56.4°C (+12°C delta vs neighbor panels). Shading or localized solder crack suspected.',
    recommendedAction: 'Inspect surface with thermal imager; clean module glass to rule out bird dropping shading.',
  },
  {
    id: 'ALT-8088',
    code: 'WARN-SOIL-03',
    title: 'String Soiling / Particulate Occlusion',
    component: 'Module MOD-C03 (Array C / String 1)',
    location: 'Rooftop East Wing Zone 1',
    severity: 'warning',
    timestamp: '11:45 (3 hrs ago)',
    status: 'active',
    description: 'Current mismatch of -1.1A detected compared to adjacent string modules. Uniform dust/dirt layer identified.',
    recommendedAction: 'Queue for scheduled automated panel wash cycle tonight.',
  },
  {
    id: 'ALT-8075',
    code: 'INFO-GRID-01',
    title: 'Grid Frequency Stabilized',
    component: 'Inverter Inv-02 (Sungrow 50kW)',
    location: 'Electrical Inverter Room A',
    severity: 'info',
    timestamp: '09:12 (5 hrs ago)',
    status: 'resolved',
    description: 'Grid voltage frequency transient (50.3 Hz) successfully clamped by smart anti-islanding controller.',
    recommendedAction: 'No action required. Telemetry within normal IEC tolerance limits.',
  },
];

export const INITIAL_AI_INSIGHTS: AIInsightItem[] = [
  {
    id: 'INS-01',
    title: 'Soiling Mitigation Opportunity',
    category: 'efficiency',
    impact: '+3.8% Yield (+48 kWh/day)',
    impactType: 'positive',
    confidencePercent: 94,
    description: 'AI optical and string telemetry analysis indicates high dust density on Array C. Scheduling a rinse cycle tonight will recover an estimated 48 kWh tomorrow.',
    recommendedAction: 'Dispatch automated robotic cleaning for Array C at 21:00.',
    actionLabel: 'Schedule Cleaning',
    timestamp: 'Updated 10m ago',
  },
  {
    id: 'INS-02',
    title: 'Inverter Peak Clipping Advisory',
    category: 'maintenance',
    impact: 'Loss Risk: $18.40/day',
    impactType: 'warning',
    confidencePercent: 89,
    description: 'Solar insolation forecast predicts peak irradiance at 920 W/m² tomorrow between 12:00-13:30. String 1 & 2 could approach AC output limits.',
    recommendedAction: 'Enable dynamic MPPT derating algorithm to minimize inverter thermal stress.',
    actionLabel: 'Activate Smart Derating',
    timestamp: 'Updated 25m ago',
  },
  {
    id: 'INS-03',
    title: 'Solar Forecast & Storage Arbitrage',
    category: 'financial',
    impact: 'Est. +$42.50 daily ROI',
    impactType: 'positive',
    confidencePercent: 96,
    description: 'Clear sky conditions expected for the next 72 hours. Grid feed-in tariff peaks between 17:00-20:00. Recommend storing excess power during 11:00-14:00.',
    recommendedAction: 'Optimize battery storage discharge curve for peak tariff window.',
    actionLabel: 'Apply Storage Strategy',
    timestamp: 'Updated 1h ago',
  },
];
*/
