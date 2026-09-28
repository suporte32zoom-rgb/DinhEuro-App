import React from "react";
import { 
  BellRing, 
  ArrowUpRight, 
  ArrowDownRight, 
  X, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Sliders,
  ExternalLink
} from "lucide-react";
import { PriceAlert, MarketAsset } from "../types";
import { ALL_ASSETS } from "../data/marketData";

interface PriceAlertBannerProps {
  triggeredAlerts: PriceAlert[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onOpenAlertsModal: () => void;
  onAskAi: (prompt: string) => void;
}

export const PriceAlertBanner: React.FC<PriceAlertBannerProps> = ({
  triggeredAlerts,
  onDismiss,
  onDismissAll,
  onSelectAsset,
  onOpenAlertsModal,
  onAskAi,
}) => {
  if (!triggeredAlerts || triggeredAlerts.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="bg-gradient-to-r from-amber-950/90 via-[#1f1b13] to-emerald-950/90 border-2 border-amber-500/80 rounded-2xl p-4 shadow-2xl shadow-amber-950/50 backdrop-blur-md relative overflow-hidden">
        {/* Glowing Background Radial */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/40 animate-bounce">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                  Gatilho de Preço Atingido!
                  <span className="bg-amber-400 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {triggeredAlerts.length} {triggeredAlerts.length === 1 ? "Meta Disparada" : "Metas Disparadas"}
                  </span>
                </h3>
              </div>
              <p className="text-xs text-amber-200/80">
                O monitoramento identificou que o valor de mercado atingiu seu alvo cadastrado no painel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAlertsModal}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-amber-500/40 text-xs font-semibold transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Gerenciar Metas</span>
            </button>
            {triggeredAlerts.length > 1 && (
              <button
                onClick={onDismissAll}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
              >
                Dispensar Todos
              </button>
            )}
          </div>
        </div>

        {/* Triggered Alert Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {triggeredAlerts.map((alert) => {
            const asset = ALL_ASSETS.find((a) => a.symbol === alert.symbol);
            const currentPrice = alert.triggeredPrice || (asset ? asset.price : alert.targetPrice);
            const currencySymbol = alert.currency === "BRL" ? "R$ " : alert.currency === "EUR" ? "€ " : "$ ";
            const isAbove = alert.condition === "above";

            const timeString = alert.triggeredAt
              ? new Date(alert.triggeredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Agora";

            return (
              <div
                key={alert.id}
                className="bg-[#161b22]/90 border border-amber-500/40 rounded-xl p-3 flex flex-col justify-between gap-2.5 shadow-md hover:border-amber-400 transition-all"
              >
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      {alert.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white text-sm">
                          {alert.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/60 font-semibold flex items-center gap-0.5">
                          {isAbove ? (
                            <>
                              <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />
                              ≥ Meta
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-2.5 h-2.5 text-rose-400" />
                              ≤ Meta
                            </>
                          )}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                        {alert.name}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDismiss(alert.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
                    title="Dispensar notificação"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pricing Details */}
                <div className="bg-[#0e1117]/80 rounded-lg p-2.5 border border-[#30363d] flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Preço de Mercado</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {currencySymbol}
                      {currentPrice.toLocaleString(undefined, {
                        minimumFractionDigits: currentPrice < 10 ? 4 : 2,
                        maximumFractionDigits: currentPrice < 10 ? 4 : 2,
                      })}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Sua Meta Definida</span>
                    <span className="font-bold text-amber-300 text-sm">
                      {currencySymbol}
                      {alert.targetPrice.toLocaleString(undefined, {
                        minimumFractionDigits: alert.targetPrice < 10 ? 4 : 2,
                        maximumFractionDigits: alert.targetPrice < 10 ? 4 : 2,
                      })}
                    </span>
                  </div>
                </div>

                {alert.notes && (
                  <div className="text-[11px] text-slate-300 italic bg-[#21262d]/40 px-2 py-1 rounded border border-[#30363d]/50">
                    "{alert.notes}"
                  </div>
                )}

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-[#30363d]/50 text-xs">
                  {asset && (
                    <button
                      onClick={() => onSelectAsset(asset)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span>Ver Ativo</span>
                    </button>
                  )}
                  <button
                    onClick={() =>
                      onAskAi(
                        `O ativo ${alert.symbol} (${alert.name}) atingiu o gatilho de preço de ${currencySymbol}${alert.targetPrice.toFixed(2)}. Qual a recomendação e análise técnica/fundamentalista no cenário atual?`
                      )
                    }
                    className="py-1.5 px-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-amber-300 font-semibold text-[11px] transition-colors flex items-center justify-center gap-1"
                    title="Analisar impacto com IA"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>IA</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
