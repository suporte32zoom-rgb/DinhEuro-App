import React, { useState } from "react";
import { 
  Globe2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Landmark,
  Layers,
  FileCheck
} from "lucide-react";
import { TRADE_TARIFF_SCENARIOS, EXPAT_TAX_CHECKLIST } from "../data/financialKnowledge";

interface MercosurEuCorridorProps {
  onAskAi: (prompt: string, domain: "mercosur_eu" | "tax_expat") => void;
}

export const MercosurEuCorridor: React.FC<MercosurEuCorridorProps> = ({ onAskAi }) => {
  const [activeSubTab, setActiveSubTab] = useState<"trade" | "expat">("trade");
  const [selectedProduct, setSelectedProduct] = useState(TRADE_TARIFF_SCENARIOS[0]);

  const handleAskTradeAdvice = (scenario: typeof TRADE_TARIFF_SCENARIOS[0]) => {
    const prompt = `Realize uma análise econômica e aduaneira completa para importação/exportação de:
Produto: ${scenario.product} (NCM/SH: ${scenario.hsCode})
Corredor: ${scenario.origin} ➔ ${scenario.destination}
Tarifa Atual (Status Quo): ${scenario.currentTariff}
Termos do Acordo Mercosul-UE: ${scenario.postAgreementTariff} (Cronograma de transição: ${scenario.transitionYears})
Exigência de Regras de Origem: ${scenario.rulesOfOrigin}

Detalhe os procedimentos aduaneiros (Siscomex vs TARIC europeu), certificados de origem obrigatórios (EUR.1 / Declaração em Fatura) e requisitos fitossanitários, ambientais ou técnicos para o desembaraço aduaneiro.`;

    onAskAi(prompt, "mercosur_eu");
  };

  const handleAskExpatAdvice = (step: typeof EXPAT_TAX_CHECKLIST[0]) => {
    const prompt = `Necessito de orientação tributária internacional autoritativa referente à Etapa ${step.step}: "${step.title}" (${step.jurisdiction}).
Base Legal: ${step.legalBasis}
Aspectos Principais: ${step.details}
Risco Associado: ${step.risk}

Explique as declarações legais necessárias, o cálculo do DARF, conformidade bancária sob a Resolução BCB 277 para Conta CDE de Não Residente e como utilizar o Acordo de Bitributação (DTA) para evitar bitributação entre o Brasil e a União Europeia.`;

    onAskAi(prompt, "tax_expat");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Globe2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Hub do Corredor Econômico Mercosul – União Europeia
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Comércio bilateral, tarifas aduaneiras (NCM/TARIC), transição fiscal de expatriados e conformidade tributária.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveSubTab("trade")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === "trade"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Comércio & Tarifas Aduaneiras
            </button>
            <button
              onClick={() => setActiveSubTab("expat")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === "expat"
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Expatriados & Transição Fiscal
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === "trade" ? (
        /* Trade & Customs Section */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Product List */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Catálogo de Fluxos por Setor
            </h3>

            <div className="space-y-2">
              {TRADE_TARIFF_SCENARIOS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedProduct(item)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedProduct.id === item.id
                      ? "bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50"
                      : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-400 mb-1">
                    <span>{item.sector}</span>
                    <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
                      {item.hsCode}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-100">{item.product}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                    <span className="text-slate-300 font-medium">{item.origin}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-slate-300 font-medium">{item.destination}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Detailed Analysis of Selected Product */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-semibold text-cyan-400">
                  {selectedProduct.sector} • NCM/SH {selectedProduct.hsCode}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {selectedProduct.product}
                </h3>
              </div>
              <button
                onClick={() => handleAskTradeAdvice(selectedProduct)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-sm shadow-cyan-900/50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auditar Tarifas & Regras</span>
              </button>
            </div>

            {/* Tariff Comparison Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40">
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  Status Quo Atual (Sem Acordo)
                </span>
                <div className="text-lg font-bold text-white mt-1">
                  {selectedProduct.currentTariff}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Tarifa padrão NMF ou Tarifa Externa Comum (TEC) do Mercosul.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Tarifa sob o Acordo Mercosul – UE
                </span>
                <div className="text-lg font-bold text-white mt-1">
                  {selectedProduct.postAgreementTariff}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Cronograma: <strong className="text-emerald-300">{selectedProduct.transitionYears}</strong>
                </p>
              </div>
            </div>

            {/* Rules of Origin & Strategic Opportunity */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-cyan-400" /> Regras de Origem & Conformidade ESG
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedProduct.rulesOfOrigin}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Impacto Estratégico no Mercado
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {selectedProduct.keyOpportunity}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Expat Tax & Capital Relocation Section */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-cyan-400" /> Protocolo de Transição Fiscal & Não Residência
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Ao relocar patrimônio e residência fiscal entre o Brasil e países da União Europeia (Portugal, Espanha, Alemanha, França, Itália), etapas rigorosas devem ser seguidas para evitar bitributação global e garantir plena legalidade bancária.
            </p>

            {/* Step-by-Step Interactive Timeline */}
            <div className="mt-6 space-y-4">
              {EXPAT_TAX_CHECKLIST.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-800/80 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-300 font-extrabold flex items-center justify-center text-sm shrink-0 font-mono">
                      0{step.step}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-100">{step.title}</h4>
                        <span className="text-[10px] bg-slate-900 border border-slate-700 text-cyan-300 px-2 py-0.5 rounded-full font-medium">
                          {step.jurisdiction}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{step.details}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span><strong>Prazo:</strong> {step.deadline}</span>
                        <span>•</span>
                        <span className="font-mono text-cyan-400/90">{step.legalBasis}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 pt-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Risco de Não Conformidade:</strong> {step.risk}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleAskExpatAdvice(step)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-600 text-cyan-300 text-xs font-semibold transition-all whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auditar Etapa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
