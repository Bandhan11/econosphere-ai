import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { FINANCIAL_INSTRUMENTS } from "../../data/mockDatabase";
import { DataProvenanceBadge } from "../common/DataProvenanceBadge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const MarketsView: React.FC = () => {
  const { selectedTicker, setSelectedTicker, activeInstrument } = useApp();
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y" | "5Y">("1M");

  const assetClasses = [
    { id: "all", label: "All Assets" },
    { id: "Equity Index", label: "Equities & Indices" },
    { id: "Commodity", label: "Commodities" },
    { id: "Forex", label: "Currencies (FX)" },
    { id: "Sovereign Bond", label: "Fixed Income & Yields" },
  ];

  const filteredInstruments =
    selectedAssetClass === "all"
      ? FINANCIAL_INSTRUMENTS
      : FINANCIAL_INSTRUMENTS.filter((i) => 
          i.type === selectedAssetClass || 
          i.assetClass === selectedAssetClass ||
          (selectedAssetClass === "Equity Index" && (i.type === "Index" || i.type === "Stock")) ||
          (selectedAssetClass === "Sovereign Bond" && (i.type === "Bond"))
        );

  // Generate synthetic chart data based on active instrument
  const chartData = [
    { date: "Day 1", price: activeInstrument.price * 0.96 },
    { date: "Day 5", price: activeInstrument.price * 0.975 },
    { date: "Day 10", price: activeInstrument.price * 0.95 },
    { date: "Day 15", price: activeInstrument.price * 0.98 },
    { date: "Day 20", price: activeInstrument.price * 0.99 },
    { date: "Day 25", price: activeInstrument.price * 1.01 },
    { date: "Day 30", price: activeInstrument.price },
  ];

  const isPositive = activeInstrument.change >= 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Global Financial Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Markets & <span className="text-cyan-400">Assets</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time equity indices (DSEX, S&P 500), raw commodities, foreign exchange crosses (USD/BDT), and sovereign bond yield curves.
          </p>
        </div>

        {/* Asset Filter Bar */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {assetClasses.map((ac) => (
            <button
              key={ac.id}
              onClick={() => setSelectedAssetClass(ac.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedAssetClass === ac.id
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-950"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {ac.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Terminal Grid: Active Asset Chart + Asset List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Asset Deep-Dive */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Asset Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-extrabold text-xl text-white">
                    {activeInstrument.ticker}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {activeInstrument.assetClass}
                  </span>
                  <span className="text-xs text-slate-400">({activeInstrument.exchange})</span>
                </div>
                <div className="text-xs text-slate-400">{activeInstrument.name}</div>
              </div>

              {/* Price & Change */}
              <div className="text-left sm:text-right">
                <div className="font-mono font-extrabold text-2xl text-slate-100">
                  {activeInstrument.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`inline-flex items-center text-xs font-mono font-bold ${
                    isPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                  {isPositive ? "+" : ""}
                  {activeInstrument.change.toFixed(2)} ({isPositive ? "+" : ""}
                  {activeInstrument.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Interactive Price Action</span>
              <div className="flex gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
                {(["1D", "1W", "1M", "1Y", "5Y"] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded ${
                      timeframe === tf ? "bg-slate-800 text-cyan-300 font-bold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Price Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={isPositive ? "#10b981" : "#f43f5e"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#475569" fontSize={11} />
                  <YAxis stroke="#475569" fontSize={11} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }}
                    formatter={(val: any) => [`${Number(val).toFixed(2)}`, "Price"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPositive ? "#10b981" : "#f43f5e"}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#priceGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Instrument Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">52-Week High</span>
                <span className="font-bold text-slate-200">{(activeInstrument.price * 1.15).toFixed(2)}</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">52-Week Low</span>
                <span className="font-bold text-slate-200">{(activeInstrument.price * 0.82).toFixed(2)}</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">20-Day Volatility</span>
                <span className="font-bold text-cyan-400">14.2%</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Exchange Status</span>
                <span className="font-bold text-emerald-400">OPEN / TRADING</span>
              </div>
            </div>

            {/* Provenance Footer */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <DataProvenanceBadge provenance={activeInstrument.provenance} />
              <span className="text-[11px] text-slate-400 font-mono">
                Latency: {activeInstrument.label}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: All Instruments List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Market Watchlist ({filteredInstruments.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {filteredInstruments.map((item) => {
              const isSelected = item.ticker === selectedTicker;
              const isItemPos = item.change >= 0;
              return (
                <button
                  key={item.ticker}
                  onClick={() => setSelectedTicker(item.ticker)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-cyan-950/70 border-cyan-800/80 text-cyan-200 shadow"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white">{item.ticker}</span>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        isItemPos ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isItemPos ? "+" : ""}
                      {item.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{item.name}</div>
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/60 text-[11px] font-mono">
                    <span className="text-slate-300">
                      {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-slate-400">{item.exchange}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
