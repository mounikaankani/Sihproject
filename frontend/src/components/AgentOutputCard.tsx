import React, { useState } from 'react';
import { 
  CloudRain, 
  Hospital as HospitalIcon, 
  ShieldAlert, 
  Route, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Droplet, 
  Wind, 
  Thermometer, 
  LifeBuoy, 
  Users, 
  Bed, 
  Clock,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { EmergencyResponsePlan } from '../types';

interface AgentOutputCardProps {
  plan: EmergencyResponsePlan;
}

export const AgentOutputCard: React.FC<AgentOutputCardProps> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { verification, weather, hospital, rescue, traffic, resources } = plan;

  const agentTabs = [
    { id: 'all', label: 'All 6 Agents Matrix', icon: Layers },
    { id: 'verification', label: '1. Verification Agent', icon: Sparkles },
    { id: 'weather', label: '2. Weather Agent', icon: CloudRain },
    { id: 'hospital', label: '3. Hospital Agent', icon: HospitalIcon },
    { id: 'rescue', label: '4. Rescue Agent', icon: LifeBuoy },
    { id: 'traffic', label: '5. Traffic Agent', icon: Route },
    { id: 'resource', label: '6. Resource Agent', icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Agent Selector Ribbon */}
      <div className="flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        {agentTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Single Selected Agent or All Matrix */}
      <div className="space-y-6">
        {/* 1. Verification Agent Card */}
        {(activeTab === 'all' || activeTab === 'verification') && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold font-mono">
                  01
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-white">AI Verification Agent</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                      Multi-Modal Auditing
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Autonomous verification of GPS telemetry, report freshness, weather pattern alignment & visual evidence
                  </p>
                </div>
              </div>

              {/* Confidence Score Pill */}
              <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Confidence Level</span>
                  <span className="text-xl font-black font-mono text-purple-400">{verification.confidence_score}%</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-purple-500/40 border-t-purple-400 flex items-center justify-center text-xs font-mono text-purple-300 font-bold">
                  {Math.round(verification.confidence_score)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <span className="text-xs font-bold text-slate-300 mb-2 block uppercase tracking-wider">
                  Verified Intelligence Signals:
                </span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {verification.evidence_signals.map((sig, i) => (
                    <li key={i} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block uppercase tracking-wider text-[11px]">
                    Telemetry Audit Notes:
                  </span>
                  <p className="text-slate-300">{verification.timestamp_freshness}</p>
                  <p className="text-emerald-400 font-medium">✓ Geolocation coordinates authenticated within regional bounds</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 italic leading-relaxed">
                  {verification.authenticity_disclaimer}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2 & 3: Weather and Hospital Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weather Agent Card */}
          {(activeTab === 'all' || activeTab === 'weather') && weather && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold font-mono">
                    02
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Weather Agent</h3>
                    <p className="text-xs text-slate-400">Micro-Climate & Atmospheric Severe Risk Assessment</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  {weather.weather_risk} RISK
                </span>
              </div>

              {/* Weather 4-Metrics Bar */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-rose-400 text-[10px] font-semibold mb-0.5">Temp</div>
                  <span className="font-mono font-bold text-white text-sm">{weather.temperature_c}°C</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-blue-400 text-[10px] font-semibold mb-0.5">Rainfall</div>
                  <span className="font-mono font-bold text-white text-sm">{weather.rainfall_mm} mm</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-teal-400 text-[10px] font-semibold mb-0.5">Wind</div>
                  <span className="font-mono font-bold text-white text-sm">{weather.wind_speed_kmh} km/h</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-amber-400 text-[10px] font-semibold mb-0.5">Humidity</div>
                  <span className="font-mono font-bold text-white text-sm">{weather.humidity_pct}%</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-400 block mb-1 uppercase text-[10px]">Synopsis:</span>
                <p>{weather.forecast_summary}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Active Warnings:</span>
                {weather.relevant_warnings.map((w, idx) => (
                  <div key={idx} className="flex items-start space-x-1.5 text-rose-300 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                <span className="font-bold text-slate-300">Action: </span>
                {weather.recommended_actions[0]}
              </div>
            </div>
          )}

          {/* Hospital Agent Card */}
          {(activeTab === 'all' || activeTab === 'hospital') && hospital && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold font-mono">
                    03
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Hospital Agent</h3>
                    <p className="text-xs text-slate-400">Trauma Bed Triage & Dynamic Overflow Routing</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  {hospital.distance_km} km Away
                </span>
              </div>

              {/* Primary Facility */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide">Designated Primary Hospital</span>
                    <h4 className="font-bold text-sm text-white mt-0.5">{hospital.recommended_hospital}</h4>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs text-slate-400 block">Available</span>
                    <span className="text-xl font-black text-emerald-400">{hospital.available_beds} Beds</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">ICU Units:</span>
                    <span className="font-bold text-white">{hospital.icu_beds}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Capacity:</span>
                    <span className="font-bold text-white">{hospital.emergency_capacity} Pts</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                {hospital.triage_notes}
              </p>

              {hospital.backup_hospital && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Designated Backup:</span>
                    <p className="font-semibold text-slate-200">{hospital.backup_hospital}</p>
                  </div>
                  <span className="font-mono text-slate-400 text-xs">
                    {hospital.backup_hospital_beds} beds • {hospital.backup_distance_km} km
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4 & 5: Rescue and Traffic Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rescue Agent Card */}
          {(activeTab === 'all' || activeTab === 'rescue') && rescue && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono">
                    04
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Rescue Agent</h3>
                    <p className="text-xs text-slate-400">NDRF & SDRF Force Sizing & Equipment Allocation</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  {rescue.rescue_priority}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Teams</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">{rescue.teams_required}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Personnel</span>
                  <span className="text-2xl font-black font-mono text-cyan-400">{rescue.personnel_required}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Boats / Crafts</span>
                  <span className="text-2xl font-black font-mono text-amber-400">{rescue.boats_required}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Tactical Equipment Requisitioned:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {rescue.specialized_equipment.map((eq, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-slate-950 text-slate-300 border border-slate-800">
                      • {eq}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 font-mono">
                <span className="font-bold text-slate-300">Designated Battalion: </span>
                {rescue.assigned_team_names.join(', ')}
              </div>
            </div>
          )}

          {/* Traffic Agent Card */}
          {(activeTab === 'all' || activeTab === 'traffic') && traffic && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold font-mono">
                    05
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Traffic Agent</h3>
                    <p className="text-xs text-slate-400">Evacuation Transit Corridor & Route Obstacle Solver</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  ETA ~{traffic.estimated_travel_time_min} Mins
                </span>
              </div>

              {/* Route status comparisons */}
              <div className="space-y-2 text-xs">
                <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Primary Route (Impassable):</span>
                    <span className="text-[10px] font-mono text-rose-300 font-bold bg-rose-900/60 px-1.5 py-0.5 rounded">
                      {traffic.primary_route_status}
                    </span>
                  </div>
                  <p className="font-semibold text-white mt-0.5">{traffic.primary_route_name}</p>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Safe Alternate Bypass:</span>
                    <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-900/60 px-1.5 py-0.5 rounded">
                      {traffic.alternative_route_status}
                    </span>
                  </div>
                  <p className="font-bold text-white mt-0.5">{traffic.alternative_route_name}</p>
                  <p className="text-slate-400 text-[11px] font-mono mt-1">
                    Distance: {traffic.estimated_distance_km} km • Clean high-clearance clearance
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-amber-400 block mb-1 text-[10px] uppercase">Navigation Notice:</span>
                <p>{traffic.navigation_advisory}</p>
              </div>
            </div>
          )}
        </div>

        {/* 6. Resource Agent Card */}
        {(activeTab === 'all' || activeTab === 'resource') && resources && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-600/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold font-mono">
                  06
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Resource Agent</h3>
                  <p className="text-xs text-slate-400">Sphere International Standards Humanitarian Relief Quotas</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800 font-mono">
                Logistics Allocation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Food Rations</span>
                <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">{resources.food_packets}</span>
                <span className="text-[10px] text-slate-500">packets</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Drinking Water</span>
                <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{resources.drinking_water_liters}</span>
                <span className="text-[10px] text-slate-500">liters</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">First-Aid Kits</span>
                <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">{resources.medical_kits}</span>
                <span className="text-[10px] text-slate-500">kits</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fleece Blankets</span>
                <span className="text-2xl font-black text-indigo-400 font-mono mt-1 block">{resources.blankets}</span>
                <span className="text-[10px] text-slate-500">units</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Family Shelters</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{resources.temporary_shelters}</span>
                <span className="text-[10px] text-slate-500">tents</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Hygiene Packs</span>
                <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">{resources.hygiene_packs}</span>
                <span className="text-[10px] text-slate-500">packs</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-slate-400 block mb-0.5 text-[10px] uppercase">Distribution Strategy:</span>
              <p>{resources.distribution_strategy}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
