import React, { useState } from 'react';
import { Alert } from '../types';
import { BellRing, Volume2, VolumeX, MessageSquare, ChevronRight } from 'lucide-react';

interface AlertTickerProps {
  alerts: Alert[];
  onOpenSMSModal: () => void;
}

export const AlertTicker: React.FC<AlertTickerProps> = ({ alerts, onOpenSMSModal }) => {
  const [audioEnabled, setAudioEnabled] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE' || a.severity === 'CRITICAL' || a.severity === 'HIGH');
  const latestAlert = activeAlerts[0];

  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  };

  const toggleAudio = () => {
    if (!audioEnabled) {
      playBeep();
    }
    setAudioEnabled(!audioEnabled);
  };

  if (!latestAlert) return null;

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 overflow-hidden flex-1 min-w-0">
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="font-mono text-[10px] tracking-wider uppercase">BROADCAST</span>
          </div>

          <div className="flex items-center space-x-2 truncate">
            <span className="font-mono font-bold text-slate-300 text-[11px] shrink-0">
              [{latestAlert.alert_type}]
            </span>
            <span className="text-slate-200 truncate font-medium">
              <span className="font-bold text-white mr-1.5">{latestAlert.title}:</span>
              {latestAlert.message}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenSMSModal}
            className="flex items-center space-x-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Cellular SMS View</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>

          <span className="text-slate-700">|</span>

          <button
            onClick={toggleAudio}
            title={audioEnabled ? "Mute alert tone" : "Enable alert tone"}
            className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
          >
            {audioEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
