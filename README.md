# 🛡️ DisasterGuard AI
### **AI-Powered Multi-Agent Disaster Detection, Verification & Emergency Response System**
*Developed for Smart India Hackathon (SIH) • Aligned with NDMA / SDMA First-Responder Protocols*

---

## 1. Project Overview
**DisasterGuard AI** is a full-stack, autonomous disaster-management command center and citizen-reporting system. When natural disasters strike—floods, cyclones, fires, earthquakes, or landslides—the platform coordinates ground-level citizen reports, verifies on-site telemetry, and orchestrates **6 specialized AI agents** to synthesize a unified **Emergency Response Plan** within seconds.

---

## 2. Problem Statement
During severe disaster emergencies (e.g., Godavari/Brahmaputra floods, coastal cyclones, industrial blazes):
- **Communication Bottlenecks:** Citizen calls flood switchboards without standardized GPS or photographic telemetry.
- **Unverified & Misleading Data:** Panic reports overwhelm response forces with conflicting claims.
- **Siloed Agency Operations:** First-responders (NDRF/SDRF), hospitals, and civil supply warehouses operate in isolation without synchronized triage.
- **Compromised Transit Corridors:** Ambulances often head down submerged or impassable roads, delaying life-saving casualty extraction.

---

## 3. The Solution
DisasterGuard AI bridges citizens, government emergency war rooms, and field rescue teams through an automated multi-agent reasoning pipeline:
1. **Citizen Ingestion:** One-click GPS telemetry capture, severity designation, casualty estimation, and photo/video evidence upload.
2. **Autonomous Multi-Agent Triage:** 6 modular AI agents simultaneously evaluate meteorology, hospital capacities, rescue team deployments, road blockages, and humanitarian quotas.
3. **Multi-Agency Command Dispatch:** Real-time synchronized alert broadcasts to Government War Rooms, Hospital Superintendents, NDRF Battalions, and Citizen SMS cell broadcasts.

---

## 4. System Architecture

```
                       [ CITIZEN ON THE GROUND ]
                                  │
                 (GPS, Photo, Description, Affected, Severity)
                                  │
                                  ▼
                   [ FASTAPI REST API GATEWAY ]
                                  │
                                  ▼
                 ┌────────────────────────────────┐
                 │    AI MULTI-AGENT ORCHESTRATOR │
                 └────────────────┬───────────────┘
                                  │
      ┌──────────────┬────────────┼────────────┬─────────────┬──────────────┐
      ▼              ▼            ▼            ▼             ▼              ▼
1. VERIFICATION  2. WEATHER  3. HOSPITAL   4. RESCUE     5. TRAFFIC    6. RESOURCE
     AGENT          AGENT       AGENT        AGENT          AGENT         AGENT
      │              │            │            │             │              │
      └──────────────┴────────────┼────────────┴─────────────┴──────────────┘
                                  │
                                  ▼
                 [ UNIFIED EMERGENCY RESPONSE ENGINE ]
                                  │
    ┌─────────────────────────────┼──────────────────────────────┐
    ▼                             ▼                              ▼
[GOVERNMENT WAR ROOM]     [FIELD NDRF DASHBOARD]      [SMS BROADCAST GATEWAY]
• Real-time GIS Map       • Tactical Equipment        • External Carrier API
• Severity Pulse Pins     • Safe Alternate Routes     • Simulated SMS Handset
• Actionable Escalations  • Casualty Handover         • Zero-Client SMS Claim
```

---

## 5. AI Agent Architecture

| # | Agent Name | Input Domain | Output Intelligence |
|---|---|---|---|
| **1** | **Verification Agent** | Telemetry, timestamp, weather correlation, photo signals | Multi-modal confidence score (e.g., 89% AI-assisted verification), consistency audit, and authenticity disclaimers. |
| **2** | **Weather Agent** | GPS coordinates, disaster type | Live Open-Meteo API query or deterministic meteorology: rainfall (mm), wind speed (km/h), storm surge risk, tactical warnings. |
| **3** | **Hospital Agent** | Coordinates, estimated casualties, severity | Haversine distance triage, trauma bed availability, ICU triage, and automated secondary overflow hospital designation. |
| **4** | **Rescue Agent** | Disaster type, affected population, severity | NDRF/SDRF team sizing, inflatable Gemini boats, personnel quotas, tactical priority (P1/P2/P3), and equipment checklists. |
| **5** | **Traffic Agent** | Disaster & hospital coordinates, road status | Identifies submerged/blocked routes (e.g. NH-65 underpass flooded), computes safe bypass corridors, and outputs Leaflet GPS polyline waypoints. |
| **6** | **Resource Agent** | Affected population, severity duration | Sphere Humanitarian Relief Standards calculation: rations, drinking water liters, first-aid trauma kits, and family emergency tents. |

