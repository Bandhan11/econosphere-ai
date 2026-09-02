import React, { useState } from "react";
import {
  Globe2,
  Search,
  Bell,
  Download,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Sparkles,
  ChevronDown,
  Check,
  DollarSign,
  AlertCircle,
  Menu,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SUPPORTED_LANGUAGES } from "../../i18n/translations";
import { FINANCIAL_INSTRUMENTS } from "../../data/mockDatabase";
import { LanguageCode, UserRole } from "../../types";

export const Header: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    userRole,
    setUserRole,
    setIsSearchOpen,
    alerts,
    navigateToInstrument,
    currencyDenomination,
    setCurrencyDenomination,
    isMobileNavOpen,
    setIsMobileNavOpen,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    viewUserProfile,
    logout,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    { role: "economist", title: "Senior Economist", desc: "Advanced econometric models, forecasting, and policy analysis" },
    { role: "student", title: "Economics Student", desc: "Interactive concepts, simulations, formulas & quizzes" },
    { role: "teacher", title: "University Professor", desc: "Classroom management, curriculum, assignments & grading" },
    { role: "researcher", title: "Academic Researcher", desc: "Datasets, regression builder, and literature database" },
    { role: "business", title: "Business & Market Analyst", desc: "Local market intelligence, companies & commodity balance" },
    { role: "policymaker", title: "Government Policymaker", desc: "Scenario simulations, fiscal-monetary cascades & shocks" },
  ];

  const triggeredAlertsCount = alerts.filter((a) => a.isTriggered).length;

  return (
    <header className="sticky top-0 z-40 bg-[#111215]/95 backdrop-blur-md border-b border-white/10 font-sans">
      {/* Top Financial Live Ticker with Editorial Flair */}
      <div className="bg-[#0A0B0D] border-b border-white/10 px-4 py-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 text-xs whitespace-nowrap min-w-max">
          <div className="flex items-center gap-1.5 text-red-500 font-mono text-[10px] font-bold uppercase tracking-[0.25em] pr-3 border-r border-white/10">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse inline-block" />
            <span>EXHIBIT // {t.common.liveTicker}:</span>
          </div>

          {FINANCIAL_INSTRUMENTS.map((item) => {
            const isPositive = item.change >= 0;
            return (
              <button
                key={item.ticker}
                onClick={() => navigateToInstrument(item.ticker)}
                className="flex items-center gap-2 hover:bg-white/5 px-2.5 py-0.5 rounded transition-colors group"
              >
                <span className="font-mono font-bold text-neutral-200 group-hover:text-red-400 transition-colors">{item.ticker}</span>
                <span className="font-mono text-neutral-400 text-[11px]">
                  {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`flex items-center text-[10px] font-mono ${
                    isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                  {isPositive ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-white/5 text-neutral-400 font-mono border border-white/10">
                  {item.label === "Real-time" ? "LIVE" : "15M"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-2.5">
          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-nav-toggle-button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-white bg-[#17181D] border border-white/10 hover:border-red-600/40 rounded flex items-center justify-center min-w-[40px] min-h-[40px]"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5 text-neutral-300" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center border border-white/20 shadow-md shrink-0">
              <Globe2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif italic font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                  EconoSphere <span className="font-mono font-bold text-xs not-italic text-red-500 tracking-widest uppercase ml-1">AI</span>
                </span>
                <span className="hidden lg:inline-block px-2 py-0.5 text-[9px] font-mono tracking-[0.2em] bg-white/5 text-neutral-300 border border-white/15 uppercase font-medium">
                  Vol. 024 // Archive
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar Trigger */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <button
            id="global-omni-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#17181D] hover:bg-[#1C1E24] text-neutral-400 border border-white/10 hover:border-red-600/40 text-xs transition-all"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="truncate font-sans text-neutral-300">{t.common.searchPlaceholder}</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[9px] text-neutral-400 bg-white/5 px-2 py-0.5 border border-white/10 shrink-0 uppercase tracking-wider">
              <span>⌘</span>
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right: Controls (Role, Language, Currency, Alerts) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile search button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 bg-[#17181D] border border-white/10 text-neutral-300 hover:border-red-600/40"
            title="Search"
          >
            <Search className="w-4 h-4 text-red-500" />
          </button>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              id="role-switcher-button"
              onClick={() => setIsRoleOpen(!isRoleOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17181D] hover:bg-[#1E2026] border border-white/10 hover:border-red-600/40 text-xs text-neutral-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline capitalize font-medium">{userRole}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isRoleOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsRoleOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-[#141519] border border-white/15 p-2 shadow-2xl z-50 text-xs">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-white/10">
                    Switch Adaptive Role & Persona
                  </div>
                  <div className="py-1 space-y-1">
                    {rolesList.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          setUserRole(r.role);
                          setIsRoleOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 transition-colors flex items-start gap-2.5 border ${
                          userRole === r.role
                            ? "bg-red-950/40 text-red-200 border-red-600/50"
                            : "hover:bg-white/5 border-transparent text-neutral-300"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-white flex items-center justify-between">
                            <span>{r.title}</span>
                            {userRole === r.role && <Check className="w-3.5 h-3.5 text-red-500" />}
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Multilingual Switcher */}
          <div className="relative">
            <button
              id="language-switcher-button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17181D] hover:bg-[#1E2026] border border-white/10 hover:border-red-600/40 text-xs text-neutral-200 transition-colors"
            >
              <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.flag || "🌐"}</span>
              <span className="hidden lg:inline uppercase font-mono text-[11px] tracking-wider">{language}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-[#141519] border border-white/15 p-2 shadow-2xl z-50 text-xs font-sans">
                  <div className="px-2.5 py-1.5 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] border-b border-white/10">
                    Language Catalog ({SUPPORTED_LANGUAGES.length})
                  </div>
                  <div className="py-1 grid grid-cols-1 gap-1">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between transition-colors border ${
                          language === l.code
                            ? "bg-red-950/40 text-red-200 font-semibold border-red-600/50"
                            : "hover:bg-white/5 border-transparent text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <span>{l.nativeName}</span>
                          <span className="text-neutral-500 text-[11px]">({l.name})</span>
                        </div>
                        {language === l.code && <Check className="w-3.5 h-3.5 text-red-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Currency Denomination */}
          <select
            value={currencyDenomination}
            onChange={(e) => setCurrencyDenomination(e.target.value as any)}
            className="hidden sm:block px-2.5 py-1.5 bg-[#17181D] hover:bg-[#1E2026] border border-white/10 text-xs font-mono text-neutral-200 cursor-pointer"
            title="Display Currency"
          >
            <option value="USD">USD ($)</option>
            <option value="BDT">BDT (৳)</option>
            <option value="EUR">EUR (€)</option>
            <option value="INR">INR (₹)</option>
            <option value="JPY">JPY (¥)</option>
          </select>

          {/* Alerts Notification Center */}
          <div className="relative">
            <button
              id="alerts-notification-button"
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className="relative p-2 bg-[#17181D] hover:bg-[#1E2026] border border-white/10 text-neutral-300 hover:border-red-600/40 transition-colors"
              title="Economic Alerts"
            >
              <Bell className="w-4 h-4 text-neutral-300" />
              {triggeredAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {triggeredAlertsCount}
                </span>
              )}
            </button>

            {isAlertsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsAlertsOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-[#141519] border border-white/15 p-3 shadow-2xl z-50 text-xs font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="font-mono font-bold text-neutral-200 uppercase tracking-[0.2em] text-[10px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      Alert Manifest
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {triggeredAlertsCount} Active
                    </span>
                  </div>

                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className={`p-2.5 border text-xs ${
                          a.isTriggered
                            ? "bg-red-950/40 border-red-800/60 text-red-200"
                            : "bg-[#0D0E10] border-white/10 text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span>{a.title}</span>
                          <span
                            className={`px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-wider ${
                              a.isTriggered
                                ? "bg-red-900/60 text-red-300 border border-red-700/60"
                                : "bg-white/5 text-neutral-400 border border-white/10"
                            }`}
                          >
                            {a.isTriggered ? "TRIGGERED" : "NORMAL"}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-1 font-mono">
                          Condition: {a.metric} {a.condition} {a.threshold} (Current: {a.currentValue})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Account / Identity Pill */}
          {currentUser ? (
            <div className="relative">
              <button
                id="user-profile-header-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-[#17181D] hover:bg-[#1E2026] border border-white/10 hover:border-red-600/40 text-xs text-neutral-200 transition-colors"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-white/20"
                />
                <div className="hidden sm:flex flex-col items-start leading-none text-left">
                  <span className="font-semibold text-white text-[11px] truncate max-w-[100px]">
                    {currentUser.fullName}
                  </span>
                  <span className="font-mono text-[9px] text-red-400 font-bold">
                    {currentUser.personalId}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-[#141519] border border-white/15 p-3 shadow-2xl z-50 text-xs font-sans space-y-2">
                    <div className="pb-2 border-b border-white/10">
                      <div className="font-bold text-white">{currentUser.fullName}</div>
                      <div className="font-mono text-red-400 text-[11px] font-bold">
                        Personal ID: {currentUser.personalId}
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        {currentUser.institution}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        viewUserProfile(currentUser.personalId);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-white/5 text-neutral-200 hover:text-white transition-colors flex items-center justify-between"
                    >
                      <span>View Researcher Profile</span>
                      <span className="text-[10px] font-mono text-neutral-400">→</span>
                    </button>

                    <button
                      onClick={() => {
                        setAuthModalMode("register");
                        setIsAuthModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-white/5 text-neutral-200 hover:text-white transition-colors"
                    >
                      Create New Personal ID
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-red-950/40 text-red-400 hover:text-red-300 transition-colors border-t border-white/10 pt-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode("login");
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Sign In / ID</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
