import React, { useState } from "react";
import {
  Globe,
  MapPin,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Layers,
  ArrowUpRight,
  ChevronRight,
  Building,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { COUNTRIES, BANGLADESH_DIVISIONS } from "../../data/mockDatabase";
import { DataProvenanceBadge } from "../common/DataProvenanceBadge";
import { DistrictUnavailableBanner } from "../common/DistrictUnavailableBanner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export const EconomyView: React.FC = () => {
  const {
    activeCountry,
    selectedCountryId,
    setSelectedCountryId,
  } = useApp();

  const [selectedDivision, setSelectedDivision] = useState<string>("Rangpur");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Rangpur");
  const [showMissingDistrictWarning, setShowMissingDistrictWarning] = useState<boolean>(false);

  const isBangladesh = activeCountry.id === "BD";

  // Comparative Country Chart Data
  const comparativeData = COUNTRIES.map((c) => ({
    name: c.name.split(" ")[0],
    GDP_Growth: c.macro.realGdpGrowth,
    Inflation: c.macro.inflation,
    Policy_Rate: c.macro.centralBankRate,
  }));

  const currentDiv = BANGLADESH_DIVISIONS.find((d) => d.name === selectedDivision) || BANGLADESH_DIVISIONS[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>Macroeconomic & Regional Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sovereign & Sub-National <span className="text-cyan-400">Economy</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comprehensive macroeconomic surveillance across 190+ nations with deep disaggregated district-level intelligence for Bangladesh.
          </p>
        </div>

        {/* Country Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 shrink-0 font-medium">Select Country:</label>
          <select
            value={selectedCountryId}
            onChange={(e) => {
              setSelectedCountryId(e.target.value);
              setShowMissingDistrictWarning(false);
            }}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Country Profile Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{activeCountry.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{activeCountry.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                  {activeCountry.code}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Region: {activeCountry.region} | Currency: {activeCountry.macro.currencyName} ({activeCountry.macro.currencyCode})
              </p>
            </div>
          </div>

          <DataProvenanceBadge provenance={activeCountry.provenance} />
        </div>

        {/* Key Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">GDP (Nominal)</span>
            <span className="font-mono font-bold text-base text-slate-100">
              ${activeCountry.macro.gdp}B
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">GDP Growth (YoY)</span>
            <span className="font-mono font-bold text-base text-emerald-400">
              +{activeCountry.macro.realGdpGrowth}%
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Inflation (CPI)</span>
            <span className="font-mono font-bold text-base text-amber-300">
              {activeCountry.macro.inflation}%
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Policy Repo Rate</span>
            <span className="font-mono font-bold text-base text-cyan-400">
              {activeCountry.macro.centralBankRate}%
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">FX Reserves</span>
            <span className="font-mono font-bold text-base text-indigo-300">
              ${activeCountry.macro.fxReserves}B
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Unemployment</span>
            <span className="font-mono font-bold text-base text-slate-300">
              {activeCountry.macro.unemployment}%
            </span>
          </div>
        </div>

        {/* Secondary Macro Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">Fiscal Deficit:</span>
            <span className="font-mono font-semibold text-slate-200">
              {activeCountry.macro.fiscalDeficitToGdp}% of GDP
            </span>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">Public Debt:</span>
            <span className="font-mono font-semibold text-slate-200">
              {activeCountry.macro.debtToGdp}% of GDP
            </span>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">Trade Balance:</span>
            <span className="font-mono font-semibold text-slate-200">
              ${activeCountry.macro.tradeBalance}B
            </span>
          </div>
          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">Gini Inequality:</span>
            <span className="font-mono font-semibold text-slate-200">
              {activeCountry.macro.giniIndex}
            </span>
          </div>
        </div>
      </div>

      {/* Bangladesh Deep-Dive: 8 Divisions & 64 Districts Explorer */}
      {isBangladesh && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                <MapPin className="w-4 h-4" />
                <span>Bangladesh Sub-National Geographic Intelligence</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                8 Administrative Divisions & 64 Districts Disaggregation
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/50">
              BBS Official Census Data
            </span>
          </div>

          {/* Division Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
            {BANGLADESH_DIVISIONS.map((div) => (
              <button
                key={div.name}
                onClick={() => {
                  setSelectedDivision(div.name);
                  setSelectedDistrict(div.districts[0]);
                  setShowMissingDistrictWarning(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDivision === div.name
                    ? "bg-cyan-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {div.name}
              </button>
            ))}
          </div>

          {/* Division Details & District Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="font-bold text-sm text-cyan-300">{currentDiv.name} Division Overview</div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Regional Population:</span>
                  <span className="font-mono font-semibold">{currentDiv.populationM} Million</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Districts:</span>
                  <span className="font-mono font-semibold text-cyan-400">{currentDiv.districts.length} Districts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Economic Sector:</span>
                  <span className="font-semibold text-emerald-300">{currentDiv.keySector}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Districts in {currentDiv.name} ({currentDiv.districts.length})
                </span>
                <span className="text-[11px] text-slate-400">Click district to inspect local data</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentDiv.districts.map((dist) => (
                  <button
                    key={dist}
                    onClick={() => {
                      setSelectedDistrict(dist);
                      // Toggle warning if not a featured market
                      const hasMicro = ["Rangpur", "Bogura", "Rajshahi", "Dinajpur", "Dhaka", "Chattogram"].includes(dist);
                      setShowMissingDistrictWarning(!hasMicro);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedDistrict === dist
                        ? "bg-cyan-950 text-cyan-300 border-cyan-600 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Micro-Data Banner */}
          {showMissingDistrictWarning && (
            <DistrictUnavailableBanner
              districtName={selectedDistrict}
              nearestRegion={`${selectedDivision} Divisional Directorate`}
              onNavigateToRegion={() => setShowMissingDistrictWarning(false)}
            />
          )}
        </div>
      )}

      {/* Global Macro Comparative Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Cross-Country Macro Benchmark Comparison</span>
            </h3>
            <p className="text-[11px] text-slate-400">GDP Growth %, Inflation CPI %, and Policy Repo Rates %</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparativeData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }}
                formatter={(val: any) => [`${val}%`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="GDP_Growth" fill="#10b981" name="GDP Growth (YoY %)" />
              <Bar dataKey="Inflation" fill="#f59e0b" name="Inflation CPI %" />
              <Bar dataKey="Policy_Rate" fill="#38bdf8" name="Policy Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
