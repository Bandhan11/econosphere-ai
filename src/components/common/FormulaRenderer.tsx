import React from "react";
import { BookOpen } from "lucide-react";

interface Props {
  title: string;
  formula: string;
  description?: string;
  variables?: { symbol: string; label: string }[];
}

export const FormulaRenderer: React.FC<Props> = ({ title, formula, description, variables }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-sans shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          {title}
        </div>
        <span className="text-[10px] font-mono text-cyan-400/90 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          Econometric Formulation
        </span>
      </div>

      <div className="bg-slate-950/80 border border-slate-800/80 rounded-md p-3 my-2 text-center overflow-x-auto">
        <span className="font-mono text-sm sm:text-base text-cyan-300 font-medium tracking-wide">
          {formula}
        </span>
      </div>

      {description && (
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {description}
        </p>
      )}

      {variables && variables.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
          {variables.map((v, i) => (
            <div key={i} className="flex items-baseline gap-2 text-slate-400">
              <span className="font-mono text-cyan-400 font-semibold">{v.symbol}:</span>
              <span className="text-slate-300 text-[11px]">{v.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
