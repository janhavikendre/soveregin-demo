"use client";

import { useState } from "react";
import Link from "next/link";
import { deals, stats } from "@/data/deals";
import { Cell } from "@/components/ui";
import { DealDetail } from "@/components/DealDetail";
import { NewDealModal } from "@/components/NewDealModal";
import { useToast } from "@/components/Toast";

export function Dashboard() {
  const [selectedId, setSelectedId] = useState(deals[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const selected = deals.find((d) => d.id === selectedId) ?? deals[0];

  const handleCreated = () => {
    setModalOpen(false);
    toast("Deal created · SP-2848 (demo)");
  };

  return (
    <main className="flex-1 px-5 sm:px-10 py-8 max-w-[1180px] w-full mx-auto">
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <p className="eyebrow">Your deals</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-1.5">Dashboard</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 self-start rounded-md bg-ink text-cream-warm px-4 py-2 font-serif text-base hover:bg-[#241a0e] transition-colors"
        >
          + New deal
        </button>
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

      {/* selected deal — inline detail + link to full page */}
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow">Selected deal</p>
        <Link
          href={`/deals/${selected.id}`}
          className="font-serif text-base text-gold-light hover:text-ink transition-colors"
        >
          Open full deal page →
        </Link>
      </div>
      <DealDetail deal={selected} />

      {modalOpen && (
        <NewDealModal
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </main>
  );
}
