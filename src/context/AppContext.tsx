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
  | "learn"
  | "simulate"
  | "markets"
  | "economy"
  | "companies"
  | "research"
  | "caseStudies"
  | "forecast"
  | "dashboard"
  | "aiEconomist"
  | "collaborate"
  | "dataExplorer"
  | "newsEvents"
  | "challenges"
  | "profile";

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
  alerts: UserAlert[];
  addAlert: (alert: Omit<UserAlert, "id" | "isTriggered" | "createdAt">) => void;
  removeAlert: (id: string) => void;
  savedSimulations: any[];
  saveSimulation: (sim: any) => void;
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
  const [currencyDenomination, setCurrencyDenomination] = useState<"USD" | "BDT" | "EUR" | "INR" | "JPY">("USD");

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
        alerts,
        addAlert,
        removeAlert,
        savedSimulations,
        saveSimulation,
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
