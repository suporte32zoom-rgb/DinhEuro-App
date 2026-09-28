import React, { useState, useMemo } from "react";
import { 
  X, 
  Bell, 
  BellRing, 
  Plus, 
  Trash2, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  TrendingUp, 
  Sliders, 
  Play, 
  RotateCcw, 
  Search,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { PriceAlert, MarketAsset } from "../types";
import { ALL_ASSETS } from "../data/marketData";

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: PriceAlert[];
  onAddAlert: (
    symbol: string,
    targetPrice: number,
    condition: "above" | "below",
    notes?: string
  ) => void;
  onRemoveAlert: (id: string) => void;
  onToggleActive: (id: string) => void;
  onResetAlert: (id: string) => void;
  onTriggerManually: (id: string) => void;
  onSimulatePrice: (symbol: string, newPrice: number) => void;
  onSelectAsset?: (asset: MarketAsset) => void;
  onAskAi: (prompt: string) => void;
  preselectedSymbol?: string;
}

export const PriceAlertsModal: React.FC<PriceAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onAddAlert,
  onRemoveAlert,
  onToggleActive,
  onResetAlert,
  onTriggerManually,
  onSimulatePrice,
  onSelectAsset,
  onAskAi,
  preselectedSymbol,
}) => {
  // Tab state: "create" | "active" | "history"
  const [activeTab, setActiveTab] = useState<"active" | "create" | "history">("active");

  // Form State for New Alert
  const [selectedSymbol, setSelectedSymbol] = useState<string>(
    preselectedSymbol || "EURBRL"
  );
  const [targetPriceInput, setTargetPriceInput] = useState<string>("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [notesInput, setNotesInput] = useState<string>("");
  const [searchAssetFilter, setSearchAssetFilter] = useState<string>("");

  // Sync preselected symbol if changed
  React.useEffect(() => {
    if (preselectedSymbol) {
      setSelectedSymbol(preselectedSymbol);
      const asset = ALL_ASSETS.find((a) => a.symbol === preselectedSymbol);
      if (asset) {
        setTargetPriceInput((asset.price * 1.03).toFixed(asset.price < 10 ? 4 : 2));
        setCondition("above");
      }
      setActiveTab("create");
    }
  }, [preselectedSymbol]);

  // Current selected asset in form
  const currentAsset = useMemo(() => {
    return ALL_ASSETS.find((a) => a.symbol === selectedSymbol) || ALL_ASSETS[0];
  }, [selectedSymbol]);

  // Initialize target price input if empty
  React.useEffect(() => {
    if (!targetPriceInput && currentAsset) {
      const defaultTarget = condition === "above" ? currentAsset.price * 1.03 : currentAsset.price * 0.97;
      setTargetPriceInput(defaultTarget.toFixed(currentAsset.price < 10 ? 4 : 2));
    }
  }, [currentAsset, condition, targetPriceInput]);

  if (!isOpen) return null;

  // Filter assets for dropdown
  const filteredAssetsList = ALL_ASSETS.filter(
    (a) =>
      a.symbol.toLowerCase().includes(searchAssetFilter.toLowerCase()) ||
      a.name.toLowerCase().includes(searchAssetFilter.toLowerCase())
  );

  const handleApplyPercentage = (pct: number) => {
    if (!currentAsset) return;
    const newTarget = currentAsset.price * (1 + pct / 100);
    setTargetPriceInput(newTarget.toFixed(currentAsset.price < 10 ? 4 : 2));
    setCondition(pct >= 0 ? "above" : "below");
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(targetPriceInput.replace(",", "."));
    if (isNaN(parsedTarget) || parsedTarget <= 0) return;

    onAddAlert(selectedSymbol, parsedTarget, condition, notesInput);
    setNotesInput("");
    setActiveTab("active");
  };

  const activeAlertsList = alerts.filter((a) => !a.triggered);
  const triggeredAlertsList = alerts.filter((a) => a.triggered);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0e1117] border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-base sm:text-lg">
                  Sistema de Monitoramento de Preços
                </h2>
                <span className="text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-full font-mono">
                  localStorage Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Defina metas para ativos e receba alertas visuais em tempo real no painel de controle.
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

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-[#21262d] bg-[#161b22] px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "active"
                ? "border-amber-400 text-amber-300 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Metas Ativas ({activeAlertsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("create")}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "create"
                ? "border-blue-500 text-blue-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Nova Meta</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "history"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Disparados ({triggeredAlertsList.length})</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: CREATE NEW ALERT */}
          {activeTab === "create" && (
            <form onSubmit={handleSaveAlert} className="space-y-5">
              <div className="bg-[#0e1117] border border-[#30363d] rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    <span>Configurar Alvo de Preço</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Armazenado no LocalStorage
                  </span>
                </div>

                {/* Asset Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    1. Selecione o Ativo Financeiro
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={selectedSymbol}
                      onChange={(e) => {
                        setSelectedSymbol(e.target.value);
                        const asset = ALL_ASSETS.find((a) => a.symbol === e.target.value);
                        if (asset) {
                          setTargetPriceInput((asset.price * 1.03).toFixed(asset.price < 10 ? 4 : 2));
                        }
                      }}
                      className="w-full bg-[#161b22] text-white border border-[#30363d] rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    >
                      {ALL_ASSETS.map((asset) => (
                        <option key={asset.symbol} value={asset.symbol}>
                          {asset.symbol} — {asset.name} ({asset.currency} {asset.price.toFixed(2)})
                        </option>
                      ))}
                    </select>

                    {/* Current Price Display Banner */}
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Preço de Mercado Atual</span>
                        <span className="font-extrabold text-white text-sm font-mono">
                          {currentAsset?.currency === "BRL" ? "R$ " : currentAsset?.currency === "EUR" ? "€ " : "$ "}
                          {currentAsset?.price.toLocaleString(undefined, {
                            minimumFractionDigits: currentAsset?.price < 10 ? 4 : 2,
                            maximumFractionDigits: currentAsset?.price < 10 ? 4 : 2,
                          })}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                        {currentAsset?.region}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Price & Condition */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      2. Condição do Gatilho
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCondition("above")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          condition === "above"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                            : "bg-[#161b22] text-slate-300 hover:text-white border border-[#30363d]"
                        }`}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Atingir ou Superar (≥)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCondition("below")}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          condition === "below"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-950"
                            : "bg-[#161b22] text-slate-300 hover:text-white border border-[#30363d]"
                        }`}
                      >
                        <ArrowDownRight className="w-3.5 h-3.5" />
                        <span>Atingir ou Cair (≤)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      3. Valor Alvo / Meta ({currentAsset?.currency})
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        value={targetPriceInput}
                        onChange={(e) => setTargetPriceInput(e.target.value)}
                        placeholder="Ex: 38.50"
                        required
                        className="w-full bg-[#161b22] text-white font-mono font-bold text-sm sm:text-base border border-[#30363d] rounded-xl px-3.5 py-2 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Percentage Helpers */}
                <div>
                  <div className="text-[11px] text-slate-400 mb-1.5 font-medium">
                    Ajuste rápido relativo ao preço atual:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[-10, -5, -2, -1, 1, 2, 5, 10, 20].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleApplyPercentage(pct)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                          pct > 0
                            ? "bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60"
                            : "bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60"
                        }`}
                      >
                        {pct > 0 ? `+${pct}%` : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    4. Nota Estratégica (Opcional)
                  </label>
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Ex: Gatilho de compra, Realização de lucros, Câmbio para remessa..."
                    className="w-full bg-[#161b22] text-white text-xs border border-[#30363d] rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("active")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:opacity-90 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-amber-950/50 flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Cadastrar Alerta de Preço</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ACTIVE ALERTS */}
          {activeTab === "active" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  Metas em Monitoramento Ativo ({activeAlertsList.length})
                </h3>
                <button
                  onClick={() => setActiveTab("create")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nova Meta</span>
                </button>
              </div>

              {activeAlertsList.length === 0 ? (
                <div className="bg-[#0e1117] border border-[#30363d] rounded-2xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-slate-400 mx-auto">
                    <Bell className="w-6 h-6 text-slate-500" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Nenhuma meta ativa no momento</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Cadastre metas de valor para ações, moedas e criptomoedas para ser avisado quando o preço for atingido.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-bold text-xs"
                  >
                    Criar Primeira Meta
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {activeAlertsList.map((alert) => {
                    const asset = ALL_ASSETS.find((a) => a.symbol === alert.symbol);
                    const currentPrice = asset ? asset.price : alert.initialPrice;
                    const currencySymbol = alert.currency === "BRL" ? "R$ " : alert.currency === "EUR" ? "€ " : "$ ";
                    const isAbove = alert.condition === "above";

                    const diff = alert.targetPrice - currentPrice;
                    const diffPercent = currentPrice > 0 ? (diff / currentPrice) * 100 : 0;
                    const progressRatio = Math.min(
                      100,
                      Math.max(0, isAbove ? (currentPrice / alert.targetPrice) * 100 : (alert.targetPrice / currentPrice) * 100)
                    );

                    return (
                      <div
                        key={alert.id}
                        className={`bg-[#0e1117] border rounded-xl p-4 space-y-3 transition-all ${
                          alert.active ? "border-[#30363d] hover:border-amber-500/60" : "border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center font-extrabold text-white text-xs">
                              {alert.symbol.slice(0, 3)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-white text-sm">
                                  {alert.symbol}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold">
                                  {isAbove ? "≥ Atingir/Superar" : "≤ Atingir/Cair"}
                                </span>
                                {!alert.active && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                    Pausado
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 truncate max-w-xs">
                                {alert.name}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-right">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Preço Atual</span>
                              <span className="font-bold text-white text-xs sm:text-sm">
                                {currencySymbol}
                                {currentPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: currentPrice < 10 ? 4 : 2,
                                  maximumFractionDigits: currentPrice < 10 ? 4 : 2,
                                })}
                              </span>
                            </div>
                            <div className="pl-3 border-l border-[#30363d]">
                              <span className="text-[10px] text-slate-400 block">Alvo / Meta</span>
                              <span className="font-extrabold text-amber-400 text-xs sm:text-sm">
                                {currencySymbol}
                                {alert.targetPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: alert.targetPrice < 10 ? 4 : 2,
                                  maximumFractionDigits: alert.targetPrice < 10 ? 4 : 2,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Towards Target */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>
                              Distância da Meta:{" "}
                              <strong className={diffPercent >= 0 ? "text-amber-400" : "text-emerald-400"}>
                                {diffPercent > 0 ? `+${diffPercent.toFixed(2)}%` : `${diffPercent.toFixed(2)}%`}
                              </strong>
                            </span>
                            <span>{progressRatio.toFixed(0)}% do Alvo</span>
                          </div>
                          <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden border border-[#30363d]/60">
                            <div
                              className="bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${progressRatio}%` }}
                            />
                          </div>
                        </div>

                        {alert.notes && (
                          <div className="text-[11px] text-slate-300 bg-[#161b22] px-2.5 py-1.5 rounded-lg border border-[#30363d]/50 italic">
                            "{alert.notes}"
                          </div>
                        )}

                        {/* Actions Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#21262d] text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onToggleActive(alert.id)}
                              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                                alert.active
                                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                                  : "bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                              }`}
                            >
                              {alert.active ? "Pausar" : "Ativar"}
                            </button>

                            {/* Test Simulation Button */}
                            <button
                              onClick={() => onTriggerManually(alert.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-amber-300 border border-amber-800/60 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              title="Testa o disparo visual simulando o gatilho atingido"
                            >
                              <Play className="w-3 h-3 text-amber-400" />
                              <span>Testar Disparo</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {asset && onSelectAsset && (
                              <button
                                onClick={() => {
                                  onSelectAsset(asset);
                                  onClose();
                                }}
                                className="text-blue-400 hover:text-blue-300 font-semibold text-[11px] flex items-center gap-1"
                              >
                                <TrendingUp className="w-3 h-3" />
                                <span>Ver Gráfico</span>
                              </button>
                            )}

                            <button
                              onClick={() => onRemoveAlert(alert.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              title="Excluir Alerta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TRIGGERED ALERTS HISTORY */}
          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm">
                  Histórico de Metas Atingidas ({triggeredAlertsList.length})
                </h3>
              </div>

              {triggeredAlertsList.length === 0 ? (
                <div className="bg-[#0e1117] border border-[#30363d] rounded-2xl p-8 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-sm">Nenhum gatilho disparado recentemente</h4>
                  <p className="text-xs text-slate-400">
                    Assim que as cotações de mercado atingirem as metas ativas, elas aparecerão listadas aqui e no banner do painel.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {triggeredAlertsList.map((alert) => {
                    const asset = ALL_ASSETS.find((a) => a.symbol === alert.symbol);
                    const currencySymbol = alert.currency === "BRL" ? "R$ " : alert.currency === "EUR" ? "€ " : "$ ";
                    const timeString = alert.triggeredAt
                      ? new Date(alert.triggeredAt).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "Recentemente";

                    return (
                      <div
                        key={alert.id}
                        className="bg-gradient-to-r from-amber-950/40 to-[#0e1117] border border-amber-500/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
                            <BellRing className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white text-sm">
                                {alert.symbol}
                              </span>
                              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded font-mono">
                                META ATINGIDA
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">{alert.name}</div>
                            <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                              Disparado em: {timeString}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Preço Registrado</span>
                            <span className="font-extrabold text-emerald-400 text-sm">
                              {currencySymbol}
                              {alert.targetPrice.toLocaleString(undefined, {
                                minimumFractionDigits: alert.targetPrice < 10 ? 4 : 2,
                                maximumFractionDigits: alert.targetPrice < 10 ? 4 : 2,
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 pl-2 border-l border-[#30363d]">
                            <button
                              onClick={() => onResetAlert(alert.id)}
                              className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Reativar monitoramento desta meta"
                            >
                              <RotateCcw className="w-3 h-3 text-emerald-400" />
                              <span>Reativar</span>
                            </button>

                            <button
                              onClick={() => onRemoveAlert(alert.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                              title="Remover do histórico"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0e1117] border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Monitoramento Contínuo com Armazenamento Local no Navegador</span>
          </div>

          <button
            onClick={() =>
              onAskAi(
                "Como definir metas de preço eficazes e stops técnicos para ações, moedas (EUR/BRL) e criptoativos?"
              )
            }
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Perguntar Estratégias de Metas à IA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
