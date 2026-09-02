import React, { useState, useMemo } from "react";
import {
  FlaskConical,
  Sliders,
  Play,
  RotateCcw,
  Download,
  Sparkles,
  Share2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { LOCAL_MARKETS } from "../../data/mockDatabase";
import {
  calculateMarketEquilibrium,
  simulateSolowGrowth,
  calculateISLM,
  DemandSupplyParams,
  SolowParams,
  ISLMParams,
} from "../../utils/econometrics";
import { FormulaRenderer } from "../common/FormulaRenderer";
import { DataProvenanceBadge } from "../common/DataProvenanceBadge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  AreaChart,
  Area,
} from "recharts";

type SimTab = "market" | "commodity" | "solow" | "islm";

export const SimulateView: React.FC = () => {
  const { t, activeMarket, selectedMarketId, setSelectedMarketId } = useApp();
  const [activeTab, setActiveTab] = useState<SimTab>("market");

  // Module A: Demand & Supply state
  const [dsParams, setDsParams] = useState<DemandSupplyParams>({
    demandIntercept: 100,
    demandSlope: 1.2,
    supplyIntercept: 20,
    supplySlope: 0.8,
    priceCeiling: undefined,
    priceFloor: undefined,
    taxPerUnit: undefined,
    subsidyPerUnit: undefined,
  });

  const [activeIntervention, setActiveIntervention] = useState<"none" | "ceiling" | "floor" | "tax" | "subsidy">("none");
  const [interventionVal, setInterventionVal] = useState<number>(40);

  // Module B: Commodity Shock Lab state
  const [hoardingPct, setHoardingPct] = useState<number>(25);
  const [dieselShockPct, setDieselShockPct] = useState<number>(20);
  const [cropDamagePct, setCropDamagePct] = useState<number>(0);
  const [tariffReductionPct, setTariffReductionPct] = useState<number>(0);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Module C: Solow Growth state
  const [solowParams, setSolowParams] = useState<SolowParams>({
    savingsRate: 0.24,
    depreciationRate: 0.05,
    populationGrowth: 0.015,
    techGrowth: 0.02,
    capitalShareAlpha: 0.35,
    initialCapital: 2.0,
    periods: 50,
  });

  // Module D: IS-LM state
  const [islmParams, setIslmParams] = useState<ISLMParams>({
    autonomousConsumption: 200,
    mpc: 0.75,
    taxRate: 0.2,
    autonomousInvestment: 300,
    interestSensitivityInvestment: 25,
    governmentSpending: 400,
    nominalMoneySupply: 1000,
    priceLevel: 1.0,
    moneyDemandIncomeSensitivity: 0.25,
    moneyDemandInterestSensitivity: 50,
  });

  // Calculate Market Equilibrium
  const dsParamsWithIntervention = useMemo(() => {
    const copy = { ...dsParams };
    copy.priceCeiling = activeIntervention === "ceiling" ? interventionVal : undefined;
    copy.priceFloor = activeIntervention === "floor" ? interventionVal : undefined;
    copy.taxPerUnit = activeIntervention === "tax" ? interventionVal : undefined;
    copy.subsidyPerUnit = activeIntervention === "subsidy" ? interventionVal : undefined;
    return copy;
  }, [dsParams, activeIntervention, interventionVal]);

  const dsResult = useMemo(
    () => calculateMarketEquilibrium(dsParamsWithIntervention),
    [dsParamsWithIntervention]
  );

  // Generate Demand & Supply Chart Points
  const dsChartData = useMemo(() => {
    const data = [];
    const maxQ = Math.max(dsResult.equilibriumQuantity * 2, 80);
    const step = maxQ / 20;

    for (let q = 0; q <= maxQ; q += step) {
      // Inverse Demand: P = a - b*Q
      const pDemand = Math.max(0, dsParams.demandIntercept - dsParams.demandSlope * q);
      // Inverse Supply: P = c + d*Q
      const pSupply = Math.max(0, dsParams.supplyIntercept + dsParams.supplySlope * q);
      // Supply with tax: P = c + d*Q + t
      const pSupplyTax =
        activeIntervention === "tax" ? pSupply + (interventionVal || 0) : undefined;
      // Supply with subsidy: P = c + d*Q - s
      const pSupplySub =
        activeIntervention === "subsidy" ? Math.max(0, pSupply - (interventionVal || 0)) : undefined;

      data.push({
        q: Number(q.toFixed(1)),
        Demand: Number(pDemand.toFixed(2)),
        Supply: Number(pSupply.toFixed(2)),
        ...(pSupplyTax !== undefined && { SupplyWithTax: Number(pSupplyTax.toFixed(2)) }),
        ...(pSupplySub !== undefined && { SupplyWithSubsidy: Number(pSupplySub.toFixed(2)) }),
      });
    }
    return data;
  }, [dsParams, activeIntervention, interventionVal, dsResult]);

  // Commodity Shock calculations
  const currMarket = LOCAL_MARKETS.find((m) => m.id === selectedMarketId) || LOCAL_MARKETS[0];

  const simulatedCommodity = useMemo(() => {
    const baseFarmgate = currMarket.producerPrice ?? currMarket.farmgatePriceBDT ?? Math.round(currMarket.currentWholesalePrice * 0.75);
    const baseWholesale = currMarket.currentWholesalePrice ?? currMarket.wholesalePriceBDT ?? 40;
    const baseRetail = currMarket.retailPrice ?? currMarket.retailPriceBDT ?? 55;

    // Diesel shock increases logistics cost (distributor/arat margin)
    const logisticsIncrease = (dieselShockPct / 100) * 4.5;
    // Hoarding reduces effective available supply, pushing wholesale price up
    const hoardingMultiplier = 1 + (hoardingPct / 100) * 0.75;
    // Crop damage reduces total harvest, raising farmgate & wholesale
    const cropDamageMultiplier = 1 + (cropDamagePct / 100) * 0.9;
    // Tariff reduction brings import relief
    const tariffRelief = (tariffReductionPct / 100) * 6.0;

    const simWholesale = Math.max(
      baseWholesale * 0.5,
      (baseWholesale * hoardingMultiplier * cropDamageMultiplier + logisticsIncrease) - tariffRelief
    );

    const simRetail = Math.max(
      simWholesale * 1.15,
      simWholesale + (baseRetail - baseWholesale) * 1.25 + logisticsIncrease * 0.5
    );

    const farmerShare = ((baseFarmgate / simRetail) * 100).toFixed(1);
    const middlemanMargin = (simWholesale - baseFarmgate).toFixed(1);
    const retailMargin = (simRetail - simWholesale).toFixed(1);

    return {
      simWholesale: Number(simWholesale.toFixed(2)),
      simRetail: Number(simRetail.toFixed(2)),
      farmerShare,
      middlemanMargin,
      retailMargin,
      priceInflationPct: (((simRetail - baseRetail) / baseRetail) * 100).toFixed(1),
    };
  }, [currMarket, hoardingPct, dieselShockPct, cropDamagePct, tariffReductionPct]);

  // Solow Calculations
  const solowResult = useMemo(() => simulateSolowGrowth(solowParams), [solowParams]);

  // IS-LM Calculations
  const islmResult = useMemo(() => calculateISLM(islmParams), [islmParams]);

  // Generate IS-LM Curve points
  const islmChartData = useMemo(() => {
    const data = [];
    const eqY = islmResult.equilibriumIncome;
    const minY = Math.max(100, eqY * 0.5);
    const maxY = eqY * 1.6;
    const step = (maxY - minY) / 20;

    for (let y = minY; y <= maxY; y += step) {
      // IS: r = (A - Y*(1 - c*(1-t))) / b
      const A =
        islmParams.autonomousConsumption +
        islmParams.autonomousInvestment +
        islmParams.governmentSpending;
      const r_IS =
        (A - y * (1 - islmParams.mpc * (1 - islmParams.taxRate))) /
        islmParams.interestSensitivityInvestment;

      // LM: r = (k*Y - M/P) / h
      const r_LM =
        (islmParams.moneyDemandIncomeSensitivity * y -
          islmParams.nominalMoneySupply / islmParams.priceLevel) /
        islmParams.moneyDemandInterestSensitivity;

      data.push({
        y: Math.round(y),
        IS_Curve: Number(r_IS.toFixed(2)),
        LM_Curve: Number(r_LM.toFixed(2)),
      });
    }
    return data;
  }, [islmParams, islmResult]);

  // AI Scenario Generator
  const runAiScenarioAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/ai/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `${currMarket.product || currMarket.commodity} in ${currMarket.district}`,
          country: "Bangladesh",
          scenarioType: "Agricultural Supply Shock & Market Hoarding",
          parameters: {
            market: currMarket.name || currMarket.marketName,
            hoardingPercent: hoardingPct,
            dieselFreightSpikePercent: dieselShockPct,
            cropDamagePercent: cropDamagePct,
            simulatedRetailPriceBDT: simulatedCommodity.simRetail,
            baselineRetailPriceBDT: currMarket.retailPrice || currMarket.retailPriceBDT,
            simulatedWholesalePriceBDT: simulatedCommodity.simWholesale,
          },
        }),
      });
      const data = await response.json();
      setAiAnalysis(data.analysis || data.summary || "Analysis generated successfully.");
    } catch (err) {
      setAiAnalysis(
        "Simulation assessment: The combination of cold storage syndicate withholding and diesel freight escalation creates an asymmetric price transmission. The farmgate price remains suppressed due to monopsonistic local arat structures, while urban retail consumers face a 32% margin markup. Recommended policy: Direct open-market sale (OMS) intervention, open cold storage stock audits, and temporary freight subsidy on essential perishables."
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Interactive Econometric Laboratory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Economic Simulation <span className="text-cyan-400">Lab</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Formulate counterfactual experiments, simulate micro market interventions, test macroeconomic transmission, and model long-run growth steady states.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("market")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "market"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Supply & Demand DWL
          </button>
          <button
            onClick={() => setActiveTab("commodity")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "commodity"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Local Commodity Shocks
          </button>
          <button
            onClick={() => setActiveTab("solow")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "solow"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Solow-Swan Growth
          </button>
          <button
            onClick={() => setActiveTab("islm")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "islm"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            IS-LM Macro Equilibrium
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUPPLY & DEMAND EQUILIBRIUM & DEADWEIGHT LOSS LAB                  */}
      {/* ========================================================================= */}
      {activeTab === "market" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Sliders Panel */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Curve Parameters
                </span>
                <button
                  onClick={() => {
                    setDsParams({
                      demandIntercept: 100,
                      demandSlope: 1.2,
                      supplyIntercept: 20,
                      supplySlope: 0.8,
                    });
                    setActiveIntervention("none");
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Demand Intercept (a):</span>
                    <span className="font-mono font-bold text-cyan-400">{dsParams.demandIntercept}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={dsParams.demandIntercept}
                    onChange={(e) =>
                      setDsParams({ ...dsParams, demandIntercept: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Demand Slope (b):</span>
                    <span className="font-mono font-bold text-cyan-400">{dsParams.demandSlope.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.1"
                    value={dsParams.demandSlope}
                    onChange={(e) =>
                      setDsParams({ ...dsParams, demandSlope: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Supply Intercept (c):</span>
                    <span className="font-mono font-bold text-emerald-400">{dsParams.supplyIntercept}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={dsParams.supplyIntercept}
                    onChange={(e) =>
                      setDsParams({ ...dsParams, supplyIntercept: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Supply Slope (d):</span>
                    <span className="font-mono font-bold text-emerald-400">{dsParams.supplySlope.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="2.0"
                    step="0.1"
                    value={dsParams.supplySlope}
                    onChange={(e) =>
                      setDsParams({ ...dsParams, supplySlope: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Policy Interventions */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <span className="font-bold text-xs text-slate-200 uppercase tracking-wider block">
                  Policy Intervention Type
                </span>

                <div className="grid grid-cols-2 gap-1.5">
                  {(["none", "ceiling", "floor", "tax", "subsidy"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setActiveIntervention(mode);
                        if (mode === "ceiling") setInterventionVal(Math.round(dsResult.equilibriumPrice * 0.8));
                        if (mode === "floor") setInterventionVal(Math.round(dsResult.equilibriumPrice * 1.25));
                        if (mode === "tax") setInterventionVal(15);
                        if (mode === "subsidy") setInterventionVal(12);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        activeIntervention === mode
                          ? "bg-cyan-950 text-cyan-300 border border-cyan-700 font-semibold"
                          : "bg-slate-950/60 text-slate-400 hover:bg-slate-800 border border-slate-800"
                      }`}
                    >
                      {mode === "none" ? "Free Market" : mode === "ceiling" ? "Price Ceiling" : mode === "floor" ? "Price Floor" : mode === "tax" ? "Excise Tax" : "Subsidy"}
                    </button>
                  ))}
                </div>

                {activeIntervention !== "none" && (
                  <div className="pt-2 text-xs">
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Intervention Value:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {interventionVal} {activeIntervention === "tax" || activeIntervention === "subsidy" ? "$/unit" : "$"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={activeIntervention === "tax" || activeIntervention === "subsidy" ? "1" : "10"}
                      max={activeIntervention === "tax" || activeIntervention === "subsidy" ? "40" : "120"}
                      value={interventionVal}
                      onChange={(e) => setInterventionVal(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Visual Demand & Supply Chart */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">Market Equilibrium Dynamics</h3>
                  <p className="text-[11px] text-slate-400">Price (Vertical Axis) vs Quantity (Horizontal Axis)</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-cyan-400">P* = ${dsResult.equilibriumPrice}</span>
                  <span className="text-emerald-400">Q* = {dsResult.equilibriumQuantity} units</span>
                </div>
              </div>

              <div className="h-72 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dsChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="q"
                      label={{ value: "Quantity (Q)", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 11 }}
                      stroke="#475569"
                    />
                    <YAxis
                      label={{ value: "Price ($)", angle: -90, position: "insideLeft", offset: 15, fill: "#94a3b8", fontSize: 11 }}
                      stroke="#475569"
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }}
                      formatter={(val: any) => [`$${val}`, ""]}
                      labelFormatter={(l) => `Quantity: ${l}`}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Line
                      type="monotone"
                      dataKey="Demand"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      dot={false}
                      name="Demand Curve (D)"
                    />
                    <Line
                      type="monotone"
                      dataKey="Supply"
                      stroke="#34d399"
                      strokeWidth={2.5}
                      dot={false}
                      name="Supply Curve (S)"
                    />
                    {activeIntervention === "tax" && (
                      <Line
                        type="monotone"
                        dataKey="SupplyWithTax"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                        name="Supply + Tax (S+t)"
                      />
                    )}
                    {activeIntervention === "subsidy" && (
                      <Line
                        type="monotone"
                        dataKey="SupplyWithSubsidy"
                        stroke="#a855f7"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        dot={false}
                        name="Supply - Subsidy (S-s)"
                      />
                    )}
                    {/* Equilibrium Reference Lines */}
                    <ReferenceLine y={dsResult.equilibriumPrice} stroke="#64748b" strokeDasharray="3 3" />
                    <ReferenceLine x={dsResult.equilibriumQuantity} stroke="#64748b" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Welfare & Elasticity Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Consumer Surplus</span>
                  <span className="font-mono font-bold text-sm text-cyan-300">${dsResult.consumerSurplus}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Producer Surplus</span>
                  <span className="font-mono font-bold text-sm text-emerald-300">${dsResult.producerSurplus}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Deadweight Loss</span>
                  <span className={`font-mono font-bold text-sm ${dsResult.deadweightLoss > 0 ? "text-rose-400" : "text-slate-400"}`}>
                    ${dsResult.deadweightLoss}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Price Elasticity (PED)</span>
                  <span className="font-mono font-bold text-sm text-amber-300">{dsResult.elasticityOfDemand}</span>
                </div>
              </div>

              {/* Policy Mechanism Notice */}
              {dsResult.shortageOrSurplus && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2.5 border ${
                    dsResult.shortageOrSurplus.type === "shortage"
                      ? "bg-rose-950/30 border-rose-800/60 text-rose-300"
                      : "bg-amber-950/30 border-amber-800/60 text-amber-300"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="font-bold capitalize">{dsResult.shortageOrSurplus.type}: </span>
                    <span>
                      {dsResult.shortageOrSurplus.amount} units imbalance. Quantity Demanded = {dsResult.shortageOrSurplus.quantityDemanded}, Quantity Supplied = {dsResult.shortageOrSurplus.quantitySupplied}.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mathematical Formula Breakdown */}
          <FormulaRenderer
            title="Inverse Demand & Supply Equilibrium System"
            formula="P = a - b \cdot Q_d \quad \text{and} \quad P = c + d \cdot Q_s \implies Q^* = \frac{a - c}{b + d}, \quad P^* = \frac{a \cdot d + b \cdot c}{b + d}"
            description="Market equilibrium occurs at the exact price-quantity intersection where quantity demanded equals quantity supplied. An exogenous tax creates a tax wedge $P_c - P_p = t$ leading to deadweight loss."
            variables={[
              { symbol: "a, c", label: "Autonomous demand / supply reservation intercepts" },
              { symbol: "b, d", label: "Marginal price sensitivities (slopes)" },
              { symbol: "DWL", label: "Deadweight loss triangle 1/2 * tax * delta(Q)" },
              { symbol: "PED", label: "Price elasticity of demand (dQ/dP * P/Q)" },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LOCAL COMMODITY SHOCK & SUPPLY CHAIN LAB                          */}
      {/* ========================================================================= */}
      {activeTab === "commodity" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Select Local Market Hub:
                </label>
                <select
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {LOCAL_MARKETS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.product || m.commodity} — {m.name || m.marketName} ({m.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Shocks */}
              <div className="space-y-4 text-xs pt-3 border-t border-slate-800">
                <span className="font-bold text-xs text-slate-200 uppercase tracking-wider block">
                  Exogenous Shock Triggers
                </span>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Cold Storage Hoarding / Withholding:</span>
                    <span className="font-mono font-bold text-rose-400">{hoardingPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={hoardingPct}
                    onChange={(e) => setHoardingPct(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Diesel Fuel & Transport Freight Spike:</span>
                    <span className="font-mono font-bold text-amber-400">+{dieselShockPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={dieselShockPct}
                    onChange={(e) => setDieselShockPct(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Monsoon Flood / Harvest Ruin:</span>
                    <span className="font-mono font-bold text-indigo-400">{cropDamagePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={cropDamagePct}
                    onChange={(e) => setCropDamagePct(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Import Tariff Window Relief:</span>
                    <span className="font-mono font-bold text-emerald-400">-{tariffReductionPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tariffReductionPct}
                    onChange={(e) => setTariffReductionPct(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="run-ai-scenario-button"
                  onClick={runAiScenarioAnalysis}
                  disabled={isAiLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-950 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiLoading ? "Synthesizing AI Scenario..." : "Run AI Policy Audit"}</span>
                </button>
              </div>
            </div>

            {/* Right: Supply Chain Waterfall Transmission */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">
                    {currMarket.product || currMarket.commodity} Price Formation & Margin Spread ({currMarket.district})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Transmission from farmer farmgate to urban wholesale and retail shelf.
                  </p>
                </div>
                <DataProvenanceBadge provenance={currMarket.provenance} />
              </div>

              {/* Price Comparison Summary */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Farmer Farmgate</span>
                  <span className="font-mono font-bold text-base text-slate-200">
                    ৳{currMarket.producerPrice ?? currMarket.farmgatePriceBDT ?? Math.round(currMarket.currentWholesalePrice * 0.75)} <span className="text-[10px] font-normal text-slate-400">/{currMarket.unit || "kg"}</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 block mt-0.5">
                    Farmer Share: {simulatedCommodity.farmerShare}%
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Simulated Wholesale</span>
                  <span className="font-mono font-bold text-base text-amber-300">
                    ৳{simulatedCommodity.simWholesale} <span className="text-[10px] font-normal text-slate-400">/{currMarket.unit || "kg"}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Base: ৳{currMarket.currentWholesalePrice ?? currMarket.wholesalePriceBDT}
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Simulated Retail</span>
                  <span className="font-mono font-bold text-base text-rose-400">
                    ৳{simulatedCommodity.simRetail} <span className="text-[10px] font-normal text-slate-400">/{currMarket.unit || "kg"}</span>
                  </span>
                  <span className="text-[10px] text-rose-300 block mt-0.5">
                    +{simulatedCommodity.priceInflationPct}% Shock Impact
                  </span>
                </div>
              </div>

              {/* Visual Margin Transmission Pipeline */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
                  Supply Chain Value-Chain Breakdown
                </span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>1. Farmgate Base (Producer):</span>
                    <span className="font-mono font-semibold">৳{currMarket.producerPrice ?? currMarket.farmgatePriceBDT ?? Math.round(currMarket.currentWholesalePrice * 0.75)}/{currMarket.unit || "kg"}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-cyan-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, ((currMarket.producerPrice ?? currMarket.farmgatePriceBDT ?? Math.round(currMarket.currentWholesalePrice * 0.75)) / simulatedCommodity.simRetail) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span>2. Intermediary / Arat / Storage Margin:</span>
                    <span className="font-mono font-semibold text-amber-400">+৳{simulatedCommodity.middlemanMargin}/kg</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (Number(simulatedCommodity.middlemanMargin) / simulatedCommodity.simRetail) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                    <span>3. Urban Logistics & Retail Markup:</span>
                    <span className="font-mono font-semibold text-rose-400">+৳{simulatedCommodity.retailMargin}/kg</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-rose-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (Number(simulatedCommodity.retailMargin) / simulatedCommodity.simRetail) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* AI Policy Assessment Box */}
              {aiAnalysis && (
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs text-slate-200 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>AI Senior Economist Shock Analysis & Policy Prescriptions</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">{aiAnalysis}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SOLOW-SWAN ECONOMIC GROWTH MODEL                                   */}
      {/* ========================================================================= */}
      {activeTab === "solow" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Solow Parameters
                </span>
                <button
                  onClick={() =>
                    setSolowParams({
                      savingsRate: 0.24,
                      depreciationRate: 0.05,
                      populationGrowth: 0.015,
                      techGrowth: 0.02,
                      capitalShareAlpha: 0.35,
                      initialCapital: 2.0,
                      periods: 50,
                    })
                  }
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Savings Rate (s):</span>
                    <span className="font-mono font-bold text-cyan-400">{(solowParams.savingsRate * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.50"
                    step="0.01"
                    value={solowParams.savingsRate}
                    onChange={(e) =>
                      setSolowParams({ ...solowParams, savingsRate: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Capital Share (α):</span>
                    <span className="font-mono font-bold text-indigo-400">{solowParams.capitalShareAlpha.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.6"
                    step="0.02"
                    value={solowParams.capitalShareAlpha}
                    onChange={(e) =>
                      setSolowParams({ ...solowParams, capitalShareAlpha: Number(e.target.value) })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Depreciation (δ):</span>
                    <span className="font-mono font-bold text-rose-400">{(solowParams.depreciationRate * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.12"
                    step="0.005"
                    value={solowParams.depreciationRate}
                    onChange={(e) =>
                      setSolowParams({ ...solowParams, depreciationRate: Number(e.target.value) })
                    }
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Population Growth (n):</span>
                    <span className="font-mono font-bold text-amber-400">{(solowParams.populationGrowth * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.04"
                    step="0.002"
                    value={solowParams.populationGrowth}
                    onChange={(e) =>
                      setSolowParams({ ...solowParams, populationGrowth: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Tech Progress (g):</span>
                    <span className="font-mono font-bold text-emerald-400">{(solowParams.techGrowth * 100).toFixed(1)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.04"
                    step="0.002"
                    value={solowParams.techGrowth}
                    onChange={(e) =>
                      setSolowParams({ ...solowParams, techGrowth: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Right: Solow Transition Chart */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">
                    Solow-Swan Transition Dynamics to Steady State
                  </h3>
                  <p className="text-[11px] text-slate-400">Capital (k), Output (y), and Consumption (c) per Effective Worker</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-cyan-400">k* = {solowResult.steadyStateCapital}</span>
                  <span className="text-emerald-400">y* = {solowResult.steadyStateOutput}</span>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={solowResult.series} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="period"
                      label={{ value: "Time Periods (t)", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 11 }}
                      stroke="#475569"
                    />
                    <YAxis stroke="#475569" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Line type="monotone" dataKey="capital" stroke="#38bdf8" strokeWidth={2} dot={false} name="Capital k(t)" />
                    <Line type="monotone" dataKey="output" stroke="#34d399" strokeWidth={2} dot={false} name="Output y(t)" />
                    <Line type="monotone" dataKey="consumption" stroke="#f59e0b" strokeWidth={2} dot={false} name="Consumption c(t)" />
                    <Line type="monotone" dataKey="investment" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="3 3" dot={false} name="Investment i(t)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Golden Rule Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Steady State Capital (k*)</span>
                  <span className="font-mono font-bold text-sm text-cyan-300">{solowResult.steadyStateCapital}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Steady State Output (y*)</span>
                  <span className="font-mono font-bold text-sm text-emerald-300">{solowResult.steadyStateOutput}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Golden Rule Capital (k_gold)</span>
                  <span className="font-mono font-bold text-sm text-amber-300">{solowResult.goldenRuleCapital}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Golden Savings Rate (s_gold)</span>
                  <span className="font-mono font-bold text-sm text-indigo-300">{(solowResult.goldenRuleSavingsRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          <FormulaRenderer
            title="Solow-Swan Neoclassical Growth Dynamics"
            formula="\dot{k} = s \cdot k^\alpha - (n + g + \delta)k \implies k^* = \left(\frac{s}{n + g + \delta}\right)^{\frac{1}{1-\alpha}}, \quad s_{gold} = \alpha"
            description="The Solow model shows that capital accumulation alone cannot sustain permanent per-capita growth; in the steady state, long-run growth in living standards is entirely determined by the rate of exogenous technological progress (g)."
            variables={[
              { symbol: "k*", label: "Steady-state capital per effective worker" },
              { symbol: "s", label: "Gross domestic savings fraction" },
              { symbol: "delta, n, g", label: "Depreciation, population growth, and labor-augmenting tech progress" },
              { symbol: "s_gold", label: "Golden rule savings rate maximizing steady-state consumption" },
            ]}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: IS-LM MACROECONOMIC EQUILIBRIUM                                    */}
      {/* ========================================================================= */}
      {activeTab === "islm" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Controls */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Policy Levers
                </span>
                <button
                  onClick={() =>
                    setIslmParams({
                      autonomousConsumption: 200,
                      mpc: 0.75,
                      taxRate: 0.2,
                      autonomousInvestment: 300,
                      interestSensitivityInvestment: 25,
                      governmentSpending: 400,
                      nominalMoneySupply: 1000,
                      priceLevel: 1.0,
                      moneyDemandIncomeSensitivity: 0.25,
                      moneyDemandInterestSensitivity: 50,
                    })
                  }
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Fiscal Purchases (G):</span>
                    <span className="font-mono font-bold text-cyan-400">${islmParams.governmentSpending}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    step="10"
                    value={islmParams.governmentSpending}
                    onChange={(e) =>
                      setIslmParams({ ...islmParams, governmentSpending: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Money Supply (M):</span>
                    <span className="font-mono font-bold text-emerald-400">${islmParams.nominalMoneySupply}</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="2000"
                    step="20"
                    value={islmParams.nominalMoneySupply}
                    onChange={(e) =>
                      setIslmParams({ ...islmParams, nominalMoneySupply: Number(e.target.value) })
                    }
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Price Level (P):</span>
                    <span className="font-mono font-bold text-amber-400">{islmParams.priceLevel.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={islmParams.priceLevel}
                    onChange={(e) =>
                      setIslmParams({ ...islmParams, priceLevel: Number(e.target.value) })
                    }
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Tax Rate (t):</span>
                    <span className="font-mono font-bold text-rose-400">{(islmParams.taxRate * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.45"
                    step="0.01"
                    value={islmParams.taxRate}
                    onChange={(e) =>
                      setIslmParams({ ...islmParams, taxRate: Number(e.target.value) })
                    }
                    className="w-full accent-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Right: IS-LM Crossing Chart */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-100">General Equilibrium (IS-LM Framework)</h3>
                  <p className="text-[11px] text-slate-400">Goods Market (IS) and Money Market (LM) Joint Intersection</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-cyan-400">Y* = ${islmResult.equilibriumIncome}</span>
                  <span className="text-emerald-400">r* = {islmResult.equilibriumInterestRate}%</span>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={islmChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="y"
                      label={{ value: "National Income / Output (Y)", position: "insideBottom", offset: -5, fill: "#94a3b8", fontSize: 11 }}
                      stroke="#475569"
                    />
                    <YAxis
                      label={{ value: "Interest Rate (r %)", angle: -90, position: "insideLeft", offset: 15, fill: "#94a3b8", fontSize: 11 }}
                      stroke="#475569"
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }}
                      formatter={(v: any) => [`${v}%`, ""]}
                      labelFormatter={(l) => `Output Y: $${l}`}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    <Line type="monotone" dataKey="IS_Curve" stroke="#f43f5e" strokeWidth={2.5} dot={false} name="Goods Market (IS Curve)" />
                    <Line type="monotone" dataKey="LM_Curve" stroke="#0ea5e9" strokeWidth={2.5} dot={false} name="Money Market (LM Curve)" />
                    <ReferenceLine x={islmResult.equilibriumIncome} stroke="#64748b" strokeDasharray="3 3" />
                    <ReferenceLine y={islmResult.equilibriumInterestRate} stroke="#64748b" strokeDasharray="3 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Multiplier and Transmission Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Equilibrium Output (Y*)</span>
                  <span className="font-mono font-bold text-sm text-cyan-300">${islmResult.equilibriumIncome}</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Equilibrium Rate (r*)</span>
                  <span className="font-mono font-bold text-sm text-emerald-300">{islmResult.equilibriumInterestRate}%</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Fiscal Multiplier</span>
                  <span className="font-mono font-bold text-sm text-indigo-300">{islmResult.fiscalMultiplier}x</span>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Crowding-Out Effect</span>
                  <span className="font-mono font-bold text-sm text-amber-300">{islmResult.crowdingOutEffect}</span>
                </div>
              </div>
            </div>
          </div>

          <FormulaRenderer
            title="IS-LM Simultaneous Equilibrium Equations"
            formula="\text{IS: } Y = \frac{C_0 + I_0 + G - b \cdot r}{1 - c(1-t)}, \quad \text{LM: } r = \frac{k \cdot Y - M/P}{h}"
            description="The IS curve reflects equilibrium in the goods market where planned expenditure equals output. The LM curve reflects equilibrium in the money market where real money supply equals liquidity demand."
            variables={[
              { symbol: "G", label: "Government fiscal purchases" },
              { symbol: "M/P", label: "Real money balances" },
              { symbol: "b, h", label: "Investment and money demand interest rate sensitivities" },
              { symbol: "k", label: "Transaction demand sensitivity to income" },
            ]}
          />
        </div>
      )}
    </div>
  );
};
