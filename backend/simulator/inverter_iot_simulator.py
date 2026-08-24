import math
import random
import time

import requests


API_URL = "http://127.0.0.1:8001/api/v1/inverters"

INVERTERS = {
    "INV-05": {
        "base_power": 48.5,
        "base_temp": 43.0,
    },
    "INV-06": {
        "base_power": 47.8,
        "base_temp": 44.0,
    },
}


def generate_telemetry(inverter_id: str, step: int) -> dict:
    config = INVERTERS[inverter_id]

    # Smooth variation makes the simulated telemetry look like
    # real operating data instead of random jumps.
    wave = math.sin(step / 3)

    ac_power = config["base_power"] + (wave * 1.5) + random.uniform(-0.4, 0.4)

    efficiency = 96.0 + (math.sin(step / 5) * 0.7) + random.uniform(-0.15, 0.15)

    dc_power = ac_power / (efficiency / 100)

    temperature = (
        config["base_temp"]
        + (math.sin(step / 6) * 1.5)
        + random.uniform(-0.3, 0.3)
    )

    dc_voltage = 620 + math.sin(step / 4) * 5
    dc_current = dc_power * 1000 / dc_voltage

    mppt1_power = dc_power / 2
    mppt2_power = dc_power / 2

    return {
        "dc_voltage_v": round(dc_voltage, 2),
        "dc_current_a": round(dc_current, 2),
        "dc_power_kw": round(dc_power, 2),
        "ac_power_kw": round(ac_power, 2),
        "efficiency_percent": round(efficiency, 2),
        "temperature_c": round(temperature, 2),
        "grid_frequency_hz": round(50.0 + random.uniform(-0.03, 0.03), 2),
        "power_factor": round(0.98 + random.uniform(0.0, 0.02), 3),

        "mppt1_voltage_v": round(dc_voltage / 2, 2),
        "mppt1_current_a": round(dc_current / 2, 2),
        "mppt1_power_kw": round(mppt1_power, 2),

        "mppt2_voltage_v": round(dc_voltage / 2, 2),
        "mppt2_current_a": round(dc_current / 2, 2),
        "mppt2_power_kw": round(mppt2_power, 2),
    }


def send_telemetry(inverter_id: str, telemetry: dict) -> None:
    url = f"{API_URL}/{inverter_id}/telemetry"

    response = requests.post(
        url,
        json=telemetry,
        timeout=5,
    )

    response.raise_for_status()


def main():
    print("==========================================")
    print(" SolarPulse IoT Inverter Simulator")
    print("==========================================")
    print("Simulating telemetry for:")
    print("  INV-05")
    print("  INV-06")
    print()
    print("Sending data every 5 seconds.")
    print("Press CTRL+C to stop.")
    print()

    step = 0

    try:
        while True:
            for inverter_id in INVERTERS:
                telemetry = generate_telemetry(
                    inverter_id,
                    step,
                )

                try:
                    send_telemetry(
                        inverter_id,
                        telemetry,
                    )

                    print(
                        f"{inverter_id} | "
                        f"AC: {telemetry['ac_power_kw']} kW | "
                        f"DC: {telemetry['dc_power_kw']} kW | "
                        f"Temp: {telemetry['temperature_c']} °C | "
                        f"Efficiency: {telemetry['efficiency_percent']}%"
                    )

                except requests.RequestException as error:
                    print(
                        f"{inverter_id} | "
                        f"Telemetry send failed: {error}"
                    )

            step += 1

            print("------------------------------------------")
            time.sleep(5)

    except KeyboardInterrupt:
        print("\nIoT simulator stopped.")


if __name__ == "__main__":
    main()