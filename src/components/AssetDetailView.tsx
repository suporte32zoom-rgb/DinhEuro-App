import React, { useState, useRef, useMemo } from "react";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bookmark, 
  Check, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Activity, 
  Globe2, 
  Building2, 
  User, 
  Clock, 
  ExternalLink, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  Calendar,
  DollarSign
} from "lucide-react";
import { MarketAsset, TimeRange, ChartType, ChartDataPoint, PriceAlert } from "../types";
import { ALL_ASSETS, MARKET_NEWS } from "../data/marketData";
import { CurrencyConverter } from "./CurrencyConverter";
import { Bell, BellRing } from "lucide-react";

interface AssetDetailViewProps {
  asset: MarketAsset;
  onBack: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onToggleWatchlist: (symbol: string) => void;
  isWatchlisted: boolean;
  onAskAi: (prompt: string) => void;
  onOpenPriceAlertForAsset?: (symbol: string) => void;
  activeAlertForAsset?: PriceAlert;
}

const TIME_RANGES: TimeRange[] = ["1D", "5D", "1M", "6M", "YTD", "1A", "5A", "MÁX"];

export const AssetDetailView: React.FC<AssetDetailViewProps> = ({
  asset,
  onBack,
  onSelectAsset,
  onToggleWatchlist,
  isWatchlisted,
  onAskAi,
  onOpenPriceAlertForAsset,
  activeAlertForAsset,
}) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1D");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [showBenchmark, setShowBenchmark] = useState<boolean>(false);
  const [showIndicators, setShowIndicators] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Active dataset for selected time range
  const dataPoints: ChartDataPoint[] = useMemo(() => {
    return asset.historical?.[selectedRange] || [];
  }, [asset, selectedRange]);

  // Derived values for chart rendering
  const minVal = useMemo(() => {
    if (!dataPoints.length) return asset.low || asset.price * 0.95;
    const vals = dataPoints.map((d) => d.value);
    if (showBenchmark) {
      dataPoints.forEach((d) => d.benchmarkValue && vals.push(d.benchmarkValue));
    }
    return Math.min(...vals);
  }, [dataPoints, showBenchmark, asset]);

  const maxVal = useMemo(() => {
    if (!dataPoints.length) return asset.high || asset.price * 1.05;
    const vals = dataPoints.map((d) => d.value);
    if (showBenchmark) {
      dataPoints.forEach((d) => d.benchmarkValue && vals.push(d.benchmarkValue));
    }
    return Math.max(...vals);
  }, [dataPoints, showBenchmark, asset]);

  const rangeSpan = maxVal - minVal || 1;
  const startVal = dataPoints[0]?.value || asset.open || asset.price;
  const currentDisplayVal = hoveredPoint ? hoveredPoint.value : asset.price;
  const changeFromStart = currentDisplayVal - startVal;
  const changePercentFromStart = startVal > 0 ? (changeFromStart / startVal) * 100 : 0;
  const isPositivePeriod = changePercentFromStart >= 0;

  // Primary chart stroke color based on current period trend
  const strokeColor = isPositivePeriod ? "#00c853" : "#ff5252";

  // Related assets mapping
  const relatedAssets = useMemo(() => {
    return ALL_ASSETS.filter(
      (a) =>
        a.symbol !== asset.symbol &&
        (asset.relatedSymbols?.includes(a.symbol) || a.region === asset.region)
    ).slice(0, 4);
  }, [asset]);

  // Related news mapping
  const relatedNews = useMemo(() => {
    return MARKET_NEWS.filter(
      (n) => n.relatedSymbol === asset.symbol || n.category.includes(asset.region)
    ).slice(0, 3);
  }, [asset]);

  // Handle Chart Hover Scrubbing
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartContainerRef.current || dataPoints.length < 2) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const ratio = Math.max(0, Math.min(1, x / width));
    const index = Math.round(ratio * (dataPoints.length - 1));
    if (dataPoints[index]) {
      setHoveredPoint(dataPoints[index]);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  // SVG Coordinates calculation
  const svgWidth = 800;
  const svgHeight = 320;
  const paddingX = 10;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingX * 2;

  const pointsString = useMemo(() => {
    if (dataPoints.length < 2) return "";
    return dataPoints
      .map((d, i) => {
        const x = paddingX + (i / (dataPoints.length - 1)) * chartWidth;
        const y = paddingTop + chartHeight - ((d.value - minVal) / rangeSpan) * chartHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [dataPoints, minVal, rangeSpan, chartHeight, chartWidth]);

  const benchmarkPointsString = useMemo(() => {
    if (!showBenchmark || dataPoints.length < 2) return "";
    return dataPoints
      .filter((d) => d.benchmarkValue !== undefined)
      .map((d, i) => {
        const x = paddingX + (i / (dataPoints.length - 1)) * chartWidth;
        const y = paddingTop + chartHeight - (((d.benchmarkValue || 0) - minVal) / rangeSpan) * chartHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [dataPoints, showBenchmark, minVal, rangeSpan, chartHeight, chartWidth]);

  // Area Fill Path
  const areaPath = useMemo(() => {
    if (!pointsString) return "";
    const firstPoint = pointsString.split(" ")[0];
    const lastX = paddingX + chartWidth;
    const bottomY = paddingTop + chartHeight;
    return `M ${firstPoint} L ${pointsString} L ${lastX},${bottomY} L ${paddingX},${bottomY} Z`;
  }, [pointsString, chartWidth, chartHeight]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-in fade-in-50 duration-200">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-slate-300 hover:text-white border border-[#30363d] text-xs font-semibold transition-all group shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar para Visão Geral dos Mercados</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Price Alert / Target Button */}
          {onOpenPriceAlertForAsset && (
            <button
              onClick={() => onOpenPriceAlertForAsset(asset.symbol)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                activeAlertForAsset
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500 shadow-amber-500/20"
                  : "bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-[#30363d]"
              }`}
              title="Definir meta de preço no LocalStorage"
            >
              {activeAlertForAsset ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>
                    Meta: {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
                    {activeAlertForAsset.targetPrice.toFixed(asset.price < 10 ? 4 : 2)}
                  </span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Definir Meta</span>
                </>
              )}
            </button>
          )}

          {/* Add to Watchlist Button */}
          <button
            onClick={() => onToggleWatchlist(asset.symbol)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isWatchlisted
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/60"
                : "bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-[#30363d]"
            }`}
          >
            {isWatchlisted ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Salvo na Lista</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>+ Adicionar à lista</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-slate-300 hover:text-white border border-[#30363d] transition-colors"
            title="Compartilhar cotação"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {shareCopied && (
            <span className="text-[11px] text-emerald-400 font-mono">Link copiado!</span>
          )}
        </div>
      </div>

      {/* A. CABEÇALHO DO ATIVO (Google Finance Standard) */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {asset.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 font-mono text-xs font-bold">
                {asset.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
              <span className="font-mono bg-[#0e1117] px-2 py-0.5 rounded border border-[#30363d] font-semibold text-slate-300">
                {asset.exchange}
              </span>
              <span>•</span>
              <span>{asset.region}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00c853] animate-pulse" />
                Mercado Aberto / Dados em tempo real
              </span>
            </div>
          </div>

          {/* Real-Time Price & Variation */}
          <div className="md:text-right">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
              {currentDisplayVal.toLocaleString(undefined, {
                minimumFractionDigits: asset.price < 10 ? 4 : 2,
                maximumFractionDigits: asset.price < 10 ? 4 : 2,
              })}
            </div>

            <div
              className={`text-sm sm:text-base font-bold flex items-center md:justify-end gap-1 mt-1 ${
                isPositivePeriod ? "text-[#00c853]" : "text-[#ff5252]"
              }`}
            >
              {isPositivePeriod ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>
                {isPositivePeriod ? "+" : ""}
                {changeFromStart.toLocaleString(undefined, {
                  minimumFractionDigits: asset.price < 10 ? 4 : 2,
                  maximumFractionDigits: asset.price < 10 ? 4 : 2,
                })}
              </span>
              <span>({isPositivePeriod ? "+" : ""}{changePercentFromStart.toFixed(2)}%)</span>
              <span className="text-xs text-slate-400 font-normal ml-1">
                {hoveredPoint ? `(${hoveredPoint.time})` : `no período [${selectedRange}]`}
              </span>
            </div>
          </div>
        </div>

        {/* B. GRÁFICO INTERATIVO DE ALTA PRECISÃO */}
        <div className="mt-6 pt-5 border-t border-[#21262d]">
          {/* Chart Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            {/* Left Controls: Display Type & Indicators */}
            <div className="flex items-center gap-2">
              <div className="bg-[#0e1117] p-1 rounded-xl border border-[#30363d] flex items-center gap-1">
                <button
                  onClick={() => setChartType("area")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    chartType === "area"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Área
                </button>
                <button
                  onClick={() => setChartType("line")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    chartType === "line"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Linha
                </button>
              </div>

              {/* Compare Benchmark Toggle */}
              <button
                onClick={() => setShowBenchmark(!showBenchmark)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  showBenchmark
                    ? "bg-indigo-950/80 text-indigo-300 border-indigo-500 shadow-sm"
                    : "bg-[#0e1117] text-slate-300 border-[#30363d] hover:border-slate-400"
                }`}
              >
                + Comparar (Benchmark)
              </button>

              {/* Indicators Toggle */}
              <button
                onClick={() => setShowIndicators(!showIndicators)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  showIndicators
                    ? "bg-teal-950/80 text-teal-300 border-teal-500 shadow-sm"
                    : "bg-[#0e1117] text-slate-300 border-[#30363d] hover:border-slate-400"
                }`}
              >
                Indicadores (SMA)
              </button>
            </div>

            {/* Right Controls: Time Range Selectors */}
            <div className="flex items-center gap-1 bg-[#0e1117] p-1 rounded-xl border border-[#30363d] overflow-x-auto no-scrollbar">
              {TIME_RANGES.map((range) => {
                const isActive = selectedRange === range;
                return (
                  <button
                    key={range}
                    onClick={() => {
                      setSelectedRange(range);
                      setHoveredPoint(null);
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                        : "text-slate-400 hover:text-white hover:bg-[#161b22]"
                    }`}
                  >
                    {range}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive SVG Chart Viewport */}
          <div
            ref={chartContainerRef}
            className="relative w-full h-72 sm:h-80 bg-[#0e1117] rounded-xl border border-[#21262d] p-2 overflow-hidden select-none"
          >
            <svg
              className="w-full h-full cursor-crosshair overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.25, 0.5, 0.75].map((factor) => {
                const y = paddingTop + chartHeight * factor;
                return (
                  <line
                    key={factor}
                    x1={paddingX}
                    y1={y}
                    x2={paddingX + chartWidth}
                    y2={y}
                    stroke="#21262d"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Baseline Reference Line */}
              <line
                x1={paddingX}
                y1={paddingTop + chartHeight - ((startVal - minVal) / rangeSpan) * chartHeight}
                x2={paddingX + chartWidth}
                y2={paddingTop + chartHeight - ((startVal - minVal) / rangeSpan) * chartHeight}
                stroke="#30363d"
                strokeDasharray="2 2"
                strokeWidth="1.2"
              />

              {/* Area Gradient Fill */}
              {chartType === "area" && areaPath && (
                <path d={areaPath} fill="url(#areaGradient)" />
              )}

              {/* Optional Benchmark Comparison Line */}
              {showBenchmark && benchmarkPointsString && (
                <polyline
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1.75"
                  strokeDasharray="3 3"
                  points={benchmarkPointsString}
                />
              )}

              {/* Main Asset Price Line */}
              {pointsString && (
                <polyline
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              )}

              {/* Market Milestone Annotations */}
              {dataPoints.map((d, i) => {
                if (!d.annotation) return null;
                const x = paddingX + (i / (dataPoints.length - 1)) * chartWidth;
                const y = paddingTop + chartHeight - ((d.value - minVal) / rangeSpan) * chartHeight;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="#ffcc00" stroke="#0e1117" strokeWidth="2" />
                    <line x1={x} y1={y} x2={x} y2={y - 18} stroke="#ffcc00" strokeWidth="1" />
                    <rect
                      x={x - 45}
                      y={y - 34}
                      width="90"
                      height="16"
                      rx="4"
                      fill="#161b22"
                      stroke="#ffcc00"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={y - 23}
                      textAnchor="middle"
                      fill="#ffcc00"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {d.annotation}
                    </text>
                  </g>
                );
              })}

              {/* Scrubbing Crosshair & Tooltip */}
              {hoveredPoint && (
                <g>
                  {(() => {
                    const idx = dataPoints.findIndex((p) => p.time === hoveredPoint.time);
                    if (idx === -1) return null;
                    const x = paddingX + (idx / (dataPoints.length - 1)) * chartWidth;
                    const y = paddingTop + chartHeight - ((hoveredPoint.value - minVal) / rangeSpan) * chartHeight;
                    return (
                      <>
                        <line
                          x1={x}
                          y1={paddingTop}
                          x2={x}
                          y2={paddingTop + chartHeight}
                          stroke="#64748b"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill={strokeColor}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      </>
                    );
                  })()}
                </g>
              )}
            </svg>

            {/* Dynamic Scrubbing Hover Badge */}
            {hoveredPoint && (
              <div className="absolute top-4 left-4 bg-[#161b22]/95 border border-blue-500/80 rounded-xl px-3 py-2 text-xs shadow-2xl backdrop-blur-md">
                <div className="font-mono text-slate-400 text-[10px]">
                  Horário / Ponto: {hoveredPoint.time}
                </div>
                <div className="font-mono font-bold text-white text-sm">
                  {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
                  {hoveredPoint.value.toFixed(2)}
                </div>
                {hoveredPoint.benchmarkValue && (
                  <div className="text-[10px] text-indigo-300 font-mono">
                    Benchmark: {hoveredPoint.benchmarkValue.toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timeframe Footnotes */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2 px-1">
            <span>Início: {dataPoints[0]?.time || "--"}</span>
            <span>Fechamento anterior: {asset.currency} {asset.prevClose.toFixed(2)}</span>
            <span>Atual: {dataPoints[dataPoints.length - 1]?.time || "--"}</span>
          </div>
        </div>
      </div>

      {/* C. PAINEL DE DADOS E MÉTRICAS ("Visão Geral" - Google Finance Grid) */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          <span>Visão Geral & Métricas Financeiras</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Abrir</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white mt-1">
              {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
              {asset.open.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Alta do Dia</div>
            <div className="text-sm sm:text-base font-bold font-mono text-[#00c853] mt-1">
              {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
              {asset.high.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Baixa do Dia</div>
            <div className="text-sm sm:text-base font-bold font-mono text-[#ff5252] mt-1">
              {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
              {asset.low.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Alto (52 sem)</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white mt-1">
              {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
              {asset.high52.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Baixo (52 sem)</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white mt-1">
              {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
              {asset.low52.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Fechamento Anterior</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white mt-1">
              {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
              {asset.prevClose.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Volume Financeiro</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white mt-1">
              {asset.volume}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Capitalização (Cap)</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white mt-1">
              {asset.marketCap || "--"}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Preço / Lucro (P/L)</div>
            <div className="text-sm sm:text-base font-bold font-mono text-white mt-1">
              {asset.peRatio ? `${asset.peRatio}x` : "--"}
            </div>
          </div>

          <div className="bg-[#0e1117] p-3.5 rounded-xl border border-[#21262d]">
            <div className="text-[11px] text-slate-400 font-medium">Dividend Yield (DY)</div>
            <div className="text-sm sm:text-base font-bold font-mono text-[#00c853] mt-1">
              {asset.dividendYield || "--"}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Live Currency Converter for Forex Assets */}
      {(asset.region === "Moedas" || asset.exchange === "FX") && (
        <div className="animate-in fade-in duration-200">
          <CurrencyConverter
            onAskAi={onAskAi}
            onOpenVetCalculator={() =>
              onAskAi(
                `Simule a conversão de ${asset.symbol.slice(0, 3)} para ${asset.symbol.slice(3) || "BRL"} calculando o VET com IOF de 1.1% e 0.38%.`
              )
            }
            defaultFrom={asset.symbol.slice(0, 3) || "EUR"}
            defaultTo={asset.symbol.slice(3) || "BRL"}
          />
        </div>
      )}

      {/* D. CARROSSEL "ATIVOS RELACIONADOS" */}
      {relatedAssets.length > 0 && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Ativos Relacionados & Correlacionados
              </h2>
              <p className="text-xs text-slate-400">
                Pares do mesmo setor ou mercado regional para comparação de performance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedAssets.map((rel) => {
              const isRelPositive = rel.changePercent >= 0;
              return (
                <div
                  key={rel.symbol}
                  onClick={() => onSelectAsset(rel)}
                  className="bg-[#0e1117] hover:bg-[#21262d] border border-[#21262d] hover:border-blue-500 rounded-xl p-4 cursor-pointer transition-all duration-150 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                      {rel.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d]">
                      {rel.exchange}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-1">{rel.name}</div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-mono font-bold text-white text-sm">
                      {rel.currency === "BRL" ? "R$ " : rel.currency === "EUR" ? "€ " : "$ "}
                      {rel.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isRelPositive ? "text-[#00c853]" : "text-[#ff5252]"
                      }`}
                    >
                      {isRelPositive ? "+" : ""}
                      {rel.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* E. FEED DEDICADO E PERFIL INSTITUCIONAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Institutional Profile & AI Terminal Box */}
        <div className="lg:col-span-2 space-y-6">
          {/* Institutional Profile */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Perfil Institucional & Sobre o Ativo</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {asset.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#21262d] text-xs">
              {asset.sector && (
                <div>
                  <span className="text-slate-400">Setor Econômico:</span>
                  <div className="font-semibold text-white mt-0.5">{asset.sector}</div>
                </div>
              )}
              {asset.headquarters && (
                <div>
                  <span className="text-slate-400">Sede Global:</span>
                  <div className="font-semibold text-white mt-0.5">{asset.headquarters}</div>
                </div>
              )}
              {asset.ceo && (
                <div>
                  <span className="text-slate-400">Diretor Executivo (CEO):</span>
                  <div className="font-semibold text-white mt-0.5">{asset.ceo}</div>
                </div>
              )}
              {asset.website && (
                <div>
                  <span className="text-slate-400">Portal de Relações com Investidores:</span>
                  <a
                    href={asset.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 mt-0.5"
                  >
                    <span>Acessar RI Oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* DinhEuro AI Copilot Prompt Box for this Asset */}
          <div className="bg-gradient-to-br from-blue-950/40 via-[#161b22] to-emerald-950/30 border border-blue-800/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <h3 className="text-base font-bold text-white">
                Análise com IA DinhEuro: {asset.symbol}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Explore teses de valuation, projeções de dividendos, análise gráfica e impactos macroeconômicos com o motor Google Gemini.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                `Quais as principais forças e riscos de investimento para ${asset.symbol} hoje?`,
                `Como o ciclo de juros (Selic / BCE / Fed) impacta diretamente ${asset.symbol}?`,
                `Análise de múltiplos e projeção de dividendos de ${asset.symbol}.`,
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskAi(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-[#0e1117] hover:bg-[#21262d] border border-blue-500/40 hover:border-blue-400 text-blue-300 hover:text-white text-xs font-semibold transition-all text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Asset Specific News Feed */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Notícias Relacionadas</span>
            </h2>

            <div className="space-y-4">
              {relatedNews.length > 0 ? (
                relatedNews.map((news) => (
                  <div
                    key={news.id}
                    className="p-3 rounded-xl bg-[#0e1117] border border-[#21262d] hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>{news.publisher}</span>
                      <span>{news.timeAgo}</span>
                    </div>
                    <div className="font-bold text-white text-xs leading-snug line-clamp-2">
                      {news.title}
                    </div>
                    <button
                      onClick={() => onAskAi(`Analise o impacto desta notícia no ativo ${asset.symbol}: "${news.title}"`)}
                      className="mt-2 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Impacto no preço com IA</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 p-4 text-center">
                  Acompanhe os comunicados ao mercado e fatos relevantes oficiais de {asset.symbol}.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-[#21262d] text-center mt-4">
            <span className="text-[11px] text-slate-500 font-mono">
              Fonte: CVM / SEC / Reuters / DinhEuro Wire
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
