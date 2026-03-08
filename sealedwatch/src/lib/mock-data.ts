import { Product, PricePoint, TCGCategory, ProductType, DataSource } from "./types";

// Generate realistic price history with trend + noise
function generatePriceHistory(
  basePrice: number,
  days: number,
  trend: number, // annual trend multiplier (1.1 = 10% annual growth)
  volatility: number,
  startDate: Date
): PricePoint[] {
  const points: PricePoint[] = [];
  let price = basePrice / Math.pow(trend, days / 365);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dailyTrend = Math.pow(trend, 1 / 365);
    const noise = 1 + (Math.random() - 0.5) * volatility;
    price = price * dailyTrend * noise;
    const sources: DataSource[] = ["tcgplayer", "ebay"];
    if (Math.random() > 0.5) sources.push("130point");
    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      volume: Math.floor(Math.random() * 50) + 5,
      source: sources[Math.floor(Math.random() * sources.length)],
    });
  }
  return points;
}

function makeProduct(
  id: string,
  name: string,
  set: string,
  category: TCGCategory,
  type: ProductType,
  releaseDate: string,
  currentPrice: number,
  trend: number,
  volatility: number,
  historyDays: number
): Product {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - historyDays);
  const history = generatePriceHistory(currentPrice, historyDays, trend, volatility, startDate);

  // Override last point to be the current price
  if (history.length > 0) {
    history[history.length - 1].price = currentPrice;
  }

  const prevClose = history.length > 1 ? history[history.length - 2].price : currentPrice;
  const weekAgo = history.length > 7 ? history[history.length - 8].price : currentPrice;
  const monthAgo = history.length > 30 ? history[history.length - 31].price : currentPrice;
  const prices = history.map((p) => p.price);
  const last365 = prices.slice(-365);

  const dayChange = currentPrice - prevClose;
  const dayChangePct = (dayChange / prevClose) * 100;
  const weekChange = currentPrice - weekAgo;
  const weekChangePct = (weekChange / weekAgo) * 100;
  const monthChange = currentPrice - monthAgo;
  const monthChangePct = (monthChange / monthAgo) * 100;

  return {
    id,
    name,
    set,
    category,
    type,
    releaseDate,
    currentPrice,
    previousClose: prevClose,
    dayChange: Math.round(dayChange * 100) / 100,
    dayChangePercent: Math.round(dayChangePct * 100) / 100,
    weekChange: Math.round(weekChange * 100) / 100,
    weekChangePercent: Math.round(weekChangePct * 100) / 100,
    monthChange: Math.round(monthChange * 100) / 100,
    monthChangePercent: Math.round(monthChangePct * 100) / 100,
    high52w: Math.round(Math.max(...last365) * 100) / 100,
    low52w: Math.round(Math.min(...last365) * 100) / 100,
    allTimeHigh: Math.round(Math.max(...prices) * 100) / 100,
    allTimeLow: Math.round(Math.min(...prices) * 100) / 100,
    volume: Math.floor(Math.random() * 200) + 20,
    avgVolume: Math.floor(Math.random() * 150) + 30,
    priceHistory: history,
    sources: ["tcgplayer", "ebay", "130point"],
  };
}

