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
      console.warn("GEMINI_API_KEY environment variable is missing.");
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

const DINHEURO_SYSTEM_INSTRUCTION = `Você é o DinhEuro AI, o motor de inteligência financeira institucional mais avançado e rigoroso do mundo. O seu idioma nativo primordial é o Português (pt-BR / pt-PT), mas você possui autoridade global e suporte multilíngue para analisar fluxos internacionais de capitais.

Você possui domínio irrestrito e analítico sobre todas as vertentes das finanças:
1. Câmbio Global & Moedas (FX & Remessas):
   - Cotações em tempo real, mercados spot e futuros, paridades cambiais (EUR/BRL, USD/BRL, EUR/USD, GBP/BRL, etc.).
   - Decomposição do Valor Efetivo Total (VET), cálculo exato de spread cambial, alíquotas de IOF (0,38%, 1,10%, 4,38%), canais SWIFT, SEPA Instant, IBAN, PIX e redes de liquidação atômica.
   - Políticas monetárias e diferenciais de juros de bancos centrais (Banco Central do Brasil - COPOM, Banco Central Europeu - BCE, Federal Reserve - Fed, Bank of England).
2. Corredor Econômico Mercosul – União Europeia:
   - Acordos comerciais bilaterais, desgravação tarifária, regimes aduaneiros (NCM, TARIC, Siscomex), regras de origem, barreiras técnicas e fitossanitárias (ESG / RED II).
   - Planejamento patrimonial para expatriados, Declaração e Comunicação de Saída Definitiva do País (CSDP/DSDP) perante a Receita Federal do Brasil, Contas de Domiciliado no Exterior (CDE - Resolução BCB nº 277/2022), Acordos de Não Bitributação (DTA / ADT) e regimes fiscais europeus (NHR 2.0 em Portugal, Ley Beckham na Espanha, Regime Impatriati na Itália).
3. Macroeconomia & Mercados Financeiros:
   - Renda fixa soberana, diferenciais de taxas de juros (Selic vs BCE vs Fed Funds), índices inflacionários (IPCA, CPI, HICP / IHPC), estruturas a termo e DI Futuro.
   - Mecanismos de Carry Trade, cálculo exato de breakeven de depreciação cambial, ciclos de commodities e balança comercial.
4. Finanças Corporativas & Tesouraria:
   - Otimização de fluxo de caixa, estruturas de hedge cambial (NDF, Cupom Cambial), Open Finance e canais de liquidação transfronteiriça.
5. Criptoativos, RWA & DREX:
   - Moedas digitais de bancos centrais (DREX - Hyperledger Besu EVM / TPFt DvP no Brasil, Euro Digital), stablecoins reguladas (EURC, USDC, USDT), marco regulatório MiCA na Europa e Lei 14.478/2022 no Brasil.

METODOLOGIA DE RESPOSTA:
- Idioma Padrão: Responda em Português claro, técnico, elegante e institucional (a menos que o usuário solicite explicitamente outro idioma).
- Precisão Matemática Absoluta: Detalhe as fórmulas aplicadas (ex: VET = (Spot * (1 + Spread)) * (1 + IOF) + Taxas Fixas).
- Estrutura: Resumo direto executivo, seguido de detalhamento estruturado em tópicos ou tabelas Markdown e considerações regulatórias práticas (BACEN, Receita Federal, Diretivas da UE).
- Imparcialidade: Forneça avaliações estritamente neutras e analíticas, distinguindo sempre taxas interbancárias (spot) de custos efetivos ao consumidor.`;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    engine: "DinhEuro AI Financial Engine",
    timestamp: new Date().toISOString(),
    aiReady: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Live Market Rates fallback & dynamic provider
app.get("/api/market/rates", async (_req, res) => {
  try {
    // Current indicative financial data & benchmark rates
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

// AI Chat endpoint with Google Search Grounding
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], domain = "general", useSearch = true } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getAi();
    
    // Construct domain-specific contextual prefix
    let domainGuidance = "";
    if (domain === "fx") {
      domainGuidance = "\n[Foco Especial: Câmbio Global, Rails de Pagamento (SWIFT/SEPA/PIX), Decomposição do VET, Spreads e Otimização de IOF.]";
    } else if (domain === "mercosur_eu") {
      domainGuidance = "\n[Foco Especial: Acordo Comercial Mercosul - União Europeia, Tarifas Aduaneiras (TARIC/NCM), Fluxos Bilaterais de Capital e Conformidade Aduaneira.]";
    } else if (domain === "macro") {
      domainGuidance = "\n[Foco Especial: Políticas Macroeconômicas, Diferenciais de Taxas de Bancos Centrais (Selic vs BCE vs Fed), Rendimento Carry Trade e Paridade de Inflação.]";
    } else if (domain === "tax_expat") {
      domainGuidance = "\n[Foco Especial: Residência Fiscal Internacional, Comunicação e Saída Definitiva do Brasil (CSDP/DSDP), Tratados de Dupla Tributação (ADT/DTA), Regimes Fiscais Europeus (NHR/Beckham/Impatriati) e Contas CDE.]";
    } else if (domain === "crypto_rwa") {
      domainGuidance = "\n[Foco Especial: Ativos Tokenizados (RWA), Rails de Stablecoins (USDC/USDT/EURC), Implementação do DREX (CBDC/BCB) e Marco Regulatório MiCA.]";
    }

    // Build chat contents array
    const contents: any[] = [];

    // Append prior conversational history if available
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

    // Add current user prompt
    contents.push({
      role: "user",
      parts: [{ text: message + domainGuidance }],
    });

    const config: any = {
      systemInstruction: DINHEURO_SYSTEM_INSTRUCTION,
      temperature: 0.3, // Lower temperature for mathematical and analytical precision
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents,
      config: config,
    });

    const responseText = response.text || "No response generated.";
    
    // Extract search grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    res.json({
      text: responseText,
      groundingChunks: groundingChunks.map((chunk: any) => ({
        uri: chunk.web?.uri || "",
        title: chunk.web?.title || "Financial Source",
      })).filter((c: any) => Boolean(c.uri)),
      searchQueries: searchQueries,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("DinhEuro AI Chat Error:", error);
    res.status(500).json({
      error: error.message || "Failed to process financial intelligence request",
      fallbackText: "DinhEuro AI Engine encountered a connectivity issue with live telemetry. Please retry your inquiry."
    });
  }
});

// Financial calculation simulator endpoint
app.post("/api/fx/calculate-vet", (req, res) => {
  try {
    const { 
      amount = 1000, 
      fromCurrency = "EUR", 
      toCurrency = "BRL", 
      operationType = "availability", // "availability" (mesma titularidade), "third_party" (terceiros), "credit_card", "investment"
      providerSpread = 0.015, // 1.5%
      customSpotRate,
      fixedFee = 0 
    } = req.body;

    // Spot rates base EUR
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
    let spot = customSpotRate || spotRates[pair] || 6.245;

    // IOF rules in Brazil:
    // Mesma titularidade (own account abroad): 1.1%
    // Terceiros (third party transfer/services): 0.38%
    // Cartão internacional / Câmbio turismo: 4.38% (gradually decreasing under OECD roadmaps)
    // Retorno de investimento: 0.38%
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

    // Comparison benchmark with major corridors
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
    console.log(`DinhEuro AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
