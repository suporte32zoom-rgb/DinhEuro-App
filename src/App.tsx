import React, { useState, useEffect } from "react";
import { HeaderNav } from "./components/HeaderNav";
import { DrawerNav } from "./components/DrawerNav";
import { IndexCarousel } from "./components/IndexCarousel";
import { AiMarketSummary } from "./components/AiMarketSummary";
import { NewsAndTables } from "./components/NewsAndTables";
import { AssetDetailView } from "./components/AssetDetailView";
import { AiDrawerModal } from "./components/AiDrawerModal";
import { WatchlistModal } from "./components/WatchlistModal";
import { ForexConverterModal } from "./components/ForexConverterModal";
import { CurrencyConverter } from "./components/CurrencyConverter";
import { PriceAlertBanner } from "./components/PriceAlertBanner";
import { PriceAlertsModal } from "./components/PriceAlertsModal";
import { AwesomeLiveTicker } from "./components/AwesomeLiveTicker";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { MarketAsset, MarketRegion } from "./types";
import { ALL_ASSETS } from "./data/marketData";
import { usePriceAlerts } from "./hooks/usePriceAlerts";
import { useAwesomeRates } from "./hooks/useAwesomeRates";

export default function App() {
  // Navigation & View State
  const [activeRegion, setActiveRegion] = useState<MarketRegion>("EUA");
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);

  // Drawers and Modals State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiPromptToInject, setAiPromptToInject] = useState<string | undefined>(undefined);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState<boolean>(false);
  const [isForexModalOpen, setIsForexModalOpen] = useState<boolean>(false);

  // Price Monitoring & Alerts State
  const [isPriceAlertsModalOpen, setIsPriceAlertsModalOpen] = useState<boolean>(false);
  const [priceAlertPreselectedSymbol, setPriceAlertPreselectedSymbol] = useState<string | undefined>(undefined);

  const {
    alerts,
    activeTriggeredAlerts,
    totalTriggeredCount,
    activeAlertsCount,
    addAlert,
    removeAlert,
    toggleAlertActive,
    resetAlert,
    dismissNotification,
    dismissAllNotifications,
    triggerAlertManually,
    simulatePriceChange,
  } = usePriceAlerts();

  // AwesomeAPI Real-Time Rates Hook with 30s auto-polling
  const {
    quotes: awesomeQuotes,
    lastCreateDate: awesomeCreateDate,
    isRefreshing: isAwesomeRefreshing,
    secondsUntilNextPoll,
    refresh: refreshAwesomeRates,
  } = useAwesomeRates((symbol, price) => {
    simulatePriceChange(symbol, price);
  });

  // Watchlist Persistence in localStorage
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("dinheuro_watchlist");
      return saved ? JSON.parse(saved) : ["PETR4", "VALE3", "EURBRL", "BTCBRL", ".INX"];
    } catch {
      return ["PETR4", "VALE3", "EURBRL", "BTCBRL", ".INX"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("dinheuro_watchlist", JSON.stringify(watchlistSymbols));
    } catch (e) {
      console.warn("Failed to persist watchlist to localStorage:", e);
    }
  }, [watchlistSymbols]);

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleRemoveWatchlistSymbol = (symbol: string) => {
    setWatchlistSymbols((prev) => prev.filter((s) => s !== symbol));
  };

  const handleOpenAiWithPrompt = (prompt?: string) => {
    setAiPromptToInject(prompt);
    setIsAiModalOpen(true);
  };

  const handleOpenPriceAlertModal = (symbol?: string) => {
    setPriceAlertPreselectedSymbol(symbol);
    setIsPriceAlertsModalOpen(true);
  };

  const handleSelectAsset = (asset: MarketAsset) => {
    setSelectedAsset(asset);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectAssetBySymbol = (symbol: string) => {
    const asset = ALL_ASSETS.find((a) => a.symbol === symbol);
    if (asset) {
      handleSelectAsset(asset);
    }
  };

  const handleBackToOverview = () => {
    setSelectedAsset(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find active alert for the currently selected asset (if any)
  const activeAlertForSelectedAsset = selectedAsset
    ? alerts.find((a) => a.symbol === selectedAsset.symbol && a.active && !a.triggered)
    : undefined;

  // Find live quote for the currently selected asset (if any)
  const liveQuoteForSelectedAsset = selectedAsset
    ? awesomeQuotes[selectedAsset.symbol]
    : undefined;

  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Smart PWA Install Top Banner */}
      <PWAInstallBanner />

      {/* Google Finance Styled Global Header */}
      <HeaderNav
        activeRegion={activeRegion}
        onSelectRegion={(region) => {
          setActiveRegion(region);
          if (selectedAsset) setSelectedAsset(null);
        }}
        onSelectAsset={handleSelectAsset}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenAiChat={handleOpenAiWithPrompt}
        onOpenForexConverter={() => setIsForexModalOpen(true)}
        onOpenPriceAlerts={() => handleOpenPriceAlertModal()}
        watchlistCount={watchlistSymbols.length}
        priceAlertsCount={alerts.length}
        hasTriggeredAlerts={activeTriggeredAlerts.length > 0}
      />

      {/* Lateral Slide-Over Navigation Drawer */}
      <DrawerNav
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectRegion={(region) => {
          setActiveRegion(region);
          if (selectedAsset) setSelectedAsset(null);
        }}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onOpenAiChat={handleOpenAiWithPrompt}
        onOpenForexConverter={() => setIsForexModalOpen(true)}
        onOpenPriceAlerts={() => handleOpenPriceAlertModal()}
        priceAlertsCount={alerts.length}
        hasTriggeredAlerts={activeTriggeredAlerts.length > 0}
        onGoToOverview={handleBackToOverview}
      />

      {/* PRICE TARGET TRIGGER NOTIFICATION BANNER (Displays when prices reach defined targets) */}
      <PriceAlertBanner
        triggeredAlerts={activeTriggeredAlerts}
        onDismiss={dismissNotification}
        onDismissAll={dismissAllNotifications}
        onSelectAsset={handleSelectAsset}
        onOpenAlertsModal={() => handleOpenPriceAlertModal()}
        onAskAi={handleOpenAiWithPrompt}
      />

      {/* Main Content Area: Overview vs Detailed View */}
      <main className="flex-1 w-full pb-16">
        {selectedAsset ? (
          /* =========================================================================
             VIEW 2: PÁGINA INTERNA (VISÃO DETALHADA DO ATIVO/ÍNDICE)
             ========================================================================= */
          <AssetDetailView
            asset={selectedAsset}
            onBack={handleBackToOverview}
            onSelectAsset={handleSelectAsset}
            onToggleWatchlist={handleToggleWatchlist}
            isWatchlisted={watchlistSymbols.includes(selectedAsset.symbol)}
            onAskAi={handleOpenAiWithPrompt}
            onOpenPriceAlertForAsset={(symbol) => handleOpenPriceAlertModal(symbol)}
            activeAlertForAsset={activeAlertForSelectedAsset}
            liveQuote={liveQuoteForSelectedAsset}
            lastCreateDate={awesomeCreateDate}
          />
        ) : (
          /* =========================================================================
             VIEW 1: VISÃO GERAL (PÁGINA INICIAL DE MERCADOS)
             ========================================================================= */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-3">
            {/* 1. AWESOMEAPI REAL-TIME TICKER MODULE (Live Câmbio & Cripto) */}
            <AwesomeLiveTicker
              quotes={awesomeQuotes}
              lastCreateDate={awesomeCreateDate}
              isRefreshing={isAwesomeRefreshing}
              secondsUntilNextPoll={secondsUntilNextPoll}
              onRefresh={refreshAwesomeRates}
              onSelectAssetBySymbol={handleSelectAssetBySymbol}
            />

            {/* Top Market Banner / Live Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 pb-1 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
                <span className="font-semibold text-slate-300">Mercados Globais em Tempo Real</span>
                <span>•</span>
                <span className="font-mono">Filtro Ativo: {activeRegion}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <button
                  onClick={() => handleOpenPriceAlertModal()}
                  className="hover:text-amber-300 text-slate-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{alerts.length} Metas de Preço no LocalStorage</span>
                </button>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">AwesomeAPI • BACEN • BCE • Fed • NYSE • B3</span>
              </div>
            </div>

            {/* B. CARROSSEL DE CARDS DE ÍNDICES / ATIVOS (Topo Dinâmico) */}
            <IndexCarousel
              activeRegion={activeRegion}
              onSelectAsset={handleSelectAsset}
              selectedSymbol={selectedAsset?.symbol}
              liveQuotes={awesomeQuotes}
            />

            {/* FOREX REAL-TIME CONVERTER MODULE (Featured prominently on "Moedas" tab or accessible via modal) */}
            {activeRegion === "Moedas" && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <CurrencyConverter
                  onAskAi={handleOpenAiWithPrompt}
                  onOpenVetCalculator={() =>
                    handleOpenAiWithPrompt(
                      "Simule a conversão de Euro para Real calculando o VET com IOF de 1.1% e 0.38%."
                    )
                  }
                  defaultFrom="EUR"
                  defaultTo="BRL"
                />
              </div>
            )}

            {/* C. MÓDULO ACCORDION "RESUMO DO MERCADO COM IA DINHEURO" */}
            <AiMarketSummary
              activeRegion={activeRegion}
              onAskAi={handleOpenAiWithPrompt}
            />

            {/* D. NOTÍCIAS E TABELAS DE DESTAQUE (3 Colunas B3 + Feed) */}
            <NewsAndTables
              onSelectAsset={handleSelectAsset}
              onAskAiNews={(newsTitle) =>
                handleOpenAiWithPrompt(
                  `Analise o impacto econômico e no mercado da seguinte notícia: "${newsTitle}". O que os investidores institucionais devem monitorar?`
                )
              }
            />
          </div>
        )}
      </main>

      {/* Global Modals: AI Chat Copilot, Watchlist Manager, Forex Converter, and Price Alerts Manager */}
      <AiDrawerModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setAiPromptToInject(undefined);
        }}
        initialPrompt={aiPromptToInject}
        currentAssetSymbol={selectedAsset?.symbol}
      />

      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistSymbols}
        onRemoveSymbol={handleRemoveWatchlistSymbol}
        onSelectAsset={handleSelectAsset}
        onAskAi={handleOpenAiWithPrompt}
      />

      <ForexConverterModal
        isOpen={isForexModalOpen}
        onClose={() => setIsForexModalOpen(false)}
        onAskAi={handleOpenAiWithPrompt}
        defaultFrom="EUR"
        defaultTo="BRL"
      />

      {/* PRICE ALERTS & TARGETS MANAGEMENT MODAL */}
      <PriceAlertsModal
        isOpen={isPriceAlertsModalOpen}
        onClose={() => {
          setIsPriceAlertsModalOpen(false);
          setPriceAlertPreselectedSymbol(undefined);
        }}
        alerts={alerts}
        onAddAlert={addAlert}
        onRemoveAlert={removeAlert}
        onToggleActive={toggleAlertActive}
        onResetAlert={resetAlert}
        onTriggerManually={triggerAlertManually}
        onSimulatePrice={simulatePriceChange}
        onSelectAsset={handleSelectAsset}
        onAskAi={handleOpenAiWithPrompt}
        preselectedSymbol={priceAlertPreselectedSymbol}
      />

      {/* Offline Toast / Indicator */}
      <OfflineIndicator />

      {/* Institutional Footer */}
      <footer className="border-t border-[#21262d] bg-[#0e1117] py-6 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#003399] to-[#009c3b] flex items-center justify-center text-white font-extrabold text-[10px]">
              D€
            </div>
            <span className="font-bold text-slate-300">DinhEuro.com Finanças</span>
            <span>•</span>
            <span>Progressive Web App (PWA) Oficial</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button
              onClick={() => handleOpenPriceAlertModal()}
              className="hover:text-amber-400 transition-colors font-semibold text-slate-300"
            >
              Monitor de Metas de Preço
            </button>
            <span>•</span>
            <button
              onClick={() => setIsForexModalOpen(true)}
              className="hover:text-emerald-400 transition-colors font-semibold text-slate-300"
            >
              Conversor Forex em Tempo Real
            </button>
            <span>•</span>
            <button
              onClick={() =>
                handleOpenAiWithPrompt(
                  "Explique como o portal DinhEuro.com calcula o VET e analisa as taxas de câmbio de mercado."
                )
              }
              className="hover:text-blue-400 transition-colors"
            >
              Metodologia VET
            </button>
            <span>•</span>
            <button
              onClick={() =>
                handleOpenAiWithPrompt(
                  "Quais as principais regras fiscais de saída definitiva do Brasil (DSDP/CSDP) e contas CDE?"
                )
              }
              className="hover:text-blue-400 transition-colors"
            >
              Regulação Fiscal & CDE
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
