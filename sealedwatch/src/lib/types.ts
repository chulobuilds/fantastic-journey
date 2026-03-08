export type TCGCategory = "pokemon" | "magic" | "onepiece";

export type ProductType =
  | "booster-box"
  | "collector-booster-box"
  | "play-booster-box"
  | "draft-booster-box"
  | "booster-bundle"
  | "gift-bundle"
  | "etb"
  | "pc-etb"
  | "ultra-premium-collection"
  | "special-premium-collection"
  | "commander-deck"
  | "collector-commander-deck"
  | "illustration-box"
  | "double-pack"
  | "case";

export type TimeRange = "1D" | "7D" | "30D" | "90D" | "180D" | "1Y" | "3Y" | "5Y" | "MAX";

export type DataSource = "tcgplayer" | "ebay" | "130point";

export interface PricePoint {
  date: string; // ISO date
  price: number;
  volume?: number;
  source?: DataSource;
}

export interface Product {
  id: string;
  name: string;
  set: string;
  category: TCGCategory;
  type: ProductType;
  releaseDate: string;
  imageUrl?: string;
  currentPrice: number;
  previousClose: number;
  dayChange: number;
  dayChangePercent: number;
  weekChange: number;
  weekChangePercent: number;
  monthChange: number;
  monthChangePercent: number;
  high52w: number;
  low52w: number;
  allTimeHigh: number;
  allTimeLow: number;
  volume: number; // units sold recently
  avgVolume: number;
  marketCap?: number; // estimated total market value
  priceHistory: PricePoint[];
  sources: DataSource[];
}

export interface MarketSummary {
  totalProducts: number;
  totalMarketCap: number;
  avgDayChange: number;
  gainers: number;
  losers: number;
  unchanged: number;
  mostActive: Product[];
}

export const CATEGORY_LABELS: Record<TCGCategory, string> = {
  pokemon: "Pokémon",
  magic: "Magic: The Gathering",
  onepiece: "One Piece",
};

export const CATEGORY_COLORS: Record<TCGCategory, string> = {
  pokemon: "#ffd740",
  magic: "#b388ff",
  onepiece: "#ff1744",
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  "booster-box": "Booster Box",
  "collector-booster-box": "Collector Booster Box",
  "play-booster-box": "Play Booster Box",
  "draft-booster-box": "Draft Booster Box",
  "booster-bundle": "Booster Bundle",
  "gift-bundle": "Gift Bundle",
  "etb": "Elite Trainer Box",
  "pc-etb": "PC Elite Trainer Box",
  "ultra-premium-collection": "Ultra Premium Collection",
  "special-premium-collection": "Special Premium Collection",
  "commander-deck": "Commander Deck Set",
  "collector-commander-deck": "Collector Commander Deck",
  "illustration-box": "Illustration Box",
  "double-pack": "Double Pack",
  "case": "Sealed Case",
};

export const TIME_RANGES: TimeRange[] = ["1D", "7D", "30D", "90D", "180D", "1Y", "3Y", "5Y", "MAX"];
