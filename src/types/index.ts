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

export interface EconomicsBook {
  id: string;
  title: string;
  author: string;
  year: number;
  category: "Microeconomics" | "Macroeconomics" | "Econometrics" | "Development" | "Classic Economic Thought" | "Public Finance";
  pages: number;
  coverColor: string;
  summary: string;
  chapters: { number: number; title: string; summary: string }[];
  keyTakeaways: string[];
  license: "Public Domain" | "Open Access / Creative Commons" | "OER Licensed";
  readUrl?: string;
}

export interface JobListing {
  id: string;
  title: string;
  organization: string;
  location: string;
  country: string;
  remote: boolean;
  type: "Full-time" | "Contract" | "Fellowship" | "Internship";
  experienceLevel: "Entry" | "Mid-level" | "Senior" | "Lead / Director";
  salaryRange: string;
  requiredSkills: string[];
  preferredSkills: string[];
  education: string;
  description: string;
  postedDate: string;
  deadline: string;
  category: "Economist" | "Economic Analyst" | "Research Assistant" | "Data Analyst" | "Policy Analyst" | "Multilateral / NGO";
}

export interface PersonalLab {
  id: string;
  title: string;
  description: string;
  category: "Inflation" | "Growth" | "Commodity Market" | "Econometrics" | "Fiscal Policy" | "Monetary Policy";
  modelType: string;
  parameters: Record<string, any>;
  notes: string;
  resultsSummary?: string;
  createdAt: string;
  updatedAt: string;
  collaborators: string[];
}

export interface MagazineArticle {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: "Global Economy" | "Bangladesh Economy" | "Markets" | "Policy" | "Research" | "Technology & AI";
  tags: string[];
  excerpt: string;
  content: string;
  likes: number;
  commentsCount: number;
}

export interface BilateralTradePair {
  id: string;
  countryA: string;
  countryB: string;
  bilateralVolumeUSD: number; // in Billion USD
  countryAExportsUSD: number;
  countryAImportsUSD: number;
  tradeBalanceUSD: number; // A perspective
  topExportProducts: { product: string; share: number }[];
  topImportProducts: { product: string; share: number }[];
  averageTariff: number; // %
  tradeAgreement: string;
  dependencyScore: number; // 0 - 100
}

export interface CommodityItem {
  id: string;
  name: string;
  category: "Agricultural" | "Energy" | "Metals" | "Livestock";
  ticker: string;
  priceUSD: number;
  unit: string;
  change24h: number;
  changePercent: number;
  inventoryBufferDays: number;
  supplyStatus: "Surplus" | "Balanced" | "Deficit";
  priceVolatility: number; // %
  demandGrowthYoy: number; // %
  topExporters: string[];
  description: string;
}

export interface UserProfile {
  id: string;
  personalId: string; // e.g. "ECN-000108" or "@tariq_econ"
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  country: string;
  region: string;
  city: string;
  education: string;
  institution: string;
  fieldOfStudy: string;
  professionalRole: string;
  bio: string;
  skills: string[];
  researchInterests: string[];
  badges: { id: string; name: string; icon: string; issuer: string; date: string }[];
  achievements: string[];
  publicationsCount: number;
  projectsCount: number;
  followersCount: number;
  followingCount: number;
  connectionsCount: number;
  followers: string[];
  following: string[];
  connections: string[];
  privacy: {
    isPublic: boolean;
    showEmail: boolean;
    showPhone: boolean;
  };
  emailVerified: boolean;
  phoneVerified: boolean;
  isVerified?: boolean;
  citationsCount?: number;
  createdAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPersonalId: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface PostPoll {
  question: string;
  options: { id: string; text: string; votes: number; voters: string[] }[];
  totalVotes: number;
}

export type PostType =
  | "text"
  | "image"
  | "chart"
  | "dataset"
  | "research"
  | "analysis"
  | "opinion"
  | "question"
  | "poll"
  | "case_study"
  | "simulation_result"
  | "blog"
  | "article"
  | "news_commentary"
  | "project_update";

export type EconomicPostType = PostType;
export type EconomicCategory = string;

export interface PostConnectionTags {
  country?: string;
  region?: string;
  district?: string;
  city?: string;
  market?: string;
  product?: string;
  company?: string;
  industry?: string;
  indicator?: string;
  researchPaper?: string;
  policy?: string;
  environment?: string;
  climate?: string;
  economicEvent?: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorPersonalId: string;
  authorRole: string;
  authorAvatar?: string;
  authorInstitution?: string;
  postType: PostType;
  title?: string;
  content: string;
  chartData?: {
    title: string;
    labels: string[];
    values: number[];
    unit: string;
  };
  datasetPreview?: {
    name: string;
    columns: string[];
    rows: any[][];
  };
  poll?: PostPoll;
  connections: PostConnectionTags;
  aiAssistance?: {
    hasAIAssistance: boolean;
    improvedReasoning?: string;
    suggestedIndicators?: string[];
    theoryContext?: string;
    discussionQuestions?: string[];
  };
  provenance?: {
    source: string;
    dataDate: string;
    isVerified: boolean;
    isEstimate: boolean;
  };
  likes: string[]; // user IDs who liked
  bookmarks: string[]; // user IDs who saved
  sharesCount: number;
  comments: PostComment[];
  createdAt: string;
  updatedAt?: string;
  reported?: boolean;
}

export type EconomicScaleLevel =
  | "household"
  | "local"
  | "district"
  | "city"
  | "region"
  | "national"
  | "global";

export interface HouseholdSimulatorInputs {
  monthlyGrossIncome: number;
  householdSize: number;
  foodExpenditure: number;
  housingRent: number;
  utilitiesEnergy: number;
  transportCommute: number;
  educationExpenditure: number;
  healthcareExpenditure: number;
  debtRepaymentMonthly: number;
  emergencySavings: number;
  localInflationRate: number;
  currency: string;
}

export interface HouseholdSimulatorOutputs {
  monthlyIncome?: number;
  totalExpenses?: number;
  disposableIncome?: number;
  netDisposableIncome?: number;
  totalExpenditure?: number;
  netSavingsOrDeficit?: number;
  savingsRate?: number;
  savingsRatePct?: number;
  foodSharePct?: number; // Engel's Law metric
  foodBudgetShare?: number;
  debtServiceRatioPct?: number;
  financialPressureScore?: number; // 0 to 100
  financialStatus?: "Secure" | "Moderate Pressure" | "High Vulnerability" | "Critical Deficit";
  vulnerabilityRisk?: "Low" | "Moderate" | "High" | "Critical";
  realPurchasingPowerErosion?: number; // Currency amount lost to inflation
  realPurchasingPowerLoss?: number;
  recommendations?: string[];
  recommendedActions?: string[];
}

export interface TheoryKnowledgeConcept {
  id: string;
  name: string;
  category?: string;
  economists?: string[];
  year?: number | string;
  summary?: string;
  formula?: string;
  parameters?: { symbol: string; description: string }[];
  domain?:
    | "Microeconomics"
    | "Macroeconomics"
    | "Development Economics"
    | "International Economics"
    | "Public Economics"
    | "Labor Economics"
    | "Financial Economics"
    | "Environmental Economics"
    | "Agricultural Economics";
  definition?: string;
  assumptions: string[];
  equation?: string;
  mathExplanation?: string;
  graphType?: string;
  graphDescription?: string;
  realWorldExample?: string;
  realWorldApplication?: string;
  criticisms?: string[];
  bangladeshExample?: string;
  globalExample?: string;
  simulationConcept?: string;
  policyApplication?: string;
  practiceQuestions?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}
