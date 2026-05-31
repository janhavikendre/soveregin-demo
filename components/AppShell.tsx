"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ToastProvider, useToast } from "@/components/Toast";

const NAV = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Deals", href: "/deals" },
  { label: "Documents", href: "/documents" },
  { label: "AI", href: "/ai" },
  { label: "Profile", href: "/profile" },
];

// Authenticated app shell — wraps every signed-in screen with the top bar and
// a toast provider. Demo only: nav routes are real, wallet state is local.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </ToastProvider>
  );
}

function TopBar() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const toggleWallet = () => {
    const next = !connected;
    setConnected(next);
    toast(
      next ? "Wallet connected · lq1qx...8z2k" : "Wallet disconnected",
      next ? "green" : "neutral"
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-cream-base/85 backdrop-blur">
      <div className="flex items-center gap-4 px-5 sm:px-10 py-4">
        {/* wordmark */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
          <span className="h-2 w-2 rounded-full bg-gold-light shadow-[0_0_10px_rgba(166,128,47,0.6)]" />
          <span className="font-serif text-lg tracking-[0.34em] uppercase">
            Sovereign
          </span>
        </Link>

        {/* nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 font-serif text-lg transition-colors ${
                  active ? "text-ink" : "text-ink-mute hover:text-ink"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-gold-light" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* right side */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={toggleWallet}
            className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 font-serif text-base transition-colors ${
              connected
                ? "border-status-green/40 bg-status-green-soft text-status-green"
                : "border-hairline hover:border-ink"
            }`}
          >
            {connected ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
                <span className="mono text-xs">lq1qx...8z2k</span>
              </>
            ) : (
              "Connect wallet"
            )}
          </button>
          <Link
            href="/profile"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream-warm mono text-xs hover:bg-[#241a0e] transition-colors"
          >
            DH
          </Link>
        </div>
      </div>

      {/* mobile nav */}
      <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-full font-serif text-base whitespace-nowrap ${
                active
                  ? "bg-cream-sunk text-ink"
                  : "text-ink-mute hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
