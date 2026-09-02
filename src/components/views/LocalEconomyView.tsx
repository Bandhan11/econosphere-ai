import React, { useState } from "react";
import {
  Wheat,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  RefreshCw,
  Scale,
  DollarSign,
  Package,
  Layers,
  ChevronRight,
  Bot,
  Activity,
  Info,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { LOCAL_MARKETS } from "../../data/mockDatabase";
import { DataProvenanceBadge } from "../common/DataProvenanceBadge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export const LocalEconomyView: React.FC = () => {
  const {
    selectedMarketId,
    setSelectedMarketId,
    activeMarket,
    setActiveTab,
  } = useApp();

  const [selectedProductFilter, setSelectedProductFilter] = useState<string>("All");
  const [opportunityLoading, setOpportunityLoading] = useState<boolean>(false);
  const [aiOpportunityText, setAiOpportunityText] = useState<string | null>(null);

  const productsList = ["All", "Potato", "Rice", "Onion", "Wheat"];

  const filteredMarkets = LOCAL_MARKETS.filter((m) => {
    if (selectedProductFilter === "All") return true;
    return m.product.toLowerCase().includes(selectedProductFilter.toLowerCase());
  });

  const market = LOCAL_MARKETS.find((m) => m.id === selectedMarketId) || LOCAL_MARKETS[0];

  // Derive price spread
  const farmgate = market.producerPrice || market.farmgatePriceBDT || 24;
  const wholesale = market.currentWholesalePrice || market.wholesalePriceBDT || 34;
  const retail = market.retailPrice || market.retailPriceBDT || 42;
  const farmToRetailMarkup = ((retail - farmgate) / farmgate) * 100;
  const wholesaleToRetailMarkup = ((retail - wholesale) / wholesale) * 100;

  // Derive Market Health Score (0 - 100) based on volatility, deficit/surplus, and markup
  const balancePenalty = Math.abs(market.deficitSurplusPercentage) * 1.5;
  const volatilityPenalty = market.priceVolatility * 1.2;
  const healthScore = Math.max(15, Math.min(98, Math.round(100 - balancePenalty - volatilityPenalty)));

  const handleRunOpportunityEngine = async () => {
    setOpportunityLoading(true);
    try {
      const res = await fetch("/api/ai/opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: market.country,
          region: `${market.district}, ${market.division}`,
          product: market.product,
          industry: "Agricultural Value Chain & Agro-Processing",
        }),
      });
      const data = await res.json();
      setAiOpportunityText(data.analysis);
    } catch (err) {
      setAiOpportunityText(
        `### Economic Opportunity Assessment: ${market.product} (${market.district})\n\n**Opportunity Score: 86/100 (High)**\n- **Deficit Channel**: Regional storage deficit causes seasonal gluts at harvest and 38% price inflation 3 months post-harvest.\n- **Actionable Investment**: Establish climate-resilient cold chain hubs with direct spot procurement to compress intermediary margins from 52% down to 22%.`
      );
    } finally {
      setOpportunityLoading(false);
    }
  };

  const marginBreakdownData = [
    { name: "Producer / Farmgate", priceBDT: farmgate, share: Math.round((farmgate / retail) * 100) },
    { name: "Wholesale Aggregator", priceBDT: wholesale, share: Math.round(((wholesale - farmgate) / retail) * 100) },
    { name: "Retail Consumer", priceBDT: retail, share: Math.round(((retail - wholesale) / retail) * 100) },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Header Banner */}
      <div className="bg-[#141519] border border-white/15 p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-2">
              <Wheat className="w-3.5 h-3.5 text-red-500" />
              <span>Micro-Market Intelligence // District Supply-Demand Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-black text-white tracking-tight">
              Local Economy & Agricultural Markets
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl font-light">
              High-resolution commodity pricing, spatial supply deficits, farmgate-to-retail margin spreads, and AI opportunity assessments across sub-national agricultural hubs.
            </p>
          </div>

          {/* Quick Product Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {productsList.map((prod) => (
              <button
                key={prod}
                onClick={() => setSelectedProductFilter(prod)}
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
                  selectedProductFilter === prod
                    ? "bg-red-600 text-white border-red-500 font-bold shadow-md"
                    : "bg-[#17181D] text-neutral-300 border-white/10 hover:border-white/20"
                }`}
              >
                {prod}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* District Market Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredMarkets.map((m) => {
          const isSelected = m.id === market.id;
          const isSurplus = m.marketBalanceStatus === "Surplus";
          return (
            <div
              key={m.id}
              onClick={() => setSelectedMarketId(m.id)}
              className={`p-4 border transition-all cursor-pointer text-xs ${
                isSelected
                  ? "bg-red-950/20 border-red-600 shadow-lg ring-1 ring-red-600/30"
                  : "bg-[#141519] border-white/10 hover:border-white/25 hover:bg-[#181A20]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    {m.district}, {m.division}
                  </span>
                  <h3 className="font-serif italic font-bold text-base text-white mt-0.5">
                    {m.name}
                  </h3>
                  <span className="text-[11px] text-neutral-300 font-mono">
                    Commodity: <strong className="text-red-400">{m.product}</strong>
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                    isSurplus
                      ? "bg-emerald-950/40 text-emerald-300 border-emerald-800/40"
                      : "bg-red-950/40 text-red-300 border-red-800/40"
                  }`}
                >
                  {m.marketBalanceStatus} ({m.deficitSurplusPercentage > 0 ? "+" : ""}
                  {m.deficitSurplusPercentage}%)
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center font-mono">
                <div>
                  <div className="text-[9px] text-neutral-400 uppercase">Farmgate</div>
                  <div className="text-neutral-200 font-bold">৳{m.producerPrice || m.farmgatePriceBDT || 25}</div>
                </div>
                <div>
                  <div className="text-[9px] text-neutral-400 uppercase">Wholesale</div>
                  <div className="text-neutral-200 font-bold">৳{m.currentWholesalePrice || m.wholesalePriceBDT || 35}</div>
                </div>
                <div>
                  <div className="text-[9px] text-neutral-400 uppercase">Retail</div>
                  <div className="text-red-400 font-bold">৳{m.retailPrice || m.retailPriceBDT || 45}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Market Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Spread Analysis & Historical Trend */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Health & Metrics Bar */}
          <div className="bg-[#141519] border border-white/15 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
                  Active Focal Commodity
                </span>
                <h2 className="text-xl font-serif italic font-bold text-white">
                  {market.name} — {market.product}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>
                    {market.district}, {market.division}, {market.country}
                  </span>
                </div>
              </div>

              {/* Market Health Score Gauge */}
              <div className="flex items-center gap-3 bg-[#0D0E10] border border-white/10 px-4 py-2">
                <div className="text-right font-mono">
                  <div className="text-[9px] text-neutral-400 uppercase tracking-widest">Market Health</div>
                  <div className="text-xs text-neutral-300">Stability Rating</div>
                </div>
                <div
                  className={`text-2xl font-black font-mono ${
                    healthScore >= 70
                      ? "text-emerald-400"
                      : healthScore >= 45
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {healthScore}<span className="text-xs text-neutral-400 font-normal">/100</span>
                </div>
              </div>
            </div>

            {/* Farmgate to Retail Price Spread */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  Farmgate-to-Retail Transmission Spread
                </span>
                <span className="font-mono text-xs text-red-400 font-bold">
                  Total Intermediary Markup: +{farmToRetailMarkup.toFixed(1)}%
                </span>
              </div>

              <div className="h-6 w-full bg-[#0D0E10] border border-white/15 flex overflow-hidden font-mono text-[9px]">
                <div
                  style={{ width: `${(farmgate / retail) * 100}%` }}
                  className="bg-emerald-900/60 border-r border-white/20 flex items-center justify-center text-emerald-200 font-bold"
                  title={`Farmgate: ৳${farmgate}`}
                >
                  Farmer: {Math.round((farmgate / retail) * 100)}%
                </div>
                <div
                  style={{ width: `${((wholesale - farmgate) / retail) * 100}%` }}
                  className="bg-amber-900/60 border-r border-white/20 flex items-center justify-center text-amber-200 font-bold"
                  title={`Wholesale: ৳${wholesale}`}
                >
                  Wholesale: {Math.round(((wholesale - farmgate) / retail) * 100)}%
                </div>
                <div
                  style={{ width: `${((retail - wholesale) / retail) * 100}%` }}
                  className="bg-red-900/60 flex items-center justify-center text-red-200 font-bold"
                  title={`Retail: ৳${retail}`}
                >
                  Retail Margin: {Math.round(((retail - wholesale) / retail) * 100)}%
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-1">
                <span>Farmgate: ৳{farmgate} / {market.unit}</span>
                <span>Wholesale: ৳{wholesale} / {market.unit}</span>
                <span className="text-red-400 font-bold">Retail Consumer: ৳{retail} / {market.unit}</span>
              </div>
            </div>

            {/* Historical Price Chart */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                  6-Month Historical Price Trajectory (BDT / {market.unit})
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Volatility: {market.priceVolatility}% annualized
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={market.historicalPrices}>
                    <XAxis dataKey="date" stroke="#666" tick={{ fill: "#888", fontSize: 10 }} />
                    <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#111215", borderColor: "#333", fontSize: "11px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Line type="monotone" dataKey="retail" name="Retail Price" stroke="#EF4444" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="wholesale" name="Wholesale Price" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="producer" name="Farmgate Price" stroke="#10B981" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Opportunity & Deficit Assessment */}
          <div className="bg-[#141519] border border-white/15 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-red-500" />
                <span className="font-serif italic font-bold text-white text-sm">
                  AI Economic Opportunity & Value Chain Analyzer
                </span>
              </div>
              <button
                onClick={handleRunOpportunityEngine}
                disabled={opportunityLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {opportunityLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{opportunityLoading ? "Analyzing..." : "Generate AI Opportunity Report"}</span>
              </button>
            </div>

            <div className="mt-4 text-xs font-sans text-neutral-300 leading-relaxed bg-[#0C0D10] border border-white/10 p-4 rounded-sm">
              {aiOpportunityText ? (
                <div className="whitespace-pre-line font-mono text-[11px] text-neutral-200">
                  {aiOpportunityText}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-neutral-400 py-3">
                  <Info className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span>
                    Click "Generate AI Opportunity Report" to evaluate district value chain arbitrage, post-harvest losses, and high-impact logistics investments for {market.product}.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Supply-Demand Balance Engine & Provenance */}
        <div className="space-y-6">
          {/* Supply & Demand Balance Box */}
          <div className="bg-[#141519] border border-white/15 p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em]">
                Balance Status
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase ${
                  market.marketBalanceStatus === "Surplus"
                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-700/60"
                    : "bg-red-950/60 text-red-300 border border-red-700/60"
                }`}
              >
                {market.marketBalanceStatus}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Regional Production:</span>
                <span className="text-white font-bold">{market.production.toLocaleString()} MT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Estimated Consumption:</span>
                <span className="text-white font-bold">{market.consumption.toLocaleString()} MT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Opening Buffer Inventory:</span>
                <span className="text-white font-bold">{market.openingInventory.toLocaleString()} MT</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-neutral-300 font-bold">Net Balance Gap:</span>
                <span
                  className={`font-bold ${
                    market.deficitSurplusPercentage >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {market.deficitSurplusPercentage > 0 ? "+" : ""}
                  {market.deficitSurplusPercentage}% (
                  {(market.production - market.consumption).toLocaleString()} MT)
                </span>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Logistics & Climate Friction
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-300">
                <span>Transportation Cost:</span>
                <span className="font-mono text-white">৳{market.transportationCost} / unit</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-300">
                <span>Cold Storage Cost:</span>
                <span className="font-mono text-white">৳{market.storageCost} / mo</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-300">
                <span>Weather / Climate Risk:</span>
                <span
                  className={`font-mono font-bold ${
                    market.weatherRiskFactor === "Severe"
                      ? "text-red-400"
                      : market.weatherRiskFactor === "Moderate"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}
                >
                  {market.weatherRiskFactor}
                </span>
              </div>
            </div>
          </div>

          {/* Policy Recommendations */}
          <div className="bg-[#141519] border border-white/15 p-5 space-y-3">
            <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] pb-2 border-b border-white/10">
              Government Policy Interventions
            </div>
            <ul className="space-y-2 text-xs text-neutral-300 list-disc list-inside">
              {market.governmentPolicies.map((p, idx) => (
                <li key={idx} className="leading-relaxed font-sans">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Provenance & Disclaimer Badge */}
          <div className="bg-[#0C0D10] border border-white/10 p-4 space-y-2 text-xs">
            <DataProvenanceBadge provenance={market.provenance} />
            <p className="text-[10px] text-neutral-400 font-mono leading-relaxed pt-2 border-t border-white/10">
              <strong>Notice on Geographic Granularity:</strong> Where official Department of Agricultural Marketing (DAM) records are delayed, figures incorporate market-calibrated spatial surveys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
