"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deals, stats } from "@/data/deals";
import { Cell } from "@/components/ui";
import { DealDetail } from "@/components/DealDetail";
import { NewDealModal } from "@/components/NewDealModal";

export function Dashboard() {
  const [selectedId, setSelectedId] = useState(deals[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const selected = deals.find((d) => d.id === selectedId) ?? deals[0];

  const handleCreated = () => {
    setModalOpen(false);
    setToast("Deal created · SP-2848 (demo)");
    // auto-dismiss handled by the toast's own timer below
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-10 py-5 border-b border-hairline bg-cream-base/85 backdrop-blur">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-gold-light shadow-[0_0_10px_rgba(166,128,47,0.6)]" />
          <span className="font-serif text-lg tracking-[0.34em] uppercase">
            Sovereign
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setWalletConnected((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 font-serif text-base transition-colors ${
              walletConnected
                ? "border-status-green/40 bg-status-green-soft text-status-green"
                : "border-hairline hover:border-ink"
            }`}
          >
            {walletConnected ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
                <span className="mono text-xs">Connected · lq1qx...8z2k</span>
                <span className="text-ink-dim ml-1 hover:text-ink" aria-label="Disconnect">
                  ✕
                </span>
              </>
            ) : (
              "Connect wallet"
            )}
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-ink text-cream-warm px-4 py-2 font-serif text-base hover:bg-[#241a0e] transition-colors"
          >
            + New deal
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 sm:px-10 py-8 max-w-[1180px] w-full mx-auto">
        {/* page header */}
        <div className="mb-7">
          <p className="eyebrow">Your deals</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-1.5">Dashboard</h1>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-hairline bg-cream-warm px-5 py-5"
            >
              <p className="eyebrow mb-3">{s.label}</p>
              <p
                className={`font-serif text-4xl sm:text-[44px] leading-none ${
                  s.accent === "green" ? "text-status-green" : "text-ink"
                }`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* deals table */}
        <div className="rounded-xl border border-hairline bg-cream-warm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-hairline bg-cream-sunk">
                  {[
                    "Ref",
                    "Counterparty",
                    "Cargo",
                    "Vessel",
                    "ETA",
                    "Documents",
                    "Payment",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="eyebrow font-normal px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => {
                  const active = deal.id === selectedId;
                  return (
                    <tr
                      key={deal.id}
                      onClick={() => setSelectedId(deal.id)}
                      className={`border-b border-hairline-soft last:border-0 cursor-pointer transition-colors ${
                        active ? "bg-cream-card" : "hover:bg-cream-card/60"
                      }`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <span
                            className={`h-3.5 w-[3px] rounded-full ${
                              active ? "bg-gold-light" : "bg-transparent"
                            }`}
                            aria-hidden
                          />
                          <span className="mono text-sm text-gold-light">
                            {deal.id}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-4 font-serif text-lg whitespace-nowrap">
                        {deal.counterparty}
                      </td>
                      <td className="px-4 py-4 font-serif text-base text-ink-mute whitespace-nowrap">
                        {deal.cargo}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-serif text-base">
                          {deal.vesselName}
                        </span>
                        <br />
                        <span className="mono text-[11px] text-ink-dim">
                          IMO {deal.imo}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Cell value={deal.etaCell} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Cell value={deal.documentsCell} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <Cell value={deal.paymentCell} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Cell value={deal.statusCell} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* deal detail */}
        <DealDetail deal={selected} />
      </main>

      {modalOpen && (
        <NewDealModal
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

function Toast({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  // Auto-dismiss after a few seconds.
  useEffect(() => {
    const t = window.setTimeout(onDone, 4000);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 rounded-lg border border-status-green/40 bg-status-green-soft px-5 py-3 shadow-xl">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-green text-cream-warm text-xs">
          ✓
        </span>
        <span className="font-serif text-lg text-status-green">{message}</span>
      </div>
    </div>
  );
}
