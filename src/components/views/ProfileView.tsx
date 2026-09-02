import React from "react";
import {
  ShieldCheck,
  UserCheck,
  Award,
  Globe2,
  FileText,
  Lock,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ProfileView: React.FC = () => {
  const { userRole, setUserRole, language, currencyDenomination } = useApp();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Governance & Institutional Integrity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Terminal Profile & <span className="text-cyan-400">Methodology</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Institutional standards, anti-hallucination protocols, econometric models, and licensing metadata.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Terminal Configuration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 font-bold text-sm text-white">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Active Terminal Profile</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Economist Role Profile:</span>
              <span className="font-mono font-bold text-cyan-300 capitalize">{userRole}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Active Localization Language:</span>
              <span className="font-mono uppercase font-bold text-slate-200">{language} (15 Locales)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Default Currency Denomination:</span>
              <span className="font-mono font-bold text-slate-200">{currencyDenomination}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">AI Intelligence Core:</span>
              <span className="font-mono text-emerald-400">Server-Side Gemini 2.5 Flash</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Econometric Math Kernel:</span>
              <span className="font-mono text-slate-200">Pure Functional TypeScript Engine</span>
            </div>
          </div>
        </div>

        {/* Anti-Hallucination & Provenance Charter */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 font-bold text-sm text-white">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Anti-Hallucination Data Charter</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <p>
              EconoSphere AI strictly enforces source attribution and refuses to fabricate synthetic micro-data. When sub-district disaggregations are unavailable, the platform automatically flags missing indicators and defaults to regional aggregates.
            </p>
            <div className="space-y-1 pt-1 font-mono text-[11px] text-emerald-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>BBS & Bangladesh Bank Data Integrity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>World Bank & IMF BPM6 Standard Alignment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>No Browser Key Exposure (Server Proxying)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
