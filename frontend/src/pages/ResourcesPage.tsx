import React from 'react';
import { Package, CheckCircle2, Warehouse, Truck, AlertCircle } from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourcesPageProps {
  resources: ResourceItem[];
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ resources }) => {
  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center space-x-2">
            <Package className="w-6 h-6 text-teal-400" />
            <span>District Disaster Relief Stockpile & Logistics Grid</span>
          </h2>
          <p className="text-xs text-slate-400">
            Sphere Standards Humanitarian Aid Inventory: Ready-to-Eat Rations, Water, Medical Supplies & Shelters
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <Warehouse className="w-4 h-4 text-amber-400" />
          <span>CENTRAL WAREHOUSE: 100% OPERATIONAL</span>
        </div>
      </div>

      {/* Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((item) => {
          const pct = Math.round((item.available_stock / item.total_stock) * 100);
          return (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-mono">
                  {item.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {pct}% Stocked
                </span>
              </div>

              <h3 className="font-bold text-base text-white">{item.item_name}</h3>
              <p className="text-xs text-slate-400 flex items-center">
                <Warehouse className="w-3.5 h-3.5 mr-1 text-slate-500 shrink-0" />
                <span>{item.warehouse_location}</span>
              </p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-xs text-slate-400">Available:</span>
                  <span className="text-xl font-black text-white">
                    {item.available_stock.toLocaleString()} <span className="text-xs text-slate-400 font-normal">{item.unit}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Reserved: {(item.total_stock - item.available_stock).toLocaleString()}</span>
                  <span>Total Base: {item.total_stock.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
