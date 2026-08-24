# Helios PV PRO — Solar Monitoring & Plant Intelligence Platform

A high-performance solar monitoring platform built with **Next.js**, **TypeScript**, **Tailwind CSS**, and a FastAPI backend. The project follows a hybrid architecture for practical use: the live monitoring page is the main operational view, the dashboard provides summary KPIs, and the panel health section visualizes the full 48-panel array.

---

## 🌟 Final Architecture

- **Live Monitoring (`/monitoring`)**: main real-time operational interface for inverter telemetry, power flow, string diagnostics, and plant status.
- **Summary Dashboard (`/dashboard`)**: overview of generation, loss, performance ratio, alerts, and system health.
- **Solar Array Health (`/panels`)**: complete 48-module array representation grouped by Array A-D and String A1/B1-style strings.
- **Analytics (`/analytics`)**: yield, irradiance, trend analysis, and comparison views.
- **Faults (`/faults`)**: diagnostic event feed and anomaly tracking.
- **ROI & Financials (`/roi`)**: financial performance and payback estimation.
- **Optional Streamlit Demo (`/dashboard.py`)**: standalone visual dashboard for demonstration and quick validation.

This is the final recommended structure for the project: monitoring-first, dashboard-summary second, and simulation/demo support where needed.

---

## 🚀 Quick Start

### 1. Install frontend dependencies
```bash
cd frontend
npm install
```

### 2. Start the full stack
From the project root:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-all.ps1
```

This starts:
- Frontend: http://localhost:3001
- Backend: http://localhost:8001/api/v1/dashboard/overview
- Streamlit dashboard: http://localhost:8503

### 3. Run manually if needed
```bash
cd frontend
npm run dev -- --hostname 0.0.0.0 --port 3001
```

```bash
cd backend
PYTHONPATH=. python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

```bash
cd frontend
python -m streamlit run dashboard.py --server.port 8503 --server.address 0.0.0.0
```

---

## 📁 Project Structure

```text
SolarPulse-AI/
├── backend/
│   └── app/
│       ├── api/
│       ├── core/
│       ├── services/
│       ├── config.py
│       └── main.py
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   └── (dashboard)/
│   │       ├── dashboard/page.tsx
│   │       ├── monitoring/page.tsx
│   │       ├── panels/page.tsx
│   │       ├── analytics/page.tsx
│   │       ├── faults/page.tsx
│   │       ├── roi/page.tsx
│   │       └── about/page.tsx
│   ├── components/
│   ├── lib/
│   ├── dashboard.py
│   ├── package.json
│   └── tsconfig.json
├── README.md
├── requirements.txt
├── start-all.ps1
└── .gitignore
```

---

## ✅ Operational Recommendation

The app is currently best operated in hybrid mode:
- monitoring page = live plant operations
- dashboard page = business summary and KPI overview
- panel section = array health inspection
- Streamlit page = optional standalone demo view

This keeps the project practical, visually complete, and ready for future real-data integration with a database and live device connectivity.

---

## 📄 License
© 2026 Acme Inc. All rights reserved. • Privacy & Terms

&#x20;               ┌──────────────────┐

&#x20;               │ Next.js Frontend │

&#x20;               │    Dashboard     │

&#x20;               └──────────────────┘





&#x20;🛠️ Technology Stack



&#x20;Frontend



\- Next.js 14

\- React

\- TypeScript

\- Tailwind CSS

\- Lucide React

\- WebSocket-based live telemetry



&#x20;Backend



\- Python 3.12

\- FastAPI

\- SQLAlchemy

\- PostgreSQL

\- Alembic

\- Pandas

\- OpenPyXL



&#x20;Machine Learning



\- XGBoost

\- Pandas

\- NumPy

\- Historical solar generation data

\- Trained solar generation prediction model



&#x20;APIs \& Communication



\- REST APIs

\- WebSockets

\- FastAPI Swagger / OpenAPI



&#x20;Development Tools



\- Git

\- GitHub

\- npm

\- Uvicorn

\- Visual Studio Code



&#x20;📂 Project Structure



```text

SolarPulse-AI/

│

├── backend/

│   ├── app/

│   │   ├── api/

│   │   ├── crud/

│   │   ├── models/

│   │   ├── schemas/

│   │   ├── services/

│   │   ├── ml\_models/

│   │   └── main.py

│   │

│   ├── alembic/

│   └── requirements.txt

│

├── frontend/

│   ├── app/

│   │   ├── (auth)/

│   │   └── (dashboard)/

│   │

│   ├── components/

│   ├── lib/

│   ├── types/

│   ├── package.json

│   └── next.config.mjs

│

├── .gitignore

├── README.md

└── requirements.txt



\---



&#x20;🧠 Machine Learning Workflow



```text

Historical Solar Data

&#x20;       ↓

Data Cleaning \& Feature Preparation

&#x20;       ↓

XGBoost Model

&#x20;       ↓

Solar Generation Prediction

&#x20;       ↓

Expected vs Actual Comparison

&#x20;       ↓

Loss \& Performance Analysis

&#x20;       ↓

Operator Insights



&#x20;7. 🚀 Running the Project



Just the essentials:



```markdown



&#x20;🚀 Running the Project



&#x20;Backend



```bash

cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload

Backend API: http://localhost:8000



Swagger: http://localhost:8000/docs



🔮 Future Scope



\- Live solar plant telemetry integration

\- Predictive maintenance

\- Automated fault alerts

\- Multi-plant monitoring

\- Cloud deployment

\- Automated ML model retraining





&#x20;📄 License

This project is developed for academic and demonstration purpo
