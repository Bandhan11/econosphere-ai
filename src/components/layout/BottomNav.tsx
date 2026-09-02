import React from "react";
import {
  LayoutDashboard,
  Globe,
  Bot,
  TrendingUp,
  Layers,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isMobileNavOpen, setIsMobileNavOpen } = useApp();

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#111215]/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 flex items-center justify-around text-xs select-none safe-area-pb"
    >
      {/* 1. Overview / Home */}
      <button
        id="bottom-nav-home"
        onClick={() => {
          setActiveTab("home");
          setIsMobileNavOpen(false);
        }}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 transition-colors ${
          activeTab === "home" && !isMobileNavOpen
            ? "text-red-500 font-semibold"
            : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <LayoutDashboard className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] tracking-tight">Overview</span>
      </button>

      {/* 2. Global Economy */}
      <button
        id="bottom-nav-economy"
        onClick={() => {
          setActiveTab("economy");
          setIsMobileNavOpen(false);
        }}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 transition-colors ${
          activeTab === "economy" && !isMobileNavOpen
            ? "text-red-500 font-semibold"
            : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <Globe className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] tracking-tight">Economy</span>
      </button>

      {/* 3. AI Economist (Prominent) */}
      <button
        id="bottom-nav-ai"
        onClick={() => {
          setActiveTab("aiEconomist");
          setIsMobileNavOpen(false);
        }}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 transition-colors ${
          activeTab === "aiEconomist" && !isMobileNavOpen
            ? "text-red-500 font-semibold"
            : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <div className="relative">
          <Bot className="w-4 h-4 mb-0.5" />
          <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        </div>
        <span className="text-[10px] tracking-tight">AI Economist</span>
      </button>

      {/* 4. Financial Markets */}
      <button
        id="bottom-nav-markets"
        onClick={() => {
          setActiveTab("markets");
          setIsMobileNavOpen(false);
        }}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 transition-colors ${
          activeTab === "markets" && !isMobileNavOpen
            ? "text-red-500 font-semibold"
            : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <TrendingUp className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] tracking-tight">Markets</span>
      </button>

      {/* 5. More Exhibits & Labs Drawer Toggle */}
      <button
        id="bottom-nav-more"
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] px-2 py-1 transition-colors ${
          isMobileNavOpen ||
          ![
            "home",
            "economy",
            "aiEconomist",
            "markets",
          ].includes(activeTab)
            ? "text-red-500 font-semibold"
            : "text-neutral-400 hover:text-neutral-200"
        }`}
      >
        <Layers className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] tracking-tight">All Sections</span>
      </button>
    </nav>
  );
};
