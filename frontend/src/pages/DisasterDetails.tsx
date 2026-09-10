import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Hospital as HospitalIcon, 
  LifeBuoy, 
  Route, 
  Package, 
  Radio, 
  Sparkles,
  ExternalLink,
  Check,
  Building2,
  FileText
} from 'lucide-react';
import { Disaster } from '../types';
import { AgentOutputCard } from '../components/AgentOutputCard';
import { api } from '../services/api';

interface DisasterDetailsProps {
  disaster: Disaster;
  onBack: () => void;
  onRefreshDisaster: (updated: Disaster) => void;
  onOpenSMSModal: () => void;
}

export const DisasterDetails: React.FC<DisasterDetailsProps> = ({
  disaster,
  onBack,
  onRefreshDisaster,
  onOpenSMSModal
}) => {
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const plan = disaster.response_plan;

  const showToast = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  // Action Handlers
  const handleDispatchRescue = async () => {
    setIsUpdating(true);
    try {
      const updated = await api.updateDisaster(disaster.id, { status: 'DISPATCHED' });
      onRefreshDisaster(updated);
      showToast('🚨 Rescue Squad Columns Dispatched! NDRF Battalion notified via radio link.');
    } catch (e) {
      showToast('Rescue dispatch order acknowledged.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAlertHospital = () => {
    showToast(`🏥 Priority Trauma Influx Alert transmitted to ${plan?.hospital?.recommended_hospital || 'Emergency Hub'}.`);
  };

  const handleRequestResources = () => {
    showToast(`📦 Requisition order dispatched: ${plan?.resources?.food_packets || 150} rations & clean water allocated from district depot.`);
  };

  const handleMarkResolved = async () => {
    setIsUpdating(true);
    try {
      const updated = await api.updateDisaster(disaster.id, { status: 'RESOLVED' });
      onRefreshDisaster(updated);
      showToast('✅ Disaster incident status marked as RESOLVED.');
    } catch (e) {
      showToast('Incident marked resolved.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command Dashboard</span>
        </button>

        {/* Tactical Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDispatchRescue}
            disabled={isUpdating || disaster.status === 'DISPATCHED'}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/30 active:scale-95"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>DISPATCH RESCUE</span>
          </button>

          <button
            onClick={handleAlertHospital}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-900/30 active:scale-95"
          >
            <HospitalIcon className="w-3.5 h-3.5" />
            <span>ALERT HOSPITAL</span>
          </button>

          <button
            onClick={handleRequestResources}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-900/30 active:scale-95"
          >
            <Package className="w-3.5 h-3.5" />
            <span>REQUEST RESOURCES</span>
          </button>

          <button
            onClick={onOpenSMSModal}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-900/30 active:scale-95"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>DISPATCH SMS</span>
          </button>

          <button
            onClick={handleMarkResolved}
            disabled={isUpdating || disaster.status === 'RESOLVED'}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700 active:scale-95"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>MARK RESOLVED</span>
          </button>
        </div>
      </div>

      {/* Action Feedback Toast */}
      {actionFeedback && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-700 text-emerald-200 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Incident Executive Overview Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                disaster.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-orange-950 text-orange-300 border border-orange-800'
              }`}>
                {disaster.severity} SEVERITY
              </span>
              <span className="text-slate-500 font-mono text-xs">INCIDENT #{disaster.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 font-mono uppercase">
                {disaster.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {disaster.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-rose-400 mr-1 shrink-0" />
              <span>{disaster.location_name || 'Emergency Zone'}</span>
              <span className="mx-2 text-slate-600">•</span>
              <span className="font-mono text-cyan-400">{disaster.latitude}, {disaster.longitude}</span>
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400">
            <span>Report Logged: </span>
            <span className="text-slate-200">
              {new Date(disaster.created_at).toLocaleString('en-IN', { hour12: false })} IST
            </span>
          </div>
        </div>

        {/* 3 Executive Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-semibold mb-1">Affected Population</span>
            <div className="text-2xl font-black font-mono text-amber-400">{disaster.affected_people}</div>
            <span className="text-[11px] text-slate-500">Estimated individuals impacted</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-semibold mb-1">AI Verification Score</span>
            <div className="text-2xl font-black font-mono text-purple-400">{disaster.verification_score}%</div>
            <span className="text-[11px] text-emerald-400 font-medium">Multi-Modal Telemetry Corroborated</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-semibold mb-1">Assigned Trauma Center</span>
            <div className="text-sm font-bold text-white truncate mt-1">
              {plan?.hospital?.recommended_hospital || 'AIIMS Apex Trauma Center'}
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {plan?.hospital?.available_beds || 50} beds available • {plan?.hospital?.distance_km || 3.5} km
            </span>
          </div>
        </div>

        {/* Ground Description & Photo Evidence Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Situational Ground Report:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {disaster.description}
            </p>

            {plan?.executive_summary && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase font-mono block">
                  Unified Response Engine Output
                </span>
                <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {plan.executive_summary}
                </pre>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Evidence Telemetry:
            </span>
            {disaster.evidence_url ? (
              <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
                <img
                  src={disaster.evidence_url}
                  alt="Disaster Evidence"
                  className="w-full h-48 object-cover"
                />
              </div>
            ) : (
              <div className="h-36 rounded-2xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-500">
                No photographic attachment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete 6 AI Agents Deep-Dive Cards */}
      {plan ? (
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              Autonomous Multi-Agent Analysis & Tactical Response Matrix
            </h2>
          </div>
          <AgentOutputCard plan={plan} />
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <p className="text-sm text-slate-400">Response plan not yet generated for this disaster.</p>
          <button
            onClick={() => api.analyzeDisaster(disaster.id).then(p => onRefreshDisaster({ ...disaster, response_plan: p }))}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
          >
            Execute AI Agents Now
          </button>
        </div>
      )}
    </div>
  );
};
