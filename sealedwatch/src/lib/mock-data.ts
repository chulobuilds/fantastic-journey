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

export const PRODUCTS: Product[] = [
  // ============================================================
  // POKEMON - Scarlet & Violet Era
  // ============================================================

  // --- Prismatic Evolutions (Jan 2025) ---
  makeProduct("pkmn-sv-prismatic-bb", "Prismatic Evolutions Booster Box", "SV - Prismatic Evolutions", "pokemon", "booster-box", "2025-01-17", 289.99, 1.35, 0.04, 400),
  makeProduct("pkmn-sv-prismatic-ebb", "Prismatic Evolutions Enhanced BB", "SV - Prismatic Evolutions", "pokemon", "enhanced-booster-box", "2025-01-17", 339.99, 1.38, 0.045, 400),
  makeProduct("pkmn-sv-prismatic-bundle", "Prismatic Evolutions Booster Bundle", "SV - Prismatic Evolutions", "pokemon", "booster-bundle", "2025-01-17", 44.99, 1.15, 0.05, 400),
  makeProduct("pkmn-sv-prismatic-etb", "Prismatic Evolutions ETB", "SV - Prismatic Evolutions", "pokemon", "etb", "2025-01-17", 79.99, 1.28, 0.045, 400),
  makeProduct("pkmn-sv-prismatic-pc-etb", "Prismatic Evolutions PC ETB", "SV - Prismatic Evolutions", "pokemon", "pc-etb", "2025-01-17", 99.99, 1.32, 0.05, 400),
  makeProduct("pkmn-sv-prismatic-upc", "Prismatic Evolutions UPC", "SV - Prismatic Evolutions", "pokemon", "ultra-premium-collection", "2025-01-17", 149.99, 1.40, 0.045, 400),
  makeProduct("pkmn-sv-prismatic-case-bb", "Prismatic Evolutions BB Case (6)", "SV - Prismatic Evolutions", "pokemon", "case", "2025-01-17", 1649.99, 1.30, 0.035, 400),
  makeProduct("pkmn-sv-prismatic-case-etb", "Prismatic Evolutions ETB Case (10)", "SV - Prismatic Evolutions", "pokemon", "case", "2025-01-17", 749.99, 1.25, 0.04, 400),

  // --- Destined Rivals (May 2025) ---
  makeProduct("pkmn-sv-destined-bb", "Destined Rivals Booster Box", "SV - Destined Rivals", "pokemon", "booster-box", "2025-05-30", 94.99, 0.95, 0.06, 200),
  makeProduct("pkmn-sv-destined-bundle", "Destined Rivals Booster Bundle", "SV - Destined Rivals", "pokemon", "booster-bundle", "2025-05-30", 29.99, 0.93, 0.06, 200),
  makeProduct("pkmn-sv-destined-etb", "Destined Rivals ETB", "SV - Destined Rivals", "pokemon", "etb", "2025-05-30", 42.99, 0.94, 0.055, 200),
  makeProduct("pkmn-sv-destined-pc-etb", "Destined Rivals PC ETB", "SV - Destined Rivals", "pokemon", "pc-etb", "2025-05-30", 49.99, 0.96, 0.06, 200),
  makeProduct("pkmn-sv-destined-case-bb", "Destined Rivals BB Case (6)", "SV - Destined Rivals", "pokemon", "case", "2025-05-30", 539.99, 0.94, 0.05, 200),

  // --- Surging Sparks (Nov 2024) ---
  makeProduct("pkmn-sv-surging-bb", "Surging Sparks Booster Box", "SV - Surging Sparks", "pokemon", "booster-box", "2024-11-08", 119.99, 1.08, 0.03, 500),
  makeProduct("pkmn-sv-surging-bundle", "Surging Sparks Booster Bundle", "SV - Surging Sparks", "pokemon", "booster-bundle", "2024-11-08", 32.99, 1.04, 0.04, 500),
  makeProduct("pkmn-sv-surging-etb", "Surging Sparks ETB", "SV - Surging Sparks", "pokemon", "etb", "2024-11-08", 44.99, 1.06, 0.035, 500),
  makeProduct("pkmn-sv-surging-pc-etb", "Surging Sparks PC ETB", "SV - Surging Sparks", "pokemon", "pc-etb", "2024-11-08", 54.99, 1.10, 0.04, 500),
  makeProduct("pkmn-sv-surging-case-bb", "Surging Sparks BB Case (6)", "SV - Surging Sparks", "pokemon", "case", "2024-11-08", 679.99, 1.07, 0.03, 500),

  // --- Shrouded Fable (Aug 2024) - Enhanced set ---
  makeProduct("pkmn-sv-shrouded-ebb", "Shrouded Fable Enhanced Booster Box", "SV - Shrouded Fable", "pokemon", "enhanced-booster-box", "2024-08-02", 89.99, 1.12, 0.04, 600),
  makeProduct("pkmn-sv-shrouded-etb", "Shrouded Fable ETB", "SV - Shrouded Fable", "pokemon", "etb", "2024-08-02", 49.99, 1.08, 0.04, 600),
  makeProduct("pkmn-sv-shrouded-case", "Shrouded Fable Enhanced BB Case (10)", "SV - Shrouded Fable", "pokemon", "case", "2024-08-02", 849.99, 1.10, 0.035, 600),

  // --- Twilight Masquerade (May 2024) ---
  makeProduct("pkmn-sv-twilight-bb", "Twilight Masquerade Booster Box", "SV - Twilight Masquerade", "pokemon", "booster-box", "2024-05-24", 104.99, 1.05, 0.03, 700),
  makeProduct("pkmn-sv-twilight-bundle", "Twilight Masquerade Booster Bundle", "SV - Twilight Masquerade", "pokemon", "booster-bundle", "2024-05-24", 29.99, 1.02, 0.04, 700),
  makeProduct("pkmn-sv-twilight-etb", "Twilight Masquerade ETB", "SV - Twilight Masquerade", "pokemon", "etb", "2024-05-24", 39.99, 1.03, 0.035, 700),
  makeProduct("pkmn-sv-twilight-case-bb", "Twilight Masquerade BB Case (6)", "SV - Twilight Masquerade", "pokemon", "case", "2024-05-24", 599.99, 1.04, 0.03, 700),

  // --- Temporal Forces (Mar 2024) ---
  makeProduct("pkmn-sv-temporal-bb", "Temporal Forces Booster Box", "SV - Temporal Forces", "pokemon", "booster-box", "2024-03-22", 109.99, 1.10, 0.035, 730),
  makeProduct("pkmn-sv-temporal-bundle", "Temporal Forces Booster Bundle", "SV - Temporal Forces", "pokemon", "booster-bundle", "2024-03-22", 32.99, 1.06, 0.04, 730),
  makeProduct("pkmn-sv-temporal-etb", "Temporal Forces ETB", "SV - Temporal Forces", "pokemon", "etb", "2024-03-22", 44.99, 1.08, 0.035, 730),
  makeProduct("pkmn-sv-temporal-pc-etb", "Temporal Forces PC ETB", "SV - Temporal Forces", "pokemon", "pc-etb", "2024-03-22", 54.99, 1.12, 0.04, 730),
  makeProduct("pkmn-sv-temporal-case-bb", "Temporal Forces BB Case (6)", "SV - Temporal Forces", "pokemon", "case", "2024-03-22", 629.99, 1.09, 0.03, 730),

  // --- Paldean Fates (Jan 2024) - Enhanced ---
  makeProduct("pkmn-sv-paldean-ebb", "Paldean Fates Enhanced Booster Box", "SV - Paldean Fates", "pokemon", "enhanced-booster-box", "2024-01-26", 109.99, 1.18, 0.04, 800),
  makeProduct("pkmn-sv-paldean-etb", "Paldean Fates ETB", "SV - Paldean Fates", "pokemon", "etb", "2024-01-26", 54.99, 1.14, 0.04, 800),
  makeProduct("pkmn-sv-paldean-case", "Paldean Fates Enhanced BB Case (10)", "SV - Paldean Fates", "pokemon", "case", "2024-01-26", 1049.99, 1.15, 0.035, 800),

  // --- 151 (Sep 2023) - Enhanced ---
  makeProduct("pkmn-sv-151-ebb", "151 Enhanced Booster Box", "SV - 151", "pokemon", "enhanced-booster-box", "2023-09-22", 159.99, 1.30, 0.04, 1300),
  makeProduct("pkmn-sv-151-bundle", "151 Booster Bundle", "SV - 151", "pokemon", "booster-bundle", "2023-09-22", 49.99, 1.22, 0.045, 1300),
  makeProduct("pkmn-sv-151-etb", "151 ETB", "SV - 151", "pokemon", "etb", "2023-09-22", 59.99, 1.25, 0.04, 1300),
  makeProduct("pkmn-sv-151-pc-etb", "151 PC ETB", "SV - 151", "pokemon", "pc-etb", "2023-09-22", 79.99, 1.30, 0.045, 1300),
  makeProduct("pkmn-sv-151-upc", "151 Ultra Premium Collection", "SV - 151", "pokemon", "ultra-premium-collection", "2023-09-22", 199.99, 1.35, 0.04, 1300),
  makeProduct("pkmn-sv-151-case", "151 Enhanced BB Case (10)", "SV - 151", "pokemon", "case", "2023-09-22", 1499.99, 1.28, 0.035, 1300),

  // --- Obsidian Flames (Aug 2023) ---
  makeProduct("pkmn-sv-obsidian-bb", "Obsidian Flames Booster Box", "SV - Obsidian Flames", "pokemon", "booster-box", "2023-08-11", 99.99, 1.06, 0.03, 1400),
  makeProduct("pkmn-sv-obsidian-etb", "Obsidian Flames ETB", "SV - Obsidian Flames", "pokemon", "etb", "2023-08-11", 34.99, 1.04, 0.035, 1400),
  makeProduct("pkmn-sv-obsidian-case-bb", "Obsidian Flames BB Case (6)", "SV - Obsidian Flames", "pokemon", "case", "2023-08-11", 569.99, 1.05, 0.03, 1400),

  // --- SV Base (Mar 2023) ---
  makeProduct("pkmn-sv-base-bb", "Scarlet & Violet Base Booster Box", "Scarlet & Violet Base", "pokemon", "booster-box", "2023-03-31", 109.99, 1.08, 0.03, 1800),
  makeProduct("pkmn-sv-base-etb", "Scarlet & Violet Base ETB", "SV Base", "pokemon", "etb", "2023-03-31", 39.99, 1.05, 0.035, 1800),
  makeProduct("pkmn-sv-base-case-bb", "Scarlet & Violet Base BB Case (6)", "SV Base", "pokemon", "case", "2023-03-31", 629.99, 1.07, 0.03, 1800),

  // ============================================================
  // POKEMON - Sword & Shield Era
  // ============================================================

  // --- Crown Zenith (Jan 2023) - Enhanced ---
  makeProduct("pkmn-swsh-crown-ebb", "Crown Zenith Enhanced BB", "SWSH - Crown Zenith", "pokemon", "enhanced-booster-box", "2023-01-20", 119.99, 1.22, 0.04, 1800),
  makeProduct("pkmn-swsh-crown-etb", "Crown Zenith ETB", "SWSH - Crown Zenith", "pokemon", "etb", "2023-01-20", 59.99, 1.18, 0.04, 1800),
  makeProduct("pkmn-swsh-crown-pc-etb", "Crown Zenith PC ETB", "SWSH - Crown Zenith", "pokemon", "pc-etb", "2023-01-20", 79.99, 1.22, 0.045, 1800),
  makeProduct("pkmn-swsh-crown-case", "Crown Zenith Enhanced BB Case (10)", "SWSH - Crown Zenith", "pokemon", "case", "2023-01-20", 1099.99, 1.20, 0.035, 1800),

  // --- Silver Tempest (Nov 2022) ---
  makeProduct("pkmn-swsh-silver-bb", "Silver Tempest Booster Box", "SWSH - Silver Tempest", "pokemon", "booster-box", "2022-11-11", 134.99, 1.10, 0.03, 1800),
  makeProduct("pkmn-swsh-silver-etb", "Silver Tempest ETB", "SWSH - Silver Tempest", "pokemon", "etb", "2022-11-11", 39.99, 1.06, 0.04, 1800),
  makeProduct("pkmn-swsh-silver-case-bb", "Silver Tempest BB Case (6)", "SWSH - Silver Tempest", "pokemon", "case", "2022-11-11", 769.99, 1.09, 0.03, 1800),

  // --- Lost Origin (Sep 2022) ---
  makeProduct("pkmn-swsh-lost-bb", "Lost Origin Booster Box", "SWSH - Lost Origin", "pokemon", "booster-box", "2022-09-09", 129.99, 1.08, 0.03, 1800),
  makeProduct("pkmn-swsh-lost-case-bb", "Lost Origin BB Case (6)", "SWSH - Lost Origin", "pokemon", "case", "2022-09-09", 739.99, 1.07, 0.03, 1800),

  // --- Evolving Skies (Aug 2021) ---
  makeProduct("pkmn-swsh-evolving-bb", "Evolving Skies Booster Box", "SWSH - Evolving Skies", "pokemon", "booster-box", "2021-08-27", 389.99, 1.25, 0.03, 1800),
  makeProduct("pkmn-swsh-evolving-etb", "Evolving Skies ETB", "SWSH - Evolving Skies", "pokemon", "etb", "2021-08-27", 89.99, 1.20, 0.04, 1800),
  makeProduct("pkmn-swsh-evolving-case-bb", "Evolving Skies BB Case (6)", "SWSH - Evolving Skies", "pokemon", "case", "2021-08-27", 2249.99, 1.23, 0.03, 1800),

  // --- Chilling Reign (Jun 2021) ---
  makeProduct("pkmn-swsh-chilling-bb", "Chilling Reign Booster Box", "SWSH - Chilling Reign", "pokemon", "booster-box", "2021-06-18", 159.99, 1.12, 0.03, 1800),
  makeProduct("pkmn-swsh-chilling-etb", "Chilling Reign ETB", "SWSH - Chilling Reign", "pokemon", "etb", "2021-06-18", 49.99, 1.08, 0.04, 1800),

  // --- Battle Styles (Mar 2021) ---
  makeProduct("pkmn-swsh-battle-bb", "Battle Styles Booster Box", "SWSH - Battle Styles", "pokemon", "booster-box", "2021-03-19", 129.99, 1.06, 0.03, 1800),

  // --- Vivid Voltage (Nov 2020) ---
  makeProduct("pkmn-swsh-vivid-bb", "Vivid Voltage Booster Box", "SWSH - Vivid Voltage", "pokemon", "booster-box", "2020-11-13", 169.99, 1.15, 0.03, 1800),
  makeProduct("pkmn-swsh-vivid-etb", "Vivid Voltage ETB", "SWSH - Vivid Voltage", "pokemon", "etb", "2020-11-13", 54.99, 1.10, 0.04, 1800),

  // --- Champion's Path (Sep 2020) ---
  makeProduct("pkmn-swsh-champions-etb", "Champion's Path ETB", "SWSH - Champion's Path", "pokemon", "etb", "2020-09-25", 79.99, 1.18, 0.04, 1800),

  // --- Hidden Fates (Aug 2019) ---
  makeProduct("pkmn-sm-hidden-etb", "Hidden Fates ETB", "SM - Hidden Fates", "pokemon", "etb", "2019-08-23", 134.99, 1.20, 0.04, 1800),

  // ============================================================
  // POKEMON - Special Premium / UPC Products
  // ============================================================
  makeProduct("pkmn-swsh-celebrations-upc", "Celebrations UPC", "SWSH - Celebrations", "pokemon", "ultra-premium-collection", "2021-10-08", 349.99, 1.30, 0.035, 1800),
  makeProduct("pkmn-swsh-vmax-climax-bb", "VMAX Climax Booster Box (JP Import)", "SWSH - VMAX Climax", "pokemon", "booster-box", "2021-12-03", 109.99, 1.18, 0.04, 1800),
  makeProduct("pkmn-swsh-charizard-upc", "Charizard UPC", "SWSH - Charizard UPC", "pokemon", "ultra-premium-collection", "2022-10-28", 299.99, 1.35, 0.04, 1800),
  makeProduct("pkmn-sv-charizard-upc-sv", "SV Charizard ex UPC", "SV - Charizard ex UPC", "pokemon", "ultra-premium-collection", "2023-10-06", 119.99, 1.15, 0.04, 1600),
  makeProduct("pkmn-sv-mew-spc", "Mew Special Premium Collection", "SV - Mew 151 SPC", "pokemon", "special-premium-collection", "2023-10-06", 59.99, 1.12, 0.045, 1600),
  makeProduct("pkmn-sv-terastal-spc", "Terastal Festival ex SPC", "SV - Terastal Festival", "pokemon", "special-premium-collection", "2025-01-10", 49.99, 1.08, 0.05, 420),

  // ============================================================
  // POKEMON - XY / Legacy
  // ============================================================
  makeProduct("pkmn-xy-evolutions-bb", "Evolutions Booster Box", "XY - Evolutions", "pokemon", "booster-box", "2016-11-02", 899.99, 1.40, 0.03, 1800),
  makeProduct("pkmn-xy-evolutions-case", "Evolutions BB Case (6)", "XY - Evolutions", "pokemon", "case", "2016-11-02", 5199.99, 1.38, 0.03, 1800),

  // ============================================================
  // MAGIC: THE GATHERING
  // ============================================================

  // --- Aetherdrift (Feb 2025) ---
  makeProduct("mtg-aether-play-bb", "Aetherdrift Play Booster Box", "Aetherdrift", "magic", "play-booster-box", "2025-02-14", 99.99, 1.02, 0.03, 365),
  makeProduct("mtg-aether-collector-bb", "Aetherdrift Collector Booster Box", "Aetherdrift", "magic", "collector-booster-box", "2025-02-14", 219.99, 1.06, 0.04, 365),
  makeProduct("mtg-aether-bundle", "Aetherdrift Bundle", "Aetherdrift", "magic", "gift-bundle", "2025-02-14", 44.99, 1.01, 0.04, 365),
  makeProduct("mtg-aether-commander", "Aetherdrift Commander Deck Set (4)", "Aetherdrift", "magic", "commander-deck", "2025-02-14", 159.99, 1.03, 0.035, 365),
  makeProduct("mtg-aether-case-play", "Aetherdrift Play BB Case (6)", "Aetherdrift", "magic", "case", "2025-02-14", 569.99, 1.01, 0.025, 365),
  makeProduct("mtg-aether-case-collector", "Aetherdrift Collector BB Case (6)", "Aetherdrift", "magic", "case", "2025-02-14", 1269.99, 1.05, 0.035, 365),

  // --- Foundations (Nov 2024) ---
  makeProduct("mtg-fdn-play-bb", "Foundations Play Booster Box", "Foundations", "magic", "play-booster-box", "2024-11-15", 99.99, 1.03, 0.03, 480),
  makeProduct("mtg-fdn-collector-bb", "Foundations Collector Booster Box", "Foundations", "magic", "collector-booster-box", "2024-11-15", 189.99, 1.08, 0.04, 480),
  makeProduct("mtg-fdn-bundle", "Foundations Bundle", "Foundations", "magic", "gift-bundle", "2024-11-15", 41.99, 1.02, 0.04, 480),
  makeProduct("mtg-fdn-commander", "Foundations Commander Deck Set (4)", "Foundations", "magic", "commander-deck", "2024-11-15", 149.99, 1.04, 0.035, 480),
  makeProduct("mtg-fdn-case-play", "Foundations Play BB Case (6)", "Foundations", "magic", "case", "2024-11-15", 569.99, 1.02, 0.025, 480),
  makeProduct("mtg-fdn-case-collector", "Foundations Collector BB Case (6)", "Foundations", "magic", "case", "2024-11-15", 1089.99, 1.07, 0.035, 480),

  // --- Duskmourn: House of Horror (Sep 2024) ---
  makeProduct("mtg-dsk-play-bb", "Duskmourn Play Booster Box", "Duskmourn: House of Horror", "magic", "play-booster-box", "2024-09-27", 97.99, 1.04, 0.03, 540),
  makeProduct("mtg-dsk-collector-bb", "Duskmourn Collector Booster Box", "Duskmourn: House of Horror", "magic", "collector-booster-box", "2024-09-27", 219.99, 1.12, 0.04, 540),
  makeProduct("mtg-dsk-bundle", "Duskmourn Gift Bundle", "Duskmourn: House of Horror", "magic", "gift-bundle", "2024-09-27", 49.99, 1.03, 0.04, 540),
  makeProduct("mtg-dsk-commander", "Duskmourn Commander Deck Set (4)", "Duskmourn: House of Horror", "magic", "commander-deck", "2024-09-27", 139.99, 1.05, 0.035, 540),
  makeProduct("mtg-dsk-case-play", "Duskmourn Play BB Case (6)", "Duskmourn: House of Horror", "magic", "case", "2024-09-27", 559.99, 1.03, 0.025, 540),
  makeProduct("mtg-dsk-case-collector", "Duskmourn Collector BB Case (6)", "Duskmourn: House of Horror", "magic", "case", "2024-09-27", 1269.99, 1.10, 0.035, 540),

  // --- Bloomburrow (Aug 2024) ---
  makeProduct("mtg-blb-play-bb", "Bloomburrow Play Booster Box", "Bloomburrow", "magic", "play-booster-box", "2024-08-02", 94.99, 1.06, 0.03, 600),
  makeProduct("mtg-blb-collector-bb", "Bloomburrow Collector Booster Box", "Bloomburrow", "magic", "collector-booster-box", "2024-08-02", 209.99, 1.14, 0.04, 600),
  makeProduct("mtg-blb-bundle", "Bloomburrow Bundle", "Bloomburrow", "magic", "gift-bundle", "2024-08-02", 41.99, 1.04, 0.04, 600),
  makeProduct("mtg-blb-commander", "Bloomburrow Commander Deck Set (4)", "Bloomburrow", "magic", "commander-deck", "2024-08-02", 149.99, 1.06, 0.035, 600),
  makeProduct("mtg-blb-collector-commander", "Bloomburrow Collector Commander Deck", "Bloomburrow", "magic", "collector-commander-deck", "2024-08-02", 79.99, 1.08, 0.04, 600),
  makeProduct("mtg-blb-case-play", "Bloomburrow Play BB Case (6)", "Bloomburrow", "magic", "case", "2024-08-02", 539.99, 1.05, 0.025, 600),

  // --- Modern Horizons 3 (Jun 2024) ---
  makeProduct("mtg-mh3-play-bb", "Modern Horizons 3 Play Booster Box", "Modern Horizons 3", "magic", "play-booster-box", "2024-06-14", 249.99, 1.15, 0.035, 650),
  makeProduct("mtg-mh3-collector-bb", "Modern Horizons 3 Collector BB", "Modern Horizons 3", "magic", "collector-booster-box", "2024-06-14", 379.99, 1.20, 0.04, 650),
  makeProduct("mtg-mh3-bundle", "Modern Horizons 3 Gift Bundle", "Modern Horizons 3", "magic", "gift-bundle", "2024-06-14", 79.99, 1.10, 0.04, 650),
  makeProduct("mtg-mh3-commander", "Modern Horizons 3 Commander Deck Set (4)", "Modern Horizons 3", "magic", "commander-deck", "2024-06-14", 189.99, 1.12, 0.035, 650),
  makeProduct("mtg-mh3-collector-commander", "Modern Horizons 3 Collector Cmdr Deck", "Modern Horizons 3", "magic", "collector-commander-deck", "2024-06-14", 89.99, 1.14, 0.04, 650),
  makeProduct("mtg-mh3-case-play", "Modern Horizons 3 Play BB Case (6)", "Modern Horizons 3", "magic", "case", "2024-06-14", 1449.99, 1.14, 0.03, 650),
  makeProduct("mtg-mh3-case-collector", "Modern Horizons 3 Collector BB Case (6)", "Modern Horizons 3", "magic", "case", "2024-06-14", 2199.99, 1.18, 0.035, 650),

  // --- Outlaws of Thunder Junction (Apr 2024) ---
  makeProduct("mtg-otj-play-bb", "Outlaws of Thunder Junction Play BB", "Outlaws of Thunder Junction", "magic", "play-booster-box", "2024-04-19", 94.99, 1.02, 0.03, 700),
  makeProduct("mtg-otj-collector-bb", "Outlaws of Thunder Junction Collector BB", "Outlaws of Thunder Junction", "magic", "collector-booster-box", "2024-04-19", 189.99, 1.08, 0.04, 700),
  makeProduct("mtg-otj-bundle", "Outlaws of Thunder Junction Bundle", "Outlaws of Thunder Junction", "magic", "gift-bundle", "2024-04-19", 41.99, 1.01, 0.04, 700),
  makeProduct("mtg-otj-commander", "Outlaws of Thunder Junction Cmdr Set (4)", "Outlaws of Thunder Junction", "magic", "commander-deck", "2024-04-19", 149.99, 1.04, 0.035, 700),
  makeProduct("mtg-otj-case-play", "Outlaws of Thunder Junction Play BB Case (6)", "Outlaws of Thunder Junction", "magic", "case", "2024-04-19", 539.99, 1.01, 0.025, 700),

  // --- Murders at Karlov Manor (Feb 2024) ---
  makeProduct("mtg-mkm-play-bb", "Murders at Karlov Manor Play BB", "Murders at Karlov Manor", "magic", "play-booster-box", "2024-02-09", 89.99, 0.98, 0.03, 780),
  makeProduct("mtg-mkm-collector-bb", "Murders at Karlov Manor Collector BB", "Murders at Karlov Manor", "magic", "collector-booster-box", "2024-02-09", 179.99, 1.05, 0.04, 780),
  makeProduct("mtg-mkm-commander", "Murders at Karlov Manor Commander Set (4)", "Murders at Karlov Manor", "magic", "commander-deck", "2024-02-09", 139.99, 1.02, 0.035, 780),
  makeProduct("mtg-mkm-case-play", "Murders at Karlov Manor Play BB Case (6)", "Murders at Karlov Manor", "magic", "case", "2024-02-09", 509.99, 0.97, 0.025, 780),

  // --- Lost Caverns of Ixalan (Nov 2023) ---
  makeProduct("mtg-lci-play-bb", "Lost Caverns of Ixalan Play BB", "Lost Caverns of Ixalan", "magic", "play-booster-box", "2023-11-17", 89.99, 1.04, 0.03, 1200),
  makeProduct("mtg-lci-collector-bb", "Lost Caverns of Ixalan Collector BB", "Lost Caverns of Ixalan", "magic", "collector-booster-box", "2023-11-17", 209.99, 1.10, 0.04, 1200),
  makeProduct("mtg-lci-bundle", "Lost Caverns of Ixalan Gift Bundle", "Lost Caverns of Ixalan", "magic", "gift-bundle", "2023-11-17", 49.99, 1.04, 0.04, 1200),

  // --- Wilds of Eldraine (Sep 2023) ---
  makeProduct("mtg-woe-play-bb", "Wilds of Eldraine Draft BB", "Wilds of Eldraine", "magic", "draft-booster-box", "2023-09-08", 89.99, 1.03, 0.03, 1350),
  makeProduct("mtg-woe-collector-bb", "Wilds of Eldraine Collector BB", "Wilds of Eldraine", "magic", "collector-booster-box", "2023-09-08", 199.99, 1.12, 0.04, 1350),

  // --- Lord of the Rings: Tales of Middle-earth (Jun 2023) ---
  makeProduct("mtg-ltr-draft-bb", "LotR Tales of Middle-earth Draft BB", "LotR: Tales of Middle-earth", "magic", "draft-booster-box", "2023-06-23", 139.99, 1.15, 0.035, 1500),
  makeProduct("mtg-ltr-collector-bb", "LotR Tales of Middle-earth Collector BB", "LotR: Tales of Middle-earth", "magic", "collector-booster-box", "2023-06-23", 349.99, 1.22, 0.04, 1500),
  makeProduct("mtg-ltr-bundle", "LotR Tales of Middle-earth Gift Bundle", "LotR: Tales of Middle-earth", "magic", "gift-bundle", "2023-06-23", 69.99, 1.12, 0.04, 1500),
  makeProduct("mtg-ltr-case-draft", "LotR Tales Draft BB Case (6)", "LotR: Tales of Middle-earth", "magic", "case", "2023-06-23", 799.99, 1.14, 0.03, 1500),
  makeProduct("mtg-ltr-case-collector", "LotR Tales Collector BB Case (6)", "LotR: Tales of Middle-earth", "magic", "case", "2023-06-23", 2019.99, 1.20, 0.035, 1500),

  // --- Double Masters 2022 (Jul 2022) ---
  makeProduct("mtg-2xm-draft-bb", "Double Masters 2022 Draft BB", "Double Masters 2022", "magic", "draft-booster-box", "2022-07-08", 289.99, 1.18, 0.03, 1800),
  makeProduct("mtg-2xm-collector-bb", "Double Masters 2022 Collector BB", "Double Masters 2022", "magic", "collector-booster-box", "2022-07-08", 349.99, 1.22, 0.04, 1800),
  makeProduct("mtg-2xm-case-draft", "Double Masters 2022 Draft BB Case (4)", "Double Masters 2022", "magic", "case", "2022-07-08", 1099.99, 1.16, 0.025, 1800),
  makeProduct("mtg-2xm-case-collector", "Double Masters 2022 Collector BB Case (4)", "Double Masters 2022", "magic", "case", "2022-07-08", 1349.99, 1.20, 0.03, 1800),

  // --- Commander Masters (Aug 2023) ---
  makeProduct("mtg-cmm-draft-bb", "Commander Masters Draft BB", "Commander Masters", "magic", "draft-booster-box", "2023-08-04", 249.99, 1.10, 0.035, 1400),
  makeProduct("mtg-cmm-collector-bb", "Commander Masters Collector BB", "Commander Masters", "magic", "collector-booster-box", "2023-08-04", 299.99, 1.14, 0.04, 1400),
  makeProduct("mtg-cmm-commander", "Commander Masters Commander Deck Set (4)", "Commander Masters", "magic", "commander-deck", "2023-08-04", 199.99, 1.08, 0.035, 1400),

  // --- Ravnica Remastered (Jan 2024) ---
  makeProduct("mtg-rvr-draft-bb", "Ravnica Remastered Draft BB", "Ravnica Remastered", "magic", "draft-booster-box", "2024-01-12", 119.99, 1.06, 0.03, 810),
  makeProduct("mtg-rvr-collector-bb", "Ravnica Remastered Collector BB", "Ravnica Remastered", "magic", "collector-booster-box", "2024-01-12", 219.99, 1.12, 0.04, 810),

  // ============================================================
  // ONE PIECE
  // ============================================================

  // --- OP-10 Royal Blood (Mar 2025) ---
  makeProduct("op-op10-bb", "OP-10 Royal Blood Booster Box", "OP-10 Royal Blood", "onepiece", "booster-box", "2025-03-07", 89.99, 0.92, 0.07, 100),
  makeProduct("op-op10-case", "OP-10 Royal Blood Case (12 Boxes)", "OP-10 Royal Blood", "onepiece", "case", "2025-03-07", 989.99, 0.90, 0.06, 100),
  makeProduct("op-op10-double", "OP-10 Royal Blood Double Pack", "OP-10 Royal Blood", "onepiece", "double-pack", "2025-03-07", 24.99, 0.88, 0.07, 100),

  // --- OP-09 Four Emperors (Sep 2024) ---
  makeProduct("op-op09-bb", "OP-09 Four Emperors Booster Box", "OP-09 Four Emperors", "onepiece", "booster-box", "2024-09-13", 109.99, 1.15, 0.05, 560),
  makeProduct("op-op09-case", "OP-09 Four Emperors Case (12 Boxes)", "OP-09 Four Emperors", "onepiece", "case", "2024-09-13", 1189.99, 1.12, 0.04, 560),
  makeProduct("op-op09-double", "OP-09 Four Emperors Double Pack", "OP-09 Four Emperors", "onepiece", "double-pack", "2024-09-13", 29.99, 1.10, 0.05, 560),
  makeProduct("op-op09-illust", "OP-09 Four Emperors Illustration Box", "OP-09 Four Emperors", "onepiece", "illustration-box", "2024-09-13", 44.99, 1.18, 0.06, 560),

  // --- OP-08 Two Legends (May 2024) ---
  makeProduct("op-op08-bb", "OP-08 Two Legends Booster Box", "OP-08 Two Legends", "onepiece", "booster-box", "2024-05-25", 94.99, 1.20, 0.05, 680),
  makeProduct("op-op08-case", "OP-08 Two Legends Case (12 Boxes)", "OP-08 Two Legends", "onepiece", "case", "2024-05-25", 1049.99, 1.18, 0.04, 680),
  makeProduct("op-op08-double", "OP-08 Two Legends Double Pack", "OP-08 Two Legends", "onepiece", "double-pack", "2024-05-25", 24.99, 1.12, 0.05, 680),
  makeProduct("op-op08-illust", "OP-08 Two Legends Illustration Box", "OP-08 Two Legends", "onepiece", "illustration-box", "2024-05-25", 39.99, 1.22, 0.06, 680),

  // --- OP-07 500 Years in the Future (Mar 2024) ---
  makeProduct("op-op07-bb", "OP-07 500 Years in the Future BB", "OP-07 500 Years in the Future", "onepiece", "booster-box", "2024-03-15", 79.99, 1.08, 0.04, 730),
  makeProduct("op-op07-case", "OP-07 500 Years Case (12 Boxes)", "OP-07 500 Years in the Future", "onepiece", "case", "2024-03-15", 889.99, 1.06, 0.035, 730),
  makeProduct("op-op07-double", "OP-07 500 Years Double Pack", "OP-07 500 Years in the Future", "onepiece", "double-pack", "2024-03-15", 19.99, 1.04, 0.05, 730),
  makeProduct("op-op07-illust", "OP-07 500 Years Illustration Box", "OP-07 500 Years in the Future", "onepiece", "illustration-box", "2024-03-15", 34.99, 1.10, 0.06, 730),

  // --- OP-06 Wings of the Captain (Jan 2024) ---
  makeProduct("op-op06-bb", "OP-06 Wings of the Captain BB", "OP-06 Wings of the Captain", "onepiece", "booster-box", "2024-01-26", 84.99, 1.10, 0.045, 800),
  makeProduct("op-op06-case", "OP-06 Wings of the Captain Case (12)", "OP-06 Wings of the Captain", "onepiece", "case", "2024-01-26", 939.99, 1.08, 0.04, 800),
  makeProduct("op-op06-double", "OP-06 Wings of the Captain Double Pack", "OP-06 Wings of the Captain", "onepiece", "double-pack", "2024-01-26", 19.99, 1.06, 0.05, 800),

  // --- OP-05 Awakening of the New Era (Dec 2023) ---
  makeProduct("op-op05-bb", "OP-05 Awakening of the New Era BB", "OP-05 Awakening of the New Era", "onepiece", "booster-box", "2023-12-01", 119.99, 1.30, 0.05, 1100),
  makeProduct("op-op05-case", "OP-05 Awakening of New Era Case (12)", "OP-05 Awakening of the New Era", "onepiece", "case", "2023-12-01", 1319.99, 1.28, 0.04, 1100),
  makeProduct("op-op05-double", "OP-05 Awakening of the New Era Double Pack", "OP-05 Awakening of the New Era", "onepiece", "double-pack", "2023-12-01", 29.99, 1.22, 0.05, 1100),
  makeProduct("op-op05-illust", "OP-05 Awakening Illustration Box", "OP-05 Awakening of the New Era", "onepiece", "illustration-box", "2023-12-01", 49.99, 1.35, 0.06, 1100),

  // --- OP-04 Kingdoms of Intrigue (Sep 2023) ---
  makeProduct("op-op04-bb", "OP-04 Kingdoms of Intrigue BB", "OP-04 Kingdoms of Intrigue", "onepiece", "booster-box", "2023-09-22", 89.99, 1.18, 0.045, 1200),
  makeProduct("op-op04-case", "OP-04 Kingdoms of Intrigue Case (12)", "OP-04 Kingdoms of Intrigue", "onepiece", "case", "2023-09-22", 989.99, 1.16, 0.04, 1200),
  makeProduct("op-op04-double", "OP-04 Kingdoms of Intrigue Double Pack", "OP-04 Kingdoms of Intrigue", "onepiece", "double-pack", "2023-09-22", 22.99, 1.12, 0.05, 1200),

  // --- OP-03 Pillars of Strength (Jun 2023) ---
  makeProduct("op-op03-bb", "OP-03 Pillars of Strength BB", "OP-03 Pillars of Strength", "onepiece", "booster-box", "2023-06-30", 84.99, 1.15, 0.045, 1350),
  makeProduct("op-op03-case", "OP-03 Pillars of Strength Case (12)", "OP-03 Pillars of Strength", "onepiece", "case", "2023-06-30", 939.99, 1.13, 0.04, 1350),

  // --- OP-02 Paramount War (Mar 2023) ---
  makeProduct("op-op02-bb", "OP-02 Paramount War BB", "OP-02 Paramount War", "onepiece", "booster-box", "2023-03-10", 94.99, 1.20, 0.045, 1500),
  makeProduct("op-op02-case", "OP-02 Paramount War Case (12)", "OP-02 Paramount War", "onepiece", "case", "2023-03-10", 1049.99, 1.18, 0.04, 1500),

  // --- OP-01 Romance Dawn (Dec 2022) ---
  makeProduct("op-op01-bb", "OP-01 Romance Dawn Booster Box", "OP-01 Romance Dawn", "onepiece", "booster-box", "2022-12-02", 249.99, 1.45, 0.04, 1800),
  makeProduct("op-op01-case", "OP-01 Romance Dawn Case (12)", "OP-01 Romance Dawn", "onepiece", "case", "2022-12-02", 2799.99, 1.42, 0.035, 1800),
  makeProduct("op-op01-double", "OP-01 Romance Dawn Double Pack", "OP-01 Romance Dawn", "onepiece", "double-pack", "2022-12-02", 39.99, 1.35, 0.05, 1800),
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
