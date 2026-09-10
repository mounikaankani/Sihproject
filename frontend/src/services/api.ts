import { Disaster, Hospital, RescueTeam, ResourceItem, Alert, SimulationResult, EmergencyResponsePlan } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const api = {
  // Disasters
  async getDisasters(params?: { severity?: string; status?: string; type?: string }): Promise<Disaster[]> {
    try {
      const query = new URLSearchParams();
      if (params?.severity) query.append('severity', params.severity);
      if (params?.status) query.append('status', params.status);
      if (params?.type) query.append('disaster_type', params.type);

      const res = await fetch(`${API_BASE}/api/disasters?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch disasters');
      return await res.json();
    } catch (e) {
      console.warn('Backend offline or error fetching disasters:', e);
      return [];
    }
  },

  async getDisaster(id: number): Promise<Disaster | null> {
    try {
      const res = await fetch(`${API_BASE}/api/disasters/${id}`);
      if (!res.ok) throw new Error('Failed to fetch disaster');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async createDisaster(data: {
    disaster_type: string;
    description: string;
    latitude: number;
    longitude: number;
    affected_people: number;
    severity: string;
    title?: string;
    evidence_url?: string;
    location_name?: string;
  }): Promise<Disaster> {
    const res = await fetch(`${API_BASE}/api/disasters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit disaster report');
    return await res.json();
  },

  async updateDisaster(id: number, data: Partial<Disaster>): Promise<Disaster> {
    const res = await fetch(`${API_BASE}/api/disasters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update disaster');
    return await res.json();
  },

  async analyzeDisaster(id: number): Promise<EmergencyResponsePlan> {
    const res = await fetch(`${API_BASE}/api/disasters/${id}/analyze`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to run AI orchestration');
    return await res.json();
  },

  async uploadEvidence(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/disasters/upload-evidence`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload evidence');
    return await res.json();
  },

  // Hospitals
  async getHospitals(): Promise<Hospital[]> {
    try {
      const res = await fetch(`${API_BASE}/api/hospitals`);
      if (!res.ok) throw new Error('Failed to fetch hospitals');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getNearbyHospitals(lat: number, lng: number): Promise<Hospital[]> {
    try {
      const res = await fetch(`${API_BASE}/api/hospitals/nearby?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error('Failed to fetch nearby hospitals');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Rescue Teams
  async getRescueTeams(): Promise<RescueTeam[]> {
    try {
      const res = await fetch(`${API_BASE}/api/rescue-teams`);
      if (!res.ok) throw new Error('Failed to fetch rescue teams');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Resources
  async getResources(): Promise<ResourceItem[]> {
    try {
      const res = await fetch(`${API_BASE}/api/resources`);
      if (!res.ok) throw new Error('Failed to fetch resources');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Alerts
  async getAlerts(): Promise<Alert[]> {
    try {
      const res = await fetch(`${API_BASE}/api/alerts`);
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getSMSLogs(): Promise<{ disclaimer: string; logs: any[] }> {
    try {
      const res = await fetch(`${API_BASE}/api/alerts/sms-logs`);
      if (!res.ok) throw new Error('Failed to fetch SMS logs');
      return await res.json();
    } catch (e) {
      return { disclaimer: 'SMS Gateway', logs: [] };
    }
  },

  // One-Click Flood Simulation
  async simulateFlood(): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/api/simulate/flood`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to execute flood simulation');
    return await res.json();
  },
};
