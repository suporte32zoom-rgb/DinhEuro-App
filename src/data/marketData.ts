import { MarketAsset, MarketAccordionTopic, MarketNewsItem, MarketRegion, TimeRange, ChartDataPoint } from "../types";

// Helper function to synthesize realistic historical price paths for Google Finance interactive charts
function generateHistorical(
  basePrice: number,
  changePercent: number,
  volatility: number = 0.015,
  trend: number = 0.05
): Record<TimeRange, ChartDataPoint[]> {
  const result: Record<TimeRange, ChartDataPoint[]> = {
    "1D": [],
    "5D": [],
    "1M": [],
    "6M": [],
    "YTD": [],
    "1A": [],
    "5A": [],
    "MÁX": [],
  };

  // 1D: Trading hours (10:00 to 17:30 / 9:30 to 16:00)
  const times1D = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", 
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30"
  ];
  const start1D = basePrice / (1 + changePercent / 100);
  let cur1D = start1D;
  result["1D"] = times1D.map((t, idx) => {
    const progress = idx / (times1D.length - 1);
    const noise = (Math.sin(idx * 1.5) * 0.4 + (Math.random() - 0.48)) * volatility * basePrice;
    cur1D = start1D + (basePrice - start1D) * progress + noise;
    if (idx === times1D.length - 1) cur1D = basePrice;
    return {
      time: t,
      value: Number(cur1D.toFixed(2)),
      benchmarkValue: Number((cur1D * 0.98 + (idx * 0.1)).toFixed(2)),
      volume: Math.floor(10000 + Math.random() * 50000),
      annotation: idx === 0 ? "Abertura do Pregão" : idx === 8 ? "Divulgação de Dados" : undefined,
    };
  });

  // 5D
  const days5D = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  result["5D"] = days5D.map((d, idx) => {
    const factor = 1 + (idx - 4) * (changePercent * 0.003) + (Math.sin(idx) * 0.01);
    const val = basePrice * factor;
    return {
      time: `${d} 17:00`,
      value: Number(val.toFixed(2)),
      benchmarkValue: Number((val * 0.99).toFixed(2)),
      volume: Math.floor(100000 + Math.random() * 80000),
    };
  });

  // 1M
  result["1M"] = Array.from({ length: 22 }, (_, i) => {
    const factor = 1 - (21 - i) * 0.004 + Math.sin(i * 0.8) * volatility;
    const val = basePrice * factor;
    return {
      time: `Dia ${i + 1}`,
      value: Number(val.toFixed(2)),
      benchmarkValue: Number((val * 0.97).toFixed(2)),
    };
  });

  // 6M
  const months6 = ["Set", "Out", "Nov", "Dez", "Jan", "Fev"];
  result["6M"] = months6.map((m, i) => {
    const factor = 0.92 + i * 0.016 + Math.cos(i) * 0.02;
    const val = basePrice * factor;
    return {
      time: m,
      value: Number(val.toFixed(2)),
      benchmarkValue: Number((val * 0.95).toFixed(2)),
      annotation: i === 2 ? "Decisão de Taxa de Juros" : undefined,
    };
  });

  // YTD
  const ytdMonths = ["Jan", "Fev (Início)", "Fev (Atual)"];
  result["YTD"] = ytdMonths.map((m, i) => {
    const factor = 0.96 + i * 0.02 + Math.sin(i) * 0.01;
    const val = basePrice * factor;
    return {
      time: m,
      value: Number(val.toFixed(2)),
    };
  });

  // 1A
  const months12 = ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev"];
  result["1A"] = months12.map((m, i) => {
    const factor = 0.85 + (i / 11) * 0.15 + Math.sin(i * 0.5) * 0.04;
    const val = basePrice * factor;
    return {
      time: `${m}/25`,
      value: Number(val.toFixed(2)),
      benchmarkValue: Number((val * 0.93).toFixed(2)),
      annotation: i === 5 ? "Balanço Trimestral Recorde" : undefined,
    };
  });

  // 5A
  const years5 = ["2022", "2023", "2024", "2025", "2026"];
  result["5A"] = years5.map((y, i) => {
    const factor = 0.6 + (i / 4) * 0.4 + (i === 1 ? -0.05 : 0.03);
    const val = basePrice * factor;
    return {
      time: y,
      value: Number(val.toFixed(2)),
      benchmarkValue: Number((val * 0.88).toFixed(2)),
    };
  });

  // MÁX
  const yearsMax = ["2016", "2018", "2020", "2022", "2024", "2026"];
  result["MÁX"] = yearsMax.map((y, i) => {
    const factor = 0.35 + (i / 5) * 0.65;
    const val = basePrice * factor;
    return {
      time: y,
      value: Number(val.toFixed(2)),
      benchmarkValue: Number((val * 0.82).toFixed(2)),
    };
  });

  return result;
}

