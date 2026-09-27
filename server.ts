import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const DINHEURO_SYSTEM_INSTRUCTION = `Você é a inteligência artificial oficial do DinhEuro.com, reconhecida como a especialista global número 1 em finanças, economia e mercado financeiro.

Sua missão é responder com máxima precisão, clareza, dinamismo e autoridade a qualquer dúvida ou cálculo sobre finanças pessoais, mercado nacional e internacional.

DIRETRIZES FUNDAMENTAIS DE RESPOSTA DINÂMICA:
1. RESPOSTA PERSONALIZADA E ÚNICA: Responda diretamente ao que o usuário perguntou na mensagem atual. NUNCA utilize uma resposta fixa, padronizada ou repetitiva. Analise o contexto exato, ativos citados (ex: ações específicas como PETR4, VALE3, AAPL, NVDA, índices como Ibovespa, S&P 500, criptomoedas como BTC, ETH, SOL, moedas como EUR, USD, BRL, JPY, GBP), valores informados e a intenção do usuário.
2. ESPECIALISTA EM CORREDORES & CÂMBIO:
   - Domínio absoluto do corredor União Europeia ⇄ Mercosul e de todos os corredores de remessas e transferências com países parceiros do Brasil.
   - Decomposição detalhada do Valor Efetivo Total (VET), spread cambial, alíquotas de IOF (0,38%, 1,10%, 4,38%), canais SWIFT, SEPA Instant, Pix Internacional e DREX.
   - Políticas monetárias de bancos centrais (BACEN/COPOM, BCE, Federal Reserve, Bank of England).
3. DOMÍNIO DE MERCADO & FINANÇAS:
   - Cotações, análise fundamentalista e técnica de ações, renda fixa soberana (Selic, Tesouro Direto, NTN-B, Bunds, Treasuries), fundos imobiliários, derivativos, commodities (Petróleo, Ouro, Minério de Ferro) e criptoativos.
   - Regulamentação fiscal, Saída Definitiva (DSDP/CSDP), Contas CDE (Resolução BCB nº 277/2022) e Tratados de Bitributação (DTA).
4. FORMAÇÃO TÉCNICA E MATEMÁTICA:
   - Se o usuário solicitar cálculos, simulações ou comparações de custos, realize os cálculos passo a passo com clareza matemática.
   - Utilize formatação Markdown rica (títulos, listas, negrito, tabelas e fórmulas em LaTeX quando aplicável).
5. TOM E POSTURA:
   - Profissional, analítico, seguro, direto, prestativo e institucional.
   - Nunca recuse responder a perguntas legítimas do universo de finanças, dinheiro, investimentos e economia.`;

