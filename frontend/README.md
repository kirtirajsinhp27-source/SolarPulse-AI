# Helios PV PRO — Solar PV Monitoring & Telemetry Platform

A high-performance, enterprise-grade Solar PV Monitoring, Telemetry, and Anomaly Management platform built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Architecture & Features

- **Telemetry & Real-Time Inverter Monitoring (`/monitoring`)**: Live MPPT tracking, AC/DC load balancing, multi-string voltage/current metrics, and live telemetry feeds across Sungrow SG50CX string inverters.
- **Solar Array Health Matrix (`/panels`)**: 48 Monocrystalline PERC Module health grid, cell thermal hot-spot diagnostics, and individual panel power analytics.
- **Yield & Performance Analytics (`/analytics`)**: IEC 61724 benchmark metrics, Performance Ratio (PR %), Specific Yield (kWh/kWp), annual degradation rates, dual-axis generation vs. pyranometer insolation trends, and multi-unit inverter performance tables.
- **Faults & Anomaly Management (`/faults`)**: Real-time diagnostic feeds, MTTR analytics, priority triage, technician dispatch workflows, and preventative maintenance audit logs.
- **Financial Return & ROI Engine (`/roi`)**: Real-time energy savings, tariff arbitrage, Capex/Opex tracking, payback horizon projections, and carbon offset tracking.
- **Plant Metadata & Hardware Specs (`/about`)**: Complete site hardware documentation, grid interconnection parameters, and commissioning specs.
- **Onboarding & Workspace Setup (`/onboarding`)**: Two-step account setup and telemetry unit preferences flow.

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3001](http://localhost:3001)) to view the application in the browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Directory Structure

```text
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx         # Authentication Screen
│   │   └── onboarding/page.tsx    # Page 3 Account Setup & Onboarding
│   ├── (dashboard)/
│   │   ├── layout.tsx             # Shared Dashboard Shell (Sidebar + Header)
│   │   ├── page.tsx               # Redirect to /monitoring
│   │   ├── monitoring/page.tsx    # Page 1 Live Inverter Telemetry
│   │   ├── panels/page.tsx        # Page 2 Solar PV Array Health Matrix
│   │   ├── analytics/page.tsx     # Page 4 Yield & Irradiance Analytics
│   │   ├── faults/page.tsx        # Page 5 Fault & Anomaly Diagnostic Feed
│   │   ├── roi/page.tsx           # Page 6 Financial Return & Payback Tracker
│   │   └── about/page.tsx         # Plant Metadata & Hardware Specifications
├── components/
│   ├── Sidebar.tsx                # Fixed Navigation Sidebar
│   ├── Header.tsx                 # Real-time Header & Controls
│   ├── Cards.tsx                  # KPI Metric Cards (PR, Yield, Degradation, CUF)
│   ├── Charts.tsx                 # Dual-Axis SVG Curve & Inverter Efficiency Bars
│   ├── FaultCards.tsx             # Alert Feed & Diagnostic Cards
│   ├── AIInsight.tsx              # Neural Yield & Remediation Recommendations
│   └── PanelGrid.tsx              # 48-Module Interactive Array Diagnostics
├── lib/
│   ├── mockData.ts                # Realistic Solar PV Hardware & Telemetry Data
│   └── useWebSocket.ts            # Reactive WebSocket Simulation Hook
├── types/
│   └── index.ts                   # Centralized TypeScript Definitions
├── next.config.mjs                # Next.js Production Configuration
├── tailwind.config.js             # Tailwind CSS Design System Configuration
├── tsconfig.json                  # TypeScript Compiler Configuration
└── eslint.config.mjs              # Modern ESLint Flat Configuration
```

---

## 🎨 Visual System Tokens

- **Page Viewport Background**: `#4C5768` (Dark Slate Blue-Gray)
- **Container Cards**: `#FFFFFF` (Pure White `rounded-2xl` with subtle drop shadows and borders `#E2E8F0`)
- **Primary CTA Buttons**: `#0F172A` (Solid Dark Slate-900 with white typography)
- **Primary Text**: `#0F172A` / `#1E293B`
- **Muted Text / Labels**: `#64748B` / `#94A3B8`

---

## 📄 License
© 2026 Acme Inc. All rights reserved. • Privacy & Terms
