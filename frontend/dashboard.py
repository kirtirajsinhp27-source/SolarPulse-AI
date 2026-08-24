import time
from pathlib import Path

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# Page Configuration
st.set_page_config(
    page_title="SolarPulse-AI | Monitoring & Anomaly Dashboard",
    layout="wide",
)

# Title & Header
st.title("☀️ Solar Power Plant Monitoring & Anomaly Detection")
st.markdown(
    "*System:* SolarPulse-AI | *Architecture:* PV Monitoring + AI Diagnostics | *Sampling:* 15-Minute Intervals"
)


def build_demo_dataset():
    """Generate a realistic solar performance dataset with expected and actual output."""
    rng = np.random.default_rng(42)
    sample_count = 96
    timestamps = pd.date_range(end=pd.Timestamp.now(), periods=sample_count, freq="15min")

    daylight = np.maximum(0.0, np.sin(np.linspace(-np.pi / 2, 3 * np.pi / 2, sample_count)))
    irradiance = np.clip(np.round(daylight * 1000, 1), 0, 1000)
    module_temp = np.round(22 + daylight * 38 + rng.normal(0, 1.8, sample_count), 1)
    module_temp = np.clip(module_temp, 10, 75)

    expected_kw = 160 * (irradiance / 1000) * (1 - 0.0045 * (module_temp - 25))
    expected_kw = np.clip(np.round(expected_kw, 2), 0, 220)

    anomaly_types = [
        "Thermal stress",
        "Soiling / dust accumulation",
        "Grid instability",
        "Shading effect",
        "MPPT mismatch",
    ]
    anomaly_mask = np.zeros(sample_count, dtype=bool)
    anomaly_indices = rng.choice(sample_count, size=max(6, sample_count // 12), replace=False)
    anomaly_mask[anomaly_indices] = True

    actual_kw = expected_kw.copy()
    anomaly_labels = np.full(sample_count, "Normal", dtype=object)
    for idx in anomaly_indices:
        fault_type = rng.choice(anomaly_types)
        anomaly_labels[idx] = fault_type
        severity = rng.uniform(0.08, 0.32)

        if fault_type == "Thermal stress":
            actual_kw[idx] = expected_kw[idx] * (1 - severity)
        elif fault_type == "Soiling / dust accumulation":
            actual_kw[idx] = expected_kw[idx] * (1 - severity * 1.2)
        elif fault_type == "Grid instability":
            actual_kw[idx] = expected_kw[idx] * (1 - severity * 1.6)
        elif fault_type == "Shading effect":
            actual_kw[idx] = expected_kw[idx] * (1 - severity * 1.4)
        else:
            actual_kw[idx] = expected_kw[idx] * (1 - severity * 1.1)

    actual_kw = np.round(np.clip(actual_kw, 0, 220), 2)
    loss_kw = np.round(expected_kw - actual_kw, 2)
    performance_ratio = np.round((actual_kw / np.maximum(expected_kw, 1e-6)) * 100, 2)

    return pd.DataFrame(
        {
            "Timestamp": timestamps,
            "Solar_Irradiance_Wm2": irradiance,
            "Module_Temp_C": module_temp,
            "Expected_AC_Power_kW": expected_kw,
            "Actual_AC_Power_kW": actual_kw,
            "Loss_kW": loss_kw,
            "Performance_Ratio_pct": performance_ratio,
            "Is_Anomaly": anomaly_mask.astype(int),
            "Anomaly_Type": anomaly_labels,
        }
    )


# Load the real dataset when available, otherwise keep the demo stream usable.
dataset_path = Path(__file__).with_name("solar_15min_anomaly_dataset.csv")
if dataset_path.exists():
    df = pd.read_csv(dataset_path)
    required_cols = {
        "Timestamp",
        "Solar_Irradiance_Wm2",
        "Module_Temp_C",
        "AC_Power_kW",
        "Is_Anomaly",
        "Anomaly_Type",
    }
    if not required_cols.issubset(df.columns):
        st.warning("The dataset is missing required columns. Using generated demo telemetry instead.")
        df = build_demo_dataset()
else:
    st.info("Using generated demo telemetry. Add solar_15min_anomaly_dataset.csv to frontend to load recorded data.")
    df = build_demo_dataset()

# Rename dataset columns to consistent names if needed
if "Actual_AC_Power_kW" not in df.columns and "AC_Power_kW" in df.columns:
    df = df.rename(columns={"AC_Power_kW": "Actual_AC_Power_kW"})
if "Expected_AC_Power_kW" not in df.columns:
    df["Expected_AC_Power_kW"] = np.clip(
        (df["Solar_Irradiance_Wm2"] / 1000) * 160 * (1 - 0.0045 * (df["Module_Temp_C"] - 25)),
        0,
        220,
    )
if "Performance_Ratio_pct" not in df.columns:
    df["Performance_Ratio_pct"] = np.round((df["Actual_AC_Power_kW"] / np.maximum(df["Expected_AC_Power_kW"], 1e-6)) * 100, 2)
if "Loss_kW" not in df.columns:
    df["Loss_kW"] = np.round(df["Expected_AC_Power_kW"] - df["Actual_AC_Power_kW"], 2)

# Sidebar Controls
st.sidebar.header("Dashboard Control Panel")
mode = st.sidebar.radio(
    "Select Operating Mode:",
    ["Live IoT Sensor Stream", "Historical Batch Analysis"],
)

# ---------------------------------------------------------
# MODE 1: LIVE IOT SENSOR STREAM
# ---------------------------------------------------------
if mode == "Live IoT Sensor Stream":
    st.subheader("📡 Real-Time IoT Sensor Feed (Simulated)")

    speed = st.sidebar.slider("Sensor Refresh Rate (seconds):", 0.5, 3.0, 1.0)
    run_stream = st.sidebar.checkbox("Start Live Feed", value=True)

    kpi_placeholder = st.empty()
    chart_placeholder = st.empty()
    status_placeholder = st.empty()

    if "stream_index" not in st.session_state:
        st.session_state.stream_index = 0

    if run_stream:
        idx = st.session_state.stream_index
        row = df.iloc[idx]

        ts = pd.to_datetime(row["Timestamp"])
        irradiance = row["Solar_Irradiance_Wm2"]
        mod_temp = row["Module_Temp_C"]
        actual_power = row["Actual_AC_Power_kW"]
        expected_power = row["Expected_AC_Power_kW"]
        performance_ratio = row["Performance_Ratio_pct"]
        is_anomaly = int(row.get("Is_Anomaly", 0))
        fault_type = row.get("Anomaly_Type", "Normal")

        with kpi_placeholder.container():
            col1, col2, col3, col4 = st.columns(4)
            col1.metric("Irradiance", f"{irradiance:.1f} W/m²")
            col2.metric("Module Temp", f"{mod_temp:.1f} °C")
            col3.metric("Actual Output", f"{actual_power:.1f} kW")
            if is_anomaly == 1:
                col4.metric("System Health", "⚠️ Fault", delta=f"{fault_type}")
            else:
                col4.metric("System Health", "🟢 Stable", delta=f"PR {performance_ratio:.1f}%")

        with status_placeholder.container():
            if is_anomaly == 1:
                st.error(f"🚨 Alert at {ts}: {fault_type} detected. Expected {expected_power:.1f} kW, actual {actual_power:.1f} kW.")
            else:
                st.success(f"✅ Telemetry normal at {ts}. Performance ratio is {performance_ratio:.1f}%.")

        with chart_placeholder.container():
            start_idx = max(0, idx - 30)
            window_df = df.iloc[start_idx : idx + 1].copy()
            fig = go.Figure()
            fig.add_trace(
                go.Scatter(
                    x=window_df["Timestamp"],
                    y=window_df["Actual_AC_Power_kW"],
                    mode="lines+markers",
                    name="Actual Output",
                    line=dict(color="#1f77b4", width=3),
                )
            )
            fig.add_trace(
                go.Scatter(
                    x=window_df["Timestamp"],
                    y=window_df["Expected_AC_Power_kW"],
                    mode="lines",
                    name="Expected Output",
                    line=dict(color="#ff7f0e", dash="dot", width=2),
                )
            )
            fig.update_layout(
                title="Real-Time Output vs Expected Power (Last 30 Intervals)",
                xaxis_title="Timestamp",
                yaxis_title="Power (kW)",
                legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="left", x=0),
            )
            st.plotly_chart(fig, width="stretch")

        st.session_state.stream_index = (idx + 1) % len(df)
        time.sleep(speed)
        st.rerun()

else:
    st.subheader("7-Day Plant Performance Overview")

    total_energy = df["Actual_AC_Power_kW"].sum() * 0.25
    avg_pr = df["Performance_Ratio_pct"].mean()
    total_anomalies = int((df["Is_Anomaly"] == 1).sum())

    col1, col2, col3 = st.columns(3)
    col1.metric("Total Generated Energy", f"{total_energy:,.1f} kWh")
    col2.metric("Average Performance Ratio", f"{avg_pr:.1f}%")
    col3.metric("Anomalies Detected", f"{total_anomalies}")

    fig = go.Figure()
    fig.add_trace(
        go.Scatter(
            x=df["Timestamp"],
            y=df["Actual_AC_Power_kW"],
            mode="lines",
            name="Actual Output",
            line=dict(color="#1f77b4", width=3),
        )
    )
    fig.add_trace(
        go.Scatter(
            x=df["Timestamp"],
            y=df["Expected_AC_Power_kW"],
            mode="lines",
            name="Expected Output",
            line=dict(color="#ff7f0e", width=2, dash="dot"),
        )
    )
    anomalies = df[df["Is_Anomaly"] == 1]
    fig.add_trace(
        go.Scatter(
            x=anomalies["Timestamp"],
            y=anomalies["Actual_AC_Power_kW"],
            mode="markers",
            name="Detected Anomaly",
            marker=dict(color="red", size=9, symbol="x"),
            text=anomalies["Anomaly_Type"],
        )
    )
    fig.update_layout(
        title="Solar Power Curve with Expected Output & Fault Events",
        xaxis_title="Timestamp",
        yaxis_title="Power (kW)",
    )
    st.plotly_chart(fig, width="stretch")

    st.subheader("Performance & Loss Analysis")
    loss_summary = df[["Timestamp", "Actual_AC_Power_kW", "Expected_AC_Power_kW", "Loss_kW", "Performance_Ratio_pct", "Anomaly_Type"]].copy()
    loss_summary["Loss_kW"] = loss_summary["Loss_kW"].round(2)
    st.dataframe(loss_summary, use_container_width=True)

    bar_fig = px.bar(
        df[df["Is_Anomaly"] == 1],
        x="Timestamp",
        y="Loss_kW",
        color="Anomaly_Type",
        title="Loss Impact by Anomaly Type",
        labels={"Loss_kW": "Energy Loss (kW)", "Timestamp": "Time"},
    )
    bar_fig.update_layout(xaxis_title="Timestamp", yaxis_title="Loss (kW)")
    st.plotly_chart(bar_fig, width="stretch")