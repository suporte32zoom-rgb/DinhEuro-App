import React, { useState, useEffect, useMemo } from "react";
import { 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Copy, 
  Check, 
  Calculator, 
  Clock, 
  RefreshCw,
  Globe,
  Info,
  DollarSign,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Radio
} from "lucide-react";
import { fetchAwesomeRates, formatBrl, formatNumberPtBr } from "../services/awesomeApi";

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  type: "fiat" | "crypto";
  rateToBaseUSD: number; // USD = 1.0
  decimals: number;
  countryOrRegion: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "BRL", name: "Real Brasileiro", symbol: "R$", flag: "🇧🇷", type: "fiat", rateToBaseUSD: 0.1735, decimals: 2, countryOrRegion: "Brasil" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", type: "fiat", rateToBaseUSD: 1.0842, decimals: 2, countryOrRegion: "Zona do Euro" },
  { code: "USD", name: "Dólar Americano", symbol: "$", flag: "🇺🇸", type: "fiat", rateToBaseUSD: 1.0000, decimals: 2, countryOrRegion: "Estados Unidos" },
  { code: "GBP", name: "Libra Esterlina", symbol: "£", flag: "🇬🇧", type: "fiat", rateToBaseUSD: 1.2705, decimals: 2, countryOrRegion: "Reino Unido" },
  { code: "JPY", name: "Iene Japonês", symbol: "¥", flag: "🇯🇵", type: "fiat", rateToBaseUSD: 0.00656, decimals: 2, countryOrRegion: "Japão" },
  { code: "CHF", name: "Franco Suíço", symbol: "CHF", flag: "🇨🇭", type: "fiat", rateToBaseUSD: 1.1240, decimals: 2, countryOrRegion: "Suíça" },
  { code: "CAD", name: "Dólar Canadense", symbol: "C$", flag: "🇨🇦", type: "fiat", rateToBaseUSD: 0.7250, decimals: 2, countryOrRegion: "Canadá" },
  { code: "CNY", name: "Yuan Chinês", symbol: "¥", flag: "🇨🇳", type: "fiat", rateToBaseUSD: 0.1380, decimals: 2, countryOrRegion: "China" },
  { code: "AUD", name: "Dólar Australiano", symbol: "A$", flag: "🇦🇺", type: "fiat", rateToBaseUSD: 0.6540, decimals: 2, countryOrRegion: "Austrália" },
  { code: "BTC", name: "Bitcoin", symbol: "₿", flag: "⚡", type: "crypto", rateToBaseUSD: 96450.00, decimals: 6, countryOrRegion: "Global / Descentralizado" },
  { code: "ETH", name: "Ethereum", symbol: "Ξ", flag: "🌐", type: "crypto", rateToBaseUSD: 2680.00, decimals: 5, countryOrRegion: "Global / EVM" },
  { code: "SOL", name: "Solana", symbol: "SOL", flag: "🟣", type: "crypto", rateToBaseUSD: 205.00, decimals: 4, countryOrRegion: "Global / Solana" },
  { code: "USDT", name: "Tether USD", symbol: "USDT", flag: "🟢", type: "crypto", rateToBaseUSD: 1.0002, decimals: 2, countryOrRegion: "Stablecoin USD" },
  { code: "EURC", name: "Euro Coin", symbol: "EURC", flag: "🔵", type: "crypto", rateToBaseUSD: 1.0845, decimals: 2, countryOrRegion: "Stablecoin EUR (MiCA)" },
];

