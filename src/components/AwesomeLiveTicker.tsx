import React from "react";
import { 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Radio, 
  Sparkles,
  TrendingUp,
  Activity
} from "lucide-react";
import { NormalizedQuote, formatBrl, formatPercentPtBr, formatNumberPtBr } from "../services/awesomeApi";
import { MarketAsset } from "../types";

interface AwesomeLiveTickerProps {
  quotes: Record<string, NormalizedQuote>;
  lastCreateDate: string;
  isRefreshing: boolean;
  secondsUntilNextPoll: number;
  onRefresh: () => void;
  onSelectAssetBySymbol?: (symbol: string) => void;
}

export const AwesomeLiveTicker: React.FC<AwesomeLiveTickerProps> = ({
  quotes,
  lastCreateDate,
  isRefreshing,
  secondsUntilNextPoll,
  onRefresh,
  onSelectAssetBySymbol,
}) => {
  const items = [
    { key: "USDBRL", label: "Dólar Comercial", icon: "💵", flag: "🇺🇸", symbol: "USDBRL" },
    { key: "EURBRL", label: "Euro Comercial", icon: "💶", flag: "🇪🇺", symbol: "EURBRL" },
    { key: "GBPBRL", label: "Libra Esterlina", icon: "💷", flag: "🇬🇧", symbol: "GBPBRL" },
    { key: "BTCBRL", label: "Bitcoin", icon: "⚡", flag: "₿", symbol: "BTCBRL" },
    { key: "ETHBRL", label: "Ethereum", icon: "🌐", flag: "Ξ", symbol: "ETHBRL" },
  ];

  return (
    <div className="bg-[#161b22]/90 border border-[#30363d] rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md">
      {/* Header Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#21262d]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold font-mono">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>AwesomeAPI Tempo Real</span>
          </div>
          <span className="text-xs text-slate-400 hidden md:inline">
            Feed JSON Direto • Câmbio Interbancário & Cripto
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Última Cotação (create_date):{" "}
              <strong className="text-amber-300">{lastCreateDate || "Carregando..."}</strong>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
            <span>Sync: {secondsUntilNextPoll}s</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Atualizar cotações agora"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Ticker Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {items.map((item) => {
          const quote = quotes[item.key];
          const isPositive = quote ? quote.changePercent >= 0 : true;
          const bidValue = quote ? quote.bid : 0;
          const pctChange = quote ? quote.changePercent : 0;
          const isCrypto = item.key === "BTCBRL" || item.key === "ETHBRL";

          return (
            <div
              key={item.key}
              onClick={() => onSelectAssetBySymbol && onSelectAssetBySymbol(item.symbol)}
              className="bg-[#0e1117] border border-[#30363d] hover:border-blue-500/70 rounded-xl p-2.5 sm:p-3 cursor-pointer transition-all hover:scale-[1.02] group shadow-inner flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{item.flag}</span>
                  <div>
                    <span className="font-extrabold text-white text-xs block leading-tight">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block max-w-[90px]">
                      {item.label}
                    </span>
                  </div>
                </div>

                <div
                  className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                    isPositive
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                      : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  ) : (
                    <ArrowDownRight className="w-2.5 h-2.5" />
                  )}
                  <span>{formatPercentPtBr(pctChange)}</span>
                </div>
              </div>

              <div className="mt-1">
                <div className="text-xs sm:text-sm font-extrabold font-mono text-white group-hover:text-blue-400 transition-colors">
                  {formatBrl(bidValue, isCrypto ? 2 : 4, isCrypto ? 2 : 4)}
                </div>
                {quote && quote.ask > 0 && (
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between mt-0.5">
                    <span>Bid: {formatNumberPtBr(quote.bid, isCrypto ? 2 : 4)}</span>
                    <span>Ask: {formatNumberPtBr(quote.ask, isCrypto ? 2 : 4)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
