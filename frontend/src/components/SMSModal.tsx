import React, { useState, useEffect } from 'react';
import { X, Send, Smartphone, ShieldCheck, CheckCheck, Copy, Check, Radio } from 'lucide-react';
import { api } from '../services/api';

interface SMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  disasterText?: string;
}

export const SMSModal: React.FC<SMSModalProps> = ({ isOpen, onClose, disasterText }) => {
  const [copied, setCopied] = useState(false);
  const [smsLogs, setSmsLogs] = useState<any[]>([]);

  const defaultMessage = disasterText || `🚨 DISASTER ALERT:
Flood detected at [16.5142, 80.6321].
Severity: HIGH.
Affected people: 50.
Rescue team required: 2.
Recommended hospital: AIIMS Apex Trauma Center.`;

  useEffect(() => {
    if (isOpen) {
      api.getSMSLogs().then(data => {
        setSmsLogs(data.logs || []);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(defaultMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Emergency Cellular SMS Broadcast Gateway</h3>
              <p className="text-[11px] text-slate-400">National Cell Broadcast & Multi-Agency Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Notice Banner */}
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-5 py-2.5 text-xs text-amber-300 flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Cellular Gateway Architecture Notice: </span>
            A browser cannot independently send cellular SMS without an external gateway. 
            All SMS alerts are executed via DisasterGuard's backend cellular SMS gateway abstraction (e.g. GSM/CDMA cell broadcast service).
          </div>
        </div>

        {/* Content Body: Smartphone Mockup */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-semibold text-slate-300">Simulated Citizen & First-Responder Handset View:</div>

          {/* Smartphone screen container */}
          <div className="max-w-sm mx-auto bg-slate-950 border-4 border-slate-800 rounded-3xl p-4 shadow-2xl">
            {/* Phone speaker notch */}
            <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-3"></div>

            {/* Notification Bubble */}
            <div className="bg-slate-900 border border-rose-600/40 rounded-2xl p-3.5 shadow-lg">
              <div className="flex items-center justify-between text-[11px] pb-1.5 border-b border-slate-800 text-slate-400">
                <span className="font-bold text-rose-400 flex items-center">
                  <Smartphone className="w-3.5 h-3.5 mr-1" />
                  NDMA-ALERT-INDIA
                </span>
                <span>Just Now</span>
              </div>

              <div className="mt-2 font-mono text-xs text-slate-100 whitespace-pre-line leading-relaxed">
                {defaultMessage}
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800">
                <span className="text-emerald-400 flex items-center">
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Delivered to 15,200 devices in cell tower radius
                </span>
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-all"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy SMS Payload'}</span>
              </button>
            </div>
          </div>

          {/* Recent Transmission Audit Log */}
          {smsLogs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-2">Recent Gateway Transmissions:</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-[11px]">
                {smsLogs.slice(-3).map((log, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 truncate max-w-xs">{log.message.split('\n')[0]}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close Gateway View
          </button>
        </div>
      </div>
    </div>
  );
};
