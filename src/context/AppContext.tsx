import React, { createContext, useContext, useState, useEffect } from "react";
import {
  LanguageCode,
  UserRole,
  CountryProfile,
  LocalMarketItem,
  FinancialInstrument,
  CompanyIntelligence,
} from "../types";
import { COUNTRIES, LOCAL_MARKETS, FINANCIAL_INSTRUMENTS, COMPANIES } from "../data/mockDatabase";
import { translations, TranslationSchema } from "../i18n/translations";

export type NavSection =
  | "home"
  | "economy"
  | "countries"
  | "localEconomy"
  | "markets"
  | "currencies"
  | "commodities"
  | "jobs"
  | "newsEvents"
  | "aiEconomist"
  | "simulate"
  | "forecast"
  | "research"
  | "learn"
  | "dataExplorer"
  | "companies"
  | "trade"
  | "agriculture"
  | "caseStudies"
  | "collaborate"
  | "labs"
  | "magazine"
  | "career"
  | "profile"
  | "dashboard"
  | "challenges";

export interface UserAlert {
  id: string;
  title: string;
  metric: string;
  condition: ">" | "<" | "=";
  threshold: number;
  currentValue: number;
  isTriggered: boolean;
  createdAt: string;
}

export type AIExplanationLevel = "ELI5" | "Beginner" | "University" | "Advanced" | "Professional";

