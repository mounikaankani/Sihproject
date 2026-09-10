import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Radio, 
  Hospital as HospitalIcon, 
  Package, 
  Play, 
  PhoneCall, 
  Flame, 
  FileText,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onTriggerSimulation: () => void;
  isSimulating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onTriggerSimulation,
  isSimulating
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false }) + ' IST');
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'government', label: 'Command Center', icon: Activity },
    { id: 'citizen', label: 'Citizen Portal', icon: FileText },
    { id: 'emergency_team', label: 'Field Responders', icon: Radio },
    { id: 'hospitals', label: 'Hospital Grid', icon: HospitalIcon },
    { id: 'resources', label: 'Relief Stock', icon: Package },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
      {/* Official Government Top Ribbon with subtle Indian Tricolor accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 opacity-90"></div>

      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800/50 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center font-bold text-slate-200 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
              GOVERNMENT OF INDIA • NATIONAL DISASTER MANAGEMENT AUTHORITY
            </span>
            <span className="hidden md:inline-block text-slate-700">|</span>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-mono">
              OFFICIAL PORTAL
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-1.5 text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTime}</span>
            </div>
            <a
              href="tel:112"
              className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition-all font-bold font-mono"
            >
              <PhoneCall className="w-3 h-3 text-rose-400" />
              <span>EMERGENCY: 112 / 1078</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Command Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setCurrentTab('government')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white font-mono">
                  DisasterGuard<span className="text-rose-500">.AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-rose-950 text-rose-400 border border-rose-800/60 font-mono">
                  6-Agent Core
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                Autonomous Emergency Detection, Verification & Dispatch
              </p>
            </div>
          </div>

          {/* Center Segmented Navigation Pills */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Prominent 1-Click Simulation Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onTriggerSimulation}
              disabled={isSimulating}
              className={`relative inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg overflow-hidden border ${
                isSimulating
                  ? 'bg-amber-600/30 border-amber-500 text-amber-300 cursor-wait'
                  : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 border-rose-500/50 text-white shadow-rose-900/30 hover:shadow-rose-600/40 hover:scale-102 active:scale-98'
              }`}
            >
              <span className="flex items-center space-x-1.5">
                {isSimulating ? (
                  <>
                    <Activity className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    <span>Orchestrating 6 Agents...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                    <span className="tracking-wide uppercase font-mono text-[11px]">Simulate Flood Demo</span>
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Scroll Strip */}
      <div className="lg:hidden flex items-center justify-around bg-slate-950 py-1.5 border-t border-slate-800/60 text-xs overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`px-3 py-1 rounded-lg whitespace-nowrap text-[11px] font-semibold ${
              currentTab === item.id ? 'text-rose-400 font-bold bg-slate-900 border border-slate-800' : 'text-slate-400'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
