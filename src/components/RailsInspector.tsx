import React from "react";
import { 
  ShieldCheck, 
  Zap, 
  Clock, 
  Layers, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Cpu, 
  Coins, 
  Landmark,
  Building
} from "lucide-react";

interface RailsInspectorProps {
  onAskAi: (prompt: string, domain: "crypto_rwa" | "fx") => void;
}

export const RailsInspector: React.FC<RailsInspectorProps> = ({ onAskAi }) => {
  const railsData = [
    {
      id: "pix-nexus",
      name: "Pix & Pix Internacional (Projeto Nexus)",
      authority: "Banco Central do Brasil / BIS",
      latency: "< 3 segundos",
      cost: "Zero / Quase zero no varejo",
      availability: "24/7/365 em Tempo Real",
      crossBorderStatus: "Em Piloto (Hub Nexus interligando Brasil, Cingapura e sistemas da Zona do Euro)",
      techStack: "SPI (Sistema de Pagamentos Instantâneos) + Padrão ISO 20022",
      compliance: "Resolução BCB nº 1/2020 & BCB nº 277/2022 (Novo Marco Cambial)",
      highlight: "Liquidação atômica direta entre sistemas de pagamentos instantâneos de bancos centrais sem intermediários da rede SWIFT.",
    },
    {
      id: "drex",
      name: "DREX (CBDC Brasileira & Tokenização RWA)",
      authority: "Banco Central do Brasil",
      latency: "< 5 segundos (Finalidade de bloco)",
      cost: "Frações de gas / Zero spread no varejo",
      availability: "24/7 Execução Programável",
      crossBorderStatus: "Fase 2 de Testes (DvP institucional com pontes internacionais de CBDCs)",
      techStack: "Hyperledger Besu (Compatível com EVM) + Camada de Privacidade (ZKP / Anonify)",
      compliance: "Contratos inteligentes para Entrega contra Pagamento (DvP) e Pagamento contra Pagamento (PvP)",
      highlight: "Permite negociar Títulos Públicos (TPFt), garantias imobiliárias e câmbio programável com total conformidade regulatória.",
    },
    {
      id: "sepa-instant",
      name: "SEPA Instant Credit Transfer (SCT Inst)",
      authority: "Conselho Europeu de Pagamentos / BCE",
      latency: "< 10 segundos",
      cost: "0,002€ por transação (interbancário); gratuito para o consumidor",
      availability: "24/7/365 em Tempo Real",
      crossBorderStatus: "Obrigatório em todos os 36 países membros da SEPA sob a regulamentação europeia",
      techStack: "TIPS (TARGET Instant Payment Settlement) + Padrão ISO 20022",
      compliance: "Regulamento da UE 2024/886 & Diretivas PSD2 / PSD3",
      highlight: "Compensação unificada na Europa. Paridade obrigatória: bancos não podem cobrar mais pelo SEPA Instant do que por transferências comuns.",
    },
    {
      id: "swift-gpi",
      name: "SWIFT GPI (Global Payments Innovation)",
      authority: "Consórcio de Membros SWIFT",
      latency: "1 hora a 2 dias úteis",
      cost: "$15 a $50 + spread de bancos correspondentes (0,5% a 2,5%)",
      availability: "Horário bancário comercial (Liquidação em lote)",
      crossBorderStatus: "Padrão global legado (mais de 11.000 instituições financeiras)",
      techStack: "Mensageria ISO 20022 MT/MX + Código Identificador Único de Transação (UETR)",
      compliance: "Normas GAFI/FATF PLD/FT, padrões Wolfsberg e triagem de sanções OFAC / UE",
      highlight: "Alcance mundial absoluto, porém suscetível a taxas intermediárias imprevistas e atrasos em rotas de correspondentes.",
    },
    {
      id: "eurc-usdc",
      name: "Trilhos de Stablecoins Reguladas (EURC / USDC)",
      authority: "Circle Internet Financial / Conformidade MiCA UE",
      latency: "1 a 15 segundos (Base / Solana / Avalanche / Ethereum)",
      cost: "< $0,01 em redes Layer 2",
      availability: "24/7/365 Finalidade Descentralizada",
      crossBorderStatus: "Liquidação global contínua 24 horas por dia",
      techStack: "Smart Contracts ERC-20 / SPL + Prova de Reservas (100% em Caixa/Títulos Soberanos)",
      compliance: "Regulamentação MiCA da UE (Títulos III e IV) & Marco Legal Cripto BCB (Lei 14.478)",
      highlight: "Tokens fiduciários resgatáveis 1:1 conectando liquidez em EUR e USD diretamente a tesourarias corporativas.",
    },
  ];

  const handleAskRailsAnalysis = (rail: typeof railsData[0]) => {
    const prompt = `Forneça uma análise arquitetural e regulatória aprofundada de ${rail.name}:
- Autoridade Reguladora: ${rail.authority}
- Velocidade & Latência: ${rail.latency}
- Estrutura de Custos: ${rail.cost}
- Status Transfronteiriço: ${rail.crossBorderStatus}
- Infraestrutura Tecnológica: ${rail.techStack}
- Conformidade Regulatória: ${rail.compliance}

Analise a eficiência comparativa deste trilho frente às alternativas de mercado para remessas corporativas de alto volume e movimentação de patrimônio entre o Brasil e a União Europeia.`;

    onAskAi(prompt, "crypto_rwa");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Trilhos de Liquidação Transfronteiriça & Arquitetura DREX
              </h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Análise comparativa entre Moedas Digitais de Banco Central (CBDCs), Redes de Liquidação Instantânea e Stablecoins reguladas (MiCA).
            </p>
          </div>

          <button
            onClick={() => onAskAi("Compare o Pix Internacional (Projeto Nexus) versus pontes DREX na Europa versus SWIFT GPI para liquidação de tesouraria institucional.", "crypto_rwa")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-xs hover:opacity-95 shadow-md shadow-emerald-950/50 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consultar Arquitetura dos Trilhos</span>
          </button>
        </div>
      </div>

      {/* Rails Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {railsData.map((rail) => (
          <div
            key={rail.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-emerald-800/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                  {rail.name}
                </h3>
                <span className="p-1 rounded bg-slate-950 text-emerald-400 border border-slate-800 shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Regulador: <strong className="text-slate-300">{rail.authority}</strong>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Latência</span>
                  <span className="font-mono font-bold text-emerald-400">{rail.latency}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Disponibilidade</span>
                  <span className="font-mono text-slate-200">{rail.availability}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Perfil de Custo</span>
                  <span className="text-slate-300 text-[11px]">{rail.cost}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-slate-200">Base Tecnológica:</strong> {rail.techStack}
                </div>
                <div className="text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-slate-200">Status Transfronteiriço:</strong> {rail.crossBorderStatus}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed italic">
                "{rail.highlight}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4">
              <button
                onClick={() => handleAskRailsAnalysis(rail)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-950 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auditar e Avaliar Trilho</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
