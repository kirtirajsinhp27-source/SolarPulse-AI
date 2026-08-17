from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_dashboard_overview_endpoint_returns_payload():
    response = client.get('/api/v1/dashboard/overview')

    assert response.status_code == 200
    payload = response.json()
    assert 'metrics' in payload
    assert 'chartData' in payload
    assert 'panels' in payload
    assert 'alerts' in payload
    assert 'insights' in payload
