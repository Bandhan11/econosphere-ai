import React, { useState } from "react";
import {
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Sparkles,
  DollarSign,
  Home,
  ShoppingBag,
  Truck,
  Building,
  Globe2,
  Percent,
  CheckCircle2,
  BookOpen,
  PieChart,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { EconomicScaleLevel, HouseholdSimulatorInputs, HouseholdSimulatorOutputs } from "../../types";

export const EconomicDiscoveryView: React.FC = () => {
  const { economicScale, setEconomicScale } = useApp();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<"scale_navigator" | "household_sim" | "why_engine" | "story_engine">("scale_navigator");

  // Household Simulator State
  const [monthlyIncome, setMonthlyIncome] = useState<number>(35000);
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [foodPct, setFoodPct] = useState<number>(55);
  const [housingCost, setHousingCost] = useState<number>(10000);
  const [transportCost, setTransportCost] = useState<number>(3500);
  const [utilitiesCost, setUtilitiesCost] = useState<number>(2500);
  const [currentInflation, setCurrentInflation] = useState<number>(9.7);

  // Household Sim calculations
  const calculateHouseholdImpact = (): HouseholdSimulatorOutputs => {
    const foodBudget = (monthlyIncome * foodPct) / 100;
    const essentialExpenses = foodBudget + housingCost + transportCost + utilitiesCost;
    const netDisposable = monthlyIncome - essentialExpenses;
    const savingsRate = Math.max(0, (netDisposable / monthlyIncome) * 100);

    // Food inflation impact
    const inflatedFoodBudget = foodBudget * (1 + currentInflation / 100);
    const inflatedExpenses = inflatedFoodBudget + housingCost * 1.05 + transportCost * 1.08 + utilitiesCost * 1.06;
    const realPurchasingPowerLoss = inflatedExpenses - essentialExpenses;
    const postInflationDisposable = monthlyIncome - inflatedExpenses;

    let vulnerabilityRisk: "Low" | "Moderate" | "High" | "Critical" = "Low";
    if (postInflationDisposable < 0) vulnerabilityRisk = "Critical";
    else if (postInflationDisposable < monthlyIncome * 0.1) vulnerabilityRisk = "High";
    else if (postInflationDisposable < monthlyIncome * 0.2) vulnerabilityRisk = "Moderate";

    return {
      monthlyIncome,
      totalExpenses: Math.round(inflatedExpenses),
      netDisposableIncome: Math.round(postInflationDisposable),
      savingsRate: Number(savingsRate.toFixed(1)),
      foodBudgetShare: Number(((inflatedFoodBudget / monthlyIncome) * 100).toFixed(1)),
      realPurchasingPowerLoss: Math.round(realPurchasingPowerLoss),
      vulnerabilityRisk,
      recommendedActions: [
        "Reallocate non-staple caloric intake towards regulated OMS fair-price depots.",
        "Buffer against fuel tariff adjustments by locking local public transit subscriptions.",
        "Maintain 3-month liquid cash reserve in scheduled high-yield savings deposit.",
      ],
    };
  };

  const householdResults = calculateHouseholdImpact();

  // Why is this happening state
  const [selectedIndicator, setSelectedIndicator] = useState<string>("Bangladesh Food CPI Inflation (9.7%)");
  const [whyLoading, setWhyLoading] = useState(false);
  const [whyResult, setWhyResult] = useState<any>({
    indicator: "Bangladesh Food CPI Inflation (9.7%)",
    domesticDrivers: [
      "Monsoon logistical disruptions and seasonal supply bottlenecks in northern vegetable belts (Bogra, Rangpur).",
      "Multi-layered intermediary wholesale spreads at Kawran Bazar & Badamtoli hats with up to 45% markup over farmgate prices.",
      "Transmission of high commercial diesel and CNG freight transport costs across national highways.",
    ],
    internationalDrivers: [
      "Higher global CIF import parity for edible oil, fertilizer feedstocks, and wheat.",
      "BDT/USD currency depreciation increasing the landed cost of imported grains and agricultural packaging.",
    ],
    policyLevers: [
      "Aggressive open market sales (OMS) expansion by the Directorate General of Food.",
      "Targeted agricultural credit refinance facilities for smallholder rice and potato growers.",
      "Strict monitoring of wholesale cold-storage syndicates under the Consumer Rights Protection Directorate.",
    ],
  });

  const handleFetchWhy = async () => {
    setWhyLoading(true);
    try {
      const res = await fetch("/api/ai/why-indicator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indicator: selectedIndicator, country: "Bangladesh" }),
      });
      if (res.ok) {
        const data = await res.json();
        setWhyResult(data);
      }
    } catch (e) {
      //
    } finally {
      setWhyLoading(false);
    }
  };

  // Economic Story Engine State
  const [storyTopic, setStoryTopic] = useState("How global crude price hikes transmit into the retail price of potato in Dhaka");
  const [storyRole, setStoryRole] = useState("Smallholder Farmer & Urban Consumer");
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyResult, setStoryResult] = useState<any>({
    title: "From Strait of Hormuz to Kawran Bazar: The Transmission Chain of Energy Shocks",
    narrative:
      "When international crude oil benchmarks rise on global exchanges, the state-run petroleum corporation adjusts domestic commercial diesel tariffs. For a potato grower in Rangpur, this immediately inflates diesel-powered shallow tube-well irrigation expenses and cold-storage preservation rates. As haulers transport the harvest 320 kilometers south along the N5 highway to Dhaka's wholesale markets, truck freight fares surge by 20%. Wholesale middlemen tack on their margins, and by the time the potato reaches a neighborhood retail cart in Mirpur, urban working households find their grocery bill inflated by ৳18 per kilogram — reducing real household discretionary purchasing power.",
    nodes: [
      { step: 1, scale: "Global", title: "Brent Crude Benchmark Spike", detail: "Global shipping costs and energy import bills escalate." },
      { step: 2, scale: "National", title: "National Fuel Tariff Revision", detail: "BPC adjusts domestic industrial and freight diesel prices." },
      { step: 3, scale: "Regional", title: "Highway Freight & Cold Storage", detail: "Northern transport corridors increase per-truck cartage by 20%." },
      { step: 4, scale: "Local Market", title: "Wholesale Margin Spread", detail: "Kawran Bazar and Karwan Bazar merchants pass margin down." },
      { step: 5, scale: "Household", title: "Consumer Real Wage Erosion", detail: "Food share of household expenditure rises to 58%, squeezing savings." },
    ],
  });

  const handleGenerateStory = async () => {
    setStoryLoading(true);
    try {
      const res = await fetch("/api/ai/economic-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: storyTopic, perspective: storyRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setStoryResult(data);
      }
    } catch (e) {
      //
    } finally {
      setStoryLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto text-neutral-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Integrated Economic Discovery Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Economic Scale <span className="text-red-500">Navigator & Simulator</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Understand how personal household budgets, local agricultural hats, district corridors, and global trade flows intersect.
          </p>
        </div>

        {/* Sub-tab selection */}
        <div className="flex border border-white/15 rounded-lg p-1 bg-[#121318]">
          <button
            onClick={() => setActiveTab("scale_navigator")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === "scale_navigator" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            Scale Switcher
          </button>
          <button
            onClick={() => setActiveTab("household_sim")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === "household_sim" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            Household Budget Sim
          </button>
          <button
            onClick={() => setActiveTab("why_engine")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === "why_engine" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            "Why is this happening?"
          </button>
          <button
            onClick={() => setActiveTab("story_engine")}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              activeTab === "story_engine" ? "bg-red-600 text-white" : "text-neutral-400 hover:text-white"
            }`}
          >
            Transmission Story
          </button>
        </div>
      </div>

      {/* 1. SCALE SWITCHER & INTERCONNECTION */}
      {activeTab === "scale_navigator" && (
        <div className="space-y-6">
          {/* Multi-Scale Interactive Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: "household", label: "Household / Micro", icon: Home, desc: "Personal income, caloric basket, real wage" },
              { id: "local", label: "Local Market / Hat", icon: ShoppingBag, desc: "Farmgate price, village haat equilibrium" },
              { id: "district", label: "District Corridor", icon: Truck, desc: "Wholesale logistics, cold storage spread" },
              { id: "national", label: "National Economy", icon: Building, desc: "CPI inflation, policy rate, fiscal deficit" },
              { id: "global", label: "Global Trade", icon: Globe2, desc: "Exchange rates, commodities, oil benchmarks" },
            ].map((s) => {
              const Icon = s.icon;
              const isSelected = economicScale === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setEconomicScale(s.id as EconomicScaleLevel)}
                  className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? "bg-red-950/40 border-red-500 shadow-lg text-white"
                      : "bg-[#121318] border-white/10 hover:border-white/20 text-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isSelected ? "text-red-400" : "text-neutral-500"}`} />
                    {isSelected && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                  </div>
                  <div className="font-bold text-xs">{s.label}</div>
                  <div className="text-[11px] text-neutral-400 leading-tight">{s.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Scale Interconnection Cascade Map */}
          <div className="bg-[#121318] border border-white/10 rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-red-400" />
                  <span>Cross-Scale Economic Transmission Model</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Visualizing how exogenous global macro forces flow directly down into local household welfare.
                </p>
              </div>
              <span className="font-mono text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-neutral-300">
                ACTIVE VIEW: {economicScale.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative font-mono text-xs">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-[10px] text-neutral-500 uppercase">Scale 5</div>
                <div className="font-bold text-white">Global Benchmark</div>
                <div className="text-[11px] text-neutral-400">Brent Crude: $78.45/bbl</div>
                <div className="text-[11px] text-neutral-400">US 10Y Yield: 4.22%</div>
                <div className="text-[10px] text-red-400 pt-1">↑ Import Parity Pressure</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-[10px] text-neutral-500 uppercase">Scale 4</div>
                <div className="font-bold text-white">National Macro</div>
                <div className="text-[11px] text-neutral-400">Headline CPI: 9.7%</div>
                <div className="text-[11px] text-neutral-400">Policy Repo: 10.00%</div>
                <div className="text-[10px] text-amber-400 pt-1">↑ Monetary Tightening</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-[10px] text-neutral-500 uppercase">Scale 3</div>
                <div className="font-bold text-white">District Logistics</div>
                <div className="text-[11px] text-neutral-400">Rangpur Cold Storage: ৳6.5/kg</div>
                <div className="text-[11px] text-neutral-400">Highway Diesel: ৳105/L</div>
                <div className="text-[10px] text-amber-400 pt-1">↑ Freight Margin Spread</div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-[10px] text-neutral-500 uppercase">Scale 2</div>
                <div className="font-bold text-white">Local Village Hat</div>
                <div className="text-[11px] text-neutral-400">Potato Farmgate: ৳24.0/kg</div>
                <div className="text-[11px] text-neutral-400">Retail City Price: ৳42.0/kg</div>
                <div className="text-[10px] text-red-400 pt-1">৳18.0/kg Middleman Spread</div>
              </div>

              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 space-y-2">
                <div className="text-[10px] text-red-400 uppercase font-bold">Scale 1</div>
                <div className="font-bold text-white">Household Welfare</div>
                <div className="text-[11px] text-neutral-300">Food Budget Share: 58.2%</div>
                <div className="text-[11px] text-neutral-300">Real Wage Erosion: -3.4%</div>
                <div className="text-[10px] text-red-400 pt-1 font-bold">Vulnerability: High</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HOUSEHOLD BUDGET & INFLATION SIMULATOR */}
      {activeTab === "household_sim" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Column */}
          <div className="bg-[#121318] border border-white/10 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <DollarSign className="w-4 h-4 text-red-400" />
              <span>Household Financial Parameters</span>
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300">Monthly Net Income (BDT):</span>
                <span className="font-mono font-bold text-white">৳{monthlyIncome.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={15000}
                max={150000}
                step={2500}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300">Food Expenditure Share:</span>
                <span className="font-mono font-bold text-white">{foodPct}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={75}
                value={foodPct}
                onChange={(e) => setFoodPct(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300">Monthly House Rent (BDT):</span>
                <span className="font-mono font-bold text-white">৳{housingCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={3000}
                max={45000}
                step={1000}
                value={housingCost}
                onChange={(e) => setHousingCost(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300">Transport & Commute (BDT):</span>
                <span className="font-mono font-bold text-white">৳{transportCost.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={500}
                max={15000}
                step={500}
                value={transportCost}
                onChange={(e) => setTransportCost(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300">Headline Food CPI Shock:</span>
                <span className="font-mono font-bold text-red-400">{currentInflation}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={0.5}
                value={currentInflation}
                onChange={(e) => setCurrentInflation(Number(e.target.value))}
                className="w-full accent-red-500"
              />
            </div>
          </div>

          {/* Results Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#121318] border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">
                  Real Welfare & Purchasing Power Impact
                </h3>
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                    householdResults.vulnerabilityRisk === "Critical"
                      ? "bg-red-950/80 border-red-800 text-red-300"
                      : householdResults.vulnerabilityRisk === "High"
                      ? "bg-amber-950/80 border-amber-800 text-amber-300"
                      : "bg-emerald-950/80 border-emerald-800 text-emerald-300"
                  }`}
                >
                  Vulnerability: {householdResults.vulnerabilityRisk}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-black/40 rounded border border-white/5">
                  <div className="text-[10px] text-neutral-400 uppercase">Monthly Income</div>
                  <div className="text-base font-bold text-white">৳{householdResults.monthlyIncome.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-black/40 rounded border border-white/5">
                  <div className="text-[10px] text-neutral-400 uppercase">Inflated Expenses</div>
                  <div className="text-base font-bold text-red-400">৳{householdResults.totalExpenses.toLocaleString()}</div>
                </div>

                <div className="p-3 bg-black/40 rounded border border-white/5">
                  <div className="text-[10px] text-neutral-400 uppercase">Net Disposable</div>
                  <div className={`text-base font-bold ${householdResults.netDisposableIncome < 0 ? "text-red-400" : "text-emerald-400"}`}>
                    ৳{householdResults.netDisposableIncome.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-black/40 rounded border border-white/5">
                  <div className="text-[10px] text-neutral-400 uppercase">Purchasing Loss</div>
                  <div className="text-base font-bold text-red-400">-৳{householdResults.realPurchasingPowerLoss.toLocaleString()}/mo</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-neutral-200">
                  Targeted Microeconomic Coping Recommendations:
                </div>
                <div className="space-y-1.5">
                  {householdResults.recommendedActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-neutral-300 flex items-start gap-2 p-2 rounded bg-white/5 border border-white/5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. "WHY IS THIS HAPPENING?" DEEP DIVE ENGINE */}
      {activeTab === "why_engine" && (
        <div className="bg-[#121318] border border-white/10 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-red-400" />
                <span>"Why is this happening?" Indicator Diagnostic Engine</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Decomposes national and local economic anomalies into structural domestic bottlenecks and international transmissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="px-3 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none font-mono"
              >
                <option value="Bangladesh Food CPI Inflation (9.7%)">Food CPI Inflation (9.7%)</option>
                <option value="Kawran Bazar Potato Wholesale Margin (৳18/kg)">Kawran Bazar Potato Spread (৳18/kg)</option>
                <option value="Bangladesh FX Reserves ($20.5B)">Foreign Exchange Reserves ($20.5B)</option>
                <option value="Bangladesh Bank Policy Repo Rate (10.0%)">Policy Repo Rate (10.0%)</option>
              </select>

              <button
                onClick={handleFetchWhy}
                disabled={whyLoading}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{whyLoading ? "Analyzing..." : "Analyze Indicator"}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Domestic Drivers */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-amber-300 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                <span>1. Domestic Supply & Policy Drivers</span>
              </div>
              <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
                {whyResult.domesticDrivers?.map((d: string, i: number) => (
                  <div key={i} className="p-2 rounded bg-white/5 border border-white/5">
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* International Transmissions */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-red-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                <span>2. International Pass-Through</span>
              </div>
              <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
                {whyResult.internationalDrivers?.map((d: string, i: number) => (
                  <div key={i} className="p-2 rounded bg-white/5 border border-white/5">
                    {d}
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Solutions */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                <span>3. Recommended Policy Levers</span>
              </div>
              <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
                {whyResult.policyLevers?.map((d: string, i: number) => (
                  <div key={i} className="p-2 rounded bg-white/5 border border-white/5">
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ECONOMIC STORY ENGINE */}
      {activeTab === "story_engine" && (
        <div className="bg-[#121318] border border-white/10 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-400" />
                <span>Economic Story & Transmission Tracer</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Translate abstract econometric models into concrete real-world human narratives.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={storyTopic}
                onChange={(e) => setStoryTopic(e.target.value)}
                placeholder="Topic or shock to trace..."
                className="px-3 py-1.5 bg-[#0C0D10] border border-white/15 rounded text-xs text-white outline-none w-64"
              />
              <button
                onClick={handleGenerateStory}
                disabled={storyLoading}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{storyLoading ? "Synthesizing..." : "Generate Story"}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-white">{storyResult.title}</h4>
            <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
              "{storyResult.narrative}"
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-neutral-200 uppercase font-mono tracking-wider">
                Step-by-Step Economic Transmission Path:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
                {storyResult.nodes?.map((node: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-black/30 border border-white/10 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 font-bold">Step {node.step}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-400 uppercase">
                        {node.scale}
                      </span>
                    </div>
                    <div className="font-bold text-white text-[11px]">{node.title}</div>
                    <div className="text-[10px] text-neutral-400 leading-relaxed">{node.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
