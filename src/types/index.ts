export type LanguageCode =
  | "en"
  | "bn"
  | "hi"
  | "ur"
  | "ar"
  | "zh"
  | "ja"
  | "ko"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "ru"
  | "id"
  | "tr";

export type UserRole =
  | "student"
  | "teacher"
  | "researcher"
  | "economist"
  | "business"
  | "policymaker"
  | "admin";

export type ConfidenceLevel = "high" | "moderate" | "limited" | "unreliable";

export type MarketDataLabel = "Real-time" | "Delayed (15m)" | "Historical" | "Estimated" | "Model-generated";

export interface DataProvenance {
  source: string;
  dataset: string;
  publisher: string;
  publicationDate: string;
  observationDate: string;
  unit: string;
  frequency: "Annual" | "Quarterly" | "Monthly" | "Weekly" | "Daily" | "Real-time";
  geographicLevel: "World" | "Country" | "State/Province" | "District" | "City" | "Local Market";
  methodology?: string;
  lastUpdated: string;
  license: string;
  confidence: ConfidenceLevel;
}

export interface MacroIndicators {
  population: number; // in millions
  gdp: number; // in Billion USD
  gdpPerCapita: number; // in USD
  realGdpGrowth: number; // in %
  inflation: number; // in %
  unemployment: number; // in %
  povertyRate: number; // in %
  debtToGdp: number; // in %
  centralBankRate: number; // in %
  fxReserves: number; // in Billion USD
  importCoverMonths: number;
  tradeBalance: number; // in Billion USD
  fdiInflow: number; // in Billion USD
  currencyCode: string;
  currencyName: string;
  exchangeRateToUSD: number;
  giniIndex: number;
  humanDevelopmentIndex: number;
  industrialProductionGrowth: number;
  taxToGdpRatio: number;
  fiscalDeficitToGdp: number;
}

export interface LocalMarketItem {
  id: string;
  name: string;
  country: string;
  division: string;
  district: string;
  city: string;
  product: string;
  category: "Agricultural" | "Energy" | "Industrial" | "Metals" | "Consumer";
  currentWholesalePrice: number; // per unit (e.g. BDT/KG or USD/MT)
  retailPrice: number;
  producerPrice: number;
  unit: string;
  historicalPrices: { date: string; wholesale: number; retail: number; producer: number }[];
  production: number; // Metric Tons
  consumption: number; // Metric Tons
  openingInventory: number;
  imports: number;
  exports: number;
  endingAvailability: number;
  marketBalanceStatus: "Surplus" | "Balanced" | "Deficit";
  deficitSurplusPercentage: number;
  transportationCost: number; // per unit
  storageCost: number; // per month
  priceVolatility: number; // annualized %
  seasonalPattern: string;
  weatherRiskFactor: "Low" | "Moderate" | "Severe";
  marketParticipants: string[];
  governmentPolicies: string[];
  provenance: DataProvenance;
  // Aliases for compatibility
  farmgatePriceBDT?: number;
  wholesalePriceBDT?: number;
  retailPriceBDT?: number;
  commodity?: string;
  marketName?: string;
}

export interface DistrictData {
  id: string;
  name: string;
  division: string;
  country: string;
  hasDistrictData: boolean;
  population?: number;
  districtGdpEstimated?: number;
  mainIndustries?: string[];
  mainCrops?: string[];
  povertyRate?: number;
  activeMarkets?: LocalMarketItem[];
  fallbackLevel?: string;
  dataNotes?: string;
}

export interface CountryProfile {
  id: string;
  name: string;
  code: string;
  region: string;
  capital: string;
  flag: string;
  macro: MacroIndicators;
  historicalGdp: { year: number; gdp: number; growth: number; inflation: number }[];
  divisions: {
    id: string;
    name: string;
    districts: DistrictData[];
  }[];
  keyIndustries: { name: string; shareOfGdp: number; employmentShare: number; exportShare: number }[];
  keyExports: { product: string; share: number; valueBillionUSD: number }[];
  keyImports: { product: string; share: number; valueBillionUSD: number }[];
  economicHistoryTimeline: { year: number; title: string; description: string; impact: string }[];
  creditRating: { sp: string; moodys: string; outlook: string };
  provenance: DataProvenance;
  indicators?: {
    gdpNominalUSD?: number;
    gdpGrowthAnnual?: number;
    inflationRate?: number;
    centralBankRate?: number;
    foreignReservesUSD?: number;
  };
}

export interface FinancialInstrument {
  ticker: string;
  name: string;
  type: "Stock" | "Index" | "Forex" | "Commodity" | "Bond" | "Crypto";
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  marketCap?: string;
  currency: string;
  exchange?: string;
  label: MarketDataLabel;
  historicalData: { time: string; open: number; high: number; low: number; close: number; volume: number }[];
  peRatio?: number;
  yield?: number;
  source: string;
  assetClass?: string;
}

