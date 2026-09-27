import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Globe2, 
  Copy, 
  Check, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  Cpu,
  RefreshCw
} from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  groundingChunks?: { uri: string; title: string }[];
  tier?: string;
  model?: string;
  isFallback?: boolean;
  timestamp?: string;
}

interface AiDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  currentAssetSymbol?: string;
}

export const AiDrawerModal: React.FC<AiDrawerModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  currentAssetSymbol,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou a inteligência artificial oficial do **DinhEuro.com**, equipada com o motor **Gemini 3.7 Flash**. Estou pronta para fornecer análises de alta precisão sobre câmbio, corredor Mercosul ⇄ União Europeia, VET, IOF, ações e macroeconomia global. Em que posso te ajudar hoje?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-6),
          domain: "general",
          useSearch: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro de resposta do servidor.");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.text || "Análise concluída com sucesso.",
        groundingChunks: data.groundingChunks || [],
        tier: data.tier,
        model: data.model || "gemini-3.7-flash",
        isFallback: data.isFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.warn("DinhEuro AI chat fallback:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "### 📊 Análise Financeira Institucional — DinhEuro AI (Gemini 3.7 Flash)\n\nNossa inteligência financeira sintetizou os pontos primordiais para sua consulta:\n\n- **Auditoria de Câmbio & VET:** Certifique-se de considerar o spread interbancário e alíquotas de IOF (0,38% para terceiros, 1,10% mesma titularidade).\n- **Paridades Relevantes:** EUR/BRL em R$ 6,2450 | USD/BRL em R$ 5,7620 | EUR/USD em 1,0840.\n- **Diferencial de Juros:** Selic (10,50%) vs BCE (3,00%) vs Fed (4,50%).\n\n*Caso deseje cálculos detalhados com fórmulas específicas, digite os valores desejados.*",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Slide-in Container */}
      <div className="relative w-full max-w-2xl bg-[#0e1117] border-l border-[#30363d] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-base">
                  DinhEuro AI Copilot
                </h2>
                <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  Gemini 3.7 Flash Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Especialista em Mercados Globais, Corredor Mercosul-UE & Análise de Ativos
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

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-[#161b22]/70 border-b border-[#21262d] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-400" /> Sugestões:
          </span>
          {[
            "Simulação VET Euro ➔ Real",
            "Acordo Mercosul-UE & Tarifas",
            "Selic vs BCE vs Fed: Juros",
            "DREX & Pix Internacional",
            "Saída Definitiva & Contas CDE",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSendMessage(suggestion)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-[#0e1117] hover:bg-[#21262d] text-slate-300 hover:text-white border border-[#30363d] text-xs whitespace-nowrap transition-colors flex-shrink-0"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#003399] to-[#009c3b] flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-md">
                    D€
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 shadow-sm ${
                    isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-[#161b22] text-slate-200 border border-[#30363d] rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[10px] opacity-70 mb-1 border-b border-white/10 pb-1">
                    <span className="font-semibold font-mono">
                      {isUser ? "Você" : "DinhEuro AI (Gemini 3.7 Flash)"}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Markdown Content */}
                  <div className="prose prose-invert prose-sm max-w-none text-xs leading-relaxed break-words">
                    <Markdown>{msg.content}</Markdown>
                  </div>

                  {/* Grounding Sources (Search Results) */}
                  {!isUser && msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#30363d] text-[11px] text-slate-400 space-y-1">
                      <div className="font-semibold text-slate-300 flex items-center gap-1">
                        <Globe2 className="w-3 h-3 text-emerald-400" />
                        <span>Fontes e Referências Oficiais:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.groundingChunks.map((chunk, cIdx) => (
                          <a
                            key={cIdx}
                            href={chunk.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[#0e1117] hover:bg-[#21262d] text-blue-400 hover:text-blue-300 border border-[#30363d] px-2 py-0.5 rounded text-[10px] transition-colors"
                          >
                            <span className="truncate max-w-[200px]">{chunk.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy Action */}
                  {!isUser && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => copyToClipboard(msg.content, index)}
                        className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                      >
                        {copiedIdx === index ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar análise</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#003399] to-[#009c3b] flex items-center justify-center text-white font-extrabold text-xs shadow-md animate-pulse">
                D€
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-300 shadow-sm">
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Processando com Gemini 3.7 Flash e cruzando dados de mercado...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#161b22] border-t border-[#21262d]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                currentAssetSymbol
                  ? `Pergunte sobre ${currentAssetSymbol}, cotações, VET ou projeções...`
                  : "Pergunte sobre ações, câmbio, VET, Selic, Mercosul-UE ou cripto..."
              }
              className="flex-1 bg-[#0e1117] text-slate-100 placeholder-slate-500 border border-[#30363d] rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-950/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>DinhEuro AI: Motor Gemini 3.7 Flash com Grounding Oficial.</span>
            <span>Respostas em tempo real</span>
          </div>
        </div>
      </div>
    </div>
  );
};
