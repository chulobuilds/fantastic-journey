"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, TCGCategory, CATEGORY_LABELS, CATEGORY_COLORS, PRODUCT_TYPE_LABELS } from "@/lib/types";
import { PRODUCTS } from "@/lib/mock-data";
import { formatCurrency, formatPercent, formatChange, cn } from "@/lib/utils";
import SparklineChart from "./SparklineChart";
import { Filter } from "lucide-react";

type SortKey = "name" | "currentPrice" | "dayChangePercent" | "weekChangePercent" | "monthChangePercent" | "volume";
type SortDir = "asc" | "desc";

export default function ProductTable() {
  const [category, setCategory] = useState<TCGCategory | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("dayChangePercent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const categories: (TCGCategory | "all")[] = ["all", "pokemon", "magic", "onepiece"];

  const filtered = category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const SortHeader = ({ label, sKey, className }: { label: string; sKey: SortKey; className?: string }) => (
    <button
      onClick={() => handleSort(sKey)}
      className={cn(
        "text-xs text-muted hover:text-foreground font-mono transition-colors flex items-center gap-1",
        className
      )}
    >
      {label}
      {sortKey === sKey && (
        <span className="text-accent-blue">{sortDir === "asc" ? "\u25B2" : "\u25BC"}</span>
      )}
    </button>
  );

  return (
    <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
      {/* Category filter */}
      <div className="px-4 py-3 border-b border-card-border flex items-center gap-3 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded-full transition-colors border",
              category === cat
                ? "border-accent-blue text-accent-blue bg-accent-blue/10"
                : "border-card-border text-muted hover:text-foreground hover:border-muted"
            )}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
        <span className="text-xs text-muted ml-auto font-mono">{sorted.length} products</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-card-border bg-surface">
              <th className="px-4 py-2 text-left"><SortHeader label="PRODUCT" sKey="name" /></th>
              <th className="px-3 py-2 text-left">
                <span className="text-xs text-muted font-mono">TYPE</span>
              </th>
              <th className="px-3 py-2 text-right"><SortHeader label="PRICE" sKey="currentPrice" className="justify-end" /></th>
              <th className="px-3 py-2 text-right"><SortHeader label="1D %" sKey="dayChangePercent" className="justify-end" /></th>
              <th className="px-3 py-2 text-right"><SortHeader label="7D %" sKey="weekChangePercent" className="justify-end" /></th>
              <th className="px-3 py-2 text-right"><SortHeader label="30D %" sKey="monthChangePercent" className="justify-end" /></th>
              <th className="px-3 py-2 text-right"><SortHeader label="VOL" sKey="volume" className="justify-end" /></th>
              <th className="px-3 py-2 w-24">
                <span className="text-xs text-muted font-mono">30D CHART</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {sorted.map((product) => (
              <tr key={product.id} className="hover:bg-surface-hover transition-colors group">
                <td className="px-4 py-2.5">
                  <Link href={`/product/${product.id}`} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[product.category] }}
                    />
                    <span className="text-sm font-mono text-foreground group-hover:text-accent-blue transition-colors truncate max-w-[250px]">
                      {product.name}
                    </span>
                  </Link>
                </td>
                <td className="px-3 py-2.5 text-xs text-muted font-mono">
                  {PRODUCT_TYPE_LABELS[product.type]}
                </td>
                <td className="px-3 py-2.5 text-right text-sm font-mono text-foreground">
                  {formatCurrency(product.currentPrice)}
                </td>
                <td className={cn(
                  "px-3 py-2.5 text-right text-sm font-mono",
                  product.dayChangePercent >= 0 ? "text-accent-green" : "text-accent-red"
                )}>
                  {formatPercent(product.dayChangePercent)}
                </td>
                <td className={cn(
                  "px-3 py-2.5 text-right text-sm font-mono",
                  product.weekChangePercent >= 0 ? "text-accent-green" : "text-accent-red"
                )}>
                  {formatPercent(product.weekChangePercent)}
                </td>
                <td className={cn(
                  "px-3 py-2.5 text-right text-sm font-mono",
                  product.monthChangePercent >= 0 ? "text-accent-green" : "text-accent-red"
                )}>
                  {formatPercent(product.monthChangePercent)}
                </td>
                <td className="px-3 py-2.5 text-right text-sm font-mono text-muted">
                  {product.volume}
                </td>
                <td className="px-3 py-2.5 w-24">
                  <SparklineChart data={product.priceHistory} height={28} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