export interface CompanyIntelligence {
  id: string;
  ticker: string;
  name: string;
  country: string;
  headquarters: string;
  sector: string;
  industry: string;
  ceo: string;
  employees: number;
  marketCap: number; // Billion USD
  stockPrice: number;
  revenue: number; // Billion USD
  revenueGrowth: number; // %
  netProfit: number; // Billion USD
  netMargin: number; // %
  ebitda: number;
  peRatio: number;
  pbRatio: number;
  debtToEquity: number;
  freeCashFlow: number; // Billion USD
  roe: number; // %
  competitors: string[];
  majorProducts: string[];
  supplyChainRisks: string[];
  geographicRevenue: { region: string; share: number }[];
  financialHistory: { year: number; revenue: number; netIncome: number; eps: number }[];
  provenance: DataProvenance;
  exchange?: string;
  financials?: {
    marketCapUSD?: number;
    revenueUSD?: number;
    netMarginPercent?: number;
    roePercent?: number;
    peRatio?: number;
    debtToEquityRatio?: number;
    assetTurnover?: number;
  };
}

export interface EconomicReserveItem {
  id: string;
  category: "Forex" | "Gold" | "Strategic Oil" | "Natural Gas" | "Grain/Food" | "Water";
  country: string;
  currentLevel: number;
  unit: string;
  historicalLevels: { year: number; level: number }[];
  capacityEstimated?: number;
  monthsOfBuffer: number;
  changeYoy: number;
  qualityIndicator: ConfidenceLevel;
  source: string;
  notes: string;
}

export interface ForecastModelResult {
  variable: string;
  targetUnit: string;
  country: string;
  historicalYears: { year: number; value: number }[];
  forecastPeriods: {
    period: string;
    baseline: number;
    optimistic: number;
    pessimistic: number;
    interval95Lower: number;
    interval95Upper: number;
  }[];
  modelUsed: "ARIMA(1,1,1)" | "Holt-Winters Exponential Smoothing" | "Vector Autoregression (VAR)" | "Gradient Boosted Econometric Regressor";
  keyAssumptions: string[];
  confidenceScore: number;
  dataSources: string[];
  lastUpdated: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journalOrPublisher: string;
  journal?: string;
  year: number;
  topics: string[];
  abstract: string;
  methodology: string;
  keyFindings: string[];
  policyImplications: string[];
  datasetUsed: string;
  citationsCount: number;
  doi: string;
  fullTextLink: string;
  hasOpenAccess: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  category: "Inflation Crisis" | "Currency & Balance of Payments" | "Banking & Financial" | "Trade & Industrial Policy" | "Development & Poverty" | "Labor & Minimum Wage" | string;
  country: string;
  year: string | number;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  overview?: string;
  contextData?: { metric: string; valueBefore: string; valuePeak: string; valueAfter: string }[];
  coreProblem?: string;
  economicTheoryApplied?: string[];
  keyDecisionPoints?: {
    stage: string;
    question: string;
    options: { title: string; description: string; expectedOutcome: string; risk: string }[];
  }[];
  multiplayerRoles?: { role: string; objective: string; constraints: string[] }[];
  actualHistoricalOutcome: string;
  discussionQuestions?: string[];
  instructorNotes?: string;
  interventions?: string[];
  lessonsLearned?: string[];
  relevanceToBangladesh?: string;
  provenance?: DataProvenance;
  region?: string;
  summary?: string;
  transmissionChannels?: string[];
  policyResponses?: string[];
  lessons?: string;
  topic?: string;
}

export interface CourseModule {
  id: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  title: string;
  description: string;
  topics: {
    id: string;
    title: string;
    summary: string;
    equations?: string[];
    realWorldExample: string;
    interactiveLabType?: string;
    quiz: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  }[];
}

export interface EconomicNewsArticle {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  category: "Monetary Policy" | "Commodities" | "Trade" | "Labor" | "Fiscal" | "Global Economy";
  summary: string;
  causalChain: {
    trigger: string;
    microChannel: string;
    marketAdjustment: string;
    macroImpact: string;
    policyReaction: string;
  };
  impactedSectors: { sector: string; sentiment: "Positive" | "Negative" | "Neutral"; magnitude: string }[];
  relevantIndicators: string[];
}

export interface GamificationChallenge {
  id: string;
  title: string;
  role: string;
  description: string;
  startingState: {
    inflation: number;
    gdpGrowth: number;
    unemployment: number;
    debtToGdp: number;
    approvalRate: number;
  };
  targetConditions: {
    inflationRange: [number, number];
    gdpGrowthMin: number;
    unemploymentMax: number;
    approvalMin: number;
  };
  turns: number;
}
