import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Radio } from "lucide-react";
import { MarketAsset, MarketRegion } from "../types";
import { ALL_ASSETS } from "../data/marketData";
import { NormalizedQuote, formatBrl, formatNumberPtBr } from "../services/awesomeApi";

interface IndexCarouselProps {
  activeRegion: MarketRegion;
  onSelectAsset: (asset: MarketAsset) => void;
  selectedSymbol?: string;
  liveQuotes?: Record<string, NormalizedQuote>;
}

// Mini SVG Sparkline Component for Google Finance look
const MiniSparkline: React.FC<{ data: number[]; isPositive: boolean }> = ({ data, isPositive }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 36;
  const padding = 2;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const color = isPositive ? "#00c853" : "#ff5252";
  const gradientId = `spark-grad-${Math.random().toString(36).substring(2, 7)}`;

  // Area path for gradient fill
  const firstX = padding;
  const lastX = width - padding;
  const areaPath = `M ${points.split(" ")[0]} L ${points} L ${lastX},${height} L ${firstX},${height} Z`;

  return (
    <svg width={width} height={height} className="overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const IndexCarousel: React.FC<IndexCarouselProps> = ({
  activeRegion,
  onSelectAsset,
  selectedSymbol,
  liveQuotes,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter assets matching active region
  const regionAssets = ALL_ASSETS.filter((a) => a.region === activeRegion);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel my-4">
      {/* Scroll Navigation Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#161b22] hover:bg-[#21262d] text-slate-300 hover:text-white border border-[#30363d] shadow-lg flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden sm:flex"
        aria-label="Rolar para esquerda"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scroll Navigation Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#161b22] hover:bg-[#21262d] text-slate-300 hover:text-white border border-[#30363d] shadow-lg flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 focus:opacity-100 hidden sm:flex"
        aria-label="Rolar para direita"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Horizontal Cards Container */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3.5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
      >
        {regionAssets.map((asset) => {
          const liveQuote = liveQuotes?.[asset.symbol];
          const displayPrice = liveQuote ? liveQuote.bid : asset.price;
          const displayChange = liveQuote ? liveQuote.change : asset.change;
          const displayPercent = liveQuote ? liveQuote.changePercent : asset.changePercent;
          const isPositive = displayPercent >= 0;
          const isSelected = selectedSymbol === asset.symbol;
          const isCrypto = asset.region === "Criptomoedas";

          return (
            <div
              key={asset.symbol}
              onClick={() => onSelectAsset(asset)}
              className={`flex-shrink-0 w-64 sm:w-72 bg-[#161b22] hover:bg-[#21262d] border rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-md select-none group flex flex-col justify-between ${
                isSelected
                  ? "border-blue-500 ring-1 ring-blue-500 bg-[#21262d]"
                  : "border-[#30363d] hover:border-slate-500"
              }`}
            >
              {/* Card Header: Symbol & Name */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                      {asset.symbol}
                    </span>
                    {liveQuote && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="AwesomeAPI Live Feed" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-[#0e1117] px-1.5 py-0.5 rounded border border-[#30363d]">
                    {asset.exchange}
                  </span>
                </div>
                <div className="text-xs text-slate-300 truncate mt-0.5" title={asset.name}>
                  {asset.name}
                </div>
              </div>

              {/* Card Body: Price & Sparkline */}
              <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                  <div className="text-lg sm:text-xl font-mono font-extrabold text-white tracking-tight">
                    {asset.currency === "BRL" ? "R$ " : asset.currency === "EUR" ? "€ " : "$ "}
                    {displayPrice.toLocaleString("pt-BR", {
                      minimumFractionDigits: isCrypto ? 2 : displayPrice < 10 ? 4 : 2,
                      maximumFractionDigits: isCrypto ? 2 : displayPrice < 10 ? 4 : 2,
                    })}
                  </div>

                  <div
                    className={`flex items-center gap-1 text-xs font-bold mt-1 ${
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
                      {displayChange.toLocaleString("pt-BR", {
                        minimumFractionDigits: isCrypto ? 2 : displayPrice < 10 ? 4 : 2,
                        maximumFractionDigits: isCrypto ? 2 : displayPrice < 10 ? 4 : 2,
                      })}
                    </span>
                    <span>({isPositive ? "+" : ""}{displayPercent.toFixed(2)}%)</span>
                  </div>
                </div>

                {/* Mini Sparkline Chart */}
                <div className="flex-shrink-0">
                  <MiniSparkline data={asset.sparkline} isPositive={isPositive} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
