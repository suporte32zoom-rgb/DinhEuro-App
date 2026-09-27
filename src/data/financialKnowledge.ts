import { TradeTariffScenario } from "../types";

export const TRADE_TARIFF_SCENARIOS: TradeTariffScenario[] = [
  {
    id: "tariff-1",
    sector: "Agronegócio & Proteína Animal",
    product: "Carne Bovina de Alta Qualidade (Expansão da Cota Hilton)",
    hsCode: "0201.30 (Desossada)",
    origin: "Mercosul",
    destination: "União Europeia",
    currentTariff: "12% + 1.768 €/ton (Fora da cota)",
    postAgreementTariff: "0% para cota de 99.000 ton (55% resfriada / 45% congelada)",
    transitionYears: "Desgravação progressiva em 5 anos",
    rulesOfOrigin: "100% nascido, criado e abatido no Mercosul com rastreabilidade e conformidade ESG",
    keyOpportunity: "Economia aduaneira direta superior a €150 milhões/ano para exportadores brasileiros e uruguaios.",
  },
  {
    id: "tariff-2",
    sector: "Máquinas & Bens de Capital",
    product: "Robôs Industriais Automatizados & Centros de Usinagem CNC",
    hsCode: "8479.50",
    origin: "União Europeia",
    destination: "Mercosul",
    currentTariff: "14% - 20% (TEC Mercosul)",
    postAgreementTariff: "0% de tarifa (Eliminação total)",
    transitionYears: "Imediata a 4 anos",
    rulesOfOrigin: "Conteúdo de valor regional (VCR) mínimo de 50% na União Europeia",
    keyOpportunity: "Modernização das linhas industriais no Brasil com bens de capital alemães, italianos e franceses.",
  },
  {
    id: "tariff-3",
    sector: "Bioenergia & Açúcar",
    product: "Etanol (Grau Industrial & Químico)",
    hsCode: "2207.10",
    origin: "Mercosul",
    destination: "União Europeia",
    currentTariff: "19,20 €/hl (Não desnaturado)",
    postAgreementTariff: "0% para 450.000 ton (uso químico); 200.000 ton com tarifa reduzida",
    transitionYears: "Cota progressiva de 6 anos",
    rulesOfOrigin: "Matéria-prima de cana-de-açúcar com certificação de sustentabilidade RED II da UE",
    keyOpportunity: "Insumo estratégico para descarbonização de químicas verdes e combustível de aviação sustentável (SAF) na Europa.",
  },
  {
    id: "tariff-4",
    sector: "Automotivo & Mobilidade Elétrica",
    product: "Veículos Elétricos, Híbridos & Autopeças Especializadas",
    hsCode: "8703.60 / 8703.80",
    origin: "União Europeia",
    destination: "Mercosul",
    currentTariff: "35% (Faixa mais alta da TEC)",
    postAgreementTariff: "0% após transição de 15 anos (Cota com 17,5% nos primeiros 7 anos)",
    transitionYears: "15 anos",
    rulesOfOrigin: "Verificação de montagem e células de bateria de origem na UE",
    keyOpportunity: "Aceleração da eletrificação da frota e transferência de tecnologia nos centros de montagem sul-americanos.",
  },
  {
    id: "tariff-5",
    sector: "Alimentos Gourmet & Bebidas Finas",
    product: "Vinhos Finos & Destilados com Denominação de Origem (DOC / IG)",
    hsCode: "2204.21",
    origin: "União Europeia",
    destination: "Mercosul",
    currentTariff: "20% - 27% + IPI / PIS / COFINS",
    postAgreementTariff: "0% para vinhos finos engarrafados; proteção recíproca de IGs",
    transitionYears: "Imediata para espumantes >$8/garrafa; 8 anos para vinhos standard",
    rulesOfOrigin: "Certificação rigorosa de Indicação Geográfica (Champagne, Porto, Rioja, Bordeaux)",
    keyOpportunity: "Eliminação de testes laboratoriais duplicados e reconhecimento recíproco de 355 IGs europeias e brasileiras.",
  },
  {
    id: "tariff-6",
    sector: "Químico & Farmacêutico",
    product: "Princípios Ativos Farmacêuticos (IFAs) & Vacinas",
    hsCode: "3002.20 / 2933.99",
    origin: "União Europeia",
    destination: "Mercosul",
    currentTariff: "8% - 12%",
    postAgreementTariff: "0% imediato (Desoneração total)",
    transitionYears: "0 a 3 anos",
    rulesOfOrigin: "Reconhecimento mútuo de Boas Práticas de Fabricação (GMP/BPF)",
    keyOpportunity: "Redução de custos de aquisição pública de medicamentos e estabilidade nas cadeias de saúde pública.",
  }
];

