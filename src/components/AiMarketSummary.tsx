import React, { useState } from "react";
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  ArrowRight,
  Lightbulb,
  Cpu,
  ShieldAlert
} from "lucide-react";
import { MarketAccordionTopic, MarketRegion } from "../types";
import { REGIONAL_ACCORDION_TOPICS } from "../data/marketData";

interface AiMarketSummaryProps {
  activeRegion: MarketRegion;
  onAskAi: (prompt: string, domain?: string) => void;
}

export const AiMarketSummary: React.FC<AiMarketSummaryProps> = ({
  activeRegion,
  onAskAi,
}) => {
  const topics: MarketAccordionTopic[] = REGIONAL_ACCORDION_TOPICS[activeRegion] || [];
  const [expandedId, setExpandedId] = useState<string | null>(topics[0]?.id || null);

  // Sync expanded item if activeRegion changes and current expanded topic is no longer present
  React.useEffect(() => {
    if (topics.length > 0) {
      setExpandedId(topics[0].id);
    }
  }, [activeRegion]);

  const toggleTopic = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-6 my-6 shadow-xl relative overflow-hidden">
      {/* Subtle Glowing Aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header of Accordion Module */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#21262d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Resumo do Mercado com IA DinhEuro
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-950 border border-blue-800 text-blue-300 rounded-full font-mono uppercase">
                {activeRegion}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Análise em tempo real de liquidez, vetores macroeconômicos e teses setoriais
            </p>
          </div>
        </div>

        {/* Global AI Consult Button */}
        <button
          onClick={() =>
            onAskAi(
              `Faça uma análise executiva abrangente e aprofundada dos principais destaques do mercado em ${activeRegion} hoje, destacando tendências para os próximos pregões.`
            )
          }
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0e1117] hover:bg-[#21262d] border border-blue-500/40 hover:border-blue-500 text-blue-300 hover:text-white text-xs font-semibold transition-all shadow-sm group"
        >
          <Bot className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span>Consultar IA sobre {activeRegion}</span>
        </button>
      </div>

      {/* Accordion Topics List */}
      <div className="mt-4 space-y-3">
        {topics.map((topic) => {
          const isExpanded = expandedId === topic.id;
          return (
            <div
              key={topic.id}
              className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "bg-[#0e1117] border-blue-500/60 shadow-lg shadow-blue-950/20"
                  : "bg-[#0e1117]/60 border-[#21262d] hover:border-[#30363d]"
              }`}
            >
              {/* Accordion Trigger Header */}
              <button
                onClick={() => toggleTopic(topic.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left focus:outline-none select-none"
              >
                <div className="flex items-center gap-3">
                  {topic.sentiment === "bullish" ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00c853] shadow-sm shadow-emerald-500/50 flex-shrink-0" />
                  ) : topic.sentiment === "bearish" ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5252] shadow-sm shadow-red-500/50 flex-shrink-0" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">
                        {topic.categoryTag}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {topic.updatedTime}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                      {topic.title}
                    </h3>
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-[#161b22] text-slate-400 group-hover:text-white flex-shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Accordion Expanded Body */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-[#21262d]/80 space-y-3.5 animate-in fade-in-50 duration-150">
                  <p className="leading-relaxed text-slate-200 font-medium bg-[#161b22]/50 p-3 rounded-lg border border-[#30363d]/40">
                    {topic.summary}
                  </p>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Pontos Estratégicos Chave:
                    </div>
                    <ul className="space-y-1.5 list-none">
                      {topic.bulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button inside each expanded item */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161b22] p-3 rounded-xl border border-[#30363d]">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span>Dúvidas sobre o impacto deste evento no seu portfólio?</span>
                    </div>

                    <button
                      onClick={() => onAskAi(topic.aiPrompt)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-blue-900/30 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Aprenda mais com a IA do DinhEuro</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
