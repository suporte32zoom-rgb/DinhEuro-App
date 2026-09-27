export type MarketRegion = 
  | "EUA" 
  | "Europa" 
  | "Ásia" 
  | "América Latina" 
  | "Moedas" 
  | "Criptomoedas" 
  | "Contratos futuros";

export type TimeRange = "1D" | "5D" | "1M" | "6M" | "YTD" | "1A" | "5A" | "MÁX";

export type ChartType = "area" | "line";

export interface ChartDataPoint {
  time: string;
  timestamp?: number;
  value: number;
  benchmarkValue?: number;
  volume?: number;
  annotation?: string;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  exchange: string;
  region: MarketRegion;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  high52: number;
  low52: number;
  prevClose: number;
  volume: string;
  marketCap?: string;
  peRatio?: number | string;
  dividendYield?: string;
  sparkline: number[];
  historical: Record<TimeRange, ChartDataPoint[]>;
  description: string;
  website?: string;
  ceo?: string;
  headquarters?: string;
  sector?: string;
  industry?: string;
  employees?: string;
  relatedSymbols: string[];
  annotations?: { time: string; text: string }[];
}

export interface MarketAccordionTopic {
  id: string;
  region: MarketRegion;
  title: string;
  categoryTag: string;
  summary: string;
  bulletPoints: string[];
  aiPrompt: string;
  sentiment: "bullish" | "bearish" | "neutral";
  updatedTime: string;
}

export interface MarketNewsItem {
  id: string;
  title: string;
  publisher: string;
  publisherLogo?: string;
  timeAgo: string;
  category: string;
  url: string;
  snippet: string;
  relatedSymbol?: string;
  imageUrl?: string;
}

export interface LocalRankingStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

export interface WatchlistAsset {
  symbol: string;
  addedAt: string;
  notes?: string;
  targetPrice?: number;
}

// Auxiliary types for specialized modules
export type FinancialDomain = "general" | "fx" | "mercosur_eu" | "macro" | "tax_expat" | "crypto_rwa";

export interface GroundingChunk {
  uri: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  domain?: FinancialDomain;
  groundingChunks?: GroundingChunk[];
  searchQueries?: string[];
  isError?: boolean;
}

export interface RateItem {
  spot: number;
  change24h: number;
  bid: number;
  ask: number;
  high24h: number;
  low24h: number;
}

export interface MarketData {
  timestamp: string;
  baseCurrency: string;
  rates: Record<string, RateItem>;
  macro: Record<string, { rate?: string; trend?: string; authority?: string; period?: string }>;
  rails: Record<string, { latency?: string; cost?: string; crossBorder?: string; limit?: string; tracking?: string; status?: string; tech?: string; scope?: string }>;
}

export interface VetCalculationResult {
  input: {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    operationType: string;
    providerSpread: number;
    fixedFee: number;
  };
  spotRate: number;
  effectiveCommercialRate: number;
  grossConverted: number;
  spreadCostLocal: number;
  iofRate: string;
  iofCost: number;
  fixedFee: number;
  netReceived: number;
  vet: number;
  providers: Array<{
    name: string;
    spread: number;
    iof: number;
    fixedFee: number;
    time: string;
    rail: string;
    netReceived: number;
    vet: number;
    totalCostPercentage: string;
  }>;
}

export interface TradeTariffScenario {
  id?: string;
  sector: string;
  product: string;
  hsCode: string;
  origin: "Mercosul" | "União Europeia" | "Mercosur" | "European Union";
  destination: "Mercosul" | "União Europeia" | "Mercosur" | "European Union";
  currentTariff: string;
  postAgreementTariff: string;
  transitionYears: string;
  originRule?: string;
  rulesOfOrigin?: string;
  strategicImpact?: string;
  keyOpportunity?: string;
}

