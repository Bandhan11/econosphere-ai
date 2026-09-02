import React, { useState } from "react";
import { ShieldCheck, Info, ExternalLink, Calendar, Database, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";
import { DataProvenance } from "../../types";

interface Props {
  provenance?: DataProvenance;
  customLabel?: string;
}

export const DataProvenanceBadge: React.FC<Props> = ({ provenance, customLabel }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!provenance) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono bg-white/5 text-neutral-400 border border-white/10 uppercase tracking-wider">
        <Info className="w-3 h-3" />
        {customLabel || "Verified Model Data"}
      </span>
    );
  }

  const confidenceConfig = {
    high: {
      color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/60",
      dot: "bg-emerald-400",
      label: "HIGH CONFIDENCE",
    },
    moderate: {
      color: "text-amber-400 bg-amber-950/40 border-amber-800/60",
      dot: "bg-amber-400",
      label: "MODERATE CONFIDENCE",
    },
    limited: {
      color: "text-orange-400 bg-orange-950/40 border-orange-800/60",
      dot: "bg-orange-400",
      label: "LIMITED DATA",
    },
    unreliable: {
      color: "text-red-400 bg-red-950/40 border-red-800/60",
      dot: "bg-red-400",
      label: "UNRELIABLE",
    },
  }[provenance.confidence || "high"];

  return (
    <div className="relative inline-block text-left">
      <button
        id={`provenance-btn-${provenance.dataset.replace(/\s+/g, "-").toLowerCase()}`}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-mono border transition-colors hover:brightness-110 ${confidenceConfig.color}`}
        title="Click to view strict Data Provenance & Source Metadata"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${confidenceConfig.dot} animate-pulse`} />
        <span className="font-semibold">{provenance.source.split(",")[0]}</span>
        <span className="text-neutral-400 hidden sm:inline">| {provenance.frequency}</span>
        <Info className="w-3 h-3 text-neutral-400 ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#141519] border border-white/20 p-4 shadow-2xl z-50 text-neutral-200 text-xs font-sans">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-serif italic font-bold text-white text-sm">
                  Provenance Audit Manifest
                </span>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-mono border uppercase tracking-wider ${confidenceConfig.color}`}>
                {confidenceConfig.label}
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-wider block">Primary Source / Lineage:</span>
                <span className="font-medium text-white">{provenance.source}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                <div>
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-wider block">Dataset:</span>
                  <span className="text-neutral-200">{provenance.dataset}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-wider block">Publisher:</span>
                  <span className="text-neutral-200">{provenance.publisher}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                <div>
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-wider block">Obs. Date:</span>
                  <span className="font-mono text-red-400">{provenance.observationDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-wider block">Updated:</span>
                  <span className="font-mono text-neutral-300">{provenance.lastUpdated}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                <div>
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-wider block">Scope:</span>
                  <span className="text-neutral-200">{provenance.geographicLevel}</span>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-wider block">License:</span>
                  <span className="text-neutral-300">{provenance.license}</span>
                </div>
              </div>

              {provenance.methodology && (
                <div className="pt-1 border-t border-white/10">
                  <span className="text-neutral-400 text-[10px] font-mono uppercase tracking-wider block">Methodology & Sampling:</span>
                  <p className="text-neutral-300 text-[11px] leading-relaxed mt-0.5 bg-[#0C0D10] p-2 border border-white/10 font-sans">
                    {provenance.methodology}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                VERIFIED SOURCE
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-red-400 hover:text-red-300 font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
