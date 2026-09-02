import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  FlaskConical,
  TrendingUp,
  Globe,
  Building2,
  BookOpen,
  History,
  LineChart,
  Sliders,
  Bot,
  Users2,
  Database,
  Newspaper,
  Trophy,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useApp, NavSection } from "../../context/AppContext";

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const navItems: { id: NavSection; label: string; icon: React.ReactNode; tag?: string }[] = [
    { id: "home", label: t.nav.home, icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "learn", label: t.nav.learn, icon: <GraduationCap className="w-4 h-4" />, tag: "Theory" },
    { id: "simulate", label: t.nav.simulate, icon: <FlaskConical className="w-4 h-4" />, tag: "Lab" },
    { id: "markets", label: t.nav.markets, icon: <TrendingUp className="w-4 h-4" />, tag: "Live" },
    { id: "economy", label: t.nav.economy, icon: <Globe className="w-4 h-4" />, tag: "Macro" },
    { id: "companies", label: t.nav.companies, icon: <Building2 className="w-4 h-4" /> },
    { id: "research", label: t.nav.research, icon: <BookOpen className="w-4 h-4" />, tag: "OLS" },
    { id: "caseStudies", label: t.nav.caseStudies, icon: <History className="w-4 h-4" /> },
    { id: "forecast", label: t.nav.forecast, icon: <LineChart className="w-4 h-4" /> },
    { id: "dashboard", label: t.nav.dashboard, icon: <Sliders className="w-4 h-4" /> },
    { id: "aiEconomist", label: t.nav.aiEconomist, icon: <Bot className="w-4 h-4" />, tag: "AI" },
    { id: "collaborate", label: t.nav.collaborate, icon: <Users2 className="w-4 h-4" /> },
    { id: "dataExplorer", label: t.nav.dataExplorer, icon: <Database className="w-4 h-4" />, tag: "Audit" },
    { id: "newsEvents", label: t.nav.newsEvents, icon: <Newspaper className="w-4 h-4" /> },
    { id: "challenges", label: t.nav.challenges, icon: <Trophy className="w-4 h-4" /> },
    { id: "profile", label: t.nav.profile, icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#111215] border-r border-white/10 flex flex-col shrink-0 font-sans select-none">
      <div className="p-3">
        <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-neutral-400 border-b border-white/5 mb-2">
          Curated Exhibits
        </div>

        <nav className="space-y-0.5 mt-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all group ${
                  isActive
                    ? "bg-red-950/40 text-white font-medium border-l-2 border-red-600 shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={isActive ? "text-red-500" : "text-neutral-500 group-hover:text-neutral-300"}>
                    {item.icon}
                  </span>
                  <span className={`truncate ${isActive ? "font-serif italic text-[13px]" : ""}`}>{item.label}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.tag && (
                    <span
                      className={`text-[8px] font-mono px-1.5 py-0.2 uppercase tracking-wider border ${
                        isActive
                          ? "bg-red-900/60 text-red-200 border-red-700/60"
                          : "bg-white/5 text-neutral-400 border-white/10"
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Terminal System Status Footer */}
      <div className="mt-auto p-3 border-t border-white/10 bg-[#0C0D10] text-xs">
        <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            LIVE CURATION
          </span>
          <span className="text-neutral-400">VOL. 024</span>
        </div>
        <div className="text-[10px] text-neutral-400 mt-1 font-mono tracking-tight">
          Gemini 2.5 + Dynamic Econometrics
        </div>
      </div>
    </aside>
  );
};
