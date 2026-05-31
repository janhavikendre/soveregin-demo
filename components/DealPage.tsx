"use client";

import { useState } from "react";
import Link from "next/link";
import type { Deal, DealDocument } from "@/data/deals";
import { Badge } from "@/components/ui";
import { Timeline } from "@/components/DealDetail";
import { getTxFlow, type TxStep } from "@/data/transactions";
import { useToast } from "@/components/Toast";

const TABS = ["Overview", "Documents", "Vessel", "Settlement", "Activity"] as const;
type Tab = (typeof TABS)[number];

export function DealPage({ deal }: { deal: Deal }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const { toast } = useToast();

  return (
    <main className="flex-1 px-5 sm:px-10 py-8 max-w-[1180px] w-full mx-auto">
      {/* breadcrumb */}
      <nav className="flex items-center gap-2 mb-5 font-serif text-base text-ink-mute">
        <Link href="/deals" className="hover:text-ink">
          Deals
        </Link>
        <span className="text-ink-dim">/</span>
        <span className="mono text-sm text-gold-light">{deal.id}</span>
      </nav>

      {/* header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-7">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="mono text-sm tracking-wide text-gold-light">
              {deal.id}
            </span>
            {deal.statusCell.tone && (
              <Badge tone={deal.statusCell.tone}>{deal.statusCell.label}</Badge>
            )}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl leading-tight">
            {deal.counterparty}
          </h1>
          <p className="font-serif text-xl text-ink-mute mt-2">
            {deal.cargo} · {deal.vesselName}{" "}
            <span className="text-ink-dim">·</span> {deal.route}
          </p>
        </div>
        <div className="lg:text-right shrink-0 rounded-xl border border-hairline bg-cream-warm px-5 py-4">
          <p className="eyebrow mb-1">Locked in escrow</p>
          <p className="font-serif text-3xl">{deal.escrowLbtc}</p>
          <p className="mono text-sm text-ink-mute mt-0.5">{deal.escrowUsd}</p>
        </div>
      </div>

      {/* progress timeline */}
      <div className="rounded-xl border border-hairline bg-cream-warm px-6 sm:px-8 py-7 mb-7">
        <Timeline steps={deal.progress} />
      </div>

      {/* tabs */}
      <div className="flex items-center gap-1 border-b border-hairline mb-7 overflow-x-auto">
        {TABS.map((t) => {
          const active = t === tab;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 font-serif text-lg whitespace-nowrap transition-colors ${
                active ? "text-ink" : "text-ink-mute hover:text-ink"
              }`}
            >
              {t}
              {active && (
                <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] rounded-full bg-gold-light" />
              )}
            </button>
          );
        })}
      </div>

      {tab === "Overview" && <OverviewTab deal={deal} onToast={toast} />}
      {tab === "Documents" && <DocumentsTab deal={deal} />}
      {tab === "Vessel" && <VesselTab deal={deal} />}
      {tab === "Settlement" && <SettlementTab deal={deal} onToast={toast} />}
      {tab === "Activity" && <ActivityTab deal={deal} />}
    </main>
  );
}

/* ---------------------------------------------------------------- Overview */

function OverviewTab({
  deal,
  onToast,
}: {
  deal: Deal;
  onToast: (m: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* documents */}
        <section className="rounded-xl border border-hairline bg-cream-warm px-6 py-6">
          <p className="eyebrow mb-4">
            Document verification{" "}
            <span className="text-gold-light">· zkPass</span>
          </p>
          <div className="space-y-4">
            {deal.documents.map((doc) => (
              <div
                key={doc.name}
                className="rounded-lg border border-hairline-soft bg-cream-card px-4 py-3.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif text-lg">{doc.name}</span>
                  <DocStatusBadge status={doc.status} />
                </div>
                <p className="mono text-xs text-ink-mute mt-2">
                  Source: {doc.source}
                </p>
                {doc.proof && (
                  <p className="mono text-xs text-ink-mute mt-1">
                    Proof: <span className="text-status-green">{doc.proof}</span>
                  </p>
                )}
                {doc.note && (
                  <p
                    className={`mono text-xs mt-1.5 ${
                      doc.status === "failed"
                        ? "text-status-red"
                        : "text-status-amber"
                    }`}
                  >
                    {doc.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* AIS tracking */}
        <section className="rounded-xl border border-hairline bg-cream-warm px-6 py-6">
          <p className="eyebrow mb-4">
            Vessel tracking <span className="text-gold-light">· AIS</span>
          </p>
          <dl className="space-y-2.5">
            <TrackRow label="Vessel" value={deal.tracking.vessel} />
            <TrackRow label="IMO" value={deal.tracking.imo} mono />
            <TrackRow label="Position" value={deal.tracking.position} mono />
            <TrackRow label="Speed" value={deal.tracking.speed} mono />
            <TrackRow label="Last port" value={deal.tracking.lastPort} />
            <TrackRow label="Destination" value={deal.tracking.destination} />
            <TrackRow label="ETA" value={deal.tracking.eta} />
          </dl>
        </section>
      </div>

      {/* next actions */}
      <section className="rounded-xl border border-hairline bg-cream-sunk px-6 py-5 flex flex-wrap items-center gap-3">
        <p className="eyebrow mr-auto">Next actions</p>
        <button
          onClick={() => onToast("Counterparty notified (demo)")}
          className="rounded-md border border-hairline bg-cream-warm px-4 py-2 font-serif text-base hover:border-ink transition-colors"
        >
          Notify counterparty
        </button>
        <a
          href="https://blockstream.info/liquid/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-hairline bg-cream-warm px-4 py-2 font-serif text-base hover:border-ink transition-colors"
        >
          View on explorer <span className="text-gold-light">↗</span>
        </a>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------- Documents */

function DocumentsTab({ deal }: { deal: Deal }) {
  const [openDoc, setOpenDoc] = useState<DealDocument | null>(null);
  return (
    <div className="rounded-xl border border-hairline bg-cream-warm overflow-hidden">
      {deal.documents.map((doc, i) => (
        <button
          key={doc.name + i}
          onClick={() => setOpenDoc(doc)}
          className="w-full text-left flex items-center gap-4 px-6 py-4 border-b border-hairline-soft last:border-0 hover:bg-cream-card/60 transition-colors"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cream-sunk mono text-xs text-ink-mute shrink-0">
            DOC
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg">{doc.name}</p>
            <p className="mono text-xs text-ink-dim truncate">{doc.source}</p>
          </div>
          <DocStatusBadge status={doc.status} />
          <span className="text-ink-dim ml-1">→</span>
        </button>
      ))}

      {openDoc && <DocDetailModal doc={openDoc} dealId={deal.id} onClose={() => setOpenDoc(null)} />}
    </div>
  );
}

function DocDetailModal({
  doc,
  dealId,
  onClose,
}: {
  doc: DealDocument;
  dealId: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-hairline bg-cream-warm shadow-2xl">
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <p className="eyebrow">Document · zkPass proof</p>
            <h3 className="font-serif text-2xl mt-1">{doc.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-dim hover:text-ink text-xl leading-none px-2"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5">
          {/* fake document preview */}
          <div className="rounded-lg border border-hairline bg-cream-base h-36 flex items-center justify-center mb-5">
            <span className="eyebrow">{doc.name} · PDF preview</span>
          </div>

          <dl className="divide-y divide-hairline-soft">
            <ModalRow label="Status">
              <DocStatusBadge status={doc.status} />
            </ModalRow>
            <ModalRow label="Source platform">
              <span className="font-serif text-lg">
                {doc.platform ?? doc.source}
              </span>
            </ModalRow>
            {doc.timestamp && (
              <ModalRow label="Verified at">
                <span className="mono text-sm">{doc.timestamp}</span>
              </ModalRow>
            )}
            <ModalRow label="zkPass proof">
              <span className="mono text-xs text-status-green break-all">
                {doc.proofFull ?? doc.proof ?? "—"}
              </span>
            </ModalRow>
            <ModalRow label="Linked deal">
              <Link href={`/deals/${dealId}`} className="mono text-sm text-gold-light hover:text-ink">
                {dealId}
              </Link>
            </ModalRow>
            {doc.note && (
              <ModalRow label="Note">
                <span
                  className={`mono text-xs ${
                    doc.status === "failed" ? "text-status-red" : "text-status-amber"
                  }`}
                >
                  {doc.note}
                </span>
              </ModalRow>
            )}
          </dl>
        </div>

        <div className="px-6 py-4 border-t border-hairline-soft flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-ink text-cream-warm px-5 py-2 font-serif text-lg hover:bg-[#241a0e] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="eyebrow shrink-0">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ Vessel */

function VesselTab({ deal }: { deal: Deal }) {
  return (
    <div className="space-y-6">
      {/* map placeholder */}
      <div className="relative rounded-xl border border-hairline bg-[#e7dcc8] overflow-hidden h-[320px]">
        {/* subtle grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.18]" aria-hidden>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#18120a" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* fake AIS trail Antwerp -> Rotterdam */}
        <svg viewBox="0 0 600 320" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden>
          <path
            d="M 90 250 C 200 200, 240 120, 360 110 S 500 90, 530 70"
            fill="none"
            stroke="#a6802f"
            strokeWidth="2.5"
            strokeDasharray="6 6"
          />
          {/* origin */}
          <circle cx="90" cy="250" r="5" fill="#18120a" />
          {/* current position */}
          <circle cx="360" cy="110" r="7" fill="#a6802f" />
          <circle cx="360" cy="110" r="13" fill="none" stroke="#a6802f" strokeWidth="1.5" opacity="0.5" />
          {/* destination */}
          <circle cx="530" cy="70" r="5" fill="none" stroke="#18120a" strokeWidth="2" />
        </svg>

        {/* labels */}
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-md bg-cream-warm/90 border border-hairline px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-status-green animate-pulse" />
          <span className="mono text-xs">Live AIS — {deal.vesselName}</span>
        </div>
        <div className="absolute bottom-4 left-4 mono text-[11px] text-ink-mute">
          {deal.tracking.lastPort.split(" (")[0]}
        </div>
        <div className="absolute bottom-4 right-4 mono text-[11px] text-ink-mute">
          {deal.tracking.destination}
        </div>
        <div className="absolute top-4 right-4 eyebrow">
          Source · {deal.tracking.source ?? "Datalastic"}
        </div>
      </div>

      {/* AIS data panel */}
      <section className="rounded-xl border border-hairline bg-cream-warm px-6 py-6">
        <p className="eyebrow mb-4">AIS data</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8">
          <DataPair label="Vessel" value={deal.tracking.vessel} />
          <DataPair label="IMO" value={deal.tracking.imo} mono />
          <DataPair label="Position" value={deal.tracking.position} mono />
          <DataPair label="Speed" value={deal.tracking.speed} mono />
          <DataPair label="Last port" value={deal.tracking.lastPort} />
          <DataPair label="Destination" value={deal.tracking.destination} />
          <DataPair label="ETA" value={deal.tracking.eta} />
          <DataPair label="Data source" value={deal.tracking.source ?? "Datalastic"} />
        </div>
      </section>
    </div>
  );
}

function DataPair({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="eyebrow mb-1">{label}</p>
      <p className={mono ? "mono text-sm" : "font-serif text-lg leading-tight"}>{value}</p>
    </div>
  );
}

/* -------------------------------------------------------------- Settlement */

function SettlementTab({
  deal,
  onToast,
}: {
  deal: Deal;
  onToast: (m: string) => void;
}) {
  const flow = getTxFlow(deal.id, deal.statusCell.label);
  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
      {/* stepper */}
      <section className="rounded-xl border border-hairline bg-cream-warm px-6 sm:px-8 py-7">
        <p className="eyebrow mb-6">On-chain settlement</p>
        <ol className="relative">
          {flow.steps.map((step, i) => (
            <TxStepRow
              key={step.title}
              step={step}
              last={i === flow.steps.length - 1}
            />
          ))}
        </ol>
      </section>

      {/* side panel */}
      <aside className="rounded-xl border border-hairline bg-cream-sunk px-6 py-6 space-y-5">
        <div>
          <p className="eyebrow mb-1">Counterparty wallet</p>
          <p className="mono text-sm break-all">{flow.counterpartyWallet}</p>
        </div>
        <div>
          <p className="eyebrow mb-1">Network</p>
          <p className="font-serif text-lg">{flow.network}</p>
        </div>
        <div>
          <p className="eyebrow mb-1">Settlement amount</p>
          <p className="font-serif text-lg">
            {deal.settlement.amount}{" "}
            <span className="text-ink-mute">({deal.escrowUsd})</span>
          </p>
        </div>
        <a
          href="https://blockstream.info/liquid/"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center rounded-md border border-hairline bg-cream-warm px-4 py-2.5 font-serif text-base hover:border-ink transition-colors"
        >
          View on {flow.explorerLabel} <span className="text-gold-light">↗</span>
        </a>
        <button
          onClick={() => onToast("Settlement link copied (demo)")}
          className="block w-full text-center rounded-md border border-hairline bg-cream-warm px-4 py-2.5 font-serif text-base hover:border-ink transition-colors"
        >
          Copy settlement link
        </button>
      </aside>
    </div>
  );
}

const txDotStyles = {
  done: "bg-status-green text-cream-warm",
  current: "border-2 border-status-amber bg-cream-warm",
  locked: "border border-hairline bg-cream-warm",
} as const;

function TxStepRow({ step, last }: { step: TxStep; last: boolean }) {
  return (
    <li className="relative flex gap-4 pb-7 last:pb-0">
      {/* connector */}
      {!last && (
        <span
          className="absolute left-[13px] top-7 bottom-0 w-px bg-hairline"
          aria-hidden
        />
      )}
      {/* node */}
      <span
        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${txDotStyles[step.state]}`}
      >
        {step.state === "done" ? (
          "✓"
        ) : step.state === "current" ? (
          <span className="h-2 w-2 rounded-full bg-status-amber animate-pulse" />
        ) : (
          <span className="text-ink-dim">🔒</span>
        )}
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-center gap-2.5">
          <span
            className={`font-serif text-lg ${
              step.state === "locked" ? "text-ink-dim" : "text-ink"
            }`}
          >
            {step.title}
          </span>
          {step.confirmations && (
            <span className="badge badge-green">{step.confirmations}</span>
          )}
        </div>
        {step.detail && (
          <p className="font-serif text-base text-ink-mute mt-0.5">
            {step.detail}
          </p>
        )}
        {step.txHash && (
          <p className="mono text-xs text-ink-mute mt-1.5">
            tx <span className="text-status-green break-all">{step.txHash}</span>
          </p>
        )}
        {step.timestamp && (
          <p className="mono text-[11px] text-ink-dim mt-1">{step.timestamp}</p>
        )}
        {step.subItems && (
          <ul className="mt-2.5 space-y-1.5">
            {step.subItems.map((s) => (
              <li key={s.label} className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-[9px] ${
                    s.done
                      ? "bg-status-green text-cream-warm"
                      : "border border-status-amber text-status-amber"
                  }`}
                >
                  {s.done ? "✓" : ""}
                </span>
                <span
                  className={`mono text-xs ${
                    s.done ? "text-ink-mute line-through" : "text-status-amber"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

/* -------------------------------------------------------------- Activity */

const activityDot: Record<string, string> = {
  green: "bg-status-green",
  amber: "bg-status-amber",
  red: "bg-status-red",
  blue: "bg-status-blue",
  neutral: "bg-ink-dim",
};

function ActivityTab({ deal }: { deal: Deal }) {
  return (
    <section className="rounded-xl border border-hairline bg-cream-warm px-6 sm:px-8 py-7">
      <p className="eyebrow mb-6">Activity log</p>
      <ol className="relative">
        {[...deal.activity].reverse().map((ev, i, arr) => (
          <li key={ev.time + ev.title} className="relative flex gap-4 pb-6 last:pb-0">
            {i < arr.length - 1 && (
              <span className="absolute left-[5px] top-4 bottom-0 w-px bg-hairline" aria-hidden />
            )}
            <span
              className={`relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                activityDot[ev.tone ?? "neutral"]
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg leading-tight">{ev.title}</p>
              {ev.detail && (
                <p className="font-serif text-base text-ink-mute mt-0.5">
                  {ev.detail}
                </p>
              )}
              <p className="mono text-[11px] text-ink-dim mt-1">{ev.time}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------- shared */

function DocStatusBadge({ status }: { status: DealDocument["status"] }) {
  if (status === "verified") return <Badge tone="green">Verified</Badge>;
  if (status === "failed") return <Badge tone="red">Failed</Badge>;
  return <Badge tone="amber">Pending</Badge>;
}

function TrackRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="eyebrow shrink-0">{label}</dt>
      <dd className={`text-right ${mono ? "mono text-sm" : "font-serif text-lg"}`}>
        {value}
      </dd>
    </div>
  );
}
