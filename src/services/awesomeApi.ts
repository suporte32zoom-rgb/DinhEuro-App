// Service to fetch and parse data from AwesomeAPI
// Endpoint: https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL,ETH-BRL

export interface AwesomeItem {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

export interface AwesomeApiResponse {
  USDBRL?: AwesomeItem;
  EURBRL?: AwesomeItem;
  GBPBRL?: AwesomeItem;
  BTCBRL?: AwesomeItem;
  ETHBRL?: AwesomeItem;
  [key: string]: AwesomeItem | undefined;
}

export interface NormalizedQuote {
  symbol: string;
  pair: string;
  name: string;
  currency: string;
  bid: number;
  ask: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  createDate: string;
  timestamp: number;
  formattedBid: string;
  formattedAsk: string;
  formattedChange: string;
  isPositive: boolean;
}

export interface AwesomeRatesResult {
  quotes: Record<string, NormalizedQuote>;
  raw: AwesomeApiResponse;
  lastCreateDate: string;
  lastFetchTime: Date;
  source: "awesomeapi_direct" | "awesomeapi_proxy" | "fallback";
}

// Format number into Brazilian Real standard
export function formatBrl(value: number, minDecimals: number = 2, maxDecimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return "R$ 0,00";
  const safeMin = Math.max(0, Math.min(20, Math.floor(minDecimals)));
  const safeMax = Math.max(safeMin, Math.min(20, Math.floor(maxDecimals)));
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: safeMin,
    maximumFractionDigits: safeMax,
  }).format(value);
}

// Format decimal number in pt-BR
export function formatNumberPtBr(value: number, minDecimals: number = 2, maxDecimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return "0,00";
  const safeMin = Math.max(0, Math.min(20, Math.floor(minDecimals)));
  const safeMax = Math.max(safeMin, Math.min(20, Math.floor(maxDecimals)));
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: safeMin,
    maximumFractionDigits: safeMax,
  }).format(value);
}

