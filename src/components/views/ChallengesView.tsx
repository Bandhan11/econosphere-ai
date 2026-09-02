import React, { useState } from "react";
import {
  Trophy,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";

export const ChallengesView: React.FC = () => {
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null);
  const [isResolved, setIsResolved] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const challenges = [
    {
      id: "c1",
      title: "Crisis Challenge 1: The Northern Potato Shock & Hoarding Crisis",
      context:
        "Severe cold storage syndicate hoarding in Rangpur and Bogura has caused urban retail potato prices to jump by 45% in 3 weeks, while farmers complain their farmgate price is depressed at ৳22/kg. The consumer price index is spiking, and public anger is mounting.",
      objective: "Restore market supply balance, protect consumers, and maintain farmer incentives.",
      options: [
        {
          text: "Impose a strict statutory price ceiling of ৳30/kg backed by police raids on retail grocers.",
          score: 20,
          outcome:
            "Flawed Intervention: Imposing a price ceiling without addressing storage hoarding drove potato supplies into the underground black market. Retailers shut down stalls, resulting in severe urban shortages and long ration queues.",
        },
        {
          text: "Deploy Open Market Sales (OMS) at subsidized rates, conduct joint cold storage stock audits to release withheld inventories, and provide a 15% freight transport subsidy.",
          score: 100,
          outcome:
            "Optimal Policy Masterstroke! Open Market Sales (OMS) broke the speculative hoarding monopoly by flooding urban markets with buffer stock. The transport subsidy narrowed the regional wholesale spread, restoring retail prices to ৳36/kg while preserving the farmer farmgate price.",
        },
        {
          text: "Do nothing and let the free market self-correct over the next 6 months.",
          score: 40,
          outcome:
            "Sub-optimal Result: While the market eventually clears next season, the short-term consumer welfare loss was devastating, pushing low-income household food poverty up by 3.2%.",
        },
      ],
    },
    {
      id: "c2",
      title: "Crisis Challenge 2: Currency Depreciation & Import Parity Inflation",
      context:
        "Global interest rate hikes in major economies have triggered capital outflows. The domestic currency has depreciated by 12% in 60 days, driving up the cost of imported fuel, wheat, and industrial raw materials.",
      objective: "Stabilize foreign exchange reserves without triggering a domestic economic recession.",
      options: [
        {
          text: "Institute hard fixed exchange rate peg at the previous rate and ban all foreign currency transactions.",
          score: 15,
          outcome:
            "Severe Crisis: Foreign reserves collapsed within 45 days. Importers were unable to open Letters of Credit (LCs), halting domestic factories and causing severe shortages.",
        },
        {
          text: "Transition to a crawling peg exchange rate band, raise the central bank policy rate by 150 bps to curb speculative import demand, and incentivize expatriate remittance inflows.",
          score: 100,
          outcome:
            "Masterful Macroeconomic Stabilization! The crawling peg restored market confidence, higher policy rates moderated speculative credit, and official remittance inflows surged by 24%, re-anchoring foreign exchange reserves.",
        },
        {
          text: "Print money to fund fiscal subsidies on all imported commodities.",
          score: 10,
          outcome:
            "Catastrophic Hyperinflation: Monetizing the fiscal deficit expanded the money supply, fueling a vicious currency-depreciation-inflation spiral.",
        },
      ],
    },
  ];

  const currentChallenge = challenges[activeChallengeIndex];

  const handleResolve = () => {
    if (selectedPolicy === null) return;
    setIsResolved(true);
    const earned = currentChallenge.options[selectedPolicy].score;
    setTotalScore((prev) => prev + earned);

    if (earned === 100) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNext = () => {
    if (activeChallengeIndex < challenges.length - 1) {
      setActiveChallengeIndex((prev) => prev + 1);
      setSelectedPolicy(null);
      setIsResolved(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Policy Crisis Simulator Challenges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Economic Policy <span className="text-cyan-400">Crisis Challenges</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Step into the shoes of the Chief Economic Advisor. Formulate counter-crisis strategies and evaluate live welfare consequences.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-200">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Cumulative Advisor Score: <strong className="text-cyan-400">{totalScore} pts</strong></span>
        </div>
      </div>

      {/* Challenge Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">{currentChallenge.title}</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Scenario {activeChallengeIndex + 1} of {challenges.length}
          </span>
        </div>

        {/* Crisis Brief */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
            Intelligence Briefing:
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">{currentChallenge.context}</p>
          <div className="pt-2 text-[11px] text-cyan-400 font-mono">
            <strong>Mandate:</strong> {currentChallenge.objective}
          </div>
        </div>

        {/* Policy Decision Options */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Select Policy Intervention Package:
          </span>

          <div className="space-y-2.5">
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedPolicy === idx;
              return (
                <button
                  key={idx}
                  onClick={() => !isResolved && setSelectedPolicy(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                    isSelected
                      ? "bg-cyan-950/80 border-cyan-600 text-cyan-200 shadow"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resolve and Next Controls */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          {!isResolved ? (
            <button
              onClick={handleResolve}
              disabled={selectedPolicy === null}
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow disabled:opacity-50 transition-colors ml-auto cursor-pointer"
            >
              Enact Policy Decision & Simulate Outcome
            </button>
          ) : (
            <div className="w-full space-y-4">
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  currentChallenge.options[selectedPolicy!].score === 100
                    ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-200"
                    : "bg-amber-950/60 border-amber-800/80 text-amber-200"
                }`}
              >
                <div className="font-bold text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Outcome Assessment (+{currentChallenge.options[selectedPolicy!].score} points)
                  </span>
                </div>
                <p>{currentChallenge.options[selectedPolicy!].outcome}</p>
              </div>

              <div className="flex justify-end">
                {activeChallengeIndex < challenges.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-colors"
                  >
                    Proceed to Next Challenge →
                  </button>
                ) : (
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    All Simulation Challenges Completed!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