export const ALL_ASSETS: MarketAsset[] = [
  // ==============================
  // 1. ESTADOS UNIDOS (EUA)
  // ==============================
  {
    symbol: ".DJI",
    name: "Dow Jones Industrial Average",
    exchange: "INDEXDJX",
    region: "EUA",
    price: 43910.45,
    currency: "USD",
    change: 320.15,
    changePercent: 0.73,
    open: 43615.20,
    high: 43980.10,
    low: 43590.00,
    high52: 44485.50,
    low52: 37611.20,
    prevClose: 43590.30,
    volume: "382.4M",
    peRatio: 22.4,
    dividendYield: "1.78%",
    sparkline: [43590, 43620, 43680, 43650, 43710, 43790, 43840, 43810, 43890, 43910],
    historical: generateHistorical(43910.45, 0.73),
    description: "O Dow Jones Industrial Average é um dos índices de ações mais antigos e acompanhados do mundo, composto por 30 empresas líderes da economia norte-americana negociadas na NYSE e NASDAQ.",
    website: "https://www.spglobal.com/spdji/en/indices/equity/dow-jones-industrial-average/",
    headquarters: "Nova York, EUA",
    sector: "Índice Acionário Amplo",
    relatedSymbols: [".INX", ".IXIC", "AAPL", "MSFT"],
    annotations: [
      { time: "09:30", text: "Abertura de Wall Street com forte entrada de fluxo institucional." },
      { time: "14:00", text: "Divulgação da ata do FOMC sustentando ativos de valor." }
    ]
  },
  {
    symbol: ".INX",
    name: "S&P 500",
    exchange: "INDEXSP",
    region: "EUA",
    price: 5983.25,
    currency: "USD",
    change: 48.60,
    changePercent: 0.82,
    open: 5938.10,
    high: 5992.40,
    low: 5930.50,
    high52: 6025.80,
    low52: 4953.50,
    prevClose: 5934.65,
    volume: "2.84B",
    peRatio: 25.8,
    dividendYield: "1.32%",
    sparkline: [5935, 5942, 5950, 5948, 5962, 5970, 5975, 5980, 5983],
    historical: generateHistorical(5983.25, 0.82),
    description: "O S&P 500 reflete a performance de 500 das maiores empresas de capital aberto dos EUA, representando aproximadamente 80% da capitalização de mercado disponível do país.",
    website: "https://www.spglobal.com/spdji/en/indices/equity/sp-500/",
    headquarters: "Nova York, EUA",
    sector: "Índice de Grande Capitalização",
    relatedSymbols: [".DJI", ".IXIC", "NVDA", "MSFT", "AAPL"]
  },
  {
    symbol: ".IXIC",
    name: "Nasdaq Composite",
    exchange: "INDEXNASDAQ",
    region: "EUA",
    price: 18987.60,
    currency: "USD",
    change: 215.80,
    changePercent: 1.15,
    open: 18790.30,
    high: 19020.40,
    low: 18770.10,
    high52: 19150.20,
    low52: 15222.80,
    prevClose: 18771.80,
    volume: "4.12B",
    peRatio: 31.2,
    dividendYield: "0.85%",
    sparkline: [18771, 18810, 18860, 18840, 18900, 18930, 18970, 18987],
    historical: generateHistorical(18987.60, 1.15),
    description: "O índice Nasdaq Composite concentra os maiores gigantes mundiais de tecnologia, inteligência artificial, semicondutores, biotecnologia e inovação digital.",
    website: "https://www.nasdaq.com/market-activity/indexes/ixic",
    headquarters: "Nova York, EUA",
    sector: "Tecnologia & Inovação",
    relatedSymbols: [".INX", "NVDA", "AAPL", "TSLA"]
  },
  {
    symbol: "RUT",
    name: "Russell 2000",
    exchange: "INDEXRUSSELL",
    region: "EUA",
    price: 2265.40,
    currency: "USD",
    change: -12.30,
    changePercent: -0.54,
    open: 2280.10,
    high: 2284.50,
    low: 2258.20,
    high52: 2442.80,
    low52: 1930.20,
    prevClose: 2277.70,
    volume: "1.15B",
    peRatio: 18.9,
    dividendYield: "1.45%",
    sparkline: [2277, 2279, 2275, 2270, 2268, 2262, 2264, 2265],
    historical: generateHistorical(2265.40, -0.54),
    description: "Índice de referência de small caps e empresas de média e baixa capitalização dos Estados Unidos, altamente sensível ao ciclo doméstico de crédito e taxas de juros.",
    sector: "Small Caps",
    relatedSymbols: [".INX", ".DJI"]
  },
  {
    symbol: "VIX",
    name: "CBOE Volatility Index",
    exchange: "INDEXCBOE",
    region: "EUA",
    price: 14.82,
    currency: "USD",
    change: -0.68,
    changePercent: -4.39,
    open: 15.60,
    high: 15.85,
    low: 14.70,
    high52: 38.57,
    low52: 11.86,
    prevClose: 15.50,
    volume: "--",
    sparkline: [15.5, 15.6, 15.3, 15.1, 14.9, 15.0, 14.85, 14.82],
    historical: generateHistorical(14.82, -4.39),
    description: "Conhecido como o 'termômetro do medo' de Wall Street, mede a volatilidade implícita esperada pelo mercado para os contratos de opções do S&P 500 nos próximos 30 dias.",
    sector: "Volatilidade / Derivativos",
    relatedSymbols: [".INX", ".IXIC"]
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    region: "EUA",
    price: 138.25,
    currency: "USD",
    change: 3.45,
    changePercent: 2.56,
    open: 135.10,
    high: 139.10,
    low: 134.80,
    high52: 149.77,
    low52: 75.60,
    prevClose: 134.80,
    volume: "58.2M",
    marketCap: "3.38T",
    peRatio: 48.2,
    dividendYield: "0.03%",
    sparkline: [134.8, 135.5, 136.2, 136.0, 137.4, 137.9, 138.25],
    historical: generateHistorical(138.25, 2.56),
    description: "Líder global absoluta em infraestrutura de computação acelerada, GPUs para data centers de Inteligência Artificial e sistemas integrados de ponta.",
    website: "https://www.nvidia.com",
    ceo: "Jensen Huang",
    headquarters: "Santa Clara, Califórnia, EUA",
    sector: "Semicondutores",
    relatedSymbols: [".IXIC", "AAPL", "MSFT", "TSMC"]
  },

  // ==============================
  // 2. EUROPA
  // ==============================
  {
    symbol: "DAX",
    name: "DAX 40 (Frankfurt)",
    exchange: "INDEXDB",
    region: "Europa",
    price: 22480.30,
    currency: "EUR",
    change: 185.40,
    changePercent: 0.83,
    open: 22310.20,
    high: 22520.10,
    low: 22295.00,
    high52: 22610.50,
    low52: 17620.10,
    prevClose: 22294.90,
    volume: "94.2M",
    peRatio: 14.8,
    dividendYield: "3.10%",
    sparkline: [22295, 22340, 22390, 22410, 22450, 22480],
    historical: generateHistorical(22480.30, 0.83),
    description: "Índice de referência da Bolsa de Valores de Frankfurt (Deutsche Börse), reunindo as 40 maiores e mais líquidas empresas alemãs como SAP, Siemens, Allianz e Volkswagen.",
    website: "https://www.boerse-frankfurt.de",
    headquarters: "Frankfurt, Alemanha",
    sector: "Índice Europeu Principal",
    relatedSymbols: ["SX5E", "CAC", "FTSE"]
  },
  {
    symbol: "FTSE",
    name: "FTSE 100 (Londres)",
    exchange: "INDEXFTSE",
    region: "Europa",
    price: 8520.15,
    currency: "GBP",
    change: 42.10,
    changePercent: 0.50,
    open: 8485.00,
    high: 8535.40,
    low: 8480.20,
    high52: 8610.20,
    low52: 7850.10,
    prevClose: 8478.05,
    volume: "640M",
    peRatio: 12.6,
    dividendYield: "3.85%",
    sparkline: [8478, 8490, 8502, 8498, 8515, 8520],
    historical: generateHistorical(8520.15, 0.50),
    description: "Índice das 100 maiores empresas cotadas na London Stock Exchange (LSE), com forte peso em commodities, energia, finanças globais e farmacêuticas.",
    headquarters: "Londres, Reino Unido",
    sector: "Índice Britânico",
    relatedSymbols: ["DAX", "SX5E"]
  },
  {
    symbol: "CAC",
    name: "CAC 40 (Paris)",
    exchange: "INDEXEURO",
    region: "Europa",
    price: 8015.60,
    currency: "EUR",
    change: 54.30,
    changePercent: 0.68,
    open: 7970.20,
    high: 8030.10,
    low: 7965.40,
    high52: 8250.40,
    low52: 7120.30,
    prevClose: 7961.30,
    volume: "185M",
    peRatio: 15.2,
    dividendYield: "2.95%",
    sparkline: [7961, 7975, 7990, 8005, 8015],
    historical: generateHistorical(8015.60, 0.68),
    description: "Índice de referência da Euronext Paris, liderado por grandes conglomerados mundiais de luxo (LVMH, Hermès, Kering), energia (TotalEnergies) e indústria aeronáutica.",
    headquarters: "Paris, França",
    sector: "Índice Francês",
    relatedSymbols: ["DAX", "SX5E", "IBEX"]
  },
  {
    symbol: "IBEX",
    name: "IBEX 35 (Madrid)",
    exchange: "BME",
    region: "Europa",
    price: 12150.80,
    currency: "EUR",
    change: -28.40,
    changePercent: -0.23,
    open: 12185.00,
    high: 12205.30,
    low: 12130.10,
    high52: 12420.00,
    low52: 9980.50,
    prevClose: 12179.20,
    volume: "120M",
    peRatio: 11.4,
    dividendYield: "4.15%",
    sparkline: [12179, 12190, 12165, 12140, 12150],
    historical: generateHistorical(12150.80, -0.23),
    description: "Principal índice da Bolsa de Valores de Madrid, composto por 35 empresas com forte atuação na Península Ibérica e na América Latina (Santander, BBVA, Iberdrola, Telefónica).",
    headquarters: "Madrid, Espanha",
    sector: "Índice Espanhol",
    relatedSymbols: ["DAX", "CAC"]
  },
  {
    symbol: "SX5E",
    name: "Euro Stoxx 50",
    exchange: "INDEXSTOXX",
    region: "Europa",
    price: 5210.40,
    currency: "EUR",
    change: 38.60,
    changePercent: 0.75,
    open: 5175.20,
    high: 5225.10,
    low: 5170.00,
    high52: 5260.00,
    low52: 4380.20,
    prevClose: 5171.80,
    volume: "820M",
    peRatio: 14.2,
    dividendYield: "3.25%",
    sparkline: [5172, 5185, 5198, 5205, 5210],
    historical: generateHistorical(5210.40, 0.75),
    description: "Índice de blue-chips que congrega as 50 maiores corporações de todos os países da Zona do Euro, referência primária para fundos de pensão e derivativos institucionais.",
    headquarters: "Zurique, Suíça",
    sector: "Zona do Euro",
    relatedSymbols: ["DAX", "CAC", "FTSE"]
  },

  // ==============================
  // 3. ÁSIA
  // ==============================
  {
    symbol: "N225",
    name: "Nikkei 225 (Tóquio)",
    exchange: "INDEXNIKKEI",
    region: "Ásia",
    price: 39450.80,
    currency: "JPY",
    change: 410.20,
    changePercent: 1.05,
    open: 39120.00,
    high: 39580.40,
    low: 39080.10,
    high52: 42426.77,
    low52: 35247.80,
    prevClose: 39040.60,
    volume: "1.42B",
    peRatio: 17.5,
    dividendYield: "1.85%",
    sparkline: [39040, 39150, 39280, 39390, 39450],
    historical: generateHistorical(39450.80, 1.05),
    description: "O Nikkei 225 é o barômetro mais prestigiado do mercado japonês na Tokyo Stock Exchange, acompanhando gigantes mundiais de eletrônica, robótica, semicondutores e montadoras.",
    headquarters: "Tóquio, Japão",
    sector: "Índice Asiático",
    relatedSymbols: ["HSI", "SHCOMP", "SENSEX"]
  },
  {
    symbol: "SHCOMP",
    name: "SSE Composite (Xangai)",
    exchange: "SHA",
    region: "Ásia",
    price: 3385.20,
    currency: "CNY",
    change: 22.40,
    changePercent: 0.67,
    open: 3365.10,
    high: 3398.00,
    low: 3358.40,
    high52: 3674.40,
    low52: 2689.70,
    prevClose: 3362.80,
    volume: "3.28B",
    peRatio: 13.1,
    dividendYield: "2.70%",
    sparkline: [3362, 3370, 3382, 3378, 3385],
    historical: generateHistorical(3385.20, 0.67),
    description: "Índice de todas as ações ordinárias classe A e B negociadas na Bolsa de Xangai, refletindo o pulso econômico e industrial da República Popular da China.",
    headquarters: "Xangai, China",
    sector: "Mercado Chinês",
    relatedSymbols: ["HSI", "N225"]
  },
  {
    symbol: "HSI",
    name: "Hang Seng Index (Hong Kong)",
    exchange: "INDEXHANGSENG",
    region: "Ásia",
    price: 21840.60,
    currency: "HKD",
    change: 310.50,
    changePercent: 1.44,
    open: 21580.00,
    high: 21920.30,
    low: 21540.20,
    high52: 23241.74,
    low52: 14794.16,
    prevClose: 21530.10,
    volume: "2.10B",
    peRatio: 9.8,
    dividendYield: "3.60%",
    sparkline: [21530, 21620, 21740, 21810, 21840],
    historical: generateHistorical(21840.60, 1.44),
    description: "Principal índice da Bolsa de Hong Kong, porta de entrada do capital internacional para os titãs de tecnologia chinesa (Tencent, Alibaba, Meituan) e bancos estatais.",
    headquarters: "Hong Kong",
    sector: "Mercado Financeiro Asiático",
    relatedSymbols: ["SHCOMP", "N225"]
  },
  {
    symbol: "SENSEX",
    name: "BSE SENSEX (Mumbai)",
    exchange: "INDEXBOM",
    region: "Ásia",
    price: 81240.50,
    currency: "INR",
    change: 540.20,
    changePercent: 0.67,
    open: 80800.00,
    high: 81400.10,
    low: 80720.50,
    high52: 85978.25,
    low52: 70319.04,
    prevClose: 80700.30,
    volume: "890M",
    peRatio: 24.1,
    dividendYield: "1.15%",
    sparkline: [80700, 80920, 81050, 81180, 81240],
    historical: generateHistorical(81240.50, 0.67),
    description: "Índice de 30 empresas financeiras e industriais líderes da Bolsa de Valores de Bombaim (BSE), refletindo o vigoroso crescimento demográfico e econômico da Índia.",
    headquarters: "Mumbai, Índia",
    sector: "Mercado Indiano",
    relatedSymbols: ["NIFTY", "N225"]
  },
  {
    symbol: "NIFTY",
    name: "NIFTY 50 (Índia)",
    exchange: "NSE",
    region: "Ásia",
    price: 24680.10,
    currency: "INR",
    change: 162.30,
    changePercent: 0.66,
    open: 24540.00,
    high: 24720.00,
    low: 24510.20,
    high52: 26277.35,
    low52: 21285.55,
    prevClose: 24517.80,
    volume: "1.05B",
    peRatio: 23.4,
    dividendYield: "1.20%",
    sparkline: [24518, 24580, 24630, 24670, 24680],
    historical: generateHistorical(24680.10, 0.66),
    description: "Índice da National Stock Exchange of India (NSE), reunindo as 50 maiores empresas do mercado acionário indiano.",
    headquarters: "Mumbai, Índia",
    sector: "Índice Indiano",
    relatedSymbols: ["SENSEX"]
  },

  // ==============================
  // 4. AMÉRICA LATINA
  // ==============================
  {
    symbol: "IBOV",
    name: "Ibovespa (B3 Brasil)",
    exchange: "BVMF",
    region: "América Latina",
    price: 132450.80,
    currency: "BRL",
    change: 1420.30,
    changePercent: 1.08,
    open: 131100.20,
    high: 132800.50,
    low: 130950.00,
    high52: 137469.38,
    low52: 118162.50,
    prevClose: 131030.50,
    volume: "R$ 24.8B",
    peRatio: 8.9,
    dividendYield: "6.80%",
    sparkline: [131030, 131400, 131850, 132200, 132450],
    historical: generateHistorical(132450.80, 1.08),
    description: "Principal indicador de desempenho do mercado acionário brasileiro na B3, reunindo as ações mais negociadas como Petrobras, Vale, Itaú Unibanco, Bradesco e Ambev.",
    website: "https://www.b3.com.br",
    headquarters: "São Paulo, Brasil",
    sector: "Índice B3 Brasil",
    relatedSymbols: ["PETR4", "VALE3", "ITUB4", "ILF"],
    annotations: [
      { time: "10:00", text: "Abertura do pregão regular da B3 impulsionada por commodities." },
      { time: "15:00", text: "Entrada expressiva de capital estrangeiro em ativos de valor." }
    ]
  },
  {
    symbol: "ILF",
    name: "iShares Latin America 40",
    exchange: "NYSEARCA",
    region: "América Latina",
    price: 28.45,
    currency: "USD",
    change: 0.38,
    changePercent: 1.35,
    open: 28.10,
    high: 28.60,
    low: 28.05,
    high52: 32.40,
    low52: 24.80,
    prevClose: 28.07,
    volume: "1.85M",
    peRatio: 9.4,
    dividendYield: "6.10%",
    sparkline: [28.07, 28.18, 28.32, 28.40, 28.45],
    historical: generateHistorical(28.45, 1.35),
    description: "ETF negociado em Nova York que acompanha as 40 maiores empresas da América Latina (Brasil, México, Chile, Colômbia e Peru).",
    sector: "ETF Regional",
    relatedSymbols: ["IBOV", "PETR4"]
  },
  {
    symbol: "IGOV",
    name: "Índice de Governança Corporativa (IGC)",
    exchange: "BVMF",
    region: "América Latina",
    price: 3840.20,
    currency: "BRL",
    change: 28.40,
    changePercent: 0.74,
    open: 3815.00,
    high: 3855.10,
    low: 3810.20,
    high52: 4010.50,
    low52: 3410.20,
    prevClose: 3811.80,
    volume: "R$ 6.2B",
    peRatio: 10.2,
    dividendYield: "5.40%",
    sparkline: [3812, 3822, 3835, 3840],
    historical: generateHistorical(3840.20, 0.74),
    description: "Mede o desempenho de uma carteira teórica composta por ações de empresas que adotam critérios diferenciados de governança corporativa no Novo Mercado da B3.",
    sector: "Governança B3",
    relatedSymbols: ["IBOV", "IBXX"]
  },
  {
    symbol: "IBXX",
    name: "IBRX 100 Brasil",
    exchange: "BVMF",
    region: "América Latina",
    price: 55420.00,
    currency: "BRL",
    change: 490.00,
    changePercent: 0.89,
    open: 54950.00,
    high: 55550.00,
    low: 54900.00,
    high52: 57800.00,
    low52: 49200.00,
    prevClose: 54930.00,
    volume: "R$ 18.5B",
    peRatio: 9.1,
    dividendYield: "6.30%",
    sparkline: [54930, 55100, 55280, 55420],
    historical: generateHistorical(55420.00, 0.89),
    description: "Índice Brasil 100, avalia o retorno de uma carteira representativa das 100 ações de maior negociabilidade e representatividade no mercado bursátil brasileiro.",
    sector: "Amplo B3",
    relatedSymbols: ["IBOV"]
  },
  {
    symbol: "PETR4",
    name: "Petróleo Brasileiro S.A. - Petrobras PN",
    exchange: "BVMF",
    region: "América Latina",
    price: 37.85,
    currency: "BRL",
    change: 0.75,
    changePercent: 2.02,
    open: 37.20,
    high: 38.10,
    low: 37.10,
    high52: 42.90,
    low52: 32.10,
    prevClose: 37.10,
    volume: "R$ 1.84B",
    marketCap: "R$ 495B",
    peRatio: 4.8,
    dividendYield: "13.40%",
    sparkline: [37.10, 37.35, 37.60, 37.75, 37.85],
    historical: generateHistorical(37.85, 2.02),
    description: "Líder global na exploração e produção de petróleo e gás em águas ultraprofundas na camada do Pré-Sal brasileiro.",
    website: "https://ri.petrobras.com.br",
    ceo: "Magda Chambriard",
    headquarters: "Rio de Janeiro, Brasil",
    sector: "Petróleo, Gás & Biocombustíveis",
    relatedSymbols: ["VALE3", "PRIO3", "BRENT"]
  },
  {
    symbol: "VALE3",
    name: "Vale S.A. ON",
    exchange: "BVMF",
    region: "América Latina",
    price: 58.40,
    currency: "BRL",
    change: 0.65,
    changePercent: 1.13,
    open: 57.80,
    high: 58.90,
    low: 57.60,
    high52: 73.20,
    low52: 54.10,
    prevClose: 57.75,
    volume: "R$ 1.42B",
    marketCap: "R$ 265B",
    peRatio: 5.9,
    dividendYield: "9.80%",
    sparkline: [57.75, 57.90, 58.15, 58.35, 58.40],
    historical: generateHistorical(58.40, 1.13),
    description: "Uma das maiores mineradoras globais, líder em minério de ferro de alto teor, pelotas, níquel e cobre para transição energética.",
    website: "https://vale.com/pt/investidores",
    ceo: "Gustavo Pimenta",
    headquarters: "Rio de Janeiro, Brasil",
    sector: "Mineração & Metais",
    relatedSymbols: ["PETR4", "CSNA3", "IRON"]
  },

  // ==============================
  // 5. MOEDAS (FX)
  // ==============================
  {
    symbol: "EURBRL",
    name: "Euro / Real Brasileiro",
    exchange: "FX",
    region: "Moedas",
    price: 6.2450,
    currency: "BRL",
    change: 0.0210,
    changePercent: 0.34,
    open: 6.2240,
    high: 6.2750,
    low: 6.2180,
    high52: 6.5400,
    low52: 5.2800,
    prevClose: 6.2240,
    volume: "€ 4.8B",
    sparkline: [6.224, 6.231, 6.240, 6.238, 6.245],
    historical: generateHistorical(6.245, 0.34),
    description: "Paridade cambial entre a moeda oficial da Zona do Euro (EUR) e o Real brasileiro (BRL). Principal termômetro do corredor bilateral financeiro e comercial Mercosul - União Europeia.",
    sector: "Câmbio Interbancário",
    relatedSymbols: ["USDBRL", "EURUSD", "GBPBRL"]
  },
  {
    symbol: "USDBRL",
    name: "Dólar Comercial / Real Brasileiro",
    exchange: "FX",
    region: "Moedas",
    price: 5.7620,
    currency: "BRL",
    change: -0.0180,
    changePercent: -0.31,
    open: 5.7800,
    high: 5.7980,
    low: 5.7480,
    high52: 6.2100,
    low52: 4.8900,
    prevClose: 5.7800,
    volume: "$ 18.2B",
    sparkline: [5.780, 5.772, 5.765, 5.768, 5.762],
    historical: generateHistorical(5.762, -0.31),
    description: "Taxa de câmbio comercial entre o Dólar dos EUA (USD) e o Real brasileiro (BRL), cotada sob a supervisão do Banco Central do Brasil (PTAX).",
    sector: "Câmbio Spot",
    relatedSymbols: ["EURBRL", "EURUSD"]
  },
  {
    symbol: "EURUSD",
    name: "Euro / Dólar Americano",
    exchange: "FX",
    region: "Moedas",
    price: 1.0842,
    currency: "USD",
    change: 0.0052,
    changePercent: 0.48,
    open: 1.0790,
    high: 1.0865,
    low: 1.0782,
    high52: 1.1210,
    low52: 1.0450,
    prevClose: 1.0790,
    volume: "$ 120B",
    sparkline: [1.079, 1.081, 1.083, 1.0842],
    historical: generateHistorical(1.0842, 0.48),
    description: "O par cambial mais líquido do planeta, refletindo as dinâmicas macroeconômicas e de política monetária entre o Banco Central Europeu (BCE) e o Federal Reserve (Fed).",
    sector: "Major Forex Pair",
    relatedSymbols: ["EURBRL", "USDBRL", "EURGBP"]
  },
  {
    symbol: "GBPBRL",
    name: "Libra Esterlina / Real Brasileiro",
    exchange: "FX",
    region: "Moedas",
    price: 7.3180,
    currency: "BRL",
    change: 0.0150,
    changePercent: 0.21,
    open: 7.3030,
    high: 7.3450,
    low: 7.2900,
    high52: 7.6200,
    low52: 6.2000,
    prevClose: 7.3030,
    volume: "£ 1.2B",
    sparkline: [7.303, 7.310, 7.315, 7.318],
    historical: generateHistorical(7.318, 0.21),
    description: "Cotação da Libra Esterlina britânica em relação ao Real brasileiro.",
    sector: "Câmbio",
    relatedSymbols: ["EURBRL", "USDBRL"]
  },
  {
    symbol: "USDJPY",
    name: "Dólar Americano / Iene Japonês",
    exchange: "FX",
    region: "Moedas",
    price: 152.40,
    currency: "JPY",
    change: -0.85,
    changePercent: -0.55,
    open: 153.25,
    high: 153.80,
    low: 152.10,
    high52: 161.95,
    low52: 139.58,
    prevClose: 153.25,
    volume: "$ 85B",
    sparkline: [153.25, 152.90, 152.60, 152.40],
    historical: generateHistorical(152.40, -0.55),
    description: "Par fundamental do mercado asiático e global, motor principal das operações de Carry Trade com Iene.",
    sector: "Forex Global",
    relatedSymbols: ["EURUSD", "N225"]
  },

  // ==============================
  // 6. CRIPTOMOEDAS
  // ==============================
  {
    symbol: "BTCBRL",
    name: "Bitcoin (BTC / BRL)",
    exchange: "CRYPTO",
    region: "Criptomoedas",
    price: 554800.00,
    currency: "BRL",
    change: 14200.00,
    changePercent: 2.63,
    open: 540600.00,
    high: 561200.00,
    low: 538900.00,
    high52: 625000.00,
    low52: 295000.00,
    prevClose: 540600.00,
    volume: "R$ 4.2B",
    marketCap: "R$ 10.9T",
    sparkline: [540600, 545200, 551000, 549800, 554800],
    historical: generateHistorical(554800, 2.63),
    description: "A principal criptomoeda descentralizada e reserva de valor digital soberana global, com emissão algorítmica estritamente limitada a 21 milhões de unidades.",
    website: "https://bitcoin.org",
    sector: "Ativos Digitais / Layer 1",
    relatedSymbols: ["ETHBRL", "SOLBRL", "XRPBRL"]
  },
  {
    symbol: "ETHBRL",
    name: "Ethereum (ETH / BRL)",
    exchange: "CRYPTO",
    region: "Criptomoedas",
    price: 15450.00,
    currency: "BRL",
    change: 320.00,
    changePercent: 2.11,
    open: 15130.00,
    high: 15680.00,
    low: 15050.00,
    high52: 22800.00,
    low52: 11400.00,
    prevClose: 15130.00,
    volume: "R$ 1.85B",
    marketCap: "R$ 1.86T",
    sparkline: [15130, 15250, 15380, 15450],
    historical: generateHistorical(15450, 2.11),
    description: "Plataforma descentralizada líder para contratos inteligentes, finanças descentralizadas (DeFi), tokenização de ativos do mundo real (RWA) e camada EVM.",
    website: "https://ethereum.org",
    sector: "Smart Contracts",
    relatedSymbols: ["BTCBRL", "SOLBRL"]
  },
  {
    symbol: "SOLBRL",
    name: "Solana (SOL / BRL)",
    exchange: "CRYPTO",
    region: "Criptomoedas",
    price: 1180.50,
    currency: "BRL",
    change: 45.20,
    changePercent: 3.98,
    open: 1135.30,
    high: 1205.00,
    low: 1128.00,
    high52: 1480.00,
    low52: 580.00,
    prevClose: 1135.30,
    volume: "R$ 820M",
    marketCap: "R$ 560B",
    sparkline: [1135, 1152, 1170, 1180.5],
    historical: generateHistorical(1180.5, 3.98),
    description: "Blockchain de altíssimo desempenho com finalidade de bloco em sub-segundos, baixíssimo custo de transação e ampla adoção em pagamentos instantâneos.",
    website: "https://solana.com",
    sector: "High-Throughput Layer 1",
    relatedSymbols: ["BTCBRL", "ETHBRL"]
  },
  {
    symbol: "XRPBRL",
    name: "XRP (XRP / BRL)",
    exchange: "CRYPTO",
    region: "Criptomoedas",
    price: 13.85,
    currency: "BRL",
    change: 0.42,
    changePercent: 3.13,
    open: 13.43,
    high: 14.10,
    low: 13.35,
    high52: 18.20,
    low52: 2.80,
    prevClose: 13.43,
    volume: "R$ 490M",
    marketCap: "R$ 790B",
    sparkline: [13.43, 13.55, 13.72, 13.85],
    historical: generateHistorical(13.85, 3.13),
    description: "Ativo nativo do XRP Ledger, projetado para liquidação transfronteiriça instantânea e pontes de liquidez entre instituições bancárias globais.",
    sector: "Cross-Border Settlement",
    relatedSymbols: ["BTCBRL", "SOLBRL"]
  },
  {
    symbol: "DOGEBRL",
    name: "Dogecoin (DOGE / BRL)",
    exchange: "CRYPTO",
    region: "Criptomoedas",
    price: 1.48,
    currency: "BRL",
    change: -0.04,
    changePercent: -2.63,
    open: 1.52,
    high: 1.56,
    low: 1.45,
    high52: 2.85,
    low52: 0.48,
    prevClose: 1.52,
    volume: "R$ 280M",
    marketCap: "R$ 215B",
    sparkline: [1.52, 1.50, 1.47, 1.48],
    historical: generateHistorical(1.48, -2.63),
    description: "Criptomoeda de código aberto baseada em prova de trabalho com alta liquidez no varejo global e comunidade participativa.",
    sector: "Meme / Pagamentos",
    relatedSymbols: ["BTCBRL"]
  },

  // ==============================
  // 7. CONTRATOS FUTUROS
  // ==============================
  {
    symbol: "BRENT",
    name: "Petróleo Brent Futuro (ICE)",
    exchange: "NYMEX",
    region: "Contratos futuros",
    price: 74.85,
    currency: "USD",
    change: 1.15,
    changePercent: 1.56,
    open: 73.70,
    high: 75.20,
    low: 73.50,
    high52: 92.40,
    low52: 68.20,
    prevClose: 73.70,
    volume: "285K Contratos",
    sparkline: [73.7, 74.1, 74.6, 74.85],
    historical: generateHistorical(74.85, 1.56),
    description: "Contrato futuro de Petróleo Brent cotado na ICE/NYMEX, referência global para precificação de combustíveis e contratos da Petrobras e petroleiras europeias.",
    sector: "Energia / Commodities",
    relatedSymbols: ["PETR4", "GOLD"]
  },
  {
    symbol: "GOLD",
    name: "Ouro Futuro (COMEX Gold)",
    exchange: "COMEX",
    region: "Contratos futuros",
    price: 2945.60,
    currency: "USD",
    change: 18.40,
    changePercent: 0.63,
    open: 2927.20,
    high: 2955.00,
    low: 2922.10,
    high52: 2980.50,
    low52: 2040.00,
    prevClose: 2927.20,
    volume: "194K Contratos",
    sparkline: [2927, 2935, 2942, 2945.6],
    historical: generateHistorical(2945.60, 0.63),
    description: "Contrato padrão de 100 onças troy de ouro fino na COMEX, porto seguro clássico contra inflação e tensões geopolíticas internacionais.",
    sector: "Metais Preciosos",
    relatedSymbols: ["BRENT", "IRON"]
  },
  {
    symbol: "IRON",
    name: "Minério de Ferro 62% (Dalian / SGX)",
    exchange: "SGX",
    region: "Contratos futuros",
    price: 104.20,
    currency: "USD",
    change: 1.80,
    changePercent: 1.76,
    open: 102.40,
    high: 105.10,
    low: 102.00,
    high52: 144.50,
    low52: 91.20,
    prevClose: 102.40,
    volume: "520K Ton",
    sparkline: [102.4, 103.1, 103.9, 104.2],
    historical: generateHistorical(104.20, 1.76),
    description: "Referência dos contratos futuros de minério de ferro de alto teor importado pela siderurgia chinesa, balizador direto das receitas da Vale e CSN.",
    sector: "Metais Industriais",
    relatedSymbols: ["VALE3", "CSNA3"]
  },
  {
    symbol: "SOY",
    name: "Soja Futuro (CBOT Soybeans)",
    exchange: "CBOT",
    region: "Contratos futuros",
    price: 1032.50,
    currency: "USd/bu",
    change: -8.50,
    changePercent: -0.82,
    open: 1041.00,
    high: 1046.00,
    low: 1028.50,
    high52: 1285.00,
    low52: 955.00,
    prevClose: 1041.00,
    volume: "140K Contratos",
    sparkline: [1041, 1038, 1034, 1032.5],
    historical: generateHistorical(1032.50, -0.82),
    description: "Contratos de grãos de soja na Bolsa de Mercadorias de Chicago (CBOT), o mais influente termômetro do agronegócio exportador do Mercosul.",
    sector: "Agronegócio",
    relatedSymbols: ["BRENT"]
  },
  {
    symbol: "ES",
    name: "E-mini S&P 500 Futuro",
    exchange: "CME",
    region: "Contratos futuros",
    price: 5998.75,
    currency: "USD",
    change: 32.50,
    changePercent: 0.54,
    open: 5966.25,
    high: 6008.50,
    low: 5962.00,
    high52: 6042.00,
    low52: 4980.00,
    prevClose: 5966.25,
    volume: "1.4M Contratos",
    sparkline: [5966, 5978, 5990, 5998.75],
    historical: generateHistorical(5998.75, 0.54),
    description: "O contrato derivativo de índices acionários mais líquido do mercado financeiro global na Chicago Mercantile Exchange.",
    sector: "Índices Futuros",
    relatedSymbols: [".INX", ".IXIC"]
  }
];

