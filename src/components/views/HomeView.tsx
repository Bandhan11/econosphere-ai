import React from "react";
import {
  Globe2,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  FlaskConical,
  GraduationCap,
  Building2,
  BookOpen,
  Bot,
  ShieldCheck,
  Zap,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { COUNTRIES, LOCAL_MARKETS, FINANCIAL_INSTRUMENTS } from "../../data/mockDatabase";
import { DataProvenanceBadge } from "../common/DataProvenanceBadge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const HomeView: React.FC = () => {
  const {
    t,
    setActiveTab,
    navigateToCountry,
    navigateToMarket,
    navigateToInstrument,
    activeCountry,
    userRole,
  } = useApp();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Banner / Executive Terminal Briefing with Artistic Flair */}
      <div className="relative overflow-hidden bg-[#141519] border border-white/15 p-6 sm:p-10 shadow-2xl relative">
        {/* Subtle geometric architectural background watermark */}
        <div className="absolute top-0 right-8 select-none pointer-events-none opacity-5 font-serif font-black text-[220px] text-white leading-none">
          24
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/15 text-neutral-300 text-[10px] font-mono uppercase tracking-[0.25em]">
              <Sparkles className="w-3 h-3 text-red-500" />
              <span>DIGITAL ARCHIVE // VOL. 024</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif italic font-black text-white tracking-tight leading-none">
              EconoSphere <span className="not-italic font-mono text-red-500 text-2xl sm:text-3xl">TERMINAL</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl font-sans font-light">
              An exhaustive digital curation of macroeconomic indicators, micro-commodity price transmission laboratories, and econometric regression models across 194 sovereign states.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => setActiveTab("simulate")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-lg transition-all cursor-pointer border border-red-500"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Launch Exhibit Lab →</span>
              </button>
              <button
                onClick={() => setActiveTab("aiEconomist")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-red-400" />
                <span>Consult Senior Economist</span>
              </button>
              <button
                onClick={() => setActiveTab("research")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#17181D] hover:bg-[#1E2026] text-neutral-300 border border-white/10 text-xs font-mono uppercase tracking-wider transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                <span>Econometrics Studio</span>
              </button>
            </div>
          </div>

          {/* Quick Stat Exhibit Manifest Card */}
          <div className="bg-[#0C0D10] border border-white/15 p-5 sm:min-w-[280px] space-y-3.5 shrink-0 relative">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-600 pointer-events-none" />
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em]">Curation Telemetry</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span className="text-neutral-500 font-mono text-[11px]">Sovereign Datasets:</span>
                <span className="font-mono font-bold text-white">194 Countries</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span className="text-neutral-500 font-mono text-[11px]">Sub-National Districts:</span>
                <span className="font-mono font-bold text-red-400">64 Districts</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span className="text-neutral-500 font-mono text-[11px]">Model Taxonomy:</span>
                <span className="font-mono text-neutral-200 text-[11px]">Solow, IS-LM, OLS, HW</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span className="text-neutral-500 font-mono text-[11px]">Active Persona:</span>
                <span className="font-mono text-red-400 capitalize">{userRole}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Macro Key Indicators Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div>
            <h2 className="text-lg font-serif italic font-bold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-red-500" />
              <span>Sovereign Macroeconomic Archives</span>
            </h2>
            <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mt-0.5">Real-time GDP, inflation, central bank discount rates, and foreign exchange reserves.</p>
          </div>
          <button
            onClick={() => setActiveTab("economy")}
            className="text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 inline-flex items-center gap-1 group"
          >
            <span>Full Catalog</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COUNTRIES.slice(0, 4).map((country) => (
            <div
              key={country.id}
              onClick={() => navigateToCountry(country.id)}
              className="bg-[#141519] border border-white/10 hover:border-red-600/50 p-4 transition-all hover:-translate-y-0.5 cursor-pointer group shadow-sm relative"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{country.flag}</span>
                  <div>
                    <h3 className="font-serif italic font-bold text-base text-white group-hover:text-red-400 transition-colors">
                      {country.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{country.region}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-red-400 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-white/10">
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase font-mono tracking-wider block">GDP (Nominal)</span>
                  <span className="font-mono font-bold text-neutral-200">${country.macro.gdp}B</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase font-mono tracking-wider block">Real Growth</span>
                  <span className={`font-mono font-bold ${country.macro.realGdpGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    +{country.macro.realGdpGrowth}%
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase font-mono tracking-wider block">CPI Inflation</span>
                  <span className="font-mono font-bold text-amber-400">{country.macro.inflation}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase font-mono tracking-wider block">Policy Rate</span>
                  <span className="font-mono font-bold text-red-400">{country.macro.centralBankRate}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-neutral-400 font-mono tracking-wide">
                <span>FX RES: ${country.macro.fxReserves}B</span>
                <span>UNEMP: {country.macro.unemployment}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Local Commodity Market Pulse & Financial Markets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Local Commodity Markets & Agricultural Price Watch */}
        <div className="bg-[#141519] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <h3 className="font-serif italic font-bold text-base text-white">Commodity Price Transmission</h3>
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                Farmgate-to-retail margin spread, logistics friction, and storage hoardings.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("simulate")}
              className="text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300"
            >
              Simulate →
            </button>
          </div>

          <div className="space-y-2.5">
            {LOCAL_MARKETS.slice(0, 4).map((m) => {
              const spread = m.retailPrice - m.currentWholesalePrice;
              const marginPct = ((spread / m.currentWholesalePrice) * 100).toFixed(1);
              return (
                <div
                  key={m.id}
                  onClick={() => navigateToMarket(m.id)}
                  className="bg-[#0C0D10] border border-white/10 hover:border-red-600/40 p-3 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-neutral-200 group-hover:text-red-400 transition-colors">
                        {m.product}
                      </span>
                      <span className="px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-widest bg-white/5 text-neutral-300 border border-white/10">
                        {m.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      {m.district}, {m.division} | Harvest: {m.production.toLocaleString()} MT
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-white">
                      ৳{m.retailPrice} <span className="text-[10px] font-normal text-neutral-400">/{m.unit}</span>
                    </div>
                    <div className="text-[10px] font-mono text-amber-400">
                      Spread: +৳{spread.toFixed(1)} ({marginPct}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10">
            <DataProvenanceBadge
              provenance={LOCAL_MARKETS[0].provenance}
              customLabel="DAM / BBS Price Lineage"
            />
            <button
              onClick={() => setActiveTab("simulate")}
              className="text-red-400 hover:text-red-300 text-xs font-mono uppercase tracking-wider"
            >
              Examine Supply Chain Shock →
            </button>
          </div>
        </div>

        {/* Right: Global Financial Terminal Snapshot */}
        <div className="bg-[#141519] border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="font-serif italic font-bold text-base text-white">Financial Market Manifest</h3>
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                Indices, sovereign bond yields, energy commodities, and FX crosses.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("markets")}
              className="text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300"
            >
              Full Terminal →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FINANCIAL_INSTRUMENTS.slice(0, 6).map((inst) => {
              const isUp = inst.change >= 0;
              return (
                <div
                  key={inst.ticker}
                  onClick={() => navigateToInstrument(inst.ticker)}
                  className="bg-[#0C0D10] border border-white/10 hover:border-red-600/40 p-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-neutral-200 group-hover:text-red-400 transition-colors">
                      {inst.ticker}
                    </span>
                    <span
                      className={`inline-flex items-center text-[10px] font-mono font-bold ${
                        isUp ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                      {isUp ? "+" : ""}{inst.changePercent}%
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">{inst.name}</div>
                  <div className="font-mono font-bold text-sm text-white mt-1">
                    {inst.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10">
            <span className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase">
              FEED: {FINANCIAL_INSTRUMENTS[0].source}
            </span>
            <button
              onClick={() => setActiveTab("markets")}
              className="text-red-400 hover:text-red-300 text-xs font-mono uppercase tracking-wider"
            >
              Open Live Chart Suite →
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Toolboxes / Quick Capabilities Grid */}
      <div className="bg-[#141519] border border-white/10 p-6">
        <h3 className="text-base font-serif italic font-bold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-500" />
          <span>Curated Analytical Laboratories</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab("learn")}
            className="p-5 bg-[#0C0D10] border border-white/10 hover:border-red-600/50 cursor-pointer transition-all group"
          >
            <GraduationCap className="w-6 h-6 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-serif italic font-bold text-sm text-white group-hover:text-red-400">Interactive Curriculum</h4>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-sans">
              Master micro and macroeconomics with live interactive curves, math breakdown, and audio readouts.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("simulate")}
            className="p-5 bg-[#0C0D10] border border-white/10 hover:border-red-600/50 cursor-pointer transition-all group"
          >
            <FlaskConical className="w-6 h-6 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-serif italic font-bold text-sm text-white group-hover:text-red-400">Policy & Shock Lab</h4>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-sans">
              Simulate price ceilings, crop storage hoardings, fiscal-monetary cascades, and Solow steady states.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("research")}
            className="p-5 bg-[#0C0D10] border border-white/10 hover:border-red-600/50 cursor-pointer transition-all group"
          >
            <BookOpen className="w-6 h-6 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-serif italic font-bold text-sm text-white group-hover:text-red-400">OLS Econometrics Studio</h4>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-sans">
              Upload custom datasets or run multi-variable OLS regression with R², F-test, and t-stats output.
            </p>
          </div>

          <div
            onClick={() => setActiveTab("aiEconomist")}
            className="p-5 bg-[#0C0D10] border border-white/10 hover:border-red-600/50 cursor-pointer transition-all group"
          >
            <Bot className="w-6 h-6 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-serif italic font-bold text-sm text-white group-hover:text-red-400">Senior AI Economist</h4>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-sans">
              Consult a server-side Gemini 2.5 economist for counterfactual scenarios, policy audit, and citations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
