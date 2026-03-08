import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import TickerBar from "@/components/TickerBar";

export const metadata: Metadata = {
  title: "SealedWatch - Sealed TCG Market Terminal",
  description:
    "Track sealed Pokemon, Magic: The Gathering, and One Piece booster box prices like a stock market terminal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground min-h-screen">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-card-border">
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 bg-accent-blue rounded flex items-center justify-center text-xs font-bold text-white">
                SW
              </div>
              <span className="font-mono font-bold text-foreground text-sm group-hover:text-accent-blue transition-colors">
                SealedWatch
              </span>
              <span className="text-xs text-muted font-mono hidden sm:inline">
                | SEALED TCG TERMINAL
              </span>
            </Link>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-muted hidden md:inline">
                Data: TCGplayer + eBay + 130Point
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              <span className="text-accent-green text-xs">LIVE</span>
            </div>
          </div>

          {/* Scrolling ticker */}
          <TickerBar />
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-card-border mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-muted">
            <span>SealedWatch Terminal v0.1.0</span>
            <span>
              Market data aggregated from TCGplayer, eBay, and 130Point
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