// ==============================
// 8. ACCORDION TOPICS PER REGION
// ==============================
export const REGIONAL_ACCORDION_TOPICS: Record<MarketRegion, MarketAccordionTopic[]> = {
  "EUA": [
    {
      id: "us-macro-fed",
      region: "EUA",
      title: "Decisão do FOMC & Trajetória da Taxa dos Fed Funds",
      categoryTag: "Política Monetária",
      summary: "O Federal Reserve mantém postura orientada por dados de inflação (CPI/PCE) e resiliência do mercado de trabalho norte-americano.",
      bulletPoints: [
        "Juros dos Fed Funds oscilando na faixa de 4,25% - 4,50% com foco na convergência para a meta de 2,0%.",
        "Treasuries de 10 anos operando em torno de 4,45%, ancorando custos globais de dívida corporativa.",
        "Mercados precificam probabilidade moderada de cortes adicionais ao longo dos próximos trimestres."
      ],
      aiPrompt: "Faça uma análise institucional detalhada dos impactos da decisão mais recente do Federal Reserve sobre a liquidez global, fluxo de capitais para emergentes e paridade EUR/USD.",
      sentiment: "neutral",
      updatedTime: "Há 18 min"
    },
    {
      id: "us-tech-ai",
      region: "EUA",
      title: "Investimentos em Infraestrutura de IA e Capex das Big Techs",
      categoryTag: "Tecnologia & Balanços",
      summary: "Nvidia, Microsoft, Alphabet e Meta reportam expansão bilionária em data centers e semicondutores de última geração.",
      bulletPoints: [
        "Aceleração da demanda por chips Blackwell e clusters de treinamento LLM.",
        "Monetização de nuvem corporativa gerando crescimento de receita acima de 25% a.a.",
        "Multiplos de P/L do Nasdaq se mantendo elevados sustentados por margens operacionais robustas."
      ],
      aiPrompt: "Explique como os gastos de capital (Capex) em IA das Big Techs norte-americanas afetam a cadeia de semicondutores e se há risco de sobrecapacidade nos próximos anos.",
      sentiment: "bullish",
      updatedTime: "Há 42 min"
    },
    {
      id: "us-energy-tariffs",
      region: "EUA",
      title: "Reconfiguração Tarifária e Política Comercial Global",
      categoryTag: "Comércio & Geopolítica",
      summary: "Propostas de sobretaxas aduaneiras e protecionismo industrial geram volatilidade nos fluxos de importação e nos rendimentos dos Treasuries.",
      bulletPoints: [
        "Discussão sobre tarifas recíprocas e impacto na inflação de bens duráveis.",
        "Fortalecimento relativo do índice DXY frente a moedas de parceiros comerciais.",
        "Setores industriais locais ganham impulso enquanto exportadores sofrem ajustes."
      ],
      aiPrompt: "Quais os efeitos macroeconômicos e cambiais para o Brasil e a Europa diante de uma escalada de tarifas comerciais impostas pelos Estados Unidos?",
      sentiment: "neutral",
      updatedTime: "Há 1 hora"
    }
  ],
  "Europa": [
    {
      id: "eu-ecb-cuts",
      region: "Europa",
      title: "Ciclo de Afrouxamento Monetário do BCE e Desinflação no Bloco",
      categoryTag: "Banco Central Europeu",
      summary: "O BCE conduz cortes graduais na Taxa de Facilidade de Depósito (3,00%) para estimular a atividade industrial estagnada.",
      bulletPoints: [
        "Inflação HICP na Zona do Euro convergindo próxima da meta de 2,0% com arrefecimento dos custos de energia.",
        "Diferencial de juros em relação aos EUA pressiona o Euro, favorecendo exportadoras da Alemanha e França.",
        "Bancos europeus mantêm rentabilidade sobre patrimônio (ROE) elevada com distribuição de dividendos recordes."
      ],
      aiPrompt: "Como a política de afrouxamento monetário do Banco Central Europeu (BCE) afeta a atratividade do Euro e o custo de financiamento corporativo transfronteiriço?",
      sentiment: "bullish",
      updatedTime: "Há 25 min"
    },
    {
      id: "eu-mercosur-deal",
      region: "Europa",
      title: "Ratificação do Acordo Mercosul – União Europeia e Quotas Tarifárias",
      categoryTag: "Corredor Mercosul - UE",
      summary: "Negociações finais sobre cláusulas de conformidade ambiental (ESG / Desmatamento) e abertura de mercados bilaterais.",
      bulletPoints: [
        "Desgravação tarifária progressiva de até 90% do comércio bilateral ao longo de 10 a 15 anos.",
        "Oportunidades em agroindústria sustentável para o Mercosul e bens de capital de alta tecnologia para a Europa.",
        "Redução de custos aduaneiros e modernização das regras de origem (EUR.1 / TARIC)."
      ],
      aiPrompt: "Detalhe os principais ganhos econômicos e desafios alfandegários para empresas brasileiras e europeias com a implementação plena do Tratado de Livre Comércio Mercosul-UE.",
      sentiment: "bullish",
      updatedTime: "Há 55 min"
    },
    {
      id: "eu-defense-energy",
      region: "Europa",
      title: "Transição Energética e Orçamentos de Defesa na OTAN",
      categoryTag: "Setor Estratégico",
      summary: "Aumento nos orçamentos de defesa da Alemanha, França e Reino Unido aliado a investimentos maciços em hidrogênio verde.",
      bulletPoints: [
        "Ações de defesa (Rheinmetall, BAE Systems, Thales) renovam máximas históricas.",
        "Mercado de carbono europeu (EU ETS) dita novos padrões de precificação industrial.",
        "Dependência de gás natural liquefeito (GNL) dos EUA e Oriente Médio estabilizada."
      ],
      aiPrompt: "Analise o impacto fiscal do aumento dos gastos em defesa e energia limpa na Europa sobre a dívida soberana e a competitividade do DAX 40.",
      sentiment: "neutral",
      updatedTime: "Há 2 horas"
    }
  ],
  "Ásia": [
    {
      id: "asia-japan-boj",
      region: "Ásia",
      title: "Normalização do Bank of Japan (BoJ) e Desmonte de Carry Trade",
      categoryTag: "Macroeconomia Japão",
      summary: "O Banco do Japão ajusta juros e flexibiliza o controle da curva de rendimentos (YCC), fortalecendo o Iene.",
      bulletPoints: [
        "Crescimento real dos salários japoneses sustenta inflação saudável pela primeira vez em três décadas.",
        "Volatilidade em operações de arbitragem global decorrente de oscilações no par USD/JPY.",
        "Nikkei 225 atrai fluxos recordes de investidores institucionais buscando governança e recompras."
      ],
      aiPrompt: "Explique como as altas de juros do Banco do Japão desarmam o Carry Trade global e quais ativos no Brasil e nos EUA são mais vulneráveis a essa reprecificação.",
      sentiment: "neutral",
      updatedTime: "Há 35 min"
    },
    {
      id: "asia-china-stimulus",
      region: "Ásia",
      title: "Pacotes de Estímulo Fiscal e Monetário na China",
      categoryTag: "Economia Chinesa",
      summary: "O Banco do Povo da China (PBoC) e o Ministério das Finanças injetam liquidez para impulsionar o consumo e o setor imobiliário.",
      bulletPoints: [
        "Redução de compulsórios bancários (RRR) e suporte direto a hipotecas e infraestrutura verde.",
        "Impacto imediato no apetite global por commodities minerais e metálicas (Minério de Ferro, Cobre, Níquel).",
        "Ações de tecnologia chinesas em Hong Kong negociando com desconto atrativo em relação aos pares ocidentais."
      ],
      aiPrompt: "Qual a magnitude dos estímulos fiscais da China na demanda mundial por commodities e como isso beneficia mineradoras como a Vale na B3?",
      sentiment: "bullish",
      updatedTime: "Há 1 hora"
    },
    {
      id: "asia-india-growth",
      region: "Ásia",
      title: "Expansão Industrial e Demográfica da Índia (Make in India)",
      categoryTag: "Índia & Emergentes",
      summary: "PIB da Índia cresce acima de 6,8% ao ano, impulsionado por investimentos em manufatura eletrônica e infraestrutura viária.",
      bulletPoints: [
        "Entrada massiva de capital estrangeiro em IPOs locais na NSE e BSE.",
        "Expansão dos serviços digitais e forte consumo da classe média urbana.",
        "Índice SENSEX e NIFTY 50 atingindo patamares históricos."
      ],
      aiPrompt: "Por que a Índia está se consolidando como o polo fabril alternativo à China e quais oportunidades de investimento existem para fundos globais?",
      sentiment: "bullish",
      updatedTime: "Há 3 horas"
    }
  ],
  "América Latina": [
    {
      id: "latam-selic-copom",
      region: "América Latina",
      title: "COPOM e a Taxa Selic a 10,50%: Juro Real e Prêmio de Risco",
      categoryTag: "Banco Central do Brasil",
      summary: "O Banco Central do Brasil mantém postura restritiva para assegurar a ancoragem das expectativas do IPCA.",
      bulletPoints: [
        "Juro real brasileiro ex-ante acima de 6,0% a.a., um dos mais atrativos do mundo para investidores internacionais.",
        "Pressões fiscais domésticas e metas orçamentárias monitoradas de perto pelos agentes de mercado.",
        "Fluxo cambial positivo atenuando oscilações pontuais do dólar e do euro."
      ],
      aiPrompt: "Faça uma análise profunda da estratégia do COPOM/BACEN na condução da Taxa Selic, relacionando juro real elevado, risco fiscal e atração de investimento estrangeiro na B3.",
      sentiment: "neutral",
      updatedTime: "Há 12 min"
    },
    {
      id: "latam-commodities-agro",
      region: "América Latina",
      title: "Superávit Comercial Recorde do Agronegócio e Pré-Sal",
      categoryTag: "Balança Comercial",
      summary: "Exportações de petróleo pela Petrobras e safras recordes de soja/milho sustentam robustez nas reservas cambiais do Brasil.",
      bulletPoints: [
        "Superávit comercial brasileiro estimado em mais de US$ 80 bilhões no ano.",
        "Produtividade agrícola do Centro-Oeste compensando preços médios deprimidos em Chicago.",
        "Geração de caixa extraordinária e distribuição de proventos em dólares e reais."
      ],
      aiPrompt: "Como a combinação de exportações do Pré-Sal e agronegócio blinda a balança de pagamentos do Brasil contra choques externos?",
      sentiment: "bullish",
      updatedTime: "Há 40 min"
    },
    {
      id: "latam-drex-pix",
      region: "América Latina",
      title: "Vanguarda Tecnológica: Fase 2 do DREX e Pix Internacional",
      categoryTag: "Inovação Financeira BCB",
      summary: "O Brasil lidera a agenda de digitalização soberana com a CBDC DREX (Hyperledger Besu) e integração transfronteiriça com o Projeto Nexus.",
      bulletPoints: [
        "Testes de liquidação atômica de Títulos Públicos (TPFt) e contratos inteligentes de Entrega contra Pagamento (DvP).",
        "Pix Internacional eliminando intermediários da rede SWIFT e reduzindo taxas de remessas a frações de centavo.",
        "Adoção acelerada de Open Finance com compartilhamento seguro de dados cadastrais e de crédito."
      ],
      aiPrompt: "Detalhe a arquitetura do DREX e do Pix Internacional, explicando como transformarão o câmbio institucional e as remessas entre o Brasil e a Europa.",
      sentiment: "bullish",
      updatedTime: "Há 1 hora"
    }
  ],
  "Moedas": [
    {
      id: "fx-eur-brl-arbitrage",
      region: "Moedas",
      title: "Paridade EUR/BRL e Otimização do VET em Remessas",
      categoryTag: "Câmbio & VET",
      summary: "A cotação do Euro em relação ao Real oscila entre R$ 6,20 e R$ 6,28, exigindo cálculo minucioso do Valor Efetivo Total.",
      bulletPoints: [
        "Diferença entre cotação spot interbancária e taxas de spread aplicadas por fintechs e grandes bancos.",
        "Alíquotas de IOF: 1,10% para mesma titularidade vs 0,38% para terceiros/serviços e 4,38% no turismo.",
        "Eficiência de canais SEPA Instant combinados com PIX para liquidação no mesmo dia útil."
      ],
      aiPrompt: "Mostre o passo a passo matemático para calcular o Valor Efetivo Total (VET) na conversão de Euros para Reais, considerando spread, IOF e taxas de rede bancária.",
      sentiment: "neutral",
      updatedTime: "Há 15 min"
    },
    {
      id: "fx-dxy-carry",
      region: "Moedas",
      title: "Índice Dólar (DXY) e Dinâmica do Carry Trade",
      categoryTag: "Mercado Internacional",
      summary: "O diferencial entre as taxas do Fed (4,50%), BCE (3,00%) e Selic (10,50%) orienta estratégias de rentabilidade alavancada.",
      bulletPoints: [
        "Investidores captam em moedas de baixo rendimento (EUR, JPY) para aplicar em títulos públicos atrelados ao CDI/Selic.",
        "Colchão cambial de proteção contra depreciação do Real estimado em mais de 7,5% ao ano.",
        "Instrumentos de hedge cambial via NDF e Cupom Cambial na B3 amplamente demandados."
      ],
      aiPrompt: "Como estruturar uma operação de Carry Trade EUR/BRL com trava de risco cambial e quais os principais pontos de atenção macroeconômicos?",
      sentiment: "bullish",
      updatedTime: "Há 50 min"
    }
  ],
  "Criptomoedas": [
    {
      id: "crypto-btc-etf",
      region: "Criptomoedas",
      title: "Adoção Institucional de Bitcoin e Reservas Estratégicas",
      categoryTag: "Bitcoin & Criptoativos",
      summary: "ETFs à vista de Bitcoin registram entradas líquidas contínuas de fundos soberanos e corporações multinacionais.",
      bulletPoints: [
        "Mais de 1 milhão de Bitcoins sob custódia direta de emissores institucionais de ETFs.",
        "Discussões sobre reservas estratégicas governamentais em ativos digitais não inflacionários.",
        "Ciclo pós-halving consolidando o Bitcoin como ouro digital de liquidação global."
      ],
      aiPrompt: "Analise a maturidade institucional do Bitcoin após a consolidação dos ETFs à vista e como corporações gerenciam a custódia e risco em seus balanços.",
      sentiment: "bullish",
      updatedTime: "Há 20 min"
    },
    {
      id: "crypto-rwa-mica",
      region: "Criptomoedas",
      title: "Regulamentação Europeia MiCA e Stablecoins em Euro (EURC)",
      categoryTag: "Regulação & RWA",
      summary: "A entrada em vigor do regulamento Markets in Crypto-Assets (MiCA) na União Europeia padroniza a emissão de tokens lastreados.",
      bulletPoints: [
        "Exigência de reservas 100% líquidas e auditadas para emissores de tokens de dinheiro eletrônico (EMT).",
        "Crescimento de stablecoins lastreadas em Euro (EURC) para liquidação em tesourarias corporativas.",
        "Tokenização de crédito privado, imóveis e títulos soberanos ganhando escala com segurança jurídica."
      ],
      aiPrompt: "Explique os impactos do marco regulatório europeu MiCA na operação de stablecoins em Euro e como o Brasil se posiciona com sua Lei de Criptoativos.",
      sentiment: "bullish",
      updatedTime: "Há 1 hora"
    }
  ],
  "Contratos futuros": [
    {
      id: "futures-brent-geopolitics",
      region: "Contratos futuros",
      title: "Petróleo Brent: Equilíbrio entre OPEP+ e Demanda Mundial",
      categoryTag: "Commodities Energéticas",
      summary: "Contratos futuros de Petróleo oscilam com cortes voluntários de produção da OPEP+ e produção recorde nos Estados Unidos.",
      bulletPoints: [
        "Barril de Brent negociando entre US$ 72 e US$ 78, sustentando fluxo de caixa para empresas de exploração marítima.",
        "Riscos de interrupção logística no Mar Vermelho e Estreito de Ormuz precificados no spread de entrega futura.",
        "Demanda industrial da Ásia como vetor chave de sustentação das cotações."
      ],
      aiPrompt: "Qual a correlação entre a variação dos contratos futuros de Petróleo Brent e a lucratividade operacional da Petrobras e do setor de refino global?",
      sentiment: "neutral",
      updatedTime: "Há 30 min"
    },
    {
      id: "futures-gold-ath",
      region: "Contratos futuros",
      title: "Ouro Futuro: Demanda de Bancos Centrais e Proteção Geopolítica",
      categoryTag: "Metais Preciosos",
      summary: "Contratos na COMEX testam máximas históricas impulsionados por compras massivas de bancos centrais de mercados emergentes.",
      bulletPoints: [
        "Diversificação de reservas internacionais reduzindo concentração em ativos denominados em dólares.",
        "Ouro físico servindo como garantia colateral de liquidação internacional.",
        "Demanda por ETFs de ouro físico reaquecida no mercado europeu e asiático."
      ],
      aiPrompt: "Por que os bancos centrais mundiais estão acelerando a compra de ouro como reserva monetária e qual o impacto no preço futuro do metal?",
      sentiment: "bullish",
      updatedTime: "Há 1 hora"
    }
  ]
};

