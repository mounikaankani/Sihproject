import React from 'react';
import { 
  Radio, 
  ShieldCheck, 
  MapPin, 
  Route, 
  Hospital as HospitalIcon, 
  Package, 
  CheckCircle2, 
  AlertTriangle,
  LifeBuoy,
  Users
} from 'lucide-react';
import { Disaster, RescueTeam } from '../types';

interface EmergencyTeamDashboardProps {
  rescueTeams: RescueTeam[];
  disasters: Disaster[];
  onSelectDisaster: (disaster: Disaster) => void;
}

export const EmergencyTeamDashboard: React.FC<EmergencyTeamDashboardProps> = ({
  rescueTeams,
  disasters,
  onSelectDisaster
}) => {
  const activeDisasters = disasters.filter(d => d.status !== 'RESOLVED');

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-mono">
              First-Responder Field Units & Tactical Dispatch
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            NDRF, SDRF & Marine Commando Tactical Orders, Route Navigation & Equipment Checklists
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <span>SECURE SATCOM: </span>
          <span className="text-emerald-400 font-bold">ONLINE (CH-09)</span>
        </div>
      </div>

      {/* Active Rescue Battalions Status */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Deployed Field Battalions & Readiness Status</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rescueTeams.map((team) => (
            <div
              key={team.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {team.status}
                </span>
                <span className="text-xs font-mono text-slate-400">{team.contact_radio}</span>
              </div>

              <h4 className="font-bold text-sm text-white">{team.name}</h4>
              <p className="text-xs text-slate-400 font-medium">{team.unit_type}</p>

              <div className="text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {team.personnel_count} Specialists
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">Active Radio</span>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-slate-300 block mb-1">Gear Inventory:</span>
                <ul className="space-y-0.5">
                  {team.equipment.map((eq, i) => (
                    <li key={i} className="truncate">• {eq}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Incident Action Orders */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Radio className="w-4 h-4 text-rose-500" />
          <span>Active Mission Operational Directives</span>
        </h3>

        <div className="space-y-4">
          {activeDisasters.map((d) => {
            const plan = d.response_plan;
            if (!plan) return null;

            return (
              <div
                key={d.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-950 text-rose-400 border border-rose-800">
                        {d.severity}
                      </span>
                      <span className="text-sm font-bold text-white">{d.title}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{d.location_name} ({d.latitude}, {d.longitude})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectDisaster(d)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    View War Room Directive
                  </button>
                </div>

                {/* 4 Mission Columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  {/* Tactical Rescue Sizing */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide flex items-center">
                      <LifeBuoy className="w-3 h-3 mr-1" />
                      Required Force Size
                    </span>
                    <div className="font-mono text-lg font-black text-white">
                      {plan.rescue?.teams_required} Teams ({plan.rescue?.personnel_required} Pers.)
                    </div>
                    <p className="text-slate-400 text-[11px]">
                      Watercraft: {plan.rescue?.boats_required} Inflatable Crafts
                    </p>
                    <p className="text-emerald-400 font-semibold text-[11px]">
                      Priority: {plan.rescue?.rescue_priority}
                    </p>
                  </div>

                  {/* Designated Hospital Target */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide flex items-center">
                      <HospitalIcon className="w-3 h-3 mr-1" />
                      Destination Hospital
                    </span>
                    <div className="font-bold text-white text-xs leading-snug">
                      {plan.hospital?.recommended_hospital}
                    </div>
                    <p className="text-slate-400 text-[11px] font-mono">
                      {plan.hospital?.available_beds} Beds Available • {plan.hospital?.distance_km} km
                    </p>
                    <p className="text-sky-300 text-[11px]">
                      Triage: {plan.hospital?.icu_beds} ICU Beds reserved
                    </p>
                  </div>

                  {/* Route Navigation Directive */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center">
                      <Route className="w-3 h-3 mr-1" />
                      Assigned Safe Route
                    </span>
                    <div className="font-bold text-white text-xs leading-snug">
                      {plan.traffic?.alternative_route_name}
                    </div>
                    <p className="text-rose-400 text-[11px]">
                      ⛔ Avoid: {plan.traffic?.primary_route_status}
                    </p>
                    <p className="text-amber-300 font-mono text-[11px]">
                      ETA: ~{plan.traffic?.estimated_travel_time_min} mins ({plan.traffic?.estimated_distance_km} km)
                    </p>
                  </div>

                  {/* Relief Materials Allocation */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wide flex items-center">
                      <Package className="w-3 h-3 mr-1" />
                      Humanitarian Rations
                    </span>
                    <div className="font-mono text-xs text-slate-200 space-y-0.5">
                      <div>🍽️ {plan.resources?.food_packets} Food Packs</div>
                      <div>💧 {plan.resources?.drinking_water_liters}L Clean Water</div>
                      <div>🩹 {plan.resources?.medical_kits} First Aid Kits</div>
                      <div>⛺ {plan.resources?.temporary_shelters} Family Shelters</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
