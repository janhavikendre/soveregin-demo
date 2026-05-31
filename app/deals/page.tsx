"use client";

import { useState } from "react";
import Link from "next/link";
import { allDeals, dealFilters } from "@/data/deals";
import { Cell } from "@/components/ui";
import { AppShell } from "@/components/AppShell";

export default function DealsPage() {
  return (
    <AppShell>
      <DealsList />
    </AppShell>
  );
}

function DealsList() {
  // Filter + search are visual only — they do not actually filter the rows.
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");

  return (
    <main className="flex-1 px-5 sm:px-10 py-8 max-w-[1180px] w-full mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <p className="eyebrow">All deals</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-1.5">Deals</h1>
        </div>
        {/* search (visual only) */}
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-dim">
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ref, vessel, counterparty…"
            className="w-full rounded-md border border-hairline bg-cream-warm pl-9 pr-3 py-2.5 font-serif text-base text-ink placeholder:text-ink-dim focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      {/* filter pills (visual only) */}
      <div className="flex flex-wrap gap-2 mb-6">
        {dealFilters.map((f) => {
          const active = f === activeFilter;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-1.5 font-serif text-base transition-colors border ${
                active
                  ? "bg-ink text-cream-warm border-ink"
                  : "bg-cream-warm text-ink-mute border-hairline hover:border-ink hover:text-ink"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* table */}
      <div className="rounded-xl border border-hairline bg-cream-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-hairline bg-cream-sunk">
                {[
                  "Ref",
                  "Counterparty",
                  "Cargo",
                  "Vessel",
                  "ETA",
                  "Documents",
                  "Escrow",
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
              {allDeals.map((deal) => (
                <tr
                  key={deal.id}
                  className="border-b border-hairline-soft last:border-0 hover:bg-cream-card/60 transition-colors group"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="mono text-sm text-gold-light group-hover:underline"
                    >
                      {deal.id}
                    </Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link
                      href={`/deals/${deal.id}`}
                      className="font-serif text-lg hover:text-gold-light"
                    >
                      {deal.counterparty}
                    </Link>
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
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-serif text-base">
                      {deal.escrowLbtc}
                    </span>
                    <br />
                    <span className="mono text-[11px] text-ink-dim">
                      {deal.escrowUsd}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Cell value={deal.statusCell} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="eyebrow mt-4">
        {allDeals.length} deals · filters and search are visual only in this demo
      </p>
    </main>
  );
}