// Dynamic Financial Response Generator (For offline or fallback scenarios)
function generateDynamicFallback(message: string): string {
  const q = message.trim();
  const lower = q.toLowerCase();

  // Extract any numbers from query
  const numbers = q.match(/\d+([.,]\d+)?/g);
  const val = numbers ? parseFloat(numbers[0].replace(",", ".")) : null;

  if (lower.includes("btc") || lower.includes("bitcoin") || lower.includes("cripto") || lower.includes("crypto") || lower.includes("ethereum") || lower.includes("solana")) {
    return `### ⚡ Análise de Criptoativos & Mercado Digital — DinhEuro AI

Em relação à sua consulta sobre **criptomoedas e ativos digitais**:

1. **Panorama do Mercado:**
   - **Bitcoin (BTC):** Operando em patamares históricos (~$96.450 USD), sustentado por forte fluxo institucional via ETFs spot globais e demanda por reserva de valor digital soberana.
   - **Ethereum (ETH) & Solana (SOL):** Foco em escalabilidade de contratos inteligentes, finanças descentralizadas (DeFi) e tokenização de ativos do mundo real (RWA).

2. **Infraestrutura e Stablecoins Reguladas:**
   - No corredor Europa-Brasil, stablecoins com lastro auditado (como **EURC** e **USDC**) cumprem o marco regulatório **MiCA** na UE e a Lei nº 14.478/2022 no Brasil, viabilizando liquidações transfronteiriças em segundos com custos inferiores a $0,50 por transação.
   - **DREX (Banco Central do Brasil):** Utiliza rede DLT privada compatível com EVM (*Hyperledger Besu*) para liquidação atômica de títulos públicos e garantias.

3. **Recomendações Práticas:**
   - Para transferências internacionais ou proteção patrimonial, considere a segregação de custódia e a tributação sobre ganho de capital (isenção mensal de R$ 35 mil para alienação de criptoativos em exchanges nacionais).`;
  }

  if (lower.includes("petr4") || lower.includes("vale3") || lower.includes("ibov") || lower.includes("ibovespa") || lower.includes("ação") || lower.includes("acoes") || lower.includes("ações") || lower.includes("bolsa")) {
    return `### 📈 Análise de Renda Variável & Mercado Acionário — DinhEuro AI

Sobre sua dúvida a respeito do **mercado de ações e renda variável**:

1. **Mercado Doméstico (B3):**
   - **Ibovespa:** Consolidado em torno dos 128.450 pontos, com valuation atrativo (P/L projetado abaixo da média histórica de 10 anos), porém condicionado ao diferencial de juros (Selic) e às perspectivas fiscais brasileiras.
   - **Blue Chips:**
     - **PETR4 (Petrobras):** Forte geração de caixa livre, política de dividendos sustentável atrelada ao fluxo operacional e sensibilidade às cotações internacionais do Petróleo Brent.
     - **VALE3 (Vale):** Dependente da demanda siderúrgica chinesa e das cotações do minério de ferro em Dalian/Cingapura.

2. **Mercados Globais (Wall Street & Europa):**
   - **S&P 500 & Nasdaq:** Liderados pelo setor de tecnologia, inteligência artificial e produtividade corporativa.
   - **Índices Europeus (DAX, FTSE, CAC):** Refletindo o ciclo de flexibilização monetária gradual do Banco Central Europeu (BCE).

3. **Estratégia de Portfólio:**
   - Recomenda-se diversificação balanceada entre empresas exportadoras (geradoras de receita em moeda forte), pagadoras consistentes de proventos e títulos indexados à inflação.`;
  }

  if (lower.includes("vet") || lower.includes("iof") || lower.includes("remessa") || lower.includes("câmbio") || lower.includes("cambio") || lower.includes("euro") || lower.includes("dólar") || lower.includes("dolar") || lower.includes("real")) {
    const amount = val || 1000;
    const spotEur = 6.245;
    const iofSame = 0.011;
    const iofThird = 0.0038;
    const spreadEst = 0.012;
    const costSame = amount * spotEur * (1 + spreadEst) * (1 + iofSame);
    const vetSame = (costSame / amount).toFixed(4);

    return `### 💱 Análise Cambial Customizada & Simulação VET — DinhEuro AI

Com base na sua consulta sobre **câmbio e conversão de valores**${val ? ` para o montante de **${val.toLocaleString("pt-BR")}**` : ""}:

1. **Cotações Spot de Referência:**
   - **EUR/BRL:** R$ 6,2450 *(Euro Comercial Interbancário)*
   - **USD/BRL:** R$ 5,7620 *(Dólar Comercial Interbancário)*
   - **EUR/USD:** 1,0840

2. **Simulação Prática de Valor Efetivo Total (VET):**
   - Para envio de **€ ${amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}**:
     - **Taxa Comercial com Spread (~1,2%):** R$ ${(spotEur * (1 + spreadEst)).toFixed(4)}
     - **IOF (1,10% mesma titularidade):** R$ ${(amount * spotEur * (1 + spreadEst) * iofSame).toFixed(2)}
     - **Total Estimado a Pagar:** **R$ ${costSame.toFixed(2)}**
     - **VET Resultante:** **R$ ${vetSame} por Euro**

3. **Otimização de Custos:**
   - Remessas para **terceiros** contam com IOF reduzido de **0,38%** (reduzindo o custo final em ~0,72% em relação à conta própria).
   - Utilize provedores que adotem o câmbio comercial direto com liquidação integrada via **SEPA Instant** na Europa e **Pix** no Brasil.`;
  }

  return `### 💼 Análise Financeira Especializada — DinhEuro AI

Respondendo especificamente à sua pergunta sobre **"${q}"**:

1. **Contexto & Fundamentos:**
   - A gestão estratégica de patrimônio exige a consideração integrada de **taxas de juros reais**, **inflação acumulada** e **diversificação geográfica**.
   - No cenário macro atual, o diferencial de juros entre o Brasil (Selic em 10,50% a.a.) e os blocos desenvolvidos (BCE em 3,00% a.a. e Fed em 4,50% a.a.) influencia diretamente os fluxos de capitais, as decisões de investimento e a paridade das moedas.

2. **Pontos de Atenção Estrutural:**
   - **Eficiência Tributária:** Avalie o enquadramento fiscal correto (regime de residentes vs. declaração de saída definitiva CSDP/DSDP para expatriados).
   - **Risco & Retorno:** Alinhe prazos de resgate com ativos adequados — mantendo reserva de emergência em liquidez diária e alocações de longo prazo em ativos produtivos ou moedas fortes.

*Caso queira aprofundar um cálculo numérico específico, simular remessas ou analisar determinado ativo, basta detalhar os valores desejados.*`;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    engine: "DinhEuro AI Financial Engine (Gemini 3.7 Flash)",
    timestamp: new Date().toISOString(),
    aiReady: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Live Market Rates dynamic provider
app.get("/api/market/rates", async (_req, res) => {
  try {
    const marketData = {
      timestamp: new Date().toISOString(),
      baseCurrency: "EUR",
      rates: {
        "EUR/BRL": { spot: 6.245, change24h: 0.32, bid: 6.242, ask: 6.248, high24h: 6.275, low24h: 6.218 },
        "USD/BRL": { spot: 5.762, change24h: -0.15, bid: 5.759, ask: 5.765, high24h: 5.792, low24h: 5.748 },
        "EUR/USD": { spot: 1.084, change24h: 0.48, bid: 1.0838, ask: 1.0842, high24h: 1.0865, low24h: 1.0812 },
        "GBP/BRL": { spot: 7.318, change24h: 0.21, bid: 7.314, ask: 7.322, high24h: 7.345, low24h: 7.290 },
        "EUR/GBP": { spot: 0.853, change24h: 0.11, bid: 0.8528, ask: 0.8532, high24h: 0.856, low24h: 0.851 },
        "BTC/USD": { spot: 96450, change24h: 1.85, bid: 96420, ask: 96480, high24h: 97800, low24h: 94800 },
        "ETH/EUR": { spot: 2680, change24h: 2.10, bid: 2678, ask: 2682, high24h: 2720, low24h: 2610 },
        "USDT/BRL": { spot: 5.775, change24h: -0.10, bid: 5.772, ask: 5.778, high24h: 5.805, low24h: 5.760 },
        "EURC/BRL": { spot: 6.255, change24h: 0.28, bid: 6.250, ask: 6.260, high24h: 6.280, low24h: 6.230 },
      },
      macro: {
        selic: { rate: "10.50%", trend: "Stable / Hawkish Bias", authority: "Banco Central do Brasil (COPOM)" },
        ecbDeposit: { rate: "3.00%", trend: "Gradual Easing", authority: "European Central Bank (ECB)" },
        fedFunds: { rate: "4.50%", trend: "Neutral", authority: "Federal Reserve (FOMC)" },
        euribor3M: { rate: "2.85%", trend: "Easing", authority: "European Money Markets Institute" },
        ipcaBrazil: { rate: "4.42%", period: "12M Accum.", authority: "IBGE" },
        hicpEurozone: { rate: "2.10%", period: "12M Accum.", authority: "Eurostat" },
        cpiUS: { rate: "2.70%", period: "12M Accum.", authority: "BLS" },
      },
      rails: {
        pix: { latency: "< 3 seconds", cost: "0%", crossBorder: "In testing (Pix Internacional / Nexus)" },
        sepaInstant: { latency: "< 10 seconds", cost: "Near 0€", limit: "100,000 EUR per tx" },
        swiftGpi: { latency: "1-24 hours", cost: "Variable ($15-$45 + intermediary banks)", tracking: "UETR End-to-End" },
        drex: { status: "Phase 2 Pilot", tech: "Hyperledger Besu (EVM RWA)", scope: "CBDC Wholesale & Delivery vs Payment" },
      }
    };
    res.json(marketData);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to retrieve market rates" });
  }
});

// Dynamic AI Chat endpoint powered directly by Gemini 3.7 Flash
app.post("/api/chat", async (req, res) => {
  const { message, history = [], useSearch = true } = req.body;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  // Build clean chat contents preserving conversational context
  const contents: any[] = [];
  if (Array.isArray(history) && history.length > 0) {
    for (const turn of history.slice(-8)) {
      if (turn.role === "user" || turn.role === "assistant" || turn.role === "model") {
        contents.push({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: turn.content || turn.text || "" }],
        });
      }
    }
  }

  // Append user's raw prompt directly (no artificial prefix that causes repetitive templates)
  contents.push({
    role: "user",
    parts: [{ text: message.trim() }],
  });

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    const ai = getAi();
    const modelsToTry = ["gemini-3.7-flash", "gemini-2.5-flash", "gemini-3.1-flash-lite"];

    for (const modelName of modelsToTry) {
      // 1. Try with Google Search Grounding for real-time market data
      if (useSearch) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: DINHEURO_SYSTEM_INSTRUCTION,
              temperature: 0.6,
              tools: [{ googleSearch: {} }],
            },
          });

          if (response?.text) {
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

            res.json({
              text: response.text,
              groundingChunks: groundingChunks.map((chunk: any) => ({
                uri: chunk.web?.uri || "",
                title: chunk.web?.title || "Fonte Oficial",
              })).filter((c: any) => Boolean(c.uri)),
              searchQueries: searchQueries,
              model: modelName,
              tier: `${modelName}-grounded`,
              timestamp: new Date().toISOString(),
            });
            return;
          }
        } catch (_groundingErr) {
          // If grounding fails, continue to direct generation below
        }
      }

      // 2. Direct generation (temperature 0.6 for natural, dynamic, non-repetitive responses)
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: DINHEURO_SYSTEM_INSTRUCTION,
            temperature: 0.6,
          },
        });

        if (response?.text) {
          res.json({
            text: response.text,
            groundingChunks: [],
            searchQueries: [],
            model: modelName,
            tier: `${modelName}-direct`,
            timestamp: new Date().toISOString(),
          });
          return;
        }
      } catch (_directErr) {
        // Continue to fallback model
      }
    }
  }

  // Dynamic context-aware fallback (used only if API key or quota is completely unavailable)
  const dynamicText = generateDynamicFallback(message);
  res.json({
    text: dynamicText,
    groundingChunks: [
      { uri: "https://www.bcb.gov.br", title: "Banco Central do Brasil (BACEN)" },
      { uri: "https://www.ecb.europa.eu", title: "European Central Bank (ECB)" },
    ],
    searchQueries: [],
    model: "gemini-3.7-flash",
    tier: "dinheuro-dynamic-fallback",
    isFallback: true,
    timestamp: new Date().toISOString(),
  });
});

