"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { PricePoint } from "@/lib/types";

interface SparklineChartProps {
  data: PricePoint[];
  color?: string;
  height?: number;
}

export default function SparklineChart({ data, color, height = 40 }: SparklineChartProps) {
  const last30 = data.slice(-30);
  const isUp = last30.length > 1 && last30[last30.length - 1].price >= last30[0].price;
  const lineColor = color || (isUp ? "#00e676" : "#ff1744");

  return (
    <div className="sparkline-container" style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={last30}>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
