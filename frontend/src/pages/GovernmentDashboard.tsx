import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  ShieldCheck, 
  Filter, 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Radio, 
  Sparkles,
  ExternalLink,
  Layers,
  BellRing
} from 'lucide-react';
import { Disaster, Hospital, RescueTeam, Alert, SeverityLevel } from '../types';
import { StatCard } from '../components/StatCard';
import { DisasterMap } from '../components/DisasterMap';

interface GovernmentDashboardProps {
  disasters: Disaster[];
  hospitals: Hospital[];
  rescueTeams: RescueTeam[];
  alerts: Alert[];
  onSelectDisaster: (disaster: Disaster) => void;
  onOpenSMSModal: () => void;
  onTriggerSimulation: () => void;
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({
  disasters,
  hospitals,
  rescueTeams,
  alerts,
  onSelectDisaster,
  onOpenSMSModal,
  onTriggerSimulation
}) => {
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [rightPanelTab, setRightPanelTab] = useState<'disasters' | 'alerts'>('disasters');
  const [selectedMapDisaster, setSelectedMapDisaster] = useState<Disaster | null>(disasters[0] || null);

  // High-level KPI metrics
  const activeDisasters = disasters.filter(d => d.status !== 'RESOLVED');
  const criticalCount = activeDisasters.filter(d => d.severity === 'CRITICAL').length;
  const totalAffected = activeDisasters.reduce((sum, d) => sum + (d.affected_people || 0), 0);
  const activeRescueUnits = rescueTeams.filter(t => t.status === 'AVAILABLE' || t.status === 'DISPATCHED').length;

  // Filtered disasters
  const filteredDisasters = disasters.filter(d => {
    return severityFilter === 'ALL' || d.severity === severityFilter;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-700/80';
      case 'HIGH':
        return 'bg-orange-950 text-orange-300 border-orange-700/80';
      case 'MEDIUM':
        return 'bg-amber-950 text-amber-300 border-amber-700/80';
      case 'LOW':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/80';
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Top Header & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <h1 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
              National Emergency Operations Center (NEOC)
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Integrated Tactical GIS, Autonomous 6-Agent AI Reasoning & Multi-Agency Emergency Response
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSMSModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 text-xs font-bold transition-all shadow-sm"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Cellular SMS Gateway</span>
          </button>
        </div>
      </div>

      {/* 4 Executive Command KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Emergencies"
          value={activeDisasters.length}
          subtitle="Monitored in real-time"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Critical Alarms"
          value={criticalCount}
          subtitle="Urgent life-safety level"
          icon={AlertTriangle}
          color="red"
          isAlert={criticalCount > 0}
        />
        <StatCard
          title="Citizens Impacted"
          value={totalAffected.toLocaleString()}
          subtitle="In danger corridors"
          icon={Users}
          color="amber"
        />
        <StatCard
          title="NDRF Columns Active"
          value={`${activeRescueUnits} / ${rescueTeams.length}`}
          subtitle="Ready for rapid water/land dispatch"
          icon={ShieldCheck}
          color="emerald"
        />
      </div>

      {/* Main Command Center Cockpit (Side-by-Side: Map + Triage Console) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tactical GIS Map (7 cols on large screens) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Tactical GIS Operational Map</span>
              {selectedMapDisaster && (
                <span className="text-[11px] font-mono text-cyan-400 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  Target: {selectedMapDisaster.disaster_type}
                </span>
              )}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center space-x-1.5 text-xs">
              <Filter className="w-3 h-3 text-slate-400" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300 text-[11px] font-semibold focus:outline-none"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical Only</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <DisasterMap
            disasters={filteredDisasters}
            hospitals={hospitals}
            rescueTeams={rescueTeams}
            selectedDisaster={selectedMapDisaster}
            onSelectDisaster={(d) => {
              setSelectedMapDisaster(d);
              onSelectDisaster(d);
            }}
          />
        </div>

        {/* Right: Command Triage & Alert Console (5 cols on large screens) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col h-[560px]">
          {/* Console Header Tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRightPanelTab('disasters')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  rightPanelTab === 'disasters'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Incident Queue ({filteredDisasters.length})
              </button>
              <button
                onClick={() => setRightPanelTab('alerts')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  rightPanelTab === 'alerts'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BellRing className="w-3 h-3" />
                <span>Alerts Feed ({alerts.length})</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              REAL-TIME SYNC
            </span>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto mt-3 pr-1 space-y-2.5">
            {rightPanelTab === 'disasters' ? (
              filteredDisasters.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No incidents match the selected filter.
                </div>
              ) : (
                filteredDisasters.map((d) => {
                  const isSelected = selectedMapDisaster?.id === d.id;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedMapDisaster(d)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-slate-800/90 border-rose-500/80 ring-1 ring-rose-500/40 shadow-lg'
                          : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border font-mono ${getSeverityBadge(d.severity)}`}>
                            {d.severity}
                          </span>
                          <span className="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[200px]">
                            {d.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 uppercase">
                          {d.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {d.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                        <div className="flex items-center space-x-2">
                          <span>👥 {d.affected_people} Ppl</span>
                          <span>•</span>
                          <span className="text-purple-400 font-semibold">AI Conf: {d.verification_score}%</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDisaster(d);
                          }}
                          className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 font-bold"
                        >
                          <span>Inspect 6 Agents</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              alerts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No alerts currently broadcast.
                </div>
              ) : (
                alerts.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-rose-400 font-mono">
                        [{a.alert_type}]
                      </span>
                      <span className="text-slate-500 font-mono">
                        {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h5 className="font-bold text-slate-200 text-xs">{a.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{a.message}</p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Target: {a.target_role}</span>
                      <span className="px-1.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {a.severity}
                      </span>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
