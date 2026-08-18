from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

from openpyxl import load_workbook


DEFAULT_EXCEL_PATH = Path(r"C:\Users\satya\OneDrive\Desktop\all_output (1).xlsx")


def _safe_date(value: Any, year: int, row_index: int) -> datetime:
    if isinstance(value, datetime) and value.year == year:
        return value
    if isinstance(value, date) and value.year == year:
        return datetime.combine(value, datetime.min.time())
    return datetime(year, 1, 1) + timedelta(days=row_index - 1)


def read_excel_telemetry(path: str | None = None) -> list[dict[str, Any]]:
    workbook_path = Path(path or DEFAULT_EXCEL_PATH)
    if not workbook_path.exists():
        return []

    workbook = load_workbook(workbook_path, read_only=True, data_only=True)
    records: list[dict[str, Any]] = []
    for sheet_name in workbook.sheetnames:
        if not sheet_name.isdigit():
            continue
        year = int(sheet_name)
        sheet = workbook[sheet_name]
        for row_index, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=1):
            generation = row[7] if len(row) > 7 and isinstance(row[7], (int, float)) else None
            if generation is None or generation <= 0:
                continue
            timestamp = _safe_date(row[1] if len(row) > 1 else None, year, row_index)
            insolation = row[11] if len(row) > 11 and isinstance(row[11], (int, float)) else 0
            pr = row[12] if len(row) > 12 and isinstance(row[12], (int, float)) else None
            records.append({
                "id": f"excel-{sheet_name}-{row_index}",
                "string_id": "EXCEL_PLANT",
                "panel_id": "PLANT_TOTAL",
                "voltage": 1,
                "current": 1,
                "power_kw": round(float(generation) / 24, 3),
                "generation_kwh": round(float(generation), 3),
                "temperature": 25,
                "irradiance": round(float(insolation) * 1000 / 24, 3),
                "performance_ratio": float(pr) if pr is not None else None,
                "timestamp": timestamp.isoformat(),
            })
    return sorted(records, key=lambda record: record["timestamp"])