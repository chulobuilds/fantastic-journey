"use client";

import { PRODUCTS } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/types";

export default function TickerBar() {
  // Show top movers in the ticker
  const sorted = [...PRODUCTS].sort(
    (a, b) => Math.abs(b.dayChangePercent) - Math.abs(a.dayChangePercent)
  );

  const items = sorted.slice(0, 20);
  // Double for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="w-full bg-ticker-bg border-b border-card-border overflow-hidden h-8 flex items-center">
      <div className="ticker-animate flex items-center whitespace-nowrap gap-8">
        {doubled.map((product, i) => {
          const isUp = product.dayChangePercent >= 0;
          return (
            <div key={`${product.id}-${i}`} className="flex items-center gap-2 text-xs font-mono">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ backgroundColor: CATEGORY_COLORS[product.category] }}
              />
              <span className="text-muted">{product.name.length > 30 ? product.name.slice(0, 28) + "..." : product.name}</span>
              <span className="text-foreground">{formatCurrency(product.currentPrice)}</span>
              <span className={isUp ? "text-accent-green" : "text-accent-red"}>
                {formatPercent(product.dayChangePercent)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
