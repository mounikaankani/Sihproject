import React from 'react';
import { 
  AlertTriangle, 
  Send, 
  PhoneCall, 
  ShieldCheck, 
  MapPin, 
  Activity, 
  CloudRain, 
  Flame, 
  Waves, 
  Mountain, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Disaster } from '../types';

interface CitizenHomeProps {
  onGoToReport: () => void;
  onGoToDashboard: () => void;
  disasters: Disaster[];
  onTriggerSimulation: () => void;
}

export const CitizenHome: React.FC<CitizenHomeProps> = ({
  onGoToReport,
  onGoToDashboard,
  disasters,
  onTriggerSimulation
}) => {
  const activeDisasters = disasters.filter(d => d.status !== 'RESOLVED');
  const criticalCount = activeDisasters.filter(d => d.severity === 'CRITICAL').length;

  return (
    <div className="space-y-10 py-8">
      {/* Official Government Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 left-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>CITIZEN EMERGENCY REPORTING NETWORK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            AI-Powered Multi-Agent Disaster Response &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400">
              Life-Safety System
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Report natural calamities, urban floods, cyclones, and fires in seconds. 
            Our autonomous 6-agent AI cluster verifies on-ground telemetry, routes around flooded roads, and mobilizes NDRF rescue columns instantly.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onGoToReport}
              className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-950/50 hover:scale-102 active:scale-98 transition-all text-sm sm:text-base group"
            >
              <AlertTriangle className="w-5 h-5 text-amber-300" />
              <span>REPORT EMERGENCY DISASTER</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onTriggerSimulation}
              className="flex items-center space-x-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-2xl border border-slate-700 transition-all text-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Simulate Flood Demo</span>
            </button>

            <button
              onClick={onGoToDashboard}
              className="px-5 py-4 text-slate-400 hover:text-white text-sm font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Enter Command Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Ribbon */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          National Emergency Direct Lines:
        </span>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-rose-300 font-mono font-bold">
            📞 112 • All-India Emergency
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-mono font-bold">
            📞 1078 • NDMA Disaster Control
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-sky-300 font-mono font-bold">
            📞 1070 • State Relief Operations
          </span>
        </div>
      </div>

      {/* Live Readiness Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Active Incidents Monitored</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black font-mono text-white">{activeDisasters.length}</span>
              {criticalCount > 0 && (
                <span className="text-xs text-rose-400 font-bold">({criticalCount} Critical)</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Multi-Agent AI Verification</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black font-mono text-purple-400">92.5%</span>
              <span className="text-xs text-slate-400">Average Confidence</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">NDRF / SDRF Standby</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black font-mono text-emerald-400">4 Battalions</span>
              <span className="text-xs text-slate-400">Amphibious & Land</span>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Safety & Evacuation Protocols */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Emergency Preparedness Guidelines</h3>
            <p className="text-xs text-slate-400">Standard operating procedures for citizens during disaster onset</p>
          </div>
          <span className="text-xs text-amber-400 font-semibold font-mono">NDMA CERTIFIED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Waves className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Floods & Inundation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Move to higher floors immediately. Do not attempt walking through flood waters exceeding knee height. Switch off main circuit breakers.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-600/20 text-teal-400 flex items-center justify-center font-bold">
              <CloudRain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Cyclones & Storms</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fasten loose outdoor fixtures. Stay indoors away from glass panes. Keep battery radio tuned for IMD storm surge bulletins and evacuation notices.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Urban / Chemical Fire</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Crawl beneath dense smoke layers using wet cloth over mouth and nose. Follow fire exits; never use elevators during structural fires.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
              <Mountain className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Earthquake & Landslide</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drop, Cover, and Hold under sturdy furniture. If outdoors, move to clear open fields away from masonry facades and utility poles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
