import React, { createContext, useContext, useState, useEffect } from "react";
import {
  LanguageCode,
  UserRole,
  CountryProfile,
  LocalMarketItem,
  FinancialInstrument,
  CompanyIntelligence,
  UserProfile,
  EconomicScaleLevel,
} from "../types";
import { COUNTRIES, LOCAL_MARKETS, FINANCIAL_INSTRUMENTS, COMPANIES } from "../data/mockDatabase";
import { VERIFIED_ECONOMISTS } from "../data/economicSocialData";
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
  | "challenges"
  | "feed"
  | "discovery"
  | "theory";

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

  // Authentication & Identity
  currentUser: UserProfile | null;
  authToken: string | null;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: "login" | "register" | "forgot";
  setAuthModalMode: (mode: "login" | "register" | "forgot") => void;

  // Social & Profiles
  targetProfileUser: UserProfile | null;
  setTargetProfileUser: (user: UserProfile | null) => void;
  viewUserProfile: (personalIdOrId: string) => Promise<void>;
  followUser: (targetUserId: string) => Promise<void>;
  connectUser: (targetUserId: string) => Promise<void>;

  // Economic Scale Discovery
  economicScale: EconomicScaleLevel;
  setEconomicScale: (scale: EconomicScaleLevel) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavSection>("feed");
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

  // Authentication & Identity States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("econosphere_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return VERIFIED_ECONOMISTS[0]; // Default authenticated as Founding Fellow Dr. Wahiduddin Mahmud
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("econosphere_token") || "demo-session-token-001";
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register" | "forgot">("login");
  const [targetProfileUser, setTargetProfileUser] = useState<UserProfile | null>(null);
  const [economicScale, setEconomicScale] = useState<EconomicScaleLevel>("national");

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

  // Auth & Identity Methods
  const login = async (identifier: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setCurrentUser(data.user);
      setAuthToken(data.token);
      localStorage.setItem("econosphere_user", JSON.stringify(data.user));
      localStorage.setItem("econosphere_token", data.token);
      if (data.user.role) setUserRole(data.user.role);
      return { success: true };
    } catch (err: any) {
      // Offline fallback for pre-seeded verified accounts
      const cleanId = identifier.trim().toLowerCase().replace(/^@/, "");
      const matched = VERIFIED_ECONOMISTS.find(
        (u) =>
          u.email.toLowerCase() === cleanId ||
          u.username.toLowerCase() === cleanId ||
          u.personalId.toLowerCase() === cleanId
      );
      if (matched) {
        setCurrentUser(matched);
        setAuthToken("offline-token-" + matched.id);
        localStorage.setItem("econosphere_user", JSON.stringify(matched));
        if (matched.role) setUserRole(matched.role);
        return { success: true };
      }
      return { success: false, error: "Network error during authentication." };
    }
  };

  const registerUser = async (data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || "Registration failed" };
      }
      setCurrentUser(resData.user);
      setAuthToken(resData.token);
      localStorage.setItem("econosphere_user", JSON.stringify(resData.user));
      localStorage.setItem("econosphere_token", resData.token);
      if (resData.user.role) setUserRole(resData.user.role);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: "Network error during registration: " + err.message };
    }
  };

  const logout = () => {
    if (authToken) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem("econosphere_user");
    localStorage.removeItem("econosphere_token");
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: "Not logged in" };
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || ""}`,
        },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) return { success: false, error: resData.error || "Update failed" };
      setCurrentUser(resData.user);
      localStorage.setItem("econosphere_user", JSON.stringify(resData.user));
      return { success: true };
    } catch (err: any) {
      // Local fallback
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
      localStorage.setItem("econosphere_user", JSON.stringify(updated));
      return { success: true };
    }
  };

  const viewUserProfile = async (personalIdOrId: string) => {
    try {
      const res = await fetch(`/api/users/profile/${encodeURIComponent(personalIdOrId)}`, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setTargetProfileUser(data.profile);
      } else {
        const localFound = VERIFIED_ECONOMISTS.find(
          (u) =>
            u.personalId.toLowerCase() === personalIdOrId.toLowerCase() ||
            u.id === personalIdOrId ||
            u.username.toLowerCase() === personalIdOrId.toLowerCase().replace(/^@/, "")
        );
        if (localFound) setTargetProfileUser(localFound);
      }
    } catch (e) {
      const localFound = VERIFIED_ECONOMISTS.find(
        (u) =>
          u.personalId.toLowerCase() === personalIdOrId.toLowerCase() ||
          u.id === personalIdOrId ||
          u.username.toLowerCase() === personalIdOrId.toLowerCase().replace(/^@/, "")
      );
      if (localFound) setTargetProfileUser(localFound);
    }
    setActiveTab("profile");
  };

  const followUser = async (targetUserId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch("/api/users/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || ""}`,
        },
        body: JSON.stringify({ targetUserId }),
      });
      if (res.ok) {
        const data = await res.json();
        const isFollowing = data.isFollowing;
        const updatedFollowing = isFollowing
          ? [...currentUser.following, targetUserId]
          : currentUser.following.filter((id) => id !== targetUserId);
        const updatedUser = {
          ...currentUser,
          following: updatedFollowing,
          followingCount: data.followingCount,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("econosphere_user", JSON.stringify(updatedUser));

        if (targetProfileUser && targetProfileUser.id === targetUserId) {
          setTargetProfileUser({
            ...targetProfileUser,
            followersCount: data.targetFollowersCount,
          });
        }
      }
    } catch (e) {
      // Local toggle
      const isFollowing = currentUser.following.includes(targetUserId);
      const updatedFollowing = isFollowing
        ? currentUser.following.filter((id) => id !== targetUserId)
        : [...currentUser.following, targetUserId];
      const updatedUser = {
        ...currentUser,
        following: updatedFollowing,
        followingCount: updatedFollowing.length,
      };
      setCurrentUser(updatedUser);
    }
  };

  const connectUser = async (targetUserId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const res = await fetch("/api/users/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken || ""}`,
        },
        body: JSON.stringify({ targetUserId }),
      });
      if (res.ok) {
        const data = await res.json();
        const isConnected = data.isConnected;
        const updatedConnections = isConnected
          ? [...currentUser.connections, targetUserId]
          : currentUser.connections.filter((id) => id !== targetUserId);
        const updatedUser = {
          ...currentUser,
          connections: updatedConnections,
          connectionsCount: data.connectionsCount,
        };
        setCurrentUser(updatedUser);
        localStorage.setItem("econosphere_user", JSON.stringify(updatedUser));
      }
    } catch (e) {
      const isConnected = currentUser.connections.includes(targetUserId);
      const updatedConnections = isConnected
        ? currentUser.connections.filter((id) => id !== targetUserId)
        : [...currentUser.connections, targetUserId];
      const updatedUser = {
        ...currentUser,
        connections: updatedConnections,
        connectionsCount: updatedConnections.length,
      };
      setCurrentUser(updatedUser);
    }
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

        // Auth & Identity
        currentUser,
        authToken,
        login,
        registerUser,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,

        // Profiles & Social
        targetProfileUser,
        setTargetProfileUser,
        viewUserProfile,
        followUser,
        connectUser,

        // Discovery
        economicScale,
        setEconomicScale,
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
