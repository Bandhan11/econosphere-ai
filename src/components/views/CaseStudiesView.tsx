import React, { useState } from "react";
import {
  History,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  FileText,
  Lightbulb,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { CASE_STUDIES } from "../../data/mockDatabase";
import { DataProvenanceBadge } from "../common/DataProvenanceBadge";

export const CaseStudiesView: React.FC = () => {
  const [selectedStudyId, setSelectedStudyId] = useState<string>(CASE_STUDIES[0].id);

  const activeStudy = CASE_STUDIES.find((s) => s.id === selectedStudyId) || CASE_STUDIES[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Empirical & Historical Policy Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Economic Crises & <span className="text-cyan-400">Case Studies</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical crisis transmission channels, policy interventions, and enduring lessons from global and sovereign macroeconomic shifts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Case Studies List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Historical Episodes ({CASE_STUDIES.length})
          </span>

          {CASE_STUDIES.map((study) => (
            <button
              key={study.id}
              onClick={() => setSelectedStudyId(study.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                selectedStudyId === study.id
                  ? "bg-cyan-950/70 border-cyan-800/80 text-cyan-200 shadow"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400">{study.year}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                  {study.country || study.category}
                </span>
              </div>
              <div className="font-bold text-xs text-slate-100 mt-1">{study.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{study.overview || study.coreProblem}</div>
            </button>
          ))}
        </div>

        {/* Right Column: Case Deep Dive */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {activeStudy.year}
                </span>
                <span className="text-xs text-slate-400">Country: {activeStudy.country}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1.5">{activeStudy.title}</h2>
              <p className="text-xs text-cyan-400 mt-0.5 font-medium">Category: {activeStudy.category}</p>
            </div>

            <DataProvenanceBadge provenance={activeStudy.provenance} />
          </div>

          {/* Core Summary */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Crisis Overview & Core Problem:
            </span>
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <p>{activeStudy.overview}</p>
              {activeStudy.coreProblem && (
                <p className="text-slate-400 font-mono text-[11px]">
                  <strong>Core Mechanism:</strong> {activeStudy.coreProblem}
                </p>
              )}
            </div>
          </div>

          {/* Policy Interventions */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Policy Interventions Implemented:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeStudy.interventions.map((tc, i) => (
                <div
                  key={i}
                  className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                >
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{tc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actual Historical Outcome */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Actual Historical Outcome:</span>
            </span>
            <p className="text-xs text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 leading-relaxed">
              {activeStudy.actualHistoricalOutcome}
            </p>
          </div>

          {/* Enduring Lessons */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border border-cyan-800/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Enduring Econometric & Policy Lessons</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-200">
              {activeStudy.lessonsLearned.map((lesson, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
            {activeStudy.relevanceToBangladesh && (
              <div className="mt-3 pt-2 border-t border-cyan-800/40 text-[11px] text-cyan-200">
                <span className="font-semibold text-cyan-300">Relevance to Bangladesh:</span> {activeStudy.relevanceToBangladesh}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
