"use client";

import { use } from "react";
import Link from "next/link";
import { getProduct } from "@/lib/mock-data";
import { formatCurrency, formatPercent, formatChange, cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  PRODUCT_TYPE_LABELS,
} from "@/lib/types";
import PriceChart from "@/components/PriceChart";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Tag,
  ExternalLink,
} from "lucide-react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const product = getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-mono text-foreground mb-2">Product Not Found</h1>
          <Link href="/" className="text-accent-blue hover:underline text-sm font-mono">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isUp = product.dayChangePercent >= 0;

  const stats = [
    { label: "Prev Close", value: formatCurrency(product.previousClose) },
    { label: "Day Change", value: formatChange(product.dayChange), color: isUp },
    { label: "Day %", value: formatPercent(product.dayChangePercent), color: isUp },
    { label: "7D Change", value: formatPercent(product.weekChangePercent), color: product.weekChangePercent >= 0 },
    { label: "30D Change", value: formatPercent(product.monthChangePercent), color: product.monthChangePercent >= 0 },
    { label: "52W High", value: formatCurrency(product.high52w) },
    { label: "52W Low", value: formatCurrency(product.low52w) },
    { label: "ATH", value: formatCurrency(product.allTimeHigh) },
    { label: "ATL", value: formatCurrency(product.allTimeLow) },
    { label: "Volume", value: product.volume.toString() },
    { label: "Avg Volume", value: product.avgVolume.toString() },
    { label: "Release", value: new Date(product.releaseDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back nav */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent-blue font-mono mb-4 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: CATEGORY_COLORS[product.category] }}
            />
            <span className="text-xs font-mono text-muted uppercase tracking-wider">
              {CATEGORY_LABELS[product.category]}
            </span>
            <span className="text-xs text-muted">|</span>
            <span className="text-xs font-mono text-muted">
              {PRODUCT_TYPE_LABELS[product.type]}
            </span>
          </div>
          <h1 className="text-2xl font-mono font-bold text-foreground mb-1">
            {product.name}
          </h1>
          <p className="text-sm text-muted font-mono">{product.set}</p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-foreground">
            {formatCurrency(product.currentPrice)}
          </div>
          <div
            className={cn(
              "text-lg font-mono font-semibold flex items-center gap-1 justify-end",
              isUp ? "text-accent-green glow-green" : "text-accent-red glow-red"
            )}
          >
            {isUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {formatChange(product.dayChange)} ({formatPercent(product.dayChangePercent)})
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card-bg border border-card-border rounded-lg p-4 mb-6">
        <PriceChart
          priceHistory={product.priceHistory}
          currentPrice={product.currentPrice}
          dayChangePercent={product.dayChangePercent}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card-bg border border-card-border rounded-lg p-3"
          >
            <div className="text-xs text-muted font-mono mb-1">{stat.label}</div>
            <div
              className={cn(
                "text-sm font-mono font-semibold",
                stat.color === undefined
                  ? "text-foreground"
                  : stat.color
                  ? "text-accent-green"
                  : "text-accent-red"
              )}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Data sources */}
      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <h3 className="text-sm font-mono font-semibold text-foreground mb-3 flex items-center gap-2">
          <ExternalLink className="w-3.5 h-3.5 text-accent-blue" />
          Data Sources
        </h3>
        <div className="flex gap-3">
          {product.sources.map((source) => (
            <div
              key={source}
              className="px-3 py-2 bg-surface rounded border border-card-border"
            >
              <span className="text-xs font-mono text-muted uppercase tracking-wider">
                {source === "130point" ? "130 Point" : source === "tcgplayer" ? "TCGplayer" : "eBay"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