// ==============================
// 9. LOCAL EQUITIES TABLES (B3 / LATAM)
// ==============================
export const MOST_ACTIVE_STOCKS = [
  { symbol: "PETR4", name: "Petrobras PN", price: 37.85, change: 0.75, changePercent: 2.02, volume: "R$ 1.84B" },
  { symbol: "VALE3", name: "Vale ON", price: 58.40, change: 0.65, changePercent: 1.13, volume: "R$ 1.42B" },
  { symbol: "ITUB4", name: "Itaú Unibanco PN", price: 35.60, change: 0.45, changePercent: 1.28, volume: "R$ 980M" },
  { symbol: "B3SA3", name: "B3 Brasil Bolsa Balcão", price: 11.25, change: 0.15, changePercent: 1.35, volume: "R$ 720M" },
  { symbol: "MGLU3", name: "Magazine Luiza ON", price: 9.42, change: -0.28, changePercent: -2.89, volume: "R$ 640M" },
  { symbol: "BBDC4", name: "Banco Bradesco PN", price: 14.80, change: 0.20, changePercent: 1.37, volume: "R$ 590M" },
];

export const TOP_GAINERS_STOCKS = [
  { symbol: "PRIO3", name: "PRIO ON (PetroRio)", price: 44.80, change: 1.95, changePercent: 4.55, volume: "R$ 480M" },
  { symbol: "EMBR3", name: "Embraer ON", price: 56.10, change: 2.30, changePercent: 4.28, volume: "R$ 610M" },
  { symbol: "WEGE3", name: "WEG ON", price: 52.40, change: 1.85, changePercent: 3.66, volume: "R$ 750M" },
  { symbol: "CSNA3", name: "Siderúrgica Nacional ON", price: 11.90, change: 0.38, changePercent: 3.30, volume: "R$ 310M" },
  { symbol: "BRAV3", name: "Brava Energia ON", price: 18.25, change: 0.55, changePercent: 3.11, volume: "R$ 240M" },
  { symbol: "SUZB3", name: "Suzano Papel ON", price: 58.70, change: 1.60, changePercent: 2.80, volume: "R$ 410M" },
];

