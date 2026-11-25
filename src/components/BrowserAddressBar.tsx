import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Star, Copy, Check, ExternalLink } from 'lucide-react';

interface BrowserAddressBarProps {
  currentUrl: string;
  onRefresh: () => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export const BrowserAddressBar: React.FC<BrowserAddressBarProps> = ({
  currentUrl,
  onRefresh,
  onPrev,
  onNext,
  canPrev,
  canNext,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#1e2329] border-b border-[#2d343f] px-3 py-1.5 flex items-center gap-2 text-xs text-slate-300 select-none">
      <div className="flex items-center gap-1">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          title="Previous Part"
          className="p-1 rounded hover:bg-slate-700/60 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          title="Next Part"
          className="p-1 rounded hover:bg-slate-700/60 disabled:opacity-40 disabled:hover:bg-transparent transition-colors text-slate-300"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRefresh}
          title="Reload registry state"
          className="p-1 rounded hover:bg-slate-700/60 transition-colors text-slate-300"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex-1 bg-[#12161b] hover:bg-[#151a21] border border-[#2b333e] rounded-full px-3 py-1 flex items-center justify-between gap-2 text-slate-300 font-mono text-[11px] transition-colors">
        <div className="flex items-center gap-2 overflow-hidden truncate">
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="text-slate-400 shrink-0">localhost:5173</span>
          <span className="text-slate-500">/</span>
          <span className="text-cyan-400/90 truncate">{currentUrl.replace(/^https?:\/\/[^/]+\/?/, '')}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800 transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
          <Star className="w-3 h-3 text-slate-400 hover:text-amber-400 cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400 px-2 font-sans">
        <span className="hover:text-slate-200 cursor-pointer transition-colors">Gmail</span>
        <span className="hover:text-slate-200 cursor-pointer transition-colors">YouTube</span>
        <span className="hover:text-slate-200 cursor-pointer transition-colors">Maps</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">All Bookmarks</span>
      </div>
    </div>
  );
};
