import React from "react";
import {
  LayoutDashboard,
  Globe,
  MapPin,
  Wheat,
  TrendingUp,
  DollarSign,
  Newspaper,
  Bot,
  FlaskConical,
  LineChart,
  Database,
  GraduationCap,
  BookOpen,
  History,
  Building2,
  ArrowLeftRight,
  Sparkles,
  Briefcase,
  BookMarked,
  Users2,
  ShieldCheck,
  ChevronRight,
  X,
  Compass,
} from "lucide-react";
import { useApp, NavSection } from "../../context/AppContext";

interface NavGroup {
  groupTitle: string;
  items: {
    id: NavSection;
    label: string;
    icon: React.ReactNode;
    tag?: string;
    description?: string;
  }[];
}

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, t, isMobileNavOpen, setIsMobileNavOpen } = useApp();

  const navGroups: NavGroup[] = [
    {
      groupTitle: "Core Intelligence",
      items: [
        { id: "home", label: t.nav.home, icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "economy", label: "Global Economy & Map", icon: <Globe className="w-4 h-4" />, tag: "World" },
        { id: "countries", label: "Countries & Regions", icon: <MapPin className="w-4 h-4" />, tag: "Drilldown" },
        { id: "localEconomy", label: "Local Economy & Agro", icon: <Wheat className="w-4 h-4" />, tag: "Surplus" },
        { id: "markets", label: "Markets & Currencies", icon: <TrendingUp className="w-4 h-4" />, tag: "Live" },
        { id: "newsEvents", label: "Economic News & Consensus", icon: <Newspaper className="w-4 h-4" /> },
      ],
    },
    {
      groupTitle: "AI & Empirical Analysis",
      items: [
        { id: "aiEconomist", label: "AI Economist Assistant", icon: <Bot className="w-4 h-4" />, tag: "Chief" },
        { id: "simulate", label: "Simulation Lab & Policy", icon: <FlaskConical className="w-4 h-4" />, tag: "IS-LM" },
        { id: "forecast", label: "Forecast Center & Risk Radar", icon: <LineChart className="w-4 h-4" /> },
        { id: "dataExplorer", label: "Data Explorer & World Bank", icon: <Database className="w-4 h-4" />, tag: "Audit" },
      ],
    },
    {
      groupTitle: "Academy & Literature",
      items: [
        { id: "learn", label: "Economics Academy & Math", icon: <GraduationCap className="w-4 h-4" />, tag: "Socratic" },
        { id: "research", label: "Research Hub & Book Library", icon: <BookOpen className="w-4 h-4" />, tag: "OER" },
        { id: "caseStudies", label: "Crisis Time Machine", icon: <History className="w-4 h-4" /> },
      ],
    },
    {
      groupTitle: "Corporate & Trade Intelligence",
      items: [
        { id: "companies", label: "Company Intelligence & DuPont", icon: <Building2 className="w-4 h-4" /> },
        { id: "trade", label: "Bilateral Trade Intelligence", icon: <ArrowLeftRight className="w-4 h-4" />, tag: "Tariffs" },
      ],
    },
    {
      groupTitle: "Personal & Career Studio",
      items: [
        { id: "labs", label: "Personal Labs Studio", icon: <Sparkles className="w-4 h-4" />, tag: "Custom" },
        { id: "career", label: "Career Center & CV Builder", icon: <Briefcase className="w-4 h-4" />, tag: "PDF" },
        { id: "magazine", label: "EconoSphere Magazine", icon: <BookMarked className="w-4 h-4" /> },
        { id: "collaborate", label: "Community & Peer Research", icon: <Users2 className="w-4 h-4" /> },
        { id: "profile", label: "My Profile & User Dashboard", icon: <ShieldCheck className="w-4 h-4" /> },
      ],
    },
  ];

  const handleNavClick = (id: NavSection) => {
    setActiveTab(id);
    setIsMobileNavOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {/* Drawer Header (Visible on Mobile) */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 md:hidden bg-[#0C0D10]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600 flex items-center justify-center text-white font-bold text-xs">
            ES
          </div>
          <span className="font-serif italic text-white font-bold text-base">EconoSphere Navigation</span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(false)}
          className="p-2 text-neutral-400 hover:text-white bg-white/5 rounded min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3 space-y-5">
        {navGroups.map((group) => (
          <div key={group.groupTitle} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-neutral-400 border-b border-white/5 flex items-center justify-between">
              <span>{group.groupTitle}</span>
              <Compass className="w-3 h-3 text-neutral-400" />
            </div>

            <nav className="space-y-0.5 pt-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 md:py-2 text-xs transition-all group rounded-sm min-h-[44px] md:min-h-0 ${
                      isActive
                        ? "bg-red-950/40 text-white font-medium border-l-2 border-red-600 shadow-sm"
                        : "text-neutral-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isActive ? "text-red-500" : "text-neutral-400 group-hover:text-neutral-300"}>
                        {item.icon}
                      </span>
                      <span className={`truncate text-left ${isActive ? "font-serif italic text-[13px] text-white" : ""}`}>
                        {item.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.tag && (
                        <span
                          className={`text-[8px] font-mono px-1.5 py-0.5 uppercase tracking-wider border ${
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
        ))}
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
        <p className="mt-1 text-[9px] text-neutral-400 font-mono">
          EconoSphere AI Institutional Intelligence Platform
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#111215] border-r border-white/10 flex-col shrink-0 font-sans select-none h-[calc(100vh-3.5rem)] sticky top-14">
        {navContent}
      </aside>

      {/* Mobile Drawer Sheet Overlay */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileNavOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full max-h-[85vh] bg-[#111215] border-t border-white/20 shadow-2xl flex flex-col rounded-t-xl overflow-hidden pb-12">
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-2 shrink-0" />
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
