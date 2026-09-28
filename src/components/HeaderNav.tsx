import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Menu, 
  Bookmark, 
  Sparkles, 
  X,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Bell,
  BellRing
} from "lucide-react";
import { MarketAsset, MarketRegion } from "../types";
import { ALL_ASSETS } from "../data/marketData";
import { PWAInstallButton } from "./PWAInstallButton";

interface HeaderNavProps {
  activeRegion: MarketRegion;
  onSelectRegion: (region: MarketRegion) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onOpenDrawer: () => void;
  onOpenWatchlist: () => void;
  onOpenAiChat: (prompt?: string) => void;
  onOpenForexConverter?: () => void;
  onOpenPriceAlerts?: () => void;
  watchlistCount: number;
  priceAlertsCount?: number;
  hasTriggeredAlerts?: boolean;
}

export const CATEGORY_PILLS: MarketRegion[] = [
  "EUA",
  "Europa",
  "Ásia",
  "América Latina",
  "Moedas",
  "Criptomoedas",
  "Contratos futuros",
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeRegion,
  onSelectRegion,
  onSelectAsset,
  onOpenDrawer,
  onOpenWatchlist,
  onOpenAiChat,
  onOpenForexConverter,
  onOpenPriceAlerts,
  watchlistCount,
  priceAlertsCount = 0,
  hasTriggeredAlerts = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter assets based on search query
  const filteredAssets = searchQuery.trim()
    ? ALL_ASSETS.filter(
        (asset) =>
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (asset.sector && asset.sector.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectSearchedAsset = (asset: MarketAsset) => {
    onSelectAsset(asset);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0e1117]/95 backdrop-blur-md border-b border-[#21262d]">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand & Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDrawer}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#161b22] transition-colors focus:outline-none"
              aria-label="Abrir menu de navegação"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Name */}
            <div 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#003399] via-[#0055b8] to-[#009c3b] p-0.5 shadow-md shadow-blue-950/40 group-hover:scale-105 transition-transform flex items-center justify-center">
                <span className="font-extrabold text-white text-base tracking-tighter">D€</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-white text-lg tracking-tight">
                    DinhEuro
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded tracking-wide font-mono">
                    Finanças
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium hidden xs:inline">
                  Portal Global de Mercados & Câmbio
                </span>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar (Google Finance Style) */}
          <div 
            ref={searchContainerRef}
            className="flex-1 max-w-2xl relative mx-2 hidden sm:block"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Pesquise ações, ETFs, moedas e criptomoedas (ex: PETR4, S&P 500, EUR/BRL, BTC)..."
                className="w-full pl-10 pr-12 py-2 text-sm bg-[#161b22] text-slate-100 placeholder-slate-400 border border-[#30363d] rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#0e1117] border border-[#30363d] rounded">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Live Search Autocomplete Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150">
                <div className="px-3 py-2 border-b border-[#21262d] text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Resultados para "{searchQuery}"</span>
                  <span>{filteredAssets.length} ativos encontrados</span>
                </div>
                {filteredAssets.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#21262d]">
                    {filteredAssets.map((asset) => {
                      const isPositive = asset.changePercent >= 0;
                      return (
                        <div
                          key={asset.symbol}
                          onClick={() => handleSelectSearchedAsset(asset)}
                          className="px-4 py-3 hover:bg-[#21262d] cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#0e1117] border border-[#30363d] flex items-center justify-center font-bold text-xs text-white group-hover:border-blue-500 transition-colors">
                              {asset.symbol.slice(0, 3)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">
                                  {asset.symbol}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono bg-[#0e1117] px-1.5 py-0.5 rounded border border-[#30363d]">
                                  {asset.exchange}
                                </span>
                                <span className="text-[10px] text-blue-400 font-medium">
                                  {asset.region}
                                </span>
                              </div>
                              <div className="text-xs text-slate-300 truncate max-w-xs">
                                {asset.name}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-mono font-bold text-white text-sm">
                              {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
                              {asset.price.toLocaleString("pt-BR", {
                                minimumFractionDigits: asset.region === "Criptomoedas" ? 2 : asset.price < 10 ? 4 : 2,
                                maximumFractionDigits: asset.region === "Criptomoedas" ? 2 : asset.price < 10 ? 4 : 2,
                              })}
                            </div>
                            <div
                              className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                                isPositive ? "text-[#00c853]" : "text-[#ff5252]"
                              }`}
                            >
                              {isPositive ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <ArrowDownRight className="w-3 h-3" />
                              )}
                              <span>
                                {isPositive ? "+" : ""}
                                {asset.changePercent.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-400">
                    Nenhum ativo encontrado para "{searchQuery}". Tente pesquisar por código (ex: PETR4, VALE3, BTC, S&P 500).
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Quick Forex Converter Button */}
            {onOpenForexConverter && (
              <button
                onClick={onOpenForexConverter}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161b22] hover:bg-[#21262d] text-emerald-400 border border-emerald-800/40 text-xs font-semibold transition-all shadow-sm"
                title="Conversor de Moedas Forex em Tempo Real"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>Conversor FX</span>
              </button>
            )}

            {/* PWA Install Button in Header */}
            <PWAInstallButton variant="header" />

            {/* Price Alerts Bell Button */}
            {onOpenPriceAlerts && (
              <button
                onClick={onOpenPriceAlerts}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-sm ${
                  hasTriggeredAlerts
                    ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-amber-500/30 animate-pulse"
                    : "bg-[#161b22] hover:bg-[#21262d] text-slate-200 border-[#30363d]"
                }`}
                title="Sistema de Metas & Alertas de Preço"
              >
                {hasTriggeredAlerts ? (
                  <BellRing className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Bell className="w-3.5 h-3.5 text-slate-300" />
                )}
                <span className="hidden md:inline">Alertas</span>
                {priceAlertsCount > 0 && (
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      hasTriggeredAlerts
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {priceAlertsCount}
                  </span>
                )}
              </button>
            )}

            {/* Watchlist Quick Button */}
            <button
              onClick={onOpenWatchlist}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-[#30363d] text-xs font-semibold transition-all shadow-sm"
              title="Meu Portfólio & Listas salvas"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Minha Lista</span>
              {watchlistCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {watchlistCount}
                </span>
              )}
            </button>

            {/* DinhEuro AI Copilot Button */}
            <button
              onClick={() => onOpenAiChat()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md shadow-blue-950/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>IA DinhEuro</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Visible on mobile only) */}
        <div className="pb-3 sm:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Pesquisar ativos (PETR4, BTC, EUR...)"
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#161b22] text-slate-100 placeholder-slate-400 border border-[#30363d] rounded-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Mobile Search Results */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="mt-1 bg-[#161b22] border border-[#30363d] rounded-xl shadow-xl overflow-hidden divide-y divide-[#21262d]">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  onClick={() => handleSelectSearchedAsset(asset)}
                  className="p-2.5 flex items-center justify-between text-xs cursor-pointer active:bg-[#21262d]"
                >
                  <div>
                    <div className="font-bold text-white">{asset.symbol}</div>
                    <div className="text-slate-400 text-[10px] truncate max-w-[180px]">{asset.name}</div>
                  </div>
                  <div className="text-right font-mono font-bold text-white">
                    {asset.currency} {asset.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Pill Tabs (Google Finance Style) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t border-[#21262d]/60">
          {CATEGORY_PILLS.map((pill) => {
            const isActive = activeRegion === pill;
            return (
              <button
                key={pill}
                onClick={() => onSelectRegion(pill)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? "bg-[#21262d] text-white border border-blue-500/80 shadow-sm shadow-blue-500/20 font-bold"
                    : "bg-[#161b22] text-slate-300 hover:text-white hover:bg-[#21262d]/70 border border-[#30363d]/60"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
