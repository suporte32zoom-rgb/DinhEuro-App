import React from "react";
import { 
  X, 
  TrendingUp, 
  Bookmark, 
  PlusCircle, 
  Sparkles, 
  Globe2, 
  ShieldCheck, 
  DollarSign, 
  ChevronRight,
  ArrowRightLeft
} from "lucide-react";
import { MarketRegion } from "../types";
import { PWAInstallButton } from "./PWAInstallButton";

interface DrawerNavProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegion: (region: MarketRegion) => void;
  onOpenWatchlist: () => void;
  onOpenAiChat: (prompt?: string) => void;
  onOpenForexConverter?: () => void;
  onGoToOverview: () => void;
  onOpenToolTab?: (tab: string) => void;
}

export const DrawerNav: React.FC<DrawerNavProps> = ({
  isOpen,
  onClose,
  onSelectRegion,
  onOpenWatchlist,
  onOpenAiChat,
  onOpenForexConverter,
  onGoToOverview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-[#161b22] border-r border-[#30363d] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#003399] to-[#009c3b] flex items-center justify-center text-white font-extrabold text-sm">
              D€
            </div>
            <div>
              <div className="font-extrabold text-white text-base leading-none">
                DinhEuro.com
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Google Finance Architecture
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-sm">
          {/* PWA Install Promo Block in Drawer */}
          <div>
            <PWAInstallButton variant="drawer" />
          </div>

          {/* Main Navigation */}
          <div>
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navegação Principal
            </div>
            <div className="mt-1 space-y-1">
              <button
                onClick={() => {
                  onGoToOverview();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-[#21262d] font-medium transition-colors text-left"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Mercados (Visão Geral)</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenForexConverter) onOpenForexConverter();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-[#21262d] font-medium transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                  <span>Conversor de Moedas (Forex)</span>
                </div>
                <span className="text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.5 rounded font-mono">
                  LIVE
                </span>
              </button>

              <button
                onClick={() => {
                  onOpenWatchlist();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-[#21262d] font-medium transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>Minhas Listas & Portfólio</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  onOpenWatchlist();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-[#21262d] font-medium transition-colors text-left"
              >
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <span>Criar Novo Portfólio</span>
              </button>

              <button
                onClick={() => {
                  onOpenAiChat("Resumo global dos principais mercados acionários, câmbio e commodities hoje.");
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/40 text-blue-300 hover:text-white font-semibold transition-colors text-left"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Copiloto de IA DinhEuro</span>
              </button>
            </div>
          </div>

          {/* Regional Market Filters */}
          <div>
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Categorias de Mercado
            </div>
            <div className="mt-1 grid grid-cols-1 gap-1">
              {[
                { name: "EUA" as MarketRegion, count: "S&P 500, Nasdaq, Dow" },
                { name: "Europa" as MarketRegion, count: "DAX, FTSE, CAC, Euro Stoxx" },
                { name: "Ásia" as MarketRegion, count: "Nikkei, Hang Seng, SSE" },
                { name: "América Latina" as MarketRegion, count: "Ibovespa, PETR4, VALE3" },
                { name: "Moedas" as MarketRegion, count: "EUR/BRL, USD/BRL, EUR/USD" },
                { name: "Criptomoedas" as MarketRegion, count: "BTC, ETH, SOL, XRP" },
                { name: "Contratos futuros" as MarketRegion, count: "Petróleo, Ouro, Minério" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onGoToOverview();
                    onSelectRegion(item.name);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#21262d] text-xs transition-colors text-left"
                >
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{item.count}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Institutional Tools Hub */}
          <div>
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Motores Especializados
            </div>
            <div className="mt-1 space-y-1">
              <button
                onClick={() => {
                  if (onOpenForexConverter) {
                    onOpenForexConverter();
                  } else {
                    onOpenAiChat("Simule a conversão de Euro para Real calculando o VET com IOF de 1.1% e 0.38%.");
                  }
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#21262d] text-xs transition-colors text-left"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Conversor Forex & Simulador VET</span>
              </button>

              <button
                onClick={() => {
                  onOpenAiChat("Explique os termos do Acordo Mercosul - União Europeia e as tarifas aduaneiras NCM / TARIC.");
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#21262d] text-xs transition-colors text-left"
              >
                <Globe2 className="w-4 h-4 text-blue-400" />
                <span>Corredor Mercosul – União Europeia</span>
              </button>

              <button
                onClick={() => {
                  onOpenAiChat("Compare o DREX (CBDC brasileira), Pix Internacional e SEPA Instant para liquidação corporativa.");
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#21262d] text-xs transition-colors text-left"
              >
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Trilhos de Liquidação & DREX</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#21262d] bg-[#0e1117] text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300">DinhEuro Finance Engine</span>
            <span className="text-[10px] text-emerald-400 font-mono">v2.5 PWA</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Dados indicativos de mercado e análises com inteligência artificial Google Gemini integrada.
          </p>
        </div>
      </div>
    </div>
  );
};
