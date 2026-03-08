"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PricePoint, TimeRange, TIME_RANGES } from "@/lib/types";
import { filterPriceHistory } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

interface PriceChartProps {
  priceHistory: PricePoint[];
  currentPrice: number;
  dayChangePercent: number;
}

export default function PriceChart({
  priceHistory,
  currentPrice,
  dayChangePercent,
}: PriceChartProps) {
  const [range, setRange] = useState<TimeRange>("1Y");
  const filtered = filterPriceHistory(priceHistory, range);
  const isUp = filtered.length > 1 && filtered[filtered.length - 1].price >= filtered[0].price;
  const color = isUp ? "#00e676" : "#ff1744";

  return (
    <div>
      {/* Time range selector */}
      <div className="flex gap-1 mb-4">
        {TIME_RANGES.map((tr) => (
          <button
            key={tr}
            onClick={() => setRange(tr)}
            className={cn(
              "px-3 py-1 text-xs font-mono rounded transition-colors",
              range === tr
                ? "bg-accent-blue text-white"
                : "bg-surface text-muted hover:bg-surface-hover hover:text-foreground"
            )}
          >
            {tr}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b6b80", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#1e1e2e" }}
              tickFormatter={(val) => {
                const d = new Date(val);
                if (range === "1D" || range === "7D") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                if (range === "30D" || range === "90D") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
              }}
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: "#6b6b80", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#1e1e2e" }}
              tickFormatter={(val) => `$${val}`}
              domain={["auto", "auto"]}
              width={65}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#12121a",
                border: "1px solid #1e1e2e",
                borderRadius: "6px",
                color: "#e0e0e8",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
              formatter={(value) => [formatCurrency(Number(value)), "Price"]}
              labelFormatter={(label) =>
                new Date(label).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              }
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill="url(#priceGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
