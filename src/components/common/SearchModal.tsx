import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Globe,
  TrendingUp,
  FlaskConical,
  BookOpen,
  Building2,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { COUNTRIES, LOCAL_MARKETS, FINANCIAL_INSTRUMENTS, COMPANIES, RESEARCH_PAPERS, CASE_STUDIES } from "../../data/mockDatabase";

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    navigateToMarket,
    navigateToCountry,
    navigateToCompany,
    navigateToInstrument,
    setActiveTab,
  } = useApp();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Search across datasets
  const matchedCountries = COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)
  );

  const matchedMarkets = LOCAL_MARKETS.filter(
    (m) =>
      m.product.toLowerCase().includes(q) ||
      m.district.toLowerCase().includes(q) ||
      m.division.toLowerCase().includes(q) ||
      m.name.toLowerCase().includes(q)
  );

  const matchedInstruments = FINANCIAL_INSTRUMENTS.filter(
    (i) => i.name.toLowerCase().includes(q) || i.ticker.toLowerCase().includes(q) || (i.type && i.type.toLowerCase().includes(q))
  );

  const matchedCompanies = COMPANIES.filter(
    (co) => co.name.toLowerCase().includes(q) || co.ticker.toLowerCase().includes(q) || co.sector.toLowerCase().includes(q)
  );

  const matchedPapers = RESEARCH_PAPERS.filter(
    (p) => p.title.toLowerCase().includes(q) || p.authors.some(a => a.toLowerCase().includes(q)) || p.journalOrPublisher.toLowerCase().includes(q)
  );

  const matchedStudies = CASE_STUDIES.filter(
    (s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.country.toLowerCase().includes(q)
  );

  const totalResults =
    matchedCountries.length +
    matchedMarkets.length +
    matchedInstruments.length +
    matchedCompanies.length +
    matchedPapers.length +
    matchedStudies.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#141519] border border-white/20 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-[#0C0D10]">
          <Search className="w-4 h-4 text-red-500 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sovereign archives, commodities (Rangpur potato), equities (DSEX), OLS models..."
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[9px] font-mono text-neutral-400 bg-white/5 border border-white/10 uppercase tracking-wider">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {q === "" ? (
            <div className="p-6 text-center text-neutral-400 space-y-2">
              <Sparkles className="w-5 h-5 text-red-500 mx-auto opacity-80" />
              <div className="text-sm font-serif italic text-white">Curated Omni-Search Index</div>
              <p className="text-xs text-neutral-400 max-w-md mx-auto font-sans">
                Search across sovereign macro profiles, commodity markets, corporate balance sheets, and econometric research.
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center text-neutral-400 font-mono text-xs">
              <p>No results indexed for "{query}".</p>
              <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Try searching for "Bangladesh", "Potato", "DSEX", "IS-LM", or "Inflation".</p>
            </div>
          ) : (
            <>
              {/* Local Markets & Commodities */}
              {matchedMarkets.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-1.5 border-b border-white/5">
                    <FlaskConical className="w-3.5 h-3.5 text-red-500" />
                    Commodity Price Transmission ({matchedMarkets.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedMarkets.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          navigateToMarket(m.id);
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-white/5 text-left transition-colors group border border-transparent hover:border-white/10"
                      >
                        <div>
                          <div className="font-serif font-bold text-sm text-neutral-200 group-hover:text-red-400">
                            {m.product} — {m.name}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {m.district}, {m.division} | Wholesale: {m.currentWholesalePrice} BDT/{m.unit} | Retail: {m.retailPrice} BDT/{m.unit}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-red-400 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Assets & Indices */}
              {matchedInstruments.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-1.5 border-b border-white/5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Financial Instrument Manifest ({matchedInstruments.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedInstruments.map((i) => (
                      <button
                        key={i.ticker}
                        onClick={() => {
                          navigateToInstrument(i.ticker);
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-white/5 text-left transition-colors group border border-transparent hover:border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-neutral-200 text-xs px-1.5 py-0.5 bg-white/5 border border-white/10">
                            {i.ticker}
                          </span>
                          <div>
                            <div className="font-serif font-bold text-sm text-neutral-200 group-hover:text-red-400">{i.name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">{i.type} | Feed: {i.source}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-white">{i.price.toLocaleString()}</div>
                          <div className={`text-[10px] font-mono font-bold ${i.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {i.changePercent >= 0 ? "+" : ""}{i.changePercent}%
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Countries */}
              {matchedCountries.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-1.5 border-b border-white/5">
                    <Globe className="w-3.5 h-3.5 text-red-500" />
                    Sovereign Macro Profiles ({matchedCountries.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedCountries.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          navigateToCountry(c.id);
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-white/5 text-left transition-colors group border border-transparent hover:border-white/10"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{c.flag}</span>
                          <div>
                            <div className="font-serif font-bold text-sm text-neutral-200 group-hover:text-red-400">{c.name}</div>
                            <div className="text-[11px] text-neutral-400 font-mono">
                              GDP: ${c.macro.gdp}B | Inflation: {c.macro.inflation}% | Region: {c.region}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-red-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Companies */}
              {matchedCompanies.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-1.5 border-b border-white/5">
                    <Building2 className="w-3.5 h-3.5 text-red-500" />
                    Corporate Financial Profiles ({matchedCompanies.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedCompanies.map((co) => (
                      <button
                        key={co.id}
                        onClick={() => {
                          navigateToCompany(co.id);
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-white/5 text-left transition-colors group border border-transparent hover:border-white/10"
                      >
                        <div>
                          <div className="font-serif font-bold text-sm text-neutral-200 group-hover:text-red-400">
                            {co.name} ({co.ticker})
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            Sector: {co.sector} | Revenue: ${co.revenue}M | Margin: {co.netMargin}%
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-red-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Academic Papers */}
              {matchedPapers.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.2em] flex items-center gap-1.5 border-b border-white/5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    Academic Research & Papers ({matchedPapers.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {matchedPapers.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveTab("research");
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 hover:bg-white/5 text-left transition-colors group border border-transparent hover:border-white/10"
                      >
                        <div>
                          <div className="font-serif italic font-bold text-sm text-neutral-200 group-hover:text-red-400">{p.title}</div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {p.authors.join(", ")} ({p.year}) — {p.journalOrPublisher}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-red-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2 bg-[#0C0D10] border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-400 font-mono tracking-wider">
          <span>CURATION INDEX // 10,000+ AUDITED NODES</span>
          <span>ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
};
