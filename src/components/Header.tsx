import React, { useState, useEffect } from "react";
import { 
  Globe2, 
  Search, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  X,
  ChevronRight,
  Layers,
  FileText,
  Percent
} from "lucide-react";
import { MarketData } from "../types";

interface HeaderProps {
  marketData: MarketData | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  useSearchGrounding: boolean;
  setUseSearchGrounding: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({
  marketData,
  activeTab,
  setActiveTab,
  useSearchGrounding,
  setUseSearchGrounding,
}) => {
  const [timeStr, setTimeStr] = useState({
    utc: "",
    brt: "",
    cet: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimeStr({
        utc: now.toLocaleTimeString("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        brt: now.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }),
        cet: now.toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }),
      });
    };
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const rates = marketData?.rates || {
    "EUR/BRL": { spot: 6.245, change24h: 0.32 },
    "USD/BRL": { spot: 5.762, change24h: -0.15 },
    "EUR/USD": { spot: 1.084, change24h: 0.48 },
    "GBP/BRL": { spot: 7.318, change24h: 0.21 },
  };

  const navItems = [
    { id: "terminal", label: "Terminal de Inteligência", icon: Sparkles, badge: "Gemini 2.5 Flash" },
    { id: "calculator", label: "Arbitragem FX & VET", icon: TrendingUp, badge: "Matriz de IOF" },
    { id: "mercosur", label: "Corredor Mercosul – UE", icon: Globe2, badge: "Tarifas / NCM" },
    { id: "macro", label: "Macro & Bancos Centrais", icon: Activity, badge: "Selic vs BCE" },
    { id: "rails", label: "Rails de Liquidação & DREX", icon: ShieldCheck, badge: "PIX / SEPA / CBDC" },
  ];

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Ticker Bar with Live Telemetry */}
      <div className="border-b border-blue-950/60 bg-[#001433] px-4 py-1.5 text-xs text-slate-200 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-6 overflow-x-auto scrollbar-none py-0.5">
            <span className="flex items-center gap-1.5 font-bold text-[#ffcc00] shrink-0 text-[11px]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
              TELEMETRIA AO VIVO (BACEN • BCE • FED)
            </span>
            
            {Object.entries(rates).slice(0, 5).map(([pair, data]: [string, any]) => {
              const isPositive = data.change24h >= 0;
              return (
                <div key={pair} className="flex items-center gap-1.5 shrink-0 font-mono text-slate-200">
                  <span className="text-slate-400 text-[11px]">{pair}:</span>
                  <span className="font-bold text-white text-xs">{typeof data.spot === "number" ? data.spot.toFixed(data.spot > 100 ? 0 : 3) : data.spot}</span>
                  <span className={`inline-flex items-center text-[10px] font-semibold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {isPositive ? "+" : ""}{data.change24h}%
                  </span>
                </div>
              );
            })}

            <div className="hidden xl:flex items-center gap-4 text-slate-300 border-l border-blue-900/60 pl-4 text-[11px]">
              <span>Selic: <strong className="text-amber-300">10,50%</strong></span>
              <span>BCE: <strong className="text-blue-300">3,00%</strong></span>
              <span>Fed: <strong className="text-cyan-300">4,50%</strong></span>
            </div>
          </div>

          {/* Time Zones */}
          <div className="hidden sm:flex items-center gap-4 text-slate-300 font-mono text-[11px] shrink-0">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400/90" />
              <span>UTC: {timeStr.utc}</span>
              <span className="text-blue-900">|</span>
              <span>BRT 🇧🇷: {timeStr.brt}</span>
              <span className="text-blue-900">|</span>
              <span>CET 🇪🇺: {timeStr.cet}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estrutura do Topo DinhEuro (com o Degradê das duas bandeiras 🇪🇺 🇧🇷) */}
      <div className="dinheuro-header">
        <div className="header-container">
          {/* Logo Area */}
          <div 
            className="logo-area cursor-pointer select-none"
            onClick={() => setActiveTab("terminal")}
          >
            <img 
              src="/logo-dinheuro.svg" 
              alt="DinhEuro Logo" 
              className="logo-img" 
              onError={(e)=>{
                // Fallback if SVG fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <span className="brand-name">
                DinhEuro
                <span className="brand-name-ai">AI</span>
              </span>
              <p className="text-[11px] text-white/80 font-medium tracking-wide hidden sm:block">
                Corredor Mercosul – União Europeia • Arbitragem FX & VET • Inteligência Macroeconômica
              </p>
            </div>
          </div>

          {/* Right Controls Area: Search Grounding + Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Live Search Grounding Pill */}
            <button
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              title="Alternar Grounding de Pesquisa Google ao Vivo"
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all backdrop-blur-md ${
                useSearchGrounding
                  ? "bg-amber-400/20 border-[#ffcc00] text-amber-200 shadow-sm"
                  : "bg-black/20 border-white/20 text-white/70 hover:text-white"
              }`}
            >
              <Search className={`w-3.5 h-3.5 ${useSearchGrounding ? "text-[#ffcc00]" : "text-white/60"}`} />
              <span>Grounding:</span>
              <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                useSearchGrounding ? "bg-[#ffcc00] text-slate-950" : "bg-black/40 text-white/80"
              }`}>
                {useSearchGrounding ? "ATIVO" : "OFF"}
              </span>
            </button>

            {/* Menu Toggle Button */}
            <button 
              className="menu-toggle" 
              aria-label="Abrir Menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-7 h-7 text-white" />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar (Desktop) */}
      <div className="bg-[#00173d] border-b border-blue-900/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/40"
                      : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#ffcc00]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-md">
            <span>🇧🇷 ➔ 🇪🇺 Corredores Bilaterais</span>
          </div>
        </div>
      </div>

      {/* Mobile / Slide-Over Menu Dropdown */}
      {isMenuOpen && (
        <div className="bg-slate-950/95 border-b border-slate-800 backdrop-blur-xl shadow-2xl animate-fadeIn">
          <div className="max-w-7xl mx-auto p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" /> Navegação & Módulos DinhEuro
              </span>
              <span className="text-[11px] text-slate-400">Selecione o Módulo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-900/60 to-emerald-950/60 border-[#ffcc00] text-white shadow-lg"
                        : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-emerald-600 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? "bg-[#ffcc00] text-slate-950" : "bg-slate-800 text-emerald-400"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{item.label}</div>
                        <div className="text-[11px] text-slate-400">{item.badge}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => {
                  setUseSearchGrounding(!useSearchGrounding);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Google Search Grounding: <strong>{useSearchGrounding ? "Ativo (Live)" : "Desativado"}</strong></span>
              </button>

              <div className="text-slate-400 text-[11px]">
                Motor de Inteligência Financeira DinhEuro AI • Mercosul & União Europeia
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

