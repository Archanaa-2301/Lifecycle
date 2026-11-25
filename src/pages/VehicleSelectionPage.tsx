import React, { useState } from 'react';
import { PageId, Vehicle } from '../types/lifex';
import { VEHICLES } from '../data/lifexData';
import { Search, Plus, Filter, ArrowRight, Check } from 'lucide-react';
import { runSelectionFlight } from '../utils/selectionMotion';

interface VehicleSelectionPageProps {
  onNavigate: (page: PageId) => void;
  onSelectVehicle: (v: Vehicle) => void;
}

export const VehicleSelectionPage: React.FC<VehicleSelectionPageProps> = ({
  onNavigate,
  onSelectVehicle,
}) => {
  const [filter, setFilter] = useState<'All' | 'SUV' | 'Sedan' | 'Truck' | 'EV' | 'Hybrid'>('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectionInProgress, setSelectionInProgress] = useState(false);

  const categories: Array<'All' | 'SUV' | 'Sedan' | 'Truck' | 'EV' | 'Hybrid'> = [
    'All',
    'SUV',
    'Sedan',
    'Truck',
    'EV',
    'Hybrid',
  ];

  const filteredVehicles = VEHICLES.filter((v) => {
    const matchCategory = filter === 'All' || v.category === filter;
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.powertrain.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handlePick = (v: Vehicle, source: HTMLElement) => {
    if (selectionInProgress) return;
    setSelectionInProgress(true);
    runSelectionFlight(source, {
      title: v.name,
      subtitle: `${v.brand.toUpperCase()} · VEHICLE SELECTED`,
      imageSrc: v.image,
      targetLabel: 'VEHICLE CONFIGURATION',
      target: { left: 28, top: Math.round(window.innerHeight * .43), width: 246, height: 76 },
      duration: 980,
      onComplete: () => { onSelectVehicle(v); onNavigate(6); },
    });
  };

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Select a Vehicle</h1>
          <p className="text-xs sm:text-sm text-teal-300/80 mt-1">
            Choose a vehicle to explore its engineering architecture.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicles..."
            className="bg-[#081521] border border-teal-800/60 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors w-full sm:w-72"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
              filter === cat
                ? 'bg-cyan-500 text-[#040e17] font-bold shadow-sm shadow-cyan-500/50'
                : 'bg-[#081724] text-slate-300 hover:text-white hover:bg-[#0c2234] border border-teal-900/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((vehicle) => {
          return (
            <div
              key={vehicle.id}
              onClick={(event) => handlePick(vehicle, event.currentTarget)} disabled={selectionInProgress}
              className="bg-[#081521]/90 hover:bg-[#0c1e2e] border border-teal-900/60 hover:border-cyan-400/80 rounded-2xl p-5 transition-all shadow-md hover:shadow-cyan-500/15 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-teal-800/40 uppercase">
                      {vehicle.brand}
                    </span>
                    <span className="text-xs text-slate-400">{vehicle.year}</span>
                  </div>
                  <span className="text-[10px] text-teal-400 font-mono">{vehicle.category}</span>
                </div>

                <div className="h-40 rounded-xl bg-[#050e17] overflow-hidden border border-teal-950 flex items-center justify-center p-2 relative">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050e17]/80 via-transparent to-transparent" />
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {vehicle.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {vehicle.powertrain} · {vehicle.transmission}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-teal-950 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-400">
                  <span>{vehicle.subsystemsCount} Subsystems</span>
                  <span>·</span>
                  <span>{vehicle.componentsCount} Parts</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                  <span>Configure</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}

        {/* Add Custom Vehicle Card */}
        <div
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-teal-800/60 hover:border-cyan-400/80 bg-[#07131e]/50 hover:bg-[#091b29]/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-full bg-teal-950 border border-teal-700/60 group-hover:border-cyan-400 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-white group-hover:text-cyan-300">Add Custom Vehicle</div>
          <div className="text-xs text-slate-400 mt-1 max-w-[200px]">
            Import new CAD architecture or OEM teardown model
          </div>
        </div>
      </div>

      {/* Modal for adding custom vehicle */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#081521] border border-teal-700/80 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add New Vehicle Program</h3>
            <p className="text-xs text-slate-400">Configure OEM parameters for new benchmarking program.</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Vehicle Name (e.g. Ford F-150 Lightning 2026)"
                className="w-full bg-[#050e17] border border-teal-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Powertrain Specs"
                className="w-full bg-[#050e17] border border-teal-800 rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  onNavigate(6);
                }}
                className="px-5 py-2 text-xs font-bold text-[#040e17] bg-cyan-400 rounded-xl shadow-md"
              >
                Create Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