// Deterministic-ish seed for consistent renders (re-seeded on module load)
export const PRODUCTS: Product[] = [
  // === POKEMON ===
  makeProduct(
    "pkmn-sv-prismatic-bb",
    "Prismatic Evolutions Booster Box",
    "Scarlet & Violet - Prismatic Evolutions",
    "pokemon", "booster-box", "2025-01-17",
    289.99, 1.35, 0.04, 400
  ),
  makeProduct(
    "pkmn-sv-prismatic-case",
    "Prismatic Evolutions Case (6 Boxes)",
    "Scarlet & Violet - Prismatic Evolutions",
    "pokemon", "case", "2025-01-17",
    1649.99, 1.30, 0.035, 400
  ),
  makeProduct(
    "pkmn-sv-prismatic-bundle",
    "Prismatic Evolutions Booster Bundle",
    "Scarlet & Violet - Prismatic Evolutions",
    "pokemon", "booster-bundle", "2025-01-17",
    44.99, 1.15, 0.05, 400
  ),
  makeProduct(
    "pkmn-sv-surging-bb",
    "Surging Sparks Booster Box",
    "Scarlet & Violet - Surging Sparks",
    "pokemon", "booster-box", "2024-11-08",
    119.99, 1.08, 0.03, 500
  ),
  makeProduct(
    "pkmn-sv-shrouded-bb",
    "Shrouded Fable Booster Box",
    "Scarlet & Violet - Shrouded Fable",
    "pokemon", "booster-box", "2024-08-02",
    89.99, 1.12, 0.04, 600
  ),
  makeProduct(
    "pkmn-sv-twilight-bb",
    "Twilight Masquerade Booster Box",
    "Scarlet & Violet - Twilight Masquerade",
    "pokemon", "booster-box", "2024-05-24",
    104.99, 1.05, 0.03, 700
  ),
  makeProduct(
    "pkmn-sv-temporal-bb",
    "Temporal Forces Booster Box",
    "Scarlet & Violet - Temporal Forces",
    "pokemon", "booster-box", "2024-03-22",
    109.99, 1.10, 0.035, 730
  ),
  makeProduct(
    "pkmn-swsh-evolving-bb",
    "Evolving Skies Booster Box",
    "Sword & Shield - Evolving Skies",
    "pokemon", "booster-box", "2021-08-27",
    389.99, 1.25, 0.03, 1800
  ),
  makeProduct(
    "pkmn-sm-hidden-fates-etb",
    "Hidden Fates ETB",
    "Sun & Moon - Hidden Fates",
    "pokemon", "etb", "2019-08-23",
    134.99, 1.20, 0.04, 1800
  ),
  makeProduct(
    "pkmn-xy-evolutions-bb",
    "Evolutions Booster Box",
    "XY - Evolutions",
    "pokemon", "booster-box", "2016-11-02",
    899.99, 1.40, 0.03, 1800
  ),
  makeProduct(
    "pkmn-sv-destined-bb",
    "Destined Rivals Booster Box",
    "Scarlet & Violet - Destined Rivals",
    "pokemon", "booster-box", "2025-05-30",
    94.99, 0.95, 0.06, 200
  ),

  // === MAGIC: THE GATHERING ===
  makeProduct(
    "mtg-otj-play-bb",
    "Outlaws of Thunder Junction Play BB",
    "Outlaws of Thunder Junction",
    "magic", "booster-box", "2024-04-19",
    94.99, 1.02, 0.03, 700
  ),
  makeProduct(
    "mtg-otj-collector-bb",
    "Outlaws of Thunder Junction Collector BB",
    "Outlaws of Thunder Junction",
    "magic", "collector-booster-box", "2024-04-19",
    189.99, 1.08, 0.04, 700
  ),
  makeProduct(
    "mtg-mkm-play-bb",
    "Murders at Karlov Manor Play BB",
    "Murders at Karlov Manor",
    "magic", "booster-box", "2024-02-09",
    89.99, 0.98, 0.03, 780
  ),
  makeProduct(
    "mtg-mkm-collector-bb",
    "Murders at Karlov Manor Collector BB",
    "Murders at Karlov Manor",
    "magic", "collector-booster-box", "2024-02-09",
    179.99, 1.05, 0.04, 780
  ),
  makeProduct(
    "mtg-dsk-play-bb",
    "Duskmourn Play Booster Box",
    "Duskmourn: House of Horror",
    "magic", "booster-box", "2024-09-27",
    97.99, 1.04, 0.03, 540
  ),
  makeProduct(
    "mtg-dsk-collector-bb",
    "Duskmourn Collector Booster Box",
    "Duskmourn: House of Horror",
    "magic", "collector-booster-box", "2024-09-27",
    219.99, 1.12, 0.04, 540
  ),
  makeProduct(
    "mtg-2xm-bb",
    "Double Masters 2022 Booster Box",
    "Double Masters 2022",
    "magic", "booster-box", "2022-07-08",
    289.99, 1.18, 0.03, 1800
  ),
  makeProduct(
    "mtg-2xm-collector-bb",
    "Double Masters 2022 Collector BB",
    "Double Masters 2022",
    "magic", "collector-booster-box", "2022-07-08",
    349.99, 1.22, 0.04, 1800
  ),
  makeProduct(
    "mtg-mh3-play-bb",
    "Modern Horizons 3 Play Booster Box",
    "Modern Horizons 3",
    "magic", "booster-box", "2024-06-14",
    249.99, 1.15, 0.035, 650
  ),
  makeProduct(
    "mtg-mh3-collector-bb",
    "Modern Horizons 3 Collector BB",
    "Modern Horizons 3",
    "magic", "collector-booster-box", "2024-06-14",
    379.99, 1.20, 0.04, 650
  ),
  makeProduct(
    "mtg-fdn-play-bb",
    "Foundations Play Booster Box",
    "Foundations",
    "magic", "booster-box", "2024-11-15",
    99.99, 1.03, 0.03, 480
  ),

  // === ONE PIECE ===
  makeProduct(
    "op-op09-bb",
    "OP-09 Four Emperors Booster Box",
    "OP-09 Four Emperors",
    "onepiece", "booster-box", "2024-09-13",
    109.99, 1.15, 0.05, 560
  ),
  makeProduct(
    "op-op09-case",
    "OP-09 Four Emperors Case (12 Boxes)",
    "OP-09 Four Emperors",
    "onepiece", "case", "2024-09-13",
    1189.99, 1.12, 0.04, 560
  ),
  makeProduct(
    "op-op08-bb",
    "OP-08 Two Legends Booster Box",
    "OP-08 Two Legends",
    "onepiece", "booster-box", "2024-05-25",
    94.99, 1.20, 0.05, 680
  ),
  makeProduct(
    "op-op07-bb",
    "OP-07 500 Years in the Future BB",
    "OP-07 500 Years in the Future",
    "onepiece", "booster-box", "2024-03-15",
    79.99, 1.08, 0.04, 730
  ),
  makeProduct(
    "op-op06-bb",
    "OP-06 Wings of the Captain BB",
    "OP-06 Wings of the Captain",
    "onepiece", "booster-box", "2024-01-26",
    84.99, 1.10, 0.045, 800
  ),
  makeProduct(
    "op-op05-bb",
    "OP-05 Awakening of the New Era BB",
    "OP-05 Awakening of the New Era",
    "onepiece", "booster-box", "2023-12-01",
    119.99, 1.30, 0.05, 1100
  ),
  makeProduct(
    "op-op04-bb",
    "OP-04 Kingdoms of Intrigue BB",
    "OP-04 Kingdoms of Intrigue",
    "onepiece", "booster-box", "2023-09-22",
    89.99, 1.18, 0.045, 1200
  ),
  makeProduct(
    "op-op01-bb",
    "OP-01 Romance Dawn Booster Box",
    "OP-01 Romance Dawn",
    "onepiece", "booster-box", "2022-12-02",
    249.99, 1.45, 0.04, 1800
  ),
  makeProduct(
    "op-op10-bb",
    "OP-10 Royal Blood Booster Box",
    "OP-10 Royal Blood",
    "onepiece", "booster-box", "2025-03-07",
    89.99, 0.92, 0.07, 100
  ),
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: TCGCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getTopGainers(count: number = 10): Product[] {
  return [...PRODUCTS]
    .sort((a, b) => b.dayChangePercent - a.dayChangePercent)
    .slice(0, count);
}

export function getTopLosers(count: number = 10): Product[] {
  return [...PRODUCTS]
    .sort((a, b) => a.dayChangePercent - b.dayChangePercent)
    .slice(0, count);
}

export function getMostActive(count: number = 10): Product[] {
  return [...PRODUCTS]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, count);
}

export function filterPriceHistory(history: PricePoint[], range: string): PricePoint[] {
  const now = new Date();
  let daysBack: number;
  switch (range) {
    case "1D": daysBack = 1; break;
    case "7D": daysBack = 7; break;
    case "30D": daysBack = 30; break;
    case "90D": daysBack = 90; break;
    case "180D": daysBack = 180; break;
    case "1Y": daysBack = 365; break;
    case "3Y": daysBack = 1095; break;
    case "5Y": daysBack = 1825; break;
    default: return history; // MAX
  }
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - daysBack);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  return history.filter((p) => p.date >= cutoffStr);
}

export function getMarketSummary() {
  const gainers = PRODUCTS.filter((p) => p.dayChangePercent > 0).length;
  const losers = PRODUCTS.filter((p) => p.dayChangePercent < 0).length;
  return {
    totalProducts: PRODUCTS.length,
    totalMarketCap: PRODUCTS.reduce((sum, p) => sum + p.currentPrice * p.volume, 0),
    avgDayChange:
      PRODUCTS.reduce((sum, p) => sum + p.dayChangePercent, 0) / PRODUCTS.length,
    gainers,
    losers,
    unchanged: PRODUCTS.length - gainers - losers,
    mostActive: getMostActive(5),
  };
}
