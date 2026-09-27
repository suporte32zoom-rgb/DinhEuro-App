import React from "react";
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Flame, 
  Clock, 
  ExternalLink,
  Newspaper,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { MarketAsset, MarketNewsItem, LocalRankingStock } from "../types";
import { 
  MARKET_NEWS, 
  MOST_ACTIVE_STOCKS, 
  TOP_GAINERS_STOCKS, 
  TOP_LOSERS_STOCKS, 
  ALL_ASSETS 
} from "../data/marketData";

interface NewsAndTablesProps {
  onSelectAsset: (asset: MarketAsset) => void;
  onAskAiNews: (newsTitle: string) => void;
}

export const NewsAndTables: React.FC<NewsAndTablesProps> = ({
  onSelectAsset,
  onAskAiNews,
}) => {
  // Helper to resolve stock click to MarketAsset
  const handleStockClick = (symbol: string) => {
    const existing = ALL_ASSETS.find((a) => a.symbol === symbol);
    if (existing) {
      onSelectAsset(existing);
    } else {
      // Find approximate or create temporary preview
      const fallback = ALL_ASSETS.find((a) => a.symbol === "PETR4") || ALL_ASSETS[0];
      onSelectAsset({
        ...fallback,
        symbol: symbol,
        name: `${symbol} B3 Brasil`,
        exchange: "BVMF",
        region: "América Latina",
      });
    }
  };

  return (
    <div className="space-y-10 my-8">
      {/* 3-Column Grid for Equities Rankings (Google Finance Style) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Destaques da B3 & Ações Locais</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Rankings atualizados de liquidez, valorizações expressivas e correções do pregão
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: Mais Ativas */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h3 className="font-bold text-white text-sm">Mais Ativas</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Volume B3</span>
              </div>

              <div className="divide-y divide-[#21262d] mt-1">
                {MOST_ACTIVE_STOCKS.map((stock) => {
                  const isPositive = stock.changePercent >= 0;
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => handleStockClick(stock.symbol)}
                      className="py-3 flex items-center justify-between hover:bg-[#21262d]/70 px-2 rounded-xl cursor-pointer transition-colors group"
                    >
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                          {stock.symbol}
                        </div>
                        <div className="text-xs text-slate-400 truncate max-w-[120px]">
                          {stock.name}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-white text-sm">
                          R$ {stock.price.toFixed(2)}
                        </div>
                        <div
                          className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                            isPositive ? "text-[#00c853]" : "text-[#ff5252]"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isPositive ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#21262d] mt-2 text-center">
              <span className="text-[11px] text-slate-500 font-mono">
                Ordenado por volume financeiro total
              </span>
            </div>
          </div>

          {/* Column 2: Maiores Altas do Dia */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00c853]" />
                  <h3 className="font-bold text-white text-sm">Maiores Altas do Dia</h3>
                </div>
                <span className="text-[11px] text-[#00c853] font-bold font-mono">Top Bull</span>
              </div>

              <div className="divide-y divide-[#21262d] mt-1">
                {TOP_GAINERS_STOCKS.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock.symbol)}
                    className="py-3 flex items-center justify-between hover:bg-[#21262d]/70 px-2 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[120px]">
                        {stock.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-white text-sm">
                        R$ {stock.price.toFixed(2)}
                      </div>
                      <div className="text-xs font-bold text-[#00c853] flex items-center justify-end gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>+{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#21262d] mt-2 text-center">
              <span className="text-[11px] text-slate-500 font-mono">
                Maiores variações positivas da sessão
              </span>
            </div>
          </div>

          {/* Column 3: Maiores Quedas do Dia */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5252]" />
                  <h3 className="font-bold text-white text-sm">Maiores Quedas do Dia</h3>
                </div>
                <span className="text-[11px] text-[#ff5252] font-bold font-mono">Top Bear</span>
              </div>

              <div className="divide-y divide-[#21262d] mt-1">
                {TOP_LOSERS_STOCKS.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock.symbol)}
                    className="py-3 flex items-center justify-between hover:bg-[#21262d]/70 px-2 rounded-xl cursor-pointer transition-colors group"
                  >
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[120px]">
                        {stock.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-white text-sm">
                        R$ {stock.price.toFixed(2)}
                      </div>
                      <div className="text-xs font-bold text-[#ff5252] flex items-center justify-end gap-0.5">
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>{stock.changePercent.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#21262d] mt-2 text-center">
              <span className="text-[11px] text-slate-500 font-mono">
                Maiores variações negativas da sessão
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Mais Notícias do Mercado */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Mais notícias do mercado
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Feed em tempo real DinhEuro Wire
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKET_NEWS.map((news) => (
            <div
              key={news.id}
              className="bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-2xl p-4 transition-all duration-200 shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
                    {news.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {news.timeAgo}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
                  {news.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {news.snippet}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#21262d] flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold truncate max-w-[150px]">
                  {news.publisher}
                </span>

                <button
                  onClick={() => onAskAiNews(news.title)}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Análise IA</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
