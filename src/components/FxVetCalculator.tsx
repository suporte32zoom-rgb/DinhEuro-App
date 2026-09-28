import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  ArrowRightLeft, 
  Percent, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { VetCalculationResult } from "../types";

interface FxVetCalculatorProps {
  onAskAi: (prompt: string, domain: "fx") => void;
}

export const FxVetCalculator: React.FC<FxVetCalculatorProps> = ({ onAskAi }) => {
  const [amount, setAmount] = useState<number>(10000);
  const [fromCurrency, setFromCurrency] = useState<string>("EUR");
  const [toCurrency, setToCurrency] = useState<string>("BRL");
  const [operationType, setOperationType] = useState<string>("availability");
  const [providerSpread, setProviderSpread] = useState<number>(1.2); // 1.2%
  const [fixedFee, setFixedFee] = useState<number>(0);
  const [result, setResult] = useState<VetCalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateVet = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fx/calculate-vet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount) || 1,
          fromCurrency,
          toCurrency,
          operationType,
          providerSpread: Number(providerSpread) / 100,
          fixedFee: Number(fixedFee) || 0,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("VET calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateVet();
  }, [amount, fromCurrency, toCurrency, operationType, providerSpread, fixedFee]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleSendToAi = () => {
    const operationName = 
      operationType === "availability" ? "Transferência de Mesma Titularidade (IOF 1,1%)" :
      operationType === "third_party" ? "Pagamento a Terceiros / Serviços (IOF 0,38%)" :
      operationType === "credit_card" ? "Cartão Internacional / Turismo (IOF 4,38%)" : "Retorno de Investimento / Dividendos (IOF 0,38%)";

    const prompt = `Por favor, elabore uma auditoria financeira minuciosa para a conversão de ${amount.toLocaleString()} ${fromCurrency} para ${toCurrency}.
Natureza da Operação: ${operationName}.
Parâmetros:
- Cotação Spot Indicativa: ${result?.spotRate || "Mercado"}
- Spread do Provedor: ${providerSpread}%
- Tarifa Fixa de Envio: ${fixedFee} ${fromCurrency}
- VET Calculado: ${result?.vet || "N/A"}
- Valor Líquido Entregue: ${result?.netReceived ? result.netReceived.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0,00"} ${toCurrency}

Avalie se esta estrutura de custos é ótima, quais documentos fiscais e regulatórios (BACEN / Receita Federal / Residência Fiscal) são exigidos e compare os trilhos SEPA/SWIFT versus PIX.`;

    onAskAi(prompt, "fx");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
                <Calculator className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Simulador de Arbitragem FX & Valor Efetivo Total (VET)
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Decomposição matemática exata do VET, alíquotas de IOF, spread bancário e comparação multi-provedores.
            </p>
          </div>

          <button
            onClick={handleSendToAi}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-xs hover:opacity-95 shadow-md shadow-emerald-950/50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auditar Cenário com DinhEuro AI</span>
          </button>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" /> Parâmetros da Remessa
          </h3>

          {/* Amount & Currency */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-400">Valor da Transação</label>
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-7 relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono font-bold text-base focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="col-span-5">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 font-semibold text-sm focus:border-emerald-500 focus:outline-none"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="BRL">BRL (R$)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Currency Swap Button */}
            <div className="flex justify-center my-1">
              <button
                type="button"
                onClick={handleSwapCurrencies}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                title="Inverter Moedas"
              >
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">Moeda de Destino</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 font-semibold text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="BRL">BRL (R$)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Operation Nature & Legal IOF */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400 flex items-center justify-between">
              <span>Natureza Fiscal & Alíquota IOF</span>
              <span className="text-[10px] text-emerald-400 font-mono">Decreto 6.306/2007</span>
            </label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
            >
              <option value="availability">Mesma Titularidade (Conta própria no exterior) • IOF 1,10%</option>
              <option value="third_party">Terceiros / Serviços / Família • IOF 0,38%</option>
              <option value="investment_return">Retorno de Investimento / Dividendos • IOF 0,38%</option>
              <option value="credit_card">Cartão Internacional / Câmbio Turismo • IOF 4,38%</option>
            </select>
          </div>

          {/* Custom Spread Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400">Spread do Provedor</span>
              <span className="font-mono text-emerald-400 font-bold">{providerSpread}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="5.0"
              step="0.1"
              value={providerSpread}
              onChange={(e) => setProviderSpread(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Fintech (0,5% - 1,2%)</span>
              <span>Conta Global (1,5% - 2,0%)</span>
              <span>Banco Tradicional (3,0% - 5,0%)</span>
            </div>
          </div>

          {/* Fixed Wire / Intermediary Fee */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-400">
              Tarifa Fixa de Envio / SWIFT ({fromCurrency})
            </label>
            <input
              type="number"
              min="0"
              value={fixedFee}
              onChange={(e) => setFixedFee(Math.max(0, Number(e.target.value)))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Decomposition & Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Output Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-900/60 rounded-2xl p-6 shadow-xl relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Valor Líquido Entregue
                </span>
                <div className="text-3xl font-extrabold text-white font-mono mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300">
                  {result ? result.netReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "..."} {toCurrency}
                </div>
                <p className="text-xs text-emerald-400 mt-0.5">
                  Montante líquido final creditado na conta do beneficiário
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Valor Efetivo Total (VET)
                </span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                  {result ? result.vet.toFixed(4) : "..."}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Engloba Spot + Spread + IOF + Custos Fixos por unidade
                </p>
              </div>
            </div>

            {/* Waterfall Cost Decomposition */}
            <div className="mt-4 space-y-2 text-xs">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Cascata de Decomposição de Custos
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Taxa Spot Interbancária (Base Oficial):</span>
                <span className="font-mono text-slate-200 font-semibold">{result?.spotRate.toFixed(4)}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Taxa Comercial após Spread ({providerSpread}%):</span>
                <span className="font-mono text-slate-200">{result?.effectiveCommercialRate.toFixed(4)}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80 text-rose-300">
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> Custo de Extração de Spread:
                </span>
                <span className="font-mono font-semibold">
                  - {result?.spreadCostLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80 text-amber-300">
                <span className="flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" /> Imposto IOF ({result?.iofRate}):
                </span>
                <span className="font-mono font-semibold">
                  - {result?.iofCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                </span>
              </div>

              {Number(fixedFee) > 0 && (
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80 text-rose-400">
                  <span>Tarifa Fixa Intermediária:</span>
                  <span className="font-mono font-semibold">- {fixedFee} {fromCurrency}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comparative Provider Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Matriz de Eficiência do Corredor</span>
              <span className="text-[11px] font-normal text-slate-400">Benchmarking em Tempo Real</span>
            </h4>

            <div className="space-y-2">
              {result?.providers.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all flex flex-wrap items-center justify-between gap-2 ${
                    idx === 0
                      ? "bg-emerald-950/40 border-emerald-700/80 shadow-sm shadow-emerald-950/50"
                      : "bg-slate-950/60 border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100">{p.name}</span>
                      {idx === 0 && (
                        <span className="text-[9px] uppercase font-extrabold bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-mono">
                          Ótimo
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Spread: {(p.spread * 100).toFixed(2)}%</span>
                      <span>•</span>
                      <span>Prazo: {p.time}</span>
                      <span>•</span>
                      <span className="text-slate-500">Trilho: {p.rail}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-slate-200">
                      {p.netReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      VET: <span className="font-semibold text-emerald-400">{p.vet.toFixed(4)}</span> (Custo: {p.totalCostPercentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