export const TOP_LOSERS_STOCKS = [
  { symbol: "AZUL4", name: "Azul Linhas Aéreas PN", price: 4.85, change: -0.42, changePercent: -7.97, volume: "R$ 290M" },
  { symbol: "BHIA3", name: "Casas Bahia ON", price: 3.12, change: -0.22, changePercent: -6.59, volume: "R$ 180M" },
  { symbol: "GOLL4", name: "Gol Linhas Aéreas PN", price: 1.15, change: -0.06, changePercent: -4.96, volume: "R$ 95M" },
  { symbol: "COGN3", name: "Cogna Educação ON", price: 1.48, change: -0.07, changePercent: -4.52, volume: "R$ 140M" },
  { symbol: "CMIN3", name: "CSN Mineração ON", price: 5.62, change: -0.21, changePercent: -3.60, volume: "R$ 210M" },
  { symbol: "CVCB3", name: "CVC Brasil ON", price: 1.98, change: -0.06, changePercent: -2.94, volume: "R$ 115M" },
];

// ==============================
// 10. MARKET NEWS FEED
// ==============================
export const MARKET_NEWS: MarketNewsItem[] = [
  {
    id: "news-1",
    title: "Mercados globais reagem a decisões de bancos centrais com fluxo comprador em emergentes",
    publisher: "DinhEuro Financial Wire",
    timeAgo: "Há 18 min",
    category: "Macroeconomia",
    url: "#",
    snippet: "A estabilização das taxas de juros nos EUA e o ciclo de afrouxamento monetário pelo BCE impulsionam a busca por ativos de juro real elevado no Brasil e na América Latina.",
    relatedSymbol: "IBOV"
  },
  {
    id: "news-2",
    title: "Petrobras (PETR4) amplia produção no Pré-Sal e confirma pagamento de dividendos extraordinários",
    publisher: "InfoMoney / DinhEuro",
    timeAgo: "Há 45 min",
    category: "Corporativo B3",
    url: "#",
    snippet: "Com avanço nos campos de Búzios e Mero, a estatal brasileira reforça sua geração de caixa operacional em dólares e atrai analistas estrangeiros.",
    relatedSymbol: "PETR4"
  },
  {
    id: "news-3",
    title: "Acordo Mercosul – União Europeia entra na reta final com foco em desregulamentação aduaneira",
    publisher: "Valor Econômico / Bruxelas",
    timeAgo: "Há 1 hora",
    category: "Comércio Bilateral",
    url: "#",
    snippet: "Representantes em Bruxelas e Brasília alinham cronogramas para eliminação recíproca de tarifas em bens industriais e agroalimentares certificados.",
    relatedSymbol: "EURBRL"
  },
  {
    id: "news-4",
    title: "Nvidia (NVDA) e gigantes de semicondutores lideram altas no Nasdaq com nova geração de chips para IA",
    publisher: "Bloomberg Línea",
    timeAgo: "Há 2 horas",
    category: "Tecnologia",
    url: "#",
    snippet: "Investimentos em data centers de hiperescala continuam acelerando sem sinais de desaceleração, sustentando os índices de Wall Street.",
    relatedSymbol: "NVDA"
  },
  {
    id: "news-5",
    title: "Bitcoin consolida patamar acima de R$ 550 mil com influxos recordes em ETFs institucionais",
    publisher: "CoinDesk / DinhEuro Crypto",
    timeAgo: "Há 3 horas",
    category: "Criptoativos",
    url: "#",
    snippet: "Fundos de pensão e tesourarias corporativas aumentam alocação estratégica na principal moeda digital soberana.",
    relatedSymbol: "BTCBRL"
  },
  {
    id: "news-6",
    title: "Vale (VALE3) se beneficia de estímulos à siderurgia na China e recuperação do Minério de Ferro",
    publisher: "Reuters Mercados",
    timeAgo: "Há 4 horas",
    category: "Mineração",
    url: "#",
    snippet: "Novas medidas de liquidez anunciadas por Pequim animam os contratos futuros em Singapura e sustentam o fluxo para a mineradora brasileira.",
    relatedSymbol: "VALE3"
  }
];
