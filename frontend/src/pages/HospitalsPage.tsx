import React from 'react';
import { Hospital as HospitalIcon, PhoneCall, Bed, HeartPulse, MapPin, CheckCircle2 } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalsPageProps {
  hospitals: Hospital[];
}

export const HospitalsPage: React.FC<HospitalsPageProps> = ({ hospitals }) => {
  const totalBeds = hospitals.reduce((sum, h) => sum + (h.available_beds || 0), 0);
  const totalICU = hospitals.reduce((sum, h) => sum + (h.icu_beds || 0), 0);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center space-x-2">
            <HospitalIcon className="w-6 h-6 text-sky-400" />
            <span>State Emergency Medical & Trauma Center Grid</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-Time Trauma Bed Availability, ICU Critical Care Reserves & Automated Casualty Diversion
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-900 px-4 py-2 rounded-2xl border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">TOTAL BEDS:</span>
            <span className="text-emerald-400 font-bold text-base">{totalBeds}</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 block text-[10px]">ICU RESERVES:</span>
            <span className="text-sky-400 font-bold text-base">{totalICU}</span>
          </div>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((h) => (
          <div
            key={h.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 px-2 py-0.5 rounded bg-sky-950 border border-sky-800">
                  Level-1 Trauma Facility
                </span>
                <h3 className="font-bold text-base text-white mt-1.5 leading-snug">{h.name}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-400 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" />
              <span className="truncate">{h.address || 'Central Health Corridor'}</span>
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">Available Beds</span>
                <span className="text-2xl font-black text-emerald-400">{h.available_beds}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block mb-1">ICU Capacity</span>
                <span className="text-2xl font-black text-sky-400">{h.icu_beds}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Staff: {h.medical_staff} Surgeons/Nurses</span>
              <a
                href={`tel:${h.contact_phone}`}
                className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-bold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{h.contact_phone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
