import React, { useState } from "react";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Sparkles, 
  ShieldCheck, 
  BarChart3,
  Sliders,
  DollarSign
} from "lucide-react";
import { MarketData } from "../types";

interface MacroRadarProps {
  marketData: MarketData | null;
  onAskAi: (prompt: string, domain: "macro") => void;
}

export const MacroRadar: React.FC<MacroRadarProps> = ({ marketData, onAskAi }) => {
  // Carry trade simulator state
  const [borrowAmountEUR, setBorrowAmountEUR] = useState<number>(100000);
  const [borrowRateEUR, setBorrowRateEUR] = useState<number>(3.25); // Euribor / Funding cost %
  const [targetYieldBRL, setTargetYieldBRL] = useState<number>(10.50); // Selic / CDI %
  const [holdingPeriodMonths, setHoldingPeriodMonths] = useState<number>(12);
  const [spotEurBrl, setSpotEurBrl] = useState<number>(6.245);
  const [expectedFxFluctuation, setExpectedFxFluctuation] = useState<number>(0); // 0%

  // Calculations for Carry Trade
  const spot = spotEurBrl;
  const initialCapitalBRL = borrowAmountEUR * spot;
  const grossInterestBRL = initialCapitalBRL * (targetYieldBRL / 100) * (holdingPeriodMonths / 12);
  const interestCostEUR = borrowAmountEUR * (borrowRateEUR / 100) * (holdingPeriodMonths / 12);

  const futureSpot = spot * (1 + expectedFxFluctuation / 100);
  const totalFutureBRL = initialCapitalBRL + grossInterestBRL;
  const repatriatedEUR = totalFutureBRL / futureSpot;
  const netProfitEUR = repatriatedEUR - borrowAmountEUR - interestCostEUR;
  const netReturnPercent = (netProfitEUR / borrowAmountEUR) * 100;
  
  // Breakeven depreciation: when netProfitEUR == 0
  // (initialCapitalBRL + grossInterestBRL) / futureSpot = borrowAmountEUR + interestCostEUR
  const breakevenSpot = totalFutureBRL / (borrowAmountEUR + interestCostEUR);
  const breakevenDepreciationPercent = ((breakevenSpot - spot) / spot) * 100;

  const handleSimulateWithAi = () => {
    const prompt = `Realize uma análise macroeconômica e de política monetária da estratégia de Carry Trade EUR/BRL:
- Moeda de Funding: EUR (Custo: ${borrowRateEUR}% a.a.)
- Ativo de Destino: Títulos Públicos Brasileiros / CDI (${targetYieldBRL}% a.a.)
- Valor Nocional: €${borrowAmountEUR.toLocaleString()} (R$ ${initialCapitalBRL.toLocaleString()})
- Horizonte: ${holdingPeriodMonths} meses
- Spot Inicial: ${spotEurBrl}
- Ponto de Equilíbrio (Breakeven) de Depreciação do BRL: +${breakevenDepreciationPercent.toFixed(2)}% (Cotação Máxima EUR/BRL: ${breakevenSpot.toFixed(4)})

Analise a trajetória das decisões do COPOM (Banco Central do Brasil) versus BCE, projeções de inflação (IPCA vs HICP), riscos fiscais no Brasil e instrumentos recomendados para hedge cambial (NDF, Cupom Cambial, Futuro de DI).`;

    onAskAi(prompt, "macro");
  };

  const centralBanks = [
    {
      name: "Banco Central do Brasil (BCB)",
      rateName: "Taxa Selic Meta",
      rate: "10,50%",
      realYield: "+6,08%",
      inflation: "4,42% (IPCA)",
      trend: "Restritiva / Vigilante",
      color: "border-emerald-700 bg-emerald-950/20 text-emerald-400",
    },
    {
      name: "Banco Central Europeu (BCE)",
      rateName: "Taxa de Facilidade de Depósito",
      rate: "3,00%",
      realYield: "+0,90%",
      inflation: "2,10% (HICP)",
      trend: "Ciclo de Afrouxamento Gradual",
      color: "border-blue-700 bg-blue-950/20 text-blue-400",
    },
    {
      name: "Federal Reserve (Fed)",
      rateName: "Fed Funds Target",
      rate: "4,50%",
      realYield: "+1,80%",
      inflation: "2,70% (CPI)",
      trend: "Neutro Dependente de Dados",
      color: "border-cyan-700 bg-cyan-950/20 text-cyan-400",
    },
    {
      name: "Bank of England (BoE)",
      rateName: "Official Bank Rate",
      rate: "4,75%",
      realYield: "+2,15%",
      inflation: "2,60% (CPI)",
      trend: "Cortes Cautelosos",
      color: "border-amber-700 bg-amber-950/20 text-amber-400",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-950 border border-amber-800 text-amber-400">
                <Activity className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Radar Macroeconômico & Bancos Centrais
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Diferencial de juros, paridade da inflação e simulador de rentabilidade de Carry Trade transfronteiriço.
            </p>
          </div>

          <button
            onClick={handleSimulateWithAi}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-semibold text-xs hover:opacity-95 shadow-md shadow-amber-950/50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simular Regime Macroeconômico com IA</span>
          </button>
        </div>
      </div>

      {/* Central Bank Benchmarks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {centralBanks.map((cb, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${cb.color} flex flex-col justify-between shadow-lg`}
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {cb.name}
              </div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">{cb.rateName}</div>
              <div className="text-3xl font-extrabold text-white font-mono mt-2">{cb.rate}</div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Juro Real Ex-Ante:</span>
                <span className="font-mono font-bold text-white">{cb.realYield}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Taxa de Inflação:</span>
                <span className="font-mono text-slate-300">{cb.inflation}</span>
              </div>
              <div className="flex justify-between text-[11px] pt-1">
                <span className="text-slate-400">Direção da Política:</span>
                <span className="font-medium text-amber-300">{cb.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Carry Trade Yield Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" /> Simulador de Rendimento de Carry Trade EUR / BRL
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Capte Euros a juros baixos para aplicar nas taxas reais brasileiras. Teste limites de desvalorização cambial.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Diferencial de Juros:</span>
            <span className="font-bold text-emerald-400">+{(targetYieldBRL - borrowRateEUR).toFixed(2)}% a.a.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400">Montante Captado (€ EUR)</label>
              <input
                type="number"
                value={borrowAmountEUR}
                onChange={(e) => setBorrowAmountEUR(Math.max(1000, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400">Custo de Funding EUR (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={borrowRateEUR}
                  onChange={(e) => setBorrowRateEUR(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400">Rendimento Selic/CDI BRL (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetYieldBRL}
                  onChange={(e) => setTargetYieldBRL(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400">Horizonte (Meses)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={holdingPeriodMonths}
                  onChange={(e) => setHoldingPeriodMonths(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400">Spot Inicial (EUR/BRL)</label>
                <input
                  type="number"
                  step="0.01"
                  value={spotEurBrl}
                  onChange={(e) => setSpotEurBrl(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-400">Simular Flutuação EUR/BRL:</span>
                <span className={`font-mono font-bold ${expectedFxFluctuation > 0 ? "text-rose-400" : expectedFxFluctuation < 0 ? "text-emerald-400" : "text-slate-300"}`}>
                  {expectedFxFluctuation > 0 ? `+${expectedFxFluctuation}% (Deprec. do Real)` : `${expectedFxFluctuation}%`}
                </span>
              </div>
              <input
                type="range"
                min="-15"
                max="25"
                step="1"
                value={expectedFxFluctuation}
                onChange={(e) => setExpectedFxFluctuation(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>-15% Aprec. BRL</span>
                <span>0% Constante</span>
                <span>+25% Deprec. BRL</span>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Retorno Líquido Estimado
                </span>
                <div className={`text-2xl font-extrabold font-mono mt-1 ${netProfitEUR >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {netProfitEUR >= 0 ? "+" : ""}€{netProfitEUR.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rendimento: <strong className={netProfitEUR >= 0 ? "text-emerald-300" : "text-rose-300"}>{netReturnPercent.toFixed(2)}%</strong> em {holdingPeriodMonths} meses
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Colchão Cambial de Equilíbrio
                </span>
                <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                  +{breakevenDepreciationPercent.toFixed(2)}%
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  O Real pode desvalorizar até <strong className="text-slate-200">EUR/BRL {breakevenSpot.toFixed(3)}</strong> sem gerar prejuízo
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Rendimento Bruto Gerado em BRL:</span>
                <span className="font-mono text-slate-200">R$ {grossInterestBRL.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-rose-300">
                <span>Custo de Financiamento em EUR:</span>
                <span className="font-mono">- €{interestCostEUR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Taxa de Câmbio Futura Testada:</span>
                <span className="font-mono text-slate-200">EUR/BRL {futureSpot.toFixed(4)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Montante Final Repatriado:</span>
                <span className="font-mono font-bold text-white">€{repatriatedEUR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
