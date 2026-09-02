import React, { useState } from "react";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Scale,
  DollarSign,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  Globe,
  FileSpreadsheet,
} from "lucide-react";
import { BilateralTradePair } from "../../types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const BILATERAL_PAIRS: BilateralTradePair[] = [
  {
    id: "bd-in",
    countryA: "Bangladesh",
    countryB: "India",
    bilateralVolumeUSD: 14.8,
    countryAExportsUSD: 1.98,
    countryAImportsUSD: 12.82,
    tradeBalanceUSD: -10.84, // Bangladesh deficit
    topExportProducts: [
      { product: "Ready-Made Garments & Knitted Apparel", share: 44.2 },
      { product: "Jute & Jute Goods", share: 18.5 },
      { product: "Raw Hides, Skins & Leather", share: 9.3 },
      { product: "Processed Foods & Bakery", share: 6.8 },
      { product: "Cotton Waste & Recycled Fiber", share: 5.4 },
    ],
    topImportProducts: [
      { product: "Raw Cotton & Yarn", share: 32.6 },
      { product: "Cereals (Wheat, Rice, Maize)", share: 18.4 },
      { product: "Petroleum Oils & Electricity", share: 14.2 },
      { product: "Machinery & Nuclear Reactors", share: 9.1 },
      { product: "Organic Chemicals & Dyes", share: 7.5 },
    ],
    averageTariff: 8.4,
    tradeAgreement: "SAFTA (South Asian Free Trade Area) & Bilateral CEPA Negotiations",
    dependencyScore: 78,
  },
  {
    id: "bd-cn",
    countryA: "Bangladesh",
    countryB: "China",
    bilateralVolumeUSD: 24.2,
    countryAExportsUSD: 0.94,
    countryAImportsUSD: 23.26,
    tradeBalanceUSD: -22.32,
    topExportProducts: [
      { product: "Apparel & Clothing Accessories", share: 38.0 },
      { product: "Jute Yarns & Cordage", share: 22.4 },
      { product: "Crustaceans & Frozen Fish", share: 12.6 },
      { product: "Leather Goods", share: 8.5 },
      { product: "Plastic & Rubber Waste", share: 5.1 },
    ],
    topImportProducts: [
      { product: "Textile Fabrics & Industrial Yarn", share: 36.5 },
      { product: "Electronics & Telecommunications", share: 21.0 },
      { product: "Heavy Industrial Machinery", share: 18.2 },
      { product: "Iron, Steel & Metals", share: 9.4 },
      { product: "Fertilizer & Chemicals", share: 6.8 },
    ],
    averageTariff: 6.2,
    tradeAgreement: "Duty-Free Treatment for 98% Tariff Lines under LDC Scheme",
    dependencyScore: 88,
  },
  {
    id: "bd-us",
    countryA: "Bangladesh",
    countryB: "United States",
    bilateralVolumeUSD: 11.5,
    countryAExportsUSD: 8.7,
    countryAImportsUSD: 2.8,
    tradeBalanceUSD: 5.9, // Bangladesh surplus
    topExportProducts: [
      { product: "Woven Apparel (Cotton & Synthetic)", share: 58.2 },
      { product: "Knitwear & T-Shirts", share: 29.4 },
      { product: "Headgear & Caps", share: 4.1 },
      { product: "Footwear & Leather", share: 3.2 },
      { product: "Home Textiles", share: 2.5 },
    ],
    topImportProducts: [
      { product: "Raw Cotton (Pima & Upland)", share: 38.4 },
      { product: "Soybeans & Oilseeds", share: 24.6 },
      { product: "Scrap Iron & Steel", share: 14.1 },
      { product: "Aviation & Turbojets", share: 8.5 },
      { product: "Medical Devices & Pharma", share: 6.2 },
    ],
    averageTariff: 15.6, // MFN rate in US
    tradeAgreement: "TICFA (Trade and Investment Cooperation Forum Agreement)",
    dependencyScore: 64,
  },
  {
    id: "bd-vn",
    countryA: "Bangladesh",
    countryB: "Vietnam",
    bilateralVolumeUSD: 1.45,
    countryAExportsUSD: 0.12,
    countryAImportsUSD: 1.33,
    tradeBalanceUSD: -1.21,
    topExportProducts: [
      { product: "Pharmaceutical Formulations", share: 41.2 },
      { product: "Jute Fiber", share: 28.5 },
      { product: "Leather & Footwear Uppers", share: 14.3 },
      { product: "Textile Chemicals", share: 8.1 },
      { product: "Fish & Aquatic Invertebrates", share: 4.2 },
    ],
    topImportProducts: [
      { product: "Parboiled & White Rice", share: 34.2 },
      { product: "Cellular Telephones & Parts", share: 26.5 },
      { product: "Synthetic Fibers & Filament", share: 16.8 },
      { product: "Rubber & Plastics", share: 11.4 },
      { product: "Industrial Chemicals", share: 6.2 },
    ],
    averageTariff: 9.8,
    tradeAgreement: "Joint Trade Commission (Bilateral Framework)",
    dependencyScore: 42,
  },
  {
    id: "us-cn",
    countryA: "United States",
    countryB: "China",
    bilateralVolumeUSD: 575.4,
    countryAExportsUSD: 147.8,
    countryAImportsUSD: 427.6,
    tradeBalanceUSD: -279.8,
    topExportProducts: [
      { product: "Agricultural Products (Soybeans, Corn)", share: 24.2 },
      { product: "Semiconductors & Electronic Components", share: 18.5 },
      { product: "Civilian Aircraft & Engines", share: 12.4 },
      { product: "Pharmaceuticals & Biotechnology", share: 8.9 },
      { product: "Crude Petroleum & LNG", share: 7.6 },
    ],
    topImportProducts: [
      { product: "Consumer Electronics & Computers", share: 28.6 },
      { product: "Industrial Machinery & Tools", share: 19.4 },
      { product: "Furniture & Home Goods", share: 9.2 },
      { product: "Toys, Sports Equipment & Games", share: 8.5 },
      { product: "Automotive Parts & Lithium Batteries", share: 7.8 },
    ],
    averageTariff: 19.3, // Section 301 tariffs
    tradeAgreement: "US-China Phase One Economic and Trade Agreement (2020)",
    dependencyScore: 72,
  },
];

