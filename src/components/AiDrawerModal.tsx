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
  RefreshCw,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Cpu
} from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  groundingChunks?: { uri: string; title: string }[];
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
        "Olá! Sou o **DinhEuro AI**, seu copiloto de inteligência financeira institucional. Estou pronto para fornecer análises aprofundadas de mercados, índices globais, ações da B3/Wall Street, câmbio (EUR/BRL, VET), política monetária e estratégias de portfólio. Em que posso te ajudar hoje?",
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
        throw new Error("Erro de comunicação com o servidor DinhEuro AI.");
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.text || "Análise concluída com sucesso.",
        groundingChunks: data.groundingChunks || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Ocorreu uma oscilação na conexão com a rede de inteligência. Por favor, tente novamente ou formule sua pergunta com outro enfoque.",
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
                  Gemini 3.7 Flash Grounded
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

        {/* Quick Context Chips */}
        <div className="bg-[#161b22]/70 px-4 py-2 border-b border-[#21262d] flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 font-semibold flex-shrink-0 text-[11px]">
            Sugestões Rápidas:
          </span>
          {[
            "Resumo dos Mercados Globais Hoje",
            "Análise do Corredor Mercosul - UE",
            "Simulação VET Câmbio EUR/BRL",
            "Projeções de Juros Selic vs BCE",
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(promptText)}
              className="px-2.5 py-1 rounded-lg bg-[#0e1117] hover:bg-[#21262d] text-slate-300 hover:text-white border border-[#30363d] text-[11px] whitespace-nowrap transition-colors"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-sm">
                    <Bot className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-[#161b22] text-slate-200 border border-[#30363d] rounded-bl-none"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1 text-[10px] text-slate-400 font-mono">
                    <span>{isUser ? "Você" : "DinhEuro AI Engine"}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="space-y-3 prose-invert max-w-none text-slate-200">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  )}

                  {/* Grounding Source Chunks if available */}
                  {!isUser && msg.groundingChunks && msg.groundingChunks.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-[#21262d] text-[11px] text-slate-400">
                      <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
                        <Globe2 className="w-3 h-3 text-blue-400" />
                        <span>Fontes e Dados Oficiais Grounded:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.groundingChunks.slice(0, 3).map((chunk, cIdx) => (
                          <a
                            key={cIdx}
                            href={chunk.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-[#0e1117] hover:bg-[#21262d] text-blue-400 px-2 py-0.5 rounded border border-[#30363d] text-[10px] truncate max-w-[200px]"
                          >
                            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate">{chunk.title || chunk.uri}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assistant Copy Action */}
                  {!isUser && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="text-slate-400 hover:text-white text-[10px] flex items-center gap-1"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Análise</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#21262d] border border-[#30363d] flex-shrink-0 flex items-center justify-center text-slate-300 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 text-xs text-slate-300">
                <span className="font-semibold text-blue-400">DinhEuro AI está processando sua análise de mercado...</span>
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
              placeholder="Pergunte sobre ações, juros, câmbio, tarifas ou teses financeiras..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-[#0e1117] text-white placeholder-slate-400 border border-[#30363d] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white disabled:opacity-40 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-center text-[10px] text-slate-400 font-mono">
            Inteligência analítica institucional para tomadas de decisão fundamentadas.
          </div>
        </div>
      </div>
    </div>
  );
};
