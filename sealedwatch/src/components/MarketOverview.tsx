"use client";

import { getMarketSummary } from "@/lib/mock-data";
import { formatCompact, formatPercent } from "@/lib/utils";
import { Activity, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

export default function MarketOverview() {
  const summary = getMarketSummary();
  const isUp = summary.avgDayChange >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-3.5 h-3.5 text-accent-blue" />
          <span className="text-xs text-muted font-mono">TOTAL PRODUCTS</span>
        </div>
        <div className="text-xl font-mono font-bold text-foreground">
          {summary.totalProducts}
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-3.5 h-3.5 text-accent-purple" />
          <span className="text-xs text-muted font-mono">AVG CHANGE</span>
        </div>
        <div
          className={`text-xl font-mono font-bold ${
            isUp ? "text-accent-green glow-green" : "text-accent-red glow-red"
          }`}
        >
          {formatPercent(summary.avgDayChange)}
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-accent-green" />
          <span className="text-xs text-muted font-mono">GAINERS</span>
        </div>
        <div className="text-xl font-mono font-bold text-accent-green">
          {summary.gainers}
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown className="w-3.5 h-3.5 text-accent-red" />
          <span className="text-xs text-muted font-mono">LOSERS</span>
        </div>
        <div className="text-xl font-mono font-bold text-accent-red">
          {summary.losers}
        </div>
      </div>
    </div>
  );
}