export const EXPAT_TAX_CHECKLIST = [
  {
    step: 1,
    title: "Comunicação de Saída Definitiva do País (CSDP)",
    jurisdiction: "Brasil (Receita Federal)",
    deadline: "A partir da data de saída até o último dia útil de fevereiro do ano-calendário subsequente",
    legalBasis: "Instrução Normativa RFB nº 208/2002",
    details: "Notifica oficialmente a Receita Federal de que você deixou de ser residente fiscal no Brasil a partir da data informada.",
    risk: "A falta de envio mantém o contribuinte sujeito à tributação universal no Brasil sobre rendimentos globais (alíquota de até 27,5%)."
  },
  {
    step: 2,
    title: "Declaração de Saída Definitiva do País (DSDP)",
    jurisdiction: "Brasil (Receita Federal)",
    deadline: "Prazo regular do IRPF (último dia útil de abril/maio) do ano seguinte à saída",
    legalBasis: "Decreto nº 9.580/2018 (RIR/2018)",
    details: "Acerto de contas fiscal final compreendendo de 1º de janeiro até o dia exato da saída. Exige apuração de DARFs pendentes e indicação de procurador no Brasil.",
    risk: "Discrepâncias patrimoniais entre ativos no exterior e a declaração CBE (Capitais Brasileiros no Exterior) do Banco Central."
  },
  {
    step: 3,
    title: "Enquadramento Bancário: Conta CDE ou Encerramento",
    jurisdiction: "Brasil (Banco Central do Brasil)",
    deadline: "Imediatamente após a caracterização da condição de não residente",
    legalBasis: "Resolução CMN nº 4.373 e Resolução BCB nº 277/2022 (Marco Cambial)",
    details: "Os bancos brasileiros devem ser notificados da Não Residência. Contas comuns de residentes devem ser encerradas ou convertidas em 'Conta de Domiciliado no Exterior' (CDE) para evitar bloqueios ou encerramento unilateral por compliance.",
    risk: "Tarifas de manutenção elevadas em grandes bancos tradicionais (R$ 800 a R$ 2.500/mês); alternativa: parcerias com fintechs para contas de não residentes."
  },
  {
    step: 4,
    title: "Acordos de Não Bitributação (ADT / DTA)",
    jurisdiction: "Bilateral (Brasil – Portugal / Espanha / França / Itália / Alemanha)",
    deadline: "Declaração anual de imposto de renda no país de destino europeu",
    legalBasis: "Tratados de Dupla Tributação & Artigo 4º da Convenção Modelo OCDE (Critérios de Desempate)",
    details: "Compensação de créditos tributários retidos na fonte no Brasil (IRRF sobre pensões, dividendos ou aluguéis) contra a obrigação fiscal na Europa.",
    risk: "Alemanha e Brasil NÃO possuem atualmente tratado de bitributação vigente (denunciado em 2005), exigindo uso do mecanismo de reciprocidade fiscal unilateral (Art. 343 RIR)."
  },
  {
    step: 5,
    title: "Regimes Fiscais Especiais na Europa (NHR 2.0, Ley Beckham, Impatriati)",
    jurisdiction: "País de Destino (União Europeia)",
    deadline: "Nos primeiros 6 a 12 meses após registro da residência fiscal no país",
    legalBasis: "NHR 2.0 em Portugal (Inovação Científica), Ley Beckham na Espanha, Regime Impatriati na Itália",
    details: "Adesão a alíquotas fixas vantajosas (ex: 24% na Espanha por 6 anos; 20% em Portugal para setores estratégicos; 50% de isenção no rendimento de trabalho na Itália).",
    risk: "Critérios rígidos de elegibilidade e prazos fatais de requerimento (não ter sido residente fiscal no país nos últimos 5 a 10 anos)."
  }
];

export const QUICK_PROMPT_TEMPLATES = [
  {
    label: "Câmbio EUR/BRL & Decomposição do VET",
    domain: "fx" as const,
    prompt: "Apresente uma decomposição financeira exata do envio de € 25.000 da Alemanha para o Brasil. Compare Mesma Titularidade (IOF 1,1%) vs Terceiros (IOF 0,38%), detalhe o spread bancário e a fórmula do VET.",
  },
  {
    label: "Tarifas & Acordo Mercosul – União Europeia",
    domain: "mercosur_eu" as const,
    prompt: "Analise o impacto econômico e aduaneiro do Acordo Mercosul - União Europeia. Detalhe o cronograma de cotas para produtos agrícolas versus máquinas industriais europeias e as regras de conformidade de origem.",
  },
  {
    label: "Saída Definitiva do Brasil & Conta CDE",
    domain: "tax_expat" as const,
    prompt: "Explique o passo a passo para um brasileiro que se muda para Portugal ou Espanha: cumprimento da CSDP/DSDP na Receita Federal, enquadramento de Conta CDE (BCB 277) e uso do Acordo de Não Bitributação.",
  },
  {
    label: "Mecânica de Carry Trade: Selic vs BCE",
    domain: "macro" as const,
    prompt: "Detalhe a estratégia macroeconômica de Carry Trade entre a Taxa Selic brasileira (10,50%) e a Taxa de Depósito do BCE (3,00%). Qual o limite de depreciação cambial (breakeven) do Real frente ao Euro?",
  },
  {
    label: "Liquidação: Pix Internacional vs DREX vs SEPA",
    domain: "crypto_rwa" as const,
    prompt: "Compare as arquiteturas de liquidação internacional: Pix Internacional (Projeto Nexus / BIS), DREX do Banco Central do Brasil (CBDC/RWA em Hyperledger Besu), SEPA Instant europeu e stablecoins em Euro (EURC).",
  },
];