---

## 6. Installation Instructions

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ & npm (Tested on Node v24, npm 11)

### Clone & Navigate
```bash
git clone <repository_url>
cd mutliwork
```

---

## 7. Environment Variables
Copy `.env.example` to create your configuration:

```bash
cp .env.example backend/.env
```

| Variable | Default | Purpose |
|---|---|---|
| `HOST` | `0.0.0.0` | API bind address |
| `PORT` | `8000` | FastAPI server port |
| `DATABASE_URL` | `sqlite:///./disasterguard.db` | Database connection string (SQLite default, switchable to PostgreSQL) |
| `SMS_MOCK_MODE` | `true` | Simulated cellular carrier gateway logs |
| `VITE_API_BASE` | `http://localhost:8000` | Frontend API connection URI |

---

## 8. How to Run the Backend

```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## 9. How to Run the Frontend

```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 10. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/disasters` | Submit citizen report + auto-trigger 6 AI agents |
| `GET` | `/api/disasters` | List all disasters with severity/status filters |
| `GET` | `/api/disasters/{id}` | Get single disaster telemetry & response plan |
| `PUT` | `/api/disasters/{id}` | Update status (`REPORTED`, `VERIFIED`, `DISPATCHED`, `RESOLVED`) |
| `POST` | `/api/disasters/{id}/analyze` | Re-run AI Multi-Agent Orchestrator |
| `GET` | `/api/hospitals/nearby` | Find closest hospitals with live bed/ICU availability |
| `GET` | `/api/rescue-teams` | List deployed and standby NDRF/SDRF columns |
| `GET` | `/api/resources` | Query district relief inventory |
| `GET` | `/api/alerts` | Stream multi-tier emergency broadcasts |
| `POST` | `/api/alerts` | Issue administrative broadcast alert |
| `POST` | `/api/simulate/flood` | **One-click demo: 14-step automated flood emergency** |

---

## 11. 3-Minute Demo Scenario: "Simulate Flood Emergency"

DisasterGuard AI features a dedicated, prominent **"SIMULATE FLOOD EMERGENCY"** button in the top navigation bar.

When clicked, the platform executes a 14-step real-time demonstration:
1. **Disaster Created:** Creates a high-severity flood incident in the Krishna-Godavari river basin.
2. **Evidence Loaded:** Photographic evidence of rooftop stranding and inundated structures.
3. **Verification Agent:** Evaluates GPS & temporal freshness, generating an **89%+ AI Confidence Score**.
4. **Weather Agent:** Registers monsoonal torrential precipitation (125mm) and high runoff.
5. **Hospital Agent:** Designates AIIMS Apex Trauma Center (68 beds) with secondary overflow routing.
6. **Rescue Agent:** Allocates 2 NDRF teams, 3 inflatable motorboats, and 36 specialists.
7. **Traffic Agent:** Flags NH-65 Underpass as **SUBMERGED** and routes via the safe **Eastern Canal Elevated Corridor**.
8. **Resource Agent:** Computes 450 rations, 450L potable water, and emergency family tents.
9. **Emergency Response Plan:** Merges outputs into a single tactical directive.
10. **Government Alert:** Triggers Level-2 War Room alert for the District Magistrate.
11. **Rescue-Team Alert:** Transmits coordinates and boat requirements to NDRF radio channel.
12. **Hospital Alert:** Transmits mass casualty influx notification to Trauma Chief.
13. **Recommended Route:** Renders safe green bypass corridor and blocked red segment on Leaflet GIS map.
14. **Required Resources:** Displays required humanitarian stocks on dashboard.

---

## 12. Future Improvements
- **Satellite InSAR Integration:** Incorporate ISRO Bhuvan / Copernicus Sentinel radar imagery for automated water extent mapping.
- **Offline Mesh Networking:** Integrate LoRa / disaster mesh networks for ground data sync during cellular infrastructure failure.
- **Multilingual Voice IVR:** Support automated Hindi, Telugu, Tamil, and Bengali voice reporting over standard dial-in lines.
- **Edge Drone Telemetry:** Direct video stream ingestion from drone cameras for real-time thermal survivor detection.

---
*Built with ❤️ for Smart India Hackathon (SIH 2026)*
