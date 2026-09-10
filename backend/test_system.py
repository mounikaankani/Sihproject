import asyncio
from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)

    print("=== TEST 1: Health & Root ===")
    res = client.get("/")
    assert res.status_code == 200, f"Failed root: {res.text}"
    print("[OK] Root:", res.json())

    res = client.get("/api/health")
    assert res.status_code == 200
    print("[OK] Health:", res.json())

    print("\n=== TEST 2: Seed Data Disasters ===")
    res = client.get("/api/disasters")
    assert res.status_code == 200
    disasters = res.json()
    print(f"[OK] Retrieved {len(disasters)} seeded disasters")
    assert len(disasters) >= 3

    print("\n=== TEST 3: Citizen Disaster Submission ===")
    new_report = {
        "disaster_type": "Flood",
        "title": "Severe Embankment Overflow",
        "description": "Rising flood water trapping 45 residents in rooftop shelters.",
        "latitude": 16.5120,
        "longitude": 80.6410,
        "affected_people": 45,
        "severity": "HIGH",
        "evidence_url": "https://images.unsplash.com/photo-1547683905-f686c993aae5"
    }
    res = client.post("/api/disasters", json=new_report)
    assert res.status_code == 200, f"Disaster submission failed: {res.text}"
    created = res.json()
    print(f"[OK] Created Disaster ID {created['id']}: Status={created['status']}, Verification Score={created['verification_score']}%")
    assert created["verification_score"] > 70.0
    assert created["response_plan"] is not None
    print("[OK] Verification Details:", created["verification_details"]["confidence_label"])
    print("[OK] Recommended Hospital:", created["response_plan"]["hospital"]["recommended_hospital"])
    print("[OK] Required Rescue Teams:", created["response_plan"]["rescue"]["teams_required"])
    print("[OK] Alternate Safe Route:", created["response_plan"]["traffic"]["alternative_route_name"])
    print("[OK] Relief Rations Allocated:", created["response_plan"]["resources"]["food_packets"])

    print("\n=== TEST 4: Nearby Hospitals ===")
    res = client.get("/api/hospitals/nearby?lat=16.5120&lng=80.6410")
    assert res.status_code == 200
    hospitals = res.json()
    print(f"[OK] Closest hospital: {hospitals[0]['name']} ({hospitals[0]['distance_km']} km away, {hospitals[0]['available_beds']} beds)")

    print("\n=== TEST 5: Rescue Teams & Resources ===")
    res = client.get("/api/rescue-teams")
    assert res.status_code == 200
    teams = res.json()
    print(f"[OK] {len(teams)} Rescue Teams available in grid")

    res = client.get("/api/resources")
    assert res.status_code == 200
    resources = res.json()
    print(f"[OK] {len(resources)} Relief Stock Categories available")

    print("\n=== TEST 6: Multi-Tier Alerts Feed ===")
    res = client.get("/api/alerts")
    assert res.status_code == 200
    alerts = res.json()
    print(f"[OK] {len(alerts)} Alerts in stream (Latest: [{alerts[0]['alert_type']}] {alerts[0]['title']})")

    print("\n=== TEST 7: ONE-CLICK 'Simulate Flood Emergency' (14-Point Flow) ===")
    res = client.post("/api/simulate/flood")
    assert res.status_code == 200, f"Simulation failed: {res.text}"
    sim = res.json()
    assert sim["success"] is True
    print(f"[OK] Simulation executed successfully with {len(sim['steps'])} steps verified:")
    for s in sim["steps"]:
        print(f"   [{s['step']}/14] {s['name']}: {s['detail']}")

    print("\n[OK] Simulated SMS Broadcast Payload:")
    print("--------------------------------------------------")
    safe_sms = sim["sms_broadcast"].encode('ascii', errors='replace').decode()
    print(safe_sms)
    print("--------------------------------------------------")

    print("\nSUCCESS: ALL 7 SYSTEM INTEGRATION TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    run_tests()
