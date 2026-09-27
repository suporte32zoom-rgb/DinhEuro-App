import React, { useState } from "react";
import { 
  X, 
  Bookmark, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  ExternalLink,
  Sparkles,
  PieChart
} from "lucide-react";
import { MarketAsset } from "../types";
import { ALL_ASSETS } from "../data/marketData";

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  onRemoveSymbol: (symbol: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onAskAi: (prompt: string) => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  onRemoveSymbol,
  onSelectAsset,
  onAskAi,
}) => {
  const [activeTab, setActiveTab] = useState<"watchlist" | "portfolio">("watchlist");

  if (!isOpen) return null;

  const savedAssets = ALL_ASSETS.filter((a) => watchlistSymbols.includes(a.symbol));

  const totalValueBrl = savedAssets.reduce((acc, curr) => {
    return acc + (curr.currency === "BRL" ? curr.price : curr.price * 5.76);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0e1117] border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-none">
                Minhas Listas & Portfólio
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Monitore seus ativos prioritários em tempo real no DinhEuro
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {savedAssets.length > 0 ? (
            <>
              {/* Summary Stats Card */}
              <div className="bg-[#0e1117] border border-[#21262d] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total de Ativos Monitorados
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
                    {savedAssets.length} {savedAssets.length === 1 ? "Ativo" : "Ativos"}
                  </div>
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Faça uma análise de diversificação, correlação de risco e recomendação estratégica para a minha carteira composta por: ${savedAssets
                        .map((a) => a.symbol)
                        .join(", ")}.`
                    )
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Análise Geral com IA</span>
                </button>
              </div>

              {/* Assets List */}
              <div className="divide-y divide-[#21262d] border border-[#21262d] rounded-xl overflow-hidden bg-[#0e1117]/60">
                {savedAssets.map((asset) => {
                  const isPositive = asset.changePercent >= 0;
                  return (
                    <div
                      key={asset.symbol}
                      className="p-4 flex items-center justify-between hover:bg-[#21262d]/60 transition-colors group"
                    >
                      <div
                        onClick={() => {
                          onSelectAsset(asset);
                          onClose();
                        }}
                        className="cursor-pointer flex items-center gap-3 flex-1"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center font-bold text-xs text-white group-hover:border-blue-500 transition-colors">
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                              {asset.symbol}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d]">
                              {asset.exchange}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                            {asset.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-mono font-bold text-white text-sm">
                            {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
                            {asset.price.toFixed(2)}
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
                              {asset.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => onRemoveSymbol(asset.symbol)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-[#161b22] transition-colors"
                          title="Remover da lista"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#0e1117] border border-[#30363d] flex items-center justify-center text-slate-400 mx-auto">
                <Bookmark className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Sua lista está vazia</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Adicione índices, ações brasileiras (PETR4, VALE3), moedas (EUR/BRL) ou criptomoedas clicando em "+ Adicionar à lista" nas páginas dos ativos.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0e1117] border-t border-[#21262d] flex items-center justify-between text-xs text-slate-400">
          <span>Dados salvos localmente no seu dispositivo.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
