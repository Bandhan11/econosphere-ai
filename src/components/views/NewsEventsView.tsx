import React, { useState } from "react";
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Globe,
  Clock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const NewsEventsView: React.FC = () => {
  const { navigateToMarket, navigateToCountry } = useApp();
  const [selectedNewsId, setSelectedNewsId] = useState<string>("news-1");

  const newsItems = [
    {
      id: "news-1",
      title: "Bangladesh Bank Tightens Monetary Policy with 50 bps Repo Rate Hike to 9.50%",
      date: "Today, 10:30 AM",
      category: "Monetary Policy",
      region: "Bangladesh",
      impact: "High",
      sentiment: "Bearish (Short-Term Liquidity)",
      summary:
        "The Monetary Policy Committee voted to raise the benchmark repo rate by 50 basis points to combat lingering headline and food inflation, reinforcing contractionary transmission.",
      transmission:
        "Higher cost of borrowing for commercial banks → Tightened private sector credit growth → Reduced aggregate demand pressure on non-food CPI.",
      linkedMarket: "mkt-rangpur-potato",
    },
    {
      id: "news-2",
      title: "Global Brent Crude Stabilizes Around $78/bbl Amid OPEC+ Quota Discipline",
      date: "Today, 08:15 AM",
      category: "Commodities",
      region: "Global",
      impact: "Moderate",
      sentiment: "Neutral",
      summary:
        "Crude oil prices held steady following OPEC+ confirmation of extended voluntary production curbs into Q4 2026, anchoring international energy import bills.",
      transmission:
        "Stable diesel and fuel import parity prices → Caps domestic transport logistics inflation in emerging economies.",
      linkedMarket: "mkt-dinajpur-rice",
    },
    {
      id: "news-3",
      title: "Agricultural Task Force Launches Nationwide Cold Storage Audits in Northern Districts",
      date: "Yesterday, 04:45 PM",
      category: "Market Regulation",
      region: "Rangpur / Rajshahi",
      impact: "High",
      sentiment: "Bullish for Consumers",
      summary:
        "Joint inspections across 45 potato cold storage facilities in Rangpur and Bogura seek to curb artificial stock hoarding and verify wholesale price alignment.",
      transmission:
        "Forced release of withheld inventories → Expands available short-run supply curve → Downward pressure on retail margins.",
      linkedMarket: "mkt-rangpur-potato",
    },
  ];

  const activeNews = newsItems.find((n) => n.id === selectedNewsId) || newsItems[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4" />
            <span>Economic Intelligence & Event Wire</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live News & <span className="text-cyan-400">Impact Propagation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time economic developments mapped directly to supply-demand curves, commodity prices, and macro transmission channels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Feed List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Breaking Economic Wire ({newsItems.length})
          </span>

          {newsItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedNewsId(item.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                selectedNewsId === item.id
                  ? "bg-cyan-950/70 border-cyan-800/80 text-cyan-200 shadow"
                  : "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan-400 font-bold">{item.category}</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.date}
                </span>
              </div>
              <h2 className="font-bold text-xs text-slate-100 mt-1.5 leading-snug">{item.title}</h2>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[10px]">
                <span className="text-slate-400">{item.region}</span>
                <span className="px-1.5 py-0.2 rounded font-mono bg-slate-800 text-amber-300">
                  Impact: {item.impact}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Impact Deep Dive Panel */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/40">
                {activeNews.category} | {activeNews.region}
              </span>
              <h3 className="text-base font-bold text-white mt-2 leading-snug">{activeNews.title}</h3>
              <span className="text-[11px] text-slate-400 mt-0.5 block">{activeNews.date}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Event Summary:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {activeNews.summary}
            </p>
          </div>

          {/* Cascading Economic Transmission */}
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Causal Transmission Mechanism & Market Propagation</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-mono">
              {activeNews.transmission}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => navigateToMarket(activeNews.linkedMarket)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <span>Simulate Shock in Commodity Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
