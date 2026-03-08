"use client";

import Link from "next/link";
import { Product, CATEGORY_COLORS } from "@/lib/types";
import { formatCurrency, formatPercent, formatChange } from "@/lib/utils";
import SparklineChart from "./SparklineChart";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GainersLosersTableProps {
  title: string;
  products: Product[];
  type: "gainers" | "losers";
}

export default function GainersLosersTable({
  title,
  products,
  type,
}: GainersLosersTableProps) {
  const icon =
    type === "gainers" ? (
      <TrendingUp className="w-4 h-4 text-accent-green" />
    ) : (
      <TrendingDown className="w-4 h-4 text-accent-red" />
    );

  return (
    <div className="bg-card-bg border border-card-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-card-border flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-mono font-semibold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-card-border">
        {products.map((product, idx) => {
          const isUp = product.dayChangePercent >= 0;
          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="flex items-center px-4 py-2.5 hover:bg-surface-hover transition-colors group"
            >
              <span className="text-muted text-xs w-6 font-mono">{idx + 1}</span>
              <span
                className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[product.category] }}
              />
              <div className="flex-1 min-w-0 mr-3">
                <div className="text-sm font-mono text-foreground truncate group-hover:text-accent-blue transition-colors">
                  {product.name}
                </div>
                <div className="text-xs text-muted truncate">{product.set}</div>
              </div>
              <div className="w-20 flex-shrink-0 hidden sm:block">
                <SparklineChart data={product.priceHistory} height={30} />
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <div className="text-sm font-mono text-foreground">
                  {formatCurrency(product.currentPrice)}
                </div>
                <div
                  className={`text-xs font-mono ${
                    isUp ? "text-accent-green" : "text-accent-red"
                  }`}
                >
                  {formatChange(product.dayChange)} ({formatPercent(product.dayChangePercent)})
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