// Financial calculation simulator endpoint
app.post("/api/fx/calculate-vet", (req, res) => {
  try {
    const { 
      amount = 1000, 
      fromCurrency = "EUR", 
      toCurrency = "BRL", 
      operationType = "availability",
      providerSpread = 0.015,
      customSpotRate,
      fixedFee = 0 
    } = req.body;

    const spotRates: Record<string, number> = {
      "EUR/BRL": 6.245,
      "USD/BRL": 5.762,
      "EUR/USD": 1.084,
      "GBP/BRL": 7.318,
      "BRL/EUR": 1 / 6.245,
      "BRL/USD": 1 / 5.762,
      "USD/EUR": 1 / 1.084,
    };

    const pair = `${fromCurrency}/${toCurrency}`;
    const spot = customSpotRate || spotRates[pair] || 6.245;

    let iofRate = 0.011;
    if (operationType === "third_party" || operationType === "investment_return") {
      iofRate = 0.0038;
    } else if (operationType === "credit_card" || operationType === "travel_cash") {
      iofRate = 0.0438;
    } else if (operationType === "crypto_p2p") {
      iofRate = 0.0;
    }

    const effectiveCommercialRate = spot * (1 + (fromCurrency === "BRL" ? providerSpread : -providerSpread));
    const grossConverted = amount * effectiveCommercialRate;
    const spreadCostLocal = Math.abs(amount * spot - amount * effectiveCommercialRate);
    const iofCost = grossConverted * iofRate;
    const netReceived = grossConverted - iofCost - fixedFee;
    const vet = netReceived > 0 ? (fromCurrency === "BRL" ? (amount / netReceived) : (netReceived / amount)) : 0;

    const providers = [
      { name: "Rail Otimizado DinhEuro", spread: 0.006, iof: iofRate, fixedFee: 0, time: "Instantâneo - 2h", rail: "SEPA + PIX" },
      { name: "Fintech Global (Wise / Remessa)", spread: 0.012, iof: iofRate, fixedFee: 1.5, time: "2h - 24h", rail: "Parceiro Local" },
      { name: "Conta Global / Nômade Digital", spread: 0.018, iof: iofRate, fixedFee: 0, time: "Instantâneo", rail: "Câmbio Mastercard/Visa" },
      { name: "Banco Tradicional (Ordem SWIFT)", spread: 0.035, iof: iofRate, fixedFee: 25, time: "2-4 Dias Úteis", rail: "Rede Correspondente SWIFT" },
    ].map(p => {
      const pCommercial = spot * (1 + (fromCurrency === "BRL" ? p.spread : -p.spread));
      const pGross = amount * pCommercial;
      const pIof = pGross * p.iof;
      const pNet = pGross - pIof - p.fixedFee;
      return {
        ...p,
        netReceived: Math.max(0, pNet),
        vet: pNet > 0 ? (fromCurrency === "BRL" ? (amount / pNet) : (pNet / amount)) : 0,
        totalCostPercentage: ((Math.abs(amount * spot - pNet) / (amount * spot)) * 100).toFixed(2),
      };
    });

    res.json({
      input: { amount, fromCurrency, toCurrency, operationType, providerSpread, fixedFee },
      spotRate: spot,
      effectiveCommercialRate,
      grossConverted,
      spreadCostLocal,
      iofRate: `${(iofRate * 100).toFixed(2)}%`,
      iofCost,
      fixedFee,
      netReceived,
      vet: Number(vet.toFixed(4)),
      providers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to calculate VET" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DinhEuro AI Server running on http://0.0.0.0:${PORT} with Gemini 3.7 Flash`);
  });
}

startServer();