const COLORS = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

export const TradeView: React.FC = () => {
  const [selectedPairId, setSelectedPairId] = useState<string>("bd-in");

  const pair = BILATERAL_PAIRS.find((p) => p.id === selectedPairId) || BILATERAL_PAIRS[0];

  const tradeFlowData = [
    { name: `${pair.countryA} Exports`, value: pair.countryAExportsUSD },
    { name: `${pair.countryA} Imports`, value: pair.countryAImportsUSD },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#141519] border border-white/15 p-6 shadow-2xl relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px] uppercase tracking-[0.25em] mb-2">
              <ArrowLeftRight className="w-3.5 h-3.5 text-red-500" />
              <span>Global Commerce & Tariff Exposure Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-black text-white tracking-tight">
              Bilateral Trade Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl font-light">
              Granular bilateral trade balances, export concentrations, tariff vulnerabilities, and supply chain dependencies across sovereign trade corridors.
            </p>
          </div>

          {/* Trade Corridors Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {BILATERAL_PAIRS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPairId(p.id)}
                className={`px-3 py-2 text-xs font-mono uppercase tracking-wider border whitespace-nowrap transition-colors ${
                  selectedPairId === p.id
                    ? "bg-red-600 text-white border-red-500 font-bold shadow-md"
                    : "bg-[#17181D] text-neutral-300 border-white/10 hover:border-white/20"
                }`}
              >
                {p.countryA} ↔ {p.countryB}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Trade Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#141519] border border-white/10 p-4">
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest">Total Bilateral Volume</div>
          <div className="text-2xl font-bold text-white mt-1">${pair.bilateralVolumeUSD}B</div>
          <div className="text-[10px] text-neutral-400 mt-1">Annual 2-way goods turnover</div>
        </div>

        <div className="bg-[#141519] border border-white/10 p-4">
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest">{pair.countryA} Exports</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">${pair.countryAExportsUSD}B</div>
          <div className="text-[10px] text-neutral-400 mt-1">FOB valuation</div>
        </div>

        <div className="bg-[#141519] border border-white/10 p-4">
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest">{pair.countryA} Imports</div>
          <div className="text-2xl font-bold text-red-400 mt-1">${pair.countryAImportsUSD}B</div>
          <div className="text-[10px] text-neutral-400 mt-1">CIF valuation</div>
        </div>

        <div className="bg-[#141519] border border-white/10 p-4">
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest">Net Trade Balance</div>
          <div
            className={`text-2xl font-bold mt-1 ${
              pair.tradeBalanceUSD >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {pair.tradeBalanceUSD > 0 ? "+" : ""}${pair.tradeBalanceUSD}B
          </div>
          <div className="text-[10px] text-neutral-400 mt-1">
            {pair.tradeBalanceUSD >= 0 ? "Trade Surplus" : "Trade Deficit"}
          </div>
        </div>
      </div>

      {/* Bilateral Trade Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Export Products */}
        <div className="bg-[#141519] border border-white/15 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                Export Composition
              </span>
              <h3 className="font-serif italic font-bold text-white text-base">
                What {pair.countryA} Exports to {pair.countryB}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              ${pair.countryAExportsUSD}B Total
            </span>
          </div>

          <div className="space-y-3">
            {pair.topExportProducts.map((p, idx) => (
              <div key={p.product} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-200 truncate pr-2">{p.product}</span>
                  <span className="font-mono text-emerald-400 font-bold">{p.share}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0C0D10] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${p.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-neutral-400 font-sans leading-relaxed">
            <strong>Concentration Risk:</strong> Top 2 export categories comprise over{" "}
            {Math.round(pair.topExportProducts[0].share + pair.topExportProducts[1].share)}% of total corridor outbound volume.
          </div>
        </div>

        {/* Right: Top Import Products */}
        <div className="bg-[#141519] border border-white/15 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                Import Composition
              </span>
              <h3 className="font-serif italic font-bold text-white text-base">
                What {pair.countryA} Imports from {pair.countryB}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-red-400">
              ${pair.countryAImportsUSD}B Total
            </span>
          </div>

          <div className="space-y-3">
            {pair.topImportProducts.map((p, idx) => (
              <div key={p.product} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-200 truncate pr-2">{p.product}</span>
                  <span className="font-mono text-red-400 font-bold">{p.share}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#0C0D10] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${p.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 text-[11px] text-neutral-400 font-sans leading-relaxed">
            <strong>Supply Vulnerability:</strong> Essential industrial inputs and primary commodities account for{" "}
            {Math.round(pair.topImportProducts[0].share + pair.topImportProducts[1].share)}% of inbound corridor shipments.
          </div>
        </div>
      </div>

      {/* Corridor Policy & Tariff Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
        <div className="bg-[#141519] border border-white/10 p-5 space-y-2">
          <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
            Corridor Trade Framework
          </div>
          <div className="font-serif italic text-white text-sm font-bold">
            {pair.tradeAgreement}
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed pt-1">
            Governs rules of origin, preferential access lines, and bilateral dispute mechanisms.
          </p>
        </div>

        <div className="bg-[#141519] border border-white/10 p-5 space-y-2">
          <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
            Weighted Average Tariff Rate
          </div>
          <div className="font-mono text-2xl font-bold text-amber-400">
            {pair.averageTariff}%
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed pt-1">
            Effective applied ad valorem rate, including non-tariff measures (NTMs) and inspection surcharges.
          </p>
        </div>

        <div className="bg-[#141519] border border-white/10 p-5 space-y-2">
          <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
            Corridor Dependency Index
          </div>
          <div className="font-mono text-2xl font-bold text-red-500">
            {pair.dependencyScore} <span className="text-xs text-neutral-400">/ 100</span>
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed pt-1">
            {pair.dependencyScore > 75
              ? "High systemic dependency. Supply shocks in this corridor rapidly transmit to domestic headline CPI."
              : "Moderate dependency with alternative import substitution channels available."}
          </p>
        </div>
      </div>
    </div>
  );
};