export interface AppContextType {
  activeTab: NavSection;
  setActiveTab: (tab: NavSection) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationSchema;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  selectedCountryId: string;
  setSelectedCountryId: (id: string) => void;
  activeCountry: CountryProfile;
  selectedMarketId: string;
  setSelectedMarketId: (id: string) => void;
  activeMarket: LocalMarketItem;
  selectedTicker: string;
  setSelectedTicker: (ticker: string) => void;
  activeInstrument: FinancialInstrument;
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  activeCompany: CompanyIntelligence;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  aiExplanationLevel: AIExplanationLevel;
  setAiExplanationLevel: (level: AIExplanationLevel) => void;
  alerts: UserAlert[];
  addAlert: (alert: Omit<UserAlert, "id" | "isTriggered" | "createdAt">) => void;
  removeAlert: (id: string) => void;
  savedSimulations: any[];
  saveSimulation: (sim: any) => void;
  personalLabs: any[];
  createPersonalLab: (lab: any) => void;
  deletePersonalLab: (id: string) => void;
  currencyDenomination: "USD" | "BDT" | "EUR" | "INR" | "JPY";
  setCurrencyDenomination: (curr: "USD" | "BDT" | "EUR" | "INR" | "JPY") => void;
  navigateToMarket: (marketId: string) => void;
  navigateToCountry: (countryId: string) => void;
  navigateToCompany: (companyId: string) => void;
  navigateToInstrument: (ticker: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavSection>("home");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [userRole, setUserRole] = useState<UserRole>("economist");
  const [selectedCountryId, setSelectedCountryId] = useState<string>("BD");
  const [selectedMarketId, setSelectedMarketId] = useState<string>("mkt-rangpur-potato");
  const [selectedTicker, setSelectedTicker] = useState<string>("DSEX");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("square-pharma");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [aiExplanationLevel, setAiExplanationLevel] = useState<AIExplanationLevel>("University");
  const [currencyDenomination, setCurrencyDenomination] = useState<"USD" | "BDT" | "EUR" | "INR" | "JPY">("USD");

  const [personalLabs, setPersonalLabs] = useState<any[]>([
    {
      id: "lab-1",
      title: "Bangladesh Food Inflation & Logistics Spread Lab",
      description: "Empirical pass-through model evaluating fuel price shocks against retail potato and rice price margins in northern divisions.",
      category: "Inflation",
      modelType: "OLS & Distributed Lag",
      parameters: { fuelShockPct: 12.5, storageHoldingWeeks: 4, interestRateBps: 100 },
      notes: "Baseline shows 10% fuel hike induces +2.8% food CPI inflation with a 3-week transmission lag.",
      resultsSummary: "R² = 0.74, F = 38.2, highly significant transmission parameter.",
      createdAt: "2026-08-15",
      updatedAt: "2026-08-28",
      collaborators: ["Dr. A. Rahman", "S. Chowdhury"],
    },
    {
      id: "lab-2",
      title: "Naogaon Rice Value Chain Equilibrium Simulation",
      description: "Micro-market supply and demand equilibrium with open-market sales (OMS) intervention threshold.",
      category: "Commodity Market",
      modelType: "Non-linear Equilibrium",
      parameters: { harvestYieldMT: 450000, millersSyndicateMargin: 18, omsSupplyMT: 25000 },
      notes: "Direct public grain distribution of 25k MT curbs speculative wholesale markups by ~৳4.5/kg.",
      resultsSummary: "Market equilibrium restored within 14 trading days.",
      createdAt: "2026-08-20",
      updatedAt: "2026-08-30",
      collaborators: ["M. Hossain"],
    },
    {
      id: "lab-3",
      title: "Central Bank Monetary Policy & Taylor Rule Cascade",
      description: "Taylor Rule interest rate calibration with inflation gap and output gap weights.",
      category: "Monetary Policy",
      modelType: "Taylor Rule 1993",
      parameters: { neutralRate: 4.0, inflationTarget: 5.5, currentInflation: 9.7, outputGap: -1.2 },
      notes: "Model recommends policy repo rate hike of +150 bps to anchor 12-month expected inflation.",
      resultsSummary: "Target policy rate: 10.25% (Observed repo: 10.0%).",
      createdAt: "2026-08-22",
      updatedAt: "2026-09-01",
      collaborators: ["Institutional Quant Group"],
    },
  ]);

  const [alerts, setAlerts] = useState<UserAlert[]>([
    {
      id: "alert-1",
      title: "Bangladesh Food Inflation Alert",
      metric: "Inflation CPI (%)",
      condition: ">",
      threshold: 9.0,
      currentValue: 9.7,
      isTriggered: true,
      createdAt: "2026-08-25",
    },
    {
      id: "alert-2",
      title: "Rangpur Potato Wholesale Margin",
      metric: "Wholesale Price (BDT/kg)",
      condition: ">",
      threshold: 40.0,
      currentValue: 38.5,
      isTriggered: false,
      createdAt: "2026-08-28",
    },
    {
      id: "alert-3",
      title: "Brent Crude Peak Threshold",
      metric: "Oil Price ($/bbl)",
      condition: ">",
      threshold: 85.0,
      currentValue: 78.45,
      isTriggered: false,
      createdAt: "2026-08-29",
    },
  ]);

  const [savedSimulations, setSavedSimulations] = useState<any[]>([]);

  const t = translations[language] || translations.en;

  const activeCountry =
    COUNTRIES.find((c) => c.id === selectedCountryId) || COUNTRIES[0];

  const activeMarket =
    LOCAL_MARKETS.find((m) => m.id === selectedMarketId) || LOCAL_MARKETS[0];

  const activeInstrument =
    FINANCIAL_INSTRUMENTS.find((i) => i.ticker === selectedTicker) || FINANCIAL_INSTRUMENTS[0];

  const activeCompany =
    COMPANIES.find((co) => co.id === selectedCompanyId) || COMPANIES[0];

  const addAlert = (alertData: Omit<UserAlert, "id" | "isTriggered" | "createdAt">) => {
    const isTriggered =
      alertData.condition === ">"
        ? alertData.currentValue > alertData.threshold
        : alertData.condition === "<"
        ? alertData.currentValue < alertData.threshold
        : alertData.currentValue === alertData.threshold;

    const newAlert: UserAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      isTriggered,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const saveSimulation = (sim: any) => {
    setSavedSimulations((prev) => [{ ...sim, savedAt: new Date().toISOString() }, ...prev]);
  };

  const createPersonalLab = (lab: any) => {
    const newLab = {
      ...lab,
      id: `lab-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      collaborators: ["You"],
    };
    setPersonalLabs((prev) => [newLab, ...prev]);
  };

  const deletePersonalLab = (id: string) => {
    setPersonalLabs((prev) => prev.filter((l) => l.id !== id));
  };

  const navigateToMarket = (marketId: string) => {
    setSelectedMarketId(marketId);
    setActiveTab("simulate");
  };

  const navigateToCountry = (countryId: string) => {
    setSelectedCountryId(countryId);
    setActiveTab("economy");
  };

  const navigateToCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setActiveTab("companies");
  };

  const navigateToInstrument = (ticker: string) => {
    setSelectedTicker(ticker);
    setActiveTab("markets");
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        t,
        userRole,
        setUserRole,
        selectedCountryId,
        setSelectedCountryId,
        activeCountry,
        selectedMarketId,
        setSelectedMarketId,
        activeMarket,
        selectedTicker,
        setSelectedTicker,
        activeInstrument,
        selectedCompanyId,
        setSelectedCompanyId,
        activeCompany,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isMobileNavOpen,
        setIsMobileNavOpen,
        aiExplanationLevel,
        setAiExplanationLevel,
        alerts,
        addAlert,
        removeAlert,
        savedSimulations,
        saveSimulation,
        personalLabs,
        createPersonalLab,
        deletePersonalLab,
        currencyDenomination,
        setCurrencyDenomination,
        navigateToMarket,
        navigateToCountry,
        navigateToCompany,
        navigateToInstrument,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
