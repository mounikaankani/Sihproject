import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  CloudRain, 
  Hospital as HospitalIcon, 
  LifeBuoy, 
  Route, 
  Package, 
  BellRing, 
  Smartphone,
  ArrowRight,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SimulationResult, SimulationStep } from '../types';

interface SimulateFloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulationComplete: (result: SimulationResult) => void;
  onViewDetails: (disasterId: number) => void;
  simulationResult: SimulationResult | null;
  isRunning: boolean;
}

export const SimulateFloodModal: React.FC<SimulateFloodModalProps> = ({
  isOpen,
  onClose,
  onViewDetails,
  simulationResult,
  isRunning
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Animate the 14-step timeline smoothly during simulation
  useEffect(() => {
    if (isOpen && simulationResult) {
      setCurrentStepIndex(0);
      const total = simulationResult.steps.length;
      const interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < total) {
            return prev + 1;
          } else {
            clearInterval(interval);
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch (e) {}
            return prev;
          }
        });
      }, 350); // ~5 seconds total animation

      return () => clearInterval(interval);
    }
  }, [isOpen, simulationResult]);

  if (!isOpen) return null;

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return AlertTriangle;
      case 2: return Sparkles;
      case 3: return ShieldCheck;
      case 4: return CloudRain;
      case 5: return HospitalIcon;
      case 6: return LifeBuoy;
      case 7: return Route;
      case 8: return Package;
      case 9: return Sparkles;
      case 10:
      case 11:
      case 12: return BellRing;
      case 13: return Route;
      case 14: return Package;
      default: return CheckCircle2;
    }
  };

  const isFinished = simulationResult && currentStepIndex >= (simulationResult.steps.length || 14);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-mono">
                  Autonomous Multi-Agent Simulation
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                  Flood Scenario
                </span>
              </div>
              <p className="text-xs text-slate-400">
                14-Point End-to-End Incident Ingestion, AI Reasoning & Multi-Agency Alert Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-950/60 px-6 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {isFinished ? (
              <span className="flex items-center text-emerald-400 font-semibold font-mono">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                SIMULATION COMPLETED • 6 AGENTS CONVERGED
              </span>
            ) : (
              <span className="flex items-center text-amber-400 font-semibold font-mono">
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                EXECUTING AGENTS STEP {currentStepIndex} OF 14...
              </span>
            )}
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Target: Godavari-Krishna Embankment Basin (16.5142, 80.6321)
          </div>
        </div>

        {/* Steps Timeline Area */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {isRunning && !simulationResult ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-rose-500/30 border-t-rose-500 animate-spin"></div>
                <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-slate-200">Initializing Multi-Agent Reasoning Graph...</p>
              <p className="text-xs text-slate-500">Querying Weather, Hospital Beds, Rescue Formations, and Safe Traffic Corridors</p>
            </div>
          ) : simulationResult ? (
            <div className="space-y-2.5">
              {simulationResult.steps.map((s, idx) => {
                const Icon = getStepIcon(s.step);
                const isStepActive = idx === currentStepIndex - 1;
                const isStepDone = idx < currentStepIndex;

                return (
                  <div
                    key={s.step}
                    className={`flex items-start space-x-3 p-3 rounded-xl border transition-all duration-300 ${
                      isStepDone
                        ? 'bg-slate-950/80 border-slate-800'
                        : isStepActive
                        ? 'bg-slate-800 border-rose-500 shadow-lg scale-[1.01]'
                        : 'opacity-30 border-transparent bg-slate-950/20'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                      isStepDone ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isStepDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${isStepDone ? 'text-slate-100' : 'text-slate-400'}`}>
                          Step {s.step}: {s.name}
                        </h4>
                        {isStepDone && (
                          <span className="text-[10px] font-mono text-emerald-400">PASSED</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* Footer & Navigation CTA */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {isFinished ? (
              <span className="text-slate-300">
                All 14 Hackathon demonstration milestones verified.
              </span>
            ) : (
              <span>Reasoning sequence in progress...</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all"
            >
              Close
            </button>

            {simulationResult && (
              <button
                onClick={() => {
                  onClose();
                  onViewDetails(simulationResult.disaster.id);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-900/40 hover:scale-105"
              >
                <span>Inspect Full Multi-Agent Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