// Format percent
export function formatPercentPtBr(pct: number): string {
  if (isNaN(pct)) return "0,00%";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${formatNumberPtBr(pct, 2, 2)}%`;
}

// Parse AwesomeItem into normalized quote
export function normalizeAwesomeItem(key: string, item: AwesomeItem): NormalizedQuote {
  const bid = parseFloat(item.bid) || 0;
  const ask = parseFloat(item.ask) || bid;
  const high = parseFloat(item.high) || bid;
  const low = parseFloat(item.low) || bid;
  const change = parseFloat(item.varBid) || 0;
  const changePercent = parseFloat(item.pctChange) || 0;
  const isCrypto = item.code === "BTC" || item.code === "ETH";
  const decimals = isCrypto ? 2 : 4;

  const symbolMap: Record<string, string> = {
    USDBRL: "USDBRL",
    EURBRL: "EURBRL",
    GBPBRL: "GBPBRL",
    BTCBRL: "BTCBRL",
    ETHBRL: "ETHBRL",
  };

  return {
    symbol: symbolMap[key] || key,
    pair: `${item.code}/${item.codein}`,
    name: item.name,
    currency: item.codein || "BRL",
    bid,
    ask,
    high,
    low,
    change,
    changePercent,
    createDate: item.create_date || new Date().toISOString(),
    timestamp: parseInt(item.timestamp, 10) * 1000 || Date.now(),
    formattedBid: formatBrl(bid, decimals, decimals),
    formattedAsk: formatBrl(ask, decimals, decimals),
    formattedChange: formatPercentPtBr(changePercent),
    isPositive: changePercent >= 0,
  };
}

// High-fidelity fallback quotes
function getFallbackAwesomeRates(): AwesomeRatesResult {
  const now = new Date();
  const dateStr = now.toISOString().replace("T", " ").substring(0, 19);

  const fallbackRaw: AwesomeApiResponse = {
    USDBRL: {
      code: "USD",
      codein: "BRL",
      name: "Dólar Americano/Real Brasileiro",
      high: "5.7920",
      low: "5.7480",
      varBid: "-0.0150",
      pctChange: "-0.26",
      bid: "5.7620",
      ask: "5.7650",
      timestamp: String(Math.floor(Date.now() / 1000)),
      create_date: dateStr,
    },
    EURBRL: {
      code: "EUR",
      codein: "BRL",
      name: "Euro/Real Brasileiro",
      high: "6.2750",
      low: "6.2180",
      varBid: "0.0210",
      pctChange: "0.34",
      bid: "6.2450",
      ask: "6.2480",
      timestamp: String(Math.floor(Date.now() / 1000)),
      create_date: dateStr,
    },
    GBPBRL: {
      code: "GBP",
      codein: "BRL",
      name: "Libra Esterlina/Real Brasileiro",
      high: "7.3450",
      low: "7.2900",
      varBid: "0.0150",
      pctChange: "0.21",
      bid: "7.3180",
      ask: "7.3220",
      timestamp: String(Math.floor(Date.now() / 1000)),
      create_date: dateStr,
    },
    BTCBRL: {
      code: "BTC",
      codein: "BRL",
      name: "Bitcoin/Real Brasileiro",
      high: "565000",
      low: "538000",
      varBid: "8500",
      pctChange: "1.85",
      bid: "554800",
      ask: "554900",
      timestamp: String(Math.floor(Date.now() / 1000)),
      create_date: dateStr,
    },
    ETHBRL: {
      code: "ETH",
      codein: "BRL",
      name: "Ethereum/Real Brasileiro",
      high: "16200",
      low: "15400",
      varBid: "320",
      pctChange: "2.11",
      bid: "15450",
      ask: "15460",
      timestamp: String(Math.floor(Date.now() / 1000)),
      create_date: dateStr,
    },
  };

  const quotes: Record<string, NormalizedQuote> = {};
  for (const [k, v] of Object.entries(fallbackRaw)) {
    if (v) quotes[k] = normalizeAwesomeItem(k, v);
  }

  return {
    quotes,
    raw: fallbackRaw,
    lastCreateDate: dateStr,
    lastFetchTime: now,
    source: "fallback",
  };
}

// Master fetch function that tries direct, proxy, and fallback
export async function fetchAwesomeRates(): Promise<AwesomeRatesResult> {
  const directUrl = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL,BTC-BRL,ETH-BRL";

  // 1. Try direct AwesomeAPI call from browser
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(directUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data: AwesomeApiResponse = await response.json();
      if (data && (data.USDBRL || data.EURBRL)) {
        const quotes: Record<string, NormalizedQuote> = {};
        for (const [k, v] of Object.entries(data)) {
          if (v) quotes[k] = normalizeAwesomeItem(k, v);
        }
        const createDate =
          data.EURBRL?.create_date ||
          data.USDBRL?.create_date ||
          new Date().toISOString().replace("T", " ").substring(0, 19);

        return {
          quotes,
          raw: data,
          lastCreateDate: createDate,
          lastFetchTime: new Date(),
          source: "awesomeapi_direct",
        };
      }
    }
  } catch (_directErr) {
    // Proceed to backend proxy
  }

  // 2. Try proxy endpoint via server.ts
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const proxyRes = await fetch("/api/awesome-rates", { signal: controller.signal });
    clearTimeout(timeout);

    if (proxyRes.ok) {
      const proxyResult = await proxyRes.json();
      const rawData = proxyResult.data || proxyResult;
      if (rawData && (rawData.USDBRL || rawData.EURBRL)) {
        const quotes: Record<string, NormalizedQuote> = {};
        for (const [k, v] of Object.entries(rawData as AwesomeApiResponse)) {
          if (v) quotes[k] = normalizeAwesomeItem(k, v);
        }
        return {
          quotes,
          raw: rawData,
          lastCreateDate: proxyResult.create_date || rawData.EURBRL?.create_date || new Date().toISOString(),
          lastFetchTime: new Date(),
          source: proxyResult.source === "awesomeapi_live" ? "awesomeapi_proxy" : "fallback",
        };
      }
    }
  } catch (_proxyErr) {
    // Proceed to resilient fallback
  }

  // 3. Resilient fallback to prevent UI freezing
  return getFallbackAwesomeRates();
}
