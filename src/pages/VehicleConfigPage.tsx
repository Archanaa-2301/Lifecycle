import React, { useState } from 'react';
import { PageId, Vehicle } from '../types/lifex';
import { VEHICLES } from '../data/lifexData';
import { Layers, Cpu, ArrowRight, Edit3, Check, Car } from 'lucide-react';

interface VehicleConfigPageProps {
  vehicle: Vehicle | null;
  onNavigate: (page: PageId) => void;
}

export const VehicleConfigPage: React.FC<VehicleConfigPageProps> = ({
  vehicle: activeVehicle,
  onNavigate,
}) => {
  const current = activeVehicle || VEHICLES[0];
  const [isEditing, setIsEditing] = useState(false);
  const [specs, setSpecs] = useState({
    oem: current.brand,
    model: current.name.split(' ')[1] || 'Endeavour',
    year: current.year.toString(),
    trim: current.trim,
    powertrain: current.powertrain,
    transmission: current.transmission,
    driveType: current.driveType,
    vehicleProgram: current.program,
    region: current.region,
    architectureType: current.architectureType,
  });

  return (
    <div className="min-h-screen bg-[#040c14] text-slate-100 p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-900/40 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(5)}
            className="p-2 rounded-xl bg-[#081521] border border-teal-800/60 text-slate-300 hover:text-white"
          >
            ←
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              <span>Vehicle Configuration</span>
              <span>·</span>
              <span>ID: {current.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
              {current.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300 bg-[#091b29] hover:bg-[#0f293d] border border-teal-700/60 rounded-xl transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Edit Specs'}</span>
          </button>
          <button
            onClick={() => onNavigate(7)}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#040e17] bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
          >
            <span>Continue to Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Visual Showcase vs Spec Table */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Visual Area */}
        <div className="lg:col-span-7 bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#0a1c2b] to-[#040b12] p-6 border border-teal-950 flex items-center justify-center min-h-[300px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
            <img
              src="/src/assets/images/vehicle_3d_wireframe_chassis_1793338595923.jpg"
              alt={current.name}
              className="w-full h-auto max-h-[280px] object-contain drop-shadow-[0_20px_25px_rgba(6,182,212,0.25)] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#050e17] p-3 rounded-xl border border-teal-950">
              <div className="text-[10px] text-teal-400 font-mono uppercase">Body Architecture</div>
              <div className="text-xs font-bold text-white mt-1">{specs.architectureType}</div>
            </div>
            <div className="bg-[#050e17] p-3 rounded-xl border border-teal-950">
              <div className="text-[10px] text-teal-400 font-mono uppercase">Subsystems Count</div>
              <div className="text-xs font-bold text-white mt-1">{current.subsystemsCount} Main Units</div>
            </div>
            <div className="bg-[#050e17] p-3 rounded-xl border border-teal-950">
              <div className="text-[10px] text-teal-400 font-mono uppercase">Benchmarked Parts</div>
              <div className="text-xs font-bold text-white mt-1">{current.componentsCount} Teardown Items</div>
            </div>
          </div>
        </div>

        {/* Right Spec Table */}
        <div className="lg:col-span-5 bg-[#07131e]/90 border border-teal-900/60 rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-teal-900/40 pb-3">
            <Car className="w-4 h-4 text-cyan-400" />
            <span>Program Specifications</span>
          </h2>

          <div className="divide-y divide-teal-950 text-xs">
            {Object.entries({
              OEM: specs.oem,
              Model: specs.model,
              Year: specs.year,
              Trim: specs.trim,
              Powertrain: specs.powertrain,
              Transmission: specs.transmission,
              'Drive Type': specs.driveType,
              'Vehicle Program': specs.vehicleProgram,
              Region: specs.region,
              'Architecture Type': specs.architectureType,
            }).map(([label, val]) => (
              <div key={label} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-400 font-medium">{label}</span>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={val}
                    className="bg-[#050e17] border border-teal-800 rounded px-2 py-0.5 text-xs text-white text-right max-w-[180px]"
                  />
                ) : (
                  <span className="font-semibold text-white text-right font-mono">{val}</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => onNavigate(5)}
              className="w-1/2 py-2.5 bg-[#081521] hover:bg-[#0c1f2f] border border-teal-800/60 rounded-xl text-xs font-semibold text-slate-300 transition-colors"
            >
              Back to Vehicles
            </button>
            <button
              onClick={() => onNavigate(7)}
              className="w-1/2 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-[#040e17] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
