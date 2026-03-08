"use client";

import { getTopGainers, getTopLosers } from "@/lib/mock-data";
import MarketOverview from "@/components/MarketOverview";
import GainersLosersTable from "@/components/GainersLosersTable";
import ProductTable from "@/components/ProductTable";

export default function Dashboard() {
  const gainers = getTopGainers(8);
  const losers = getTopLosers(8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Market overview stats */}
      <MarketOverview />

      {/* Gainers / Losers side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GainersLosersTable title="Top Gainers Today" products={gainers} type="gainers" />
        <GainersLosersTable title="Top Losers Today" products={losers} type="losers" />
      </div>

      {/* Full product table */}
      <div>
        <h2 className="text-lg font-mono font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="text-accent-blue">&gt;</span> All Sealed Products
        </h2>
        <ProductTable />
      </div>
    </div>
  );
}