interface CurrencyConverterProps {
  onAskAi?: (prompt: string) => void;
  onOpenVetCalculator?: () => void;
  defaultFrom?: string;
  defaultTo?: string;
  compact?: boolean;
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  onAskAi,
  onOpenVetCalculator,
  defaultFrom = "EUR",
  defaultTo = "BRL",
  compact = false,
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCode, setFromCode] = useState<string>(defaultFrom);
  const [toCode, setToCode] = useState<string>(defaultTo);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [liveRates, setLiveRates] = useState<Record<string, number>>({});

  const [createDateStr, setCreateDateStr] = useState<string>("");

  // Fetch live market rates from AwesomeAPI on mount
  const fetchLiveRates = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchAwesomeRates();
      if (result && result.quotes) {
        const ratesMap: Record<string, number> = {};
        if (result.quotes.EURBRL) ratesMap["EUR_BRL"] = result.quotes.EURBRL.bid;
        if (result.quotes.USDBRL) ratesMap["USD_BRL"] = result.quotes.USDBRL.bid;
        if (result.quotes.GBPBRL) ratesMap["GBP_BRL"] = result.quotes.GBPBRL.bid;
        if (result.quotes.BTCBRL) ratesMap["BTC_BRL"] = result.quotes.BTCBRL.bid;
        if (result.quotes.ETHBRL) ratesMap["ETH_BRL"] = result.quotes.ETHBRL.bid;

        if (result.quotes.EURBRL && result.quotes.USDBRL && result.quotes.USDBRL.bid > 0) {
          ratesMap["EUR_USD"] = result.quotes.EURBRL.bid / result.quotes.USDBRL.bid;
        }

        setLiveRates(ratesMap);
        setCreateDateStr(result.lastCreateDate);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.warn("Using fallback static forex rates:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  const fromCurrency = useMemo(
    () => SUPPORTED_CURRENCIES.find((c) => c.code === fromCode) || SUPPORTED_CURRENCIES[1],
    [fromCode]
  );
  const toCurrency = useMemo(
    () => SUPPORTED_CURRENCIES.find((c) => c.code === toCode) || SUPPORTED_CURRENCIES[0],
    [toCode]
  );

  // Calculate dynamic spot exchange rate between fromCurrency and toCurrency
  const exchangeRate = useMemo(() => {
    if (fromCode === toCode) return 1;

    // Check specific live mapped pairs first
    if (fromCode === "EUR" && toCode === "BRL" && liveRates["EUR_BRL"]) return liveRates["EUR_BRL"];
    if (fromCode === "BRL" && toCode === "EUR" && liveRates["EUR_BRL"]) return 1 / liveRates["EUR_BRL"];
    if (fromCode === "USD" && toCode === "BRL" && liveRates["USD_BRL"]) return liveRates["USD_BRL"];
    if (fromCode === "BRL" && toCode === "USD" && liveRates["USD_BRL"]) return 1 / liveRates["USD_BRL"];
    if (fromCode === "EUR" && toCode === "USD" && liveRates["EUR_USD"]) return liveRates["EUR_USD"];
    if (fromCode === "USD" && toCode === "EUR" && liveRates["EUR_USD"]) return 1 / liveRates["EUR_USD"];
    if (fromCode === "GBP" && toCode === "BRL" && liveRates["GBP_BRL"]) return liveRates["GBP_BRL"];
    if (fromCode === "BRL" && toCode === "GBP" && liveRates["GBP_BRL"]) return 1 / liveRates["GBP_BRL"];

    // Base USD calculation
    const fromInUSD = fromCurrency.rateToBaseUSD;
    const toInUSD = toCurrency.rateToBaseUSD;
    return fromInUSD / toInUSD;
  }, [fromCode, toCode, fromCurrency, toCurrency, liveRates]);

  const inverseRate = useMemo(() => {
    return exchangeRate > 0 ? 1 / exchangeRate : 0;
  }, [exchangeRate]);

  const convertedValue = useMemo(() => {
    return (Number(amount) || 0) * exchangeRate;
  }, [amount, exchangeRate]);

  // Swap currencies handler
  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  // Preset amounts handler
  const handlePreset = (val: number) => {
    setAmount(val);
  };

  // Copy result to clipboard
  const handleCopyResult = () => {
    const toDec = Math.max(0, Math.min(20, toCurrency.decimals ?? 2));
    const toMinDec = Math.min(2, toDec);
    const textToCopy = `${amount.toLocaleString("pt-BR")} ${fromCode} = ${convertedValue.toLocaleString("pt-BR", {
      minimumFractionDigits: toMinDec,
      maximumFractionDigits: toDec,
    })} ${toCode} (Taxa: 1 ${fromCode} = ${exchangeRate.toFixed(4)} ${toCode})`;

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Ask AI about this FX pair and timing
  const handleAskAiAboutFx = () => {
    if (!onAskAi) return;
    const prompt = `Faça uma análise cambial e macroeconômica completa para a conversão de ${amount.toLocaleString()} ${fromCode} para ${toCode}.
- Cotação Spot Atual: 1 ${fromCode} = ${exchangeRate.toFixed(4)} ${toCode} (Inversa: 1 ${toCode} = ${inverseRate.toFixed(4)} ${fromCode})
- Diferencial de Políticas Monetárias (BCE, BACEN, Fed) e tendências de inflação
- Janela de oportunidade: O momento atual é favorável para fechamento de câmbio comercial ou remessa pessoal?
- Quais os custos de IOF e melhores práticas para minimizar o spread efetivo (VET)?`;

    onAskAi(prompt);
  };

  // Multi-currency comparison list
  const quickConversions = useMemo(() => {
    const keyTargets = ["BRL", "EUR", "USD", "GBP", "JPY", "CHF", "BTC"].filter(
      (c) => c !== fromCode
    );
    return keyTargets.map((code) => {
      const curr = SUPPORTED_CURRENCIES.find((c) => c.code === code)!;
      const rate = fromCurrency.rateToBaseUSD / curr.rateToBaseUSD;
      const total = (Number(amount) || 0) * rate;
      return {
        ...curr,
        rate,
        total,
      };
    });
  }, [fromCode, fromCurrency, amount]);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-6">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#21262d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003399] via-[#0055b8] to-[#009c3b] flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-950/40">
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Conversor de Moedas Forex
              </h2>
              <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full font-mono">
                Tempo Real
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cotações interbancárias atualizadas para BRL, EUR, USD, criptoativos e moedas globais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={fetchLiveRates}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1117] hover:bg-[#21262d] text-slate-300 border border-[#30363d] transition-all text-[11px]"
            title="Atualizar cotações do servidor"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Atualizando..." : "Atualizar"}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
          </div>
        </div>
      </div>

      {/* Main Converter Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Source Currency (From) */}
        <div className="lg:col-span-5 bg-[#0e1117] border border-[#30363d] focus-within:border-blue-500 rounded-2xl p-4 transition-all space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Você envia / Converte de</span>
            <span className="font-mono text-slate-400">{fromCurrency.countryOrRegion}</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              step="any"
              value={amount === 0 ? "" : amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
              placeholder="0,00"
              className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-white font-mono placeholder-slate-600 focus:outline-none"
            />

            {/* Currency Select */}
            <div className="relative shrink-0">
              <select
                value={fromCode}
                onChange={(e) => setFromCode(e.target.value)}
                className="appearance-none bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-white font-bold text-sm rounded-xl pl-9 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code} className="bg-[#161b22] text-white py-1">
                    {curr.code} — {curr.name}
                  </option>
                ))}
              </select>
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                {fromCurrency.flag}
              </span>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Currency Subtext */}
          <div className="text-[11px] text-slate-400 truncate">
            {fromCurrency.name} ({fromCurrency.symbol})
          </div>
        </div>

        {/* Swap Button Center */}
        <div className="lg:col-span-2 flex justify-center">
          <button
            onClick={handleSwap}
            title="Inverter Moedas"
            className="w-12 h-12 rounded-full bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-slate-200 hover:text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 group"
          >
            <ArrowRightLeft className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>

        {/* Target Currency (To) */}
        <div className="lg:col-span-5 bg-[#0e1117] border border-emerald-900/50 focus-within:border-emerald-500 rounded-2xl p-4 transition-all space-y-2 shadow-inner">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Você recebe / Equivalente em</span>
            <span className="font-mono text-emerald-400">{toCurrency.countryOrRegion}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-full text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 font-mono truncate select-all">
              {convertedValue.toLocaleString("pt-BR", {
                minimumFractionDigits: Math.min(2, Math.max(0, Math.min(20, toCurrency.decimals ?? 2))),
                maximumFractionDigits: Math.max(0, Math.min(20, toCurrency.decimals ?? 2)),
              })}
            </div>

            {/* Currency Select */}
            <div className="relative shrink-0">
              <select
                value={toCode}
                onChange={(e) => setToCode(e.target.value)}
                className="appearance-none bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-white font-bold text-sm rounded-xl pl-9 pr-8 py-2.5 cursor-pointer focus:outline-none focus:border-emerald-500 transition-colors shadow-sm"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code} className="bg-[#161b22] text-white py-1">
                    {curr.code} — {curr.name}
                  </option>
                ))}
              </select>
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-base pointer-events-none">
                {toCurrency.flag}
              </span>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Currency Subtext */}
          <div className="text-[11px] text-slate-400 truncate">
            {toCurrency.name} ({toCurrency.symbol})
          </div>
        </div>
      </div>

      {/* Quick Amount Preset Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-semibold text-slate-400 mr-1 whitespace-nowrap">
          Valores Rápidos:
        </span>
        {[100, 500, 1000, 5000, 10000, 50000].map((preset) => (
          <button
            key={preset}
            onClick={() => handlePreset(preset)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
              amount === preset
                ? "bg-blue-600 text-white font-bold shadow-sm"
                : "bg-[#0e1117] text-slate-300 hover:text-white hover:bg-[#21262d] border border-[#30363d]"
            }`}
          >
            {fromCurrency.symbol} {preset.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Spot Rate Banner & Breakdown */}
      <div className="bg-[#0e1117] border border-[#21262d] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Taxa Spot Interbancária Oficial:</span>
            <span className="font-mono font-bold text-white text-sm">
              1 {fromCode} = {exchangeRate.toFixed(4)} {toCode}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Paridade Inversa: 1 {toCode} = {inverseRate.toFixed(4)} {fromCode}
          </div>
        </div>

        {/* Action Buttons: Copy, Ask AI, Simulate VET */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyResult}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-[#30363d] text-xs font-semibold transition"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {onOpenVetCalculator && (
            <button
              onClick={onOpenVetCalculator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-emerald-400 border border-emerald-800/50 text-xs font-semibold transition"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simular VET & IOF</span>
            </button>
          )}

          {onAskAi && (
            <button
              onClick={handleAskAiAboutFx}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-90 text-white text-xs font-bold transition shadow-md shadow-blue-950/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Análise IA DinhEuro</span>
            </button>
          )}
        </div>
      </div>

      {/* Multi-Currency Quick Grid */}
      {!compact && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              Cotações Simultâneas de {amount.toLocaleString()} {fromCode}
            </span>
            <span>Base Spot em Tempo Real</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {quickConversions.map((item) => (
              <div
                key={item.code}
                onClick={() => setToCode(item.code)}
                className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                  toCode === item.code
                    ? "bg-blue-950/30 border-blue-500/80 shadow-md"
                    : "bg-[#0e1117] border-[#21262d] hover:border-slate-600 hover:bg-[#161b22]"
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span>{item.flag}</span>
                    <span>{item.code}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.symbol}
                  </span>
                </div>

                <div className="font-mono font-bold text-white text-sm truncate group-hover:text-emerald-400 transition-colors">
                  {item.total.toLocaleString("pt-BR", {
                    minimumFractionDigits: Math.min(2, Math.max(0, Math.min(20, item.decimals ?? 2))),
                    maximumFractionDigits: Math.max(Math.min(2, Math.max(0, Math.min(20, item.decimals ?? 2))), Math.min(20, item.decimals > 2 ? 4 : 2)),
                  })}
                </div>

                <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                  1 {fromCode} = {item.rate < 0.01 ? item.rate.toFixed(6) : item.rate.toFixed(3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
