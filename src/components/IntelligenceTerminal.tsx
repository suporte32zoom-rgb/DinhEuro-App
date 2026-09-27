import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ShieldAlert,
  HelpCircle,
  Cpu,
  Layers,
  ArrowRight
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatMessage, FinancialDomain } from "../types";
import { QUICK_PROMPT_TEMPLATES } from "../data/financialKnowledge";

interface IntelligenceTerminalProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  useSearchGrounding: boolean;
  onNavigateTab?: (tab: string) => void;
  injectedPrompt?: string | null;
  onClearInjectedPrompt?: () => void;
}

export const IntelligenceTerminal: React.FC<IntelligenceTerminalProps> = ({
  messages,
  setMessages,
  useSearchGrounding,
  injectedPrompt,
  onClearInjectedPrompt,
}) => {
  const [input, setInput] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<FinancialDomain>("general");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of terminal
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle injected prompt from other calculators or buttons
  useEffect(() => {
    if (injectedPrompt) {
      setInput(injectedPrompt);
      if (onClearInjectedPrompt) {
        onClearInjectedPrompt();
      }
    }
  }, [injectedPrompt, onClearInjectedPrompt]);

  const handleSendMessage = async (textToSend?: string, domainOverride?: FinancialDomain) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const domain = domainOverride || selectedDomain;
    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      domain,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      // Build conversation history excluding errors
      const historyPayload = messages
        .filter((m) => !m.isError)
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageContent,
          history: historyPayload,
          domain,
          useSearch: useSearchGrounding,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Server failed to process query");
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        domain,
        groundingChunks: data.groundingChunks || [],
        searchQueries: data.searchQueries || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat invocation failed:", err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `**Telemetry Connection Notice:** ${err.message || "Failed to reach AI Intelligence Engine."}
\nPlease ensure your API parameters are reachable and retry your financial computation.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        domain,
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (!("speechSynthesis" in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech synthesis
    const cleanText = text.replace(/[#*`_\[\]()]/g, " ").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingId(id);
  };

  const domainOptions: { id: FinancialDomain; label: string; tag: string }[] = [
    { id: "general", label: "Escopo Global", tag: "Finanças Gerais" },
    { id: "fx", label: "Câmbio & Remessas", tag: "VET / Spreads" },
    { id: "mercosur_eu", label: "Mercosul – UE", tag: "Tarifas / Comércio" },
    { id: "macro", label: "Macro & Bancos Centrais", tag: "Selic / BCE / Fed" },
    { id: "tax_expat", label: "Expatriados & Tributário", tag: "Saída Def. / DTA" },
    { id: "crypto_rwa", label: "Rails & DREX", tag: "CBDC / Stablecoins" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-7xl mx-auto px-4 py-4">
      {/* Domain Mode Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-emerald-400" /> Especialidade:
          </span>
          {domainOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedDomain(opt.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                selectedDomain === opt.id
                  ? "bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-700/50"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-900 border border-transparent hover:border-slate-800"
            title="Limpar histórico do terminal"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar Histórico</span>
          </button>
        </div>
      </div>

      {/* Messages Output Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-4 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div
                className={`max-w-4xl rounded-xl p-4 shadow-md ${
                  isUser
                    ? "bg-emerald-950/80 border border-emerald-700/60 text-slate-100 ml-8"
                    : msg.isError
                    ? "bg-rose-950/50 border border-rose-800 text-rose-200"
                    : "bg-slate-900/90 border border-slate-800 text-slate-200 mr-8"
                }`}
              >
                {/* Header of message */}
                <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    {isUser ? (
                      <span className="font-semibold text-emerald-400">Consulta Solicitada</span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400" />
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                          Motor DinhEuro AI
                        </span>
                      </div>
                    )}
                    <span className="text-slate-500 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  {!isUser && !msg.isError && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className="text-slate-400 hover:text-emerald-400 p-1 rounded transition-colors"
                        title="Ouvir resposta em áudio"
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="text-slate-400 hover:text-slate-200 p-1 rounded transition-colors"
                        title="Copiar texto Markdown"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Markdown Content */}
                <div className="prose prose-invert prose-emerald max-w-none text-sm leading-relaxed prose-headings:font-bold prose-headings:text-slate-100 prose-table:border prose-table:border-slate-800 prose-th:bg-slate-950 prose-th:p-2 prose-td:p-2 prose-td:border-b prose-td:border-slate-800">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {/* Search Queries Executed Indicator */}
                {msg.searchQueries && msg.searchQueries.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center gap-1.5">
                    <Search className="w-3 h-3 text-cyan-400" />
                    <span className="text-slate-500">Consultas de Busca em Tempo Real:</span>
                    {msg.searchQueries.map((q, idx) => (
                      <span key={idx} className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-300 font-mono">
                        {q}
                      </span>
                    ))}
                  </div>
                )}

                {/* Search Grounding Sources Citations */}
                {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-emerald-400 mb-1.5 flex items-center gap-1">
                      <Search className="w-3 h-3" /> Fontes e Citações de Dados Oficiais Verificadas:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {msg.groundingChunks.map((chunk, idx) => (
                        <a
                          key={idx}
                          href={chunk.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-950/80 border border-slate-800 hover:border-emerald-700/60 text-xs text-slate-300 hover:text-emerald-300 transition-colors group"
                        >
                          <span className="truncate font-medium">{chunk.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 max-w-xl text-slate-300">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-xs font-semibold text-emerald-400 font-mono">
                  Motor DinhEuro Processando e Validando Dados de Mercado em Tempo Real...
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sintetizando taxas cambiais, diretrizes de bancos centrais, tabelas de tarifas e regras fiscais...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      {messages.length <= 2 && (
        <div className="py-2">
          <div className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Diretrizes e Consultas Financeiras Rápidas:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {QUICK_PROMPT_TEMPLATES.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedDomain(item.domain);
                  handleSendMessage(item.prompt, item.domain);
                }}
                className="text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-600/60 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-emerald-300 flex items-center justify-between">
                  <span>{item.label}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-slate-400 text-[11px] mt-1 line-clamp-2 leading-tight">
                  {item.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Input Box */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao DinhEuro AI: cotações FX, cálculo VET, tarifas Mercosul-UE, carry trade, Saída Definitiva..."
            disabled={isLoading}
            className="w-full bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl pl-4 pr-28 py-3 text-sm border border-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-lg"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isLoading || !input.trim()
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:opacity-95 shadow-md shadow-emerald-900/40"
              }`}
            >
              <span>Executar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 px-1">
          <div className="flex items-center gap-2">
            <span>Modelo: <strong className="text-slate-400">Gemini 2.5 Flash</strong></span>
            <span>•</span>
            <span>Grounding Google Search: <strong className={useSearchGrounding ? "text-emerald-400" : "text-slate-400"}>{useSearchGrounding ? "Ativo" : "Desativado"}</strong></span>
          </div>
          <span>Análise Financeira Institucional Imparcial e Rigorosa</span>
        </div>
      </div>
    </div>
  );
};
