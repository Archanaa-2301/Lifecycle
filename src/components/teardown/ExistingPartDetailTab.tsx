import React, { useRef } from 'react';
import { TeardownPart } from '../../types/teardown';
import { UploadCloud, Image as ImageIcon, X, Check, Plus } from 'lucide-react';

interface ExistingPartDetailTabProps {
  part: TeardownPart;
  onUpdatePart: (updated: Partial<TeardownPart>) => void;
}

export const ExistingPartDetailTab: React.FC<ExistingPartDetailTabProps> = ({
  part,
  onUpdatePart,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdatePart({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUpdatePart({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Part No, Part Description, Photograph Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Inputs (Cols 1-7) */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-cyan-400 uppercase mb-2">
              PART NO.
            </label>
            <input
              type="text"
              value={part.partNo}
              onChange={(e) => onUpdatePart({ partNo: e.target.value })}
              placeholder="e.g. FRD-26-EPU-PP017"
              className="w-full bg-[#08131c]/90 border border-teal-900/60 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-cyan-100 placeholder-teal-700/50 focus:outline-none transition-colors shadow-inner"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-cyan-400 uppercase mb-2">
              PART DESCRIPTION
            </label>
            <input
              type="text"
              value={part.partDescription}
              onChange={(e) => onUpdatePart({ partDescription: e.target.value })}
              placeholder="e.g. Case-hardened hollow cylindrical wrist pin..."
              className="w-full bg-[#08131c]/90 border border-teal-900/60 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-cyan-100 placeholder-teal-700/50 focus:outline-none transition-colors shadow-inner"
            />
          </div>
        </div>

        {/* Right Upload Area (Cols 8-12) */}
        <div className="lg:col-span-5">
          <label className="block text-[11px] font-bold tracking-wider text-cyan-400 uppercase mb-2">
            PART PHOTOGRAPH UPLOAD
          </label>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-[155px] border border-dashed border-teal-800/70 hover:border-cyan-400 bg-[#08131c]/60 hover:bg-[#0c1c28]/70 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden group shadow-inner"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="hidden"
            />

            {part.photoUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={part.photoUrl}
                  alt={part.name}
                  className="max-h-full max-w-full object-contain rounded-lg filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                />
                <div className="absolute inset-0 bg-[#040e17]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg gap-2">
                  <span className="text-xs font-semibold text-cyan-300">Click to replace photo</span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2 text-teal-400 group-hover:text-cyan-300 transition-colors">
                  <UploadCloud className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-xs text-slate-200">
                  <span className="text-cyan-400 font-semibold underline decoration-cyan-400/50 underline-offset-2">
                    Upload a file
                  </span>{' '}
                  or drag and drop
                </div>
                <div className="text-[10px] text-teal-500/80 mt-1 uppercase tracking-wider font-mono">
                  PNG, JPG, GIF UP TO 5MB
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Primary Function */}
      <div>
        <label className="block text-[11px] font-bold tracking-wider text-cyan-400 uppercase mb-2">
          PRIMARY FUNCTION
        </label>
        <textarea
          rows={3}
          value={part.primaryFunction}
          onChange={(e) => onUpdatePart({ primaryFunction: e.target.value })}
          placeholder="Describe primary mechanical, thermal, or structural role..."
          className="w-full bg-[#08131c]/90 border border-teal-900/60 focus:border-cyan-400 rounded-xl p-4 text-xs sm:text-sm text-cyan-100 placeholder-teal-700/50 focus:outline-none transition-colors shadow-inner leading-relaxed"
        />
      </div>

      {/* Row 3: Probable Cost, Weight, Material, Manufacturing Process */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <label className="block text-[11px] font-bold tracking-wider text-cyan-400 uppercase mb-2">
            PROBABLE COST (INR)
          </label>
          <input
            type="number"
            value={part.probableCostINR}
            onChange={(e) => onUpdatePart({ probableCostINR: Number(e.target.value) })}
            placeholder="e.g. 480"
            className="w-full bg-[#08131c]/90 border border-teal-900/60 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm font-mono text-cyan-100 placeholder-teal-700/50 focus:outline-none transition-colors shadow-inner"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-cyan-400 uppercase mb-2">
            WEIGHT (KG)
          </label>
          <input
            type="number"
            step="0.001"
            value={part.weightKg}
            onChange={(e) => onUpdatePart({ weightKg: Number(e.target.value) })}
            placeholder="e.g. 0.115"
            className="w-full bg-[#08131c]/90 border border-teal-900/60 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm font-mono text-cyan-100 placeholder-teal-700/50 focus:outline-none transition-colors shadow-inner"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-cyan-400 uppercase mb-2">
            MATERIAL
          </label>
          <input
            type="text"
            value={part.material}
            onChange={(e) => onUpdatePart({ material: e.target.value })}
            placeholder="e.g. 16MnCr5 Case Hardened Alloy Steel"
            className="w-full bg-[#08131c]/90 border border-teal-900/60 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-cyan-100 placeholder-teal-700/50 focus:outline-none transition-colors shadow-inner"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-cyan-400 uppercase mb-2">
            MANUFACTURING PROCESS USED
          </label>
          <input
            type="text"
            value={part.manufacturingProcess}
            onChange={(e) => onUpdatePart({ manufacturingProcess: e.target.value })}
            placeholder="e.g. Cold Forging + Case Carburizing"
            className="w-full bg-[#08131c]/90 border border-teal-900/60 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-cyan-100 placeholder-teal-700/50 focus:outline-none transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Row 4: Dimensions & Supplier Benchmarking */}
      <div className="pt-2 border-t border-teal-950 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-[#061017] p-3 rounded-xl border border-teal-950">
          <span className="text-teal-400 text-[10px] block uppercase">Dimensions / Tolerance</span>
          <span className="text-slate-200 mt-1 block">
            {part.dimensions
              ? `OD ${part.dimensions.outerDiameterMm ?? '—'}mm × L ${part.dimensions.lengthMm ?? '—'}mm (${part.dimensions.tolerance ?? '±0.005mm'})`
              : 'Refer to CMM inspection trace'}
          </span>
        </div>

        <div className="bg-[#061017] p-3 rounded-xl border border-teal-950">
          <span className="text-teal-400 text-[10px] block uppercase">Tier-1 Supplier</span>
          <span className="text-slate-200 mt-1 block font-sans font-semibold">
            {part.supplier || 'OEM Global Sourcing'}
          </span>
        </div>

        <div className="bg-[#061017] p-3 rounded-xl border border-teal-950">
          <span className="text-teal-400 text-[10px] block uppercase">Qty per Engine Block</span>
          <span className="text-cyan-300 font-bold mt-1 block">
            {part.quantityPerEngine ?? 1} Units
          </span>
        </div>
      </div>
    </div>
  );
};
