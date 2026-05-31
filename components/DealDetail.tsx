import type { Deal, ProgressStep } from "@/data/deals";
import { Badge } from "@/components/ui";

export function DealDetail({ deal }: { deal: Deal }) {
  return (
    <section className="rounded-xl border border-hairline bg-cream-warm overflow-hidden">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-6 sm:px-8 py-6 border-b border-hairline-soft">
        <div>
          <p className="eyebrow mb-2">Deal detail</p>
          <h2 className="font-serif text-2xl sm:text-[28px] leading-tight">
            <span className="mono text-base tracking-wide text-gold-light">
              {deal.id}
            </span>
            <span className="text-ink-dim"> · </span>
            {deal.counterparty}
            <span className="text-ink-dim"> · </span>
            <span className="text-ink-mute">{deal.cargo}</span>
          </h2>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="eyebrow mb-1">Locked in escrow</p>
          <p className="font-serif text-2xl">
            {deal.escrowLbtc}{" "}
            <span className="text-ink-mute">({deal.escrowUsd})</span>
          </p>
        </div>
      </div>

      {/* progress timeline */}
      <div className="px-6 sm:px-8 py-7 border-b border-hairline-soft">
        <Timeline steps={deal.progress} />
      </div>

      {/* two-column detail */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline-soft">
        {/* documents */}
        <div className="px-6 sm:px-8 py-6">
          <p className="eyebrow mb-4">
            Document verification <span className="text-gold-light">· zkPass</span>
          </p>
          <div className="space-y-4">
            {deal.documents.map((doc) => (
              <div
                key={doc.name}
                className="rounded-lg border border-hairline-soft bg-cream-card px-4 py-3.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif text-lg">{doc.name}</span>
                  {doc.status === "verified" ? (
                    <Badge tone="green">Verified</Badge>
                  ) : (
                    <Badge tone="amber">Pending</Badge>
                  )}
                </div>
                <p className="mono text-xs text-ink-mute mt-2">
                  Source: {doc.source}
                </p>
                {doc.proof && (
                  <p className="mono text-xs text-ink-mute mt-1">
                    Proof:{" "}
                    <span className="text-status-green">{doc.proof}</span>
                  </p>
                )}
                {doc.note && (
                  <p className="mono text-xs text-status-amber mt-1.5">
                    {doc.note} ↗
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* vessel tracking */}
        <div className="px-6 sm:px-8 py-6">
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
        </div>
      </div>

      {/* settlement footer */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8 px-6 sm:px-8 py-5 bg-cream-sunk border-t border-hairline">
        <FooterItem
          label="Settlement"
          value={`${deal.settlement.amount} · ${deal.settlement.network}`}
        />
        <FooterItem
          label="Payment trigger"
          value={deal.settlement.paymentTrigger}
        />
        <FooterItem
          label="Counterparty wallet"
          value={deal.settlement.wallet}
          mono
        />
        <a
          href="https://liquid.network/"
          target="_blank"
          rel="noopener noreferrer"
          className="lg:ml-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-hairline bg-cream-warm px-4 py-2 font-serif text-base hover:border-ink transition-colors whitespace-nowrap"
        >
          Check status <span className="text-gold-light">↗</span>
        </a>
      </div>
    </section>
  );
}

export function Timeline({ steps }: { steps: ProgressStep[] }) {
  return (
    <ol className="flex items-start justify-between gap-1">
      {steps.map((step, i) => (
        <li
          key={step.label}
          className="flex-1 flex flex-col items-center text-center relative"
        >
          {/* connector to next node */}
          {i < steps.length - 1 && (
            <span
              className="absolute top-[11px] left-1/2 w-full h-px bg-hairline"
              aria-hidden
            />
          )}
          <span className="relative z-10">
            <StepNode state={step.state} />
          </span>
          <span
            className={`mt-2.5 text-[11px] leading-tight px-1 font-serif ${
              step.state === "pending" ? "text-ink-dim" : "text-ink"
            }`}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function StepNode({ state }: { state: ProgressStep["state"] }) {
  if (state === "done") {
    return (
      <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gold-light text-cream-warm text-[11px] shadow-[0_0_0_3px_rgba(166,128,47,0.12)]">
        ✓
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-gold-light bg-cream-warm">
        <span className="h-2 w-2 rounded-full bg-gold-light" />
      </span>
    );
  }
  return (
    <span className="block h-[22px] w-[22px] rounded-full border border-hairline bg-cream-warm" />
  );
}

function TrackRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="eyebrow shrink-0">{label}</dt>
      <dd className={`text-right ${mono ? "mono text-sm" : "font-serif text-lg"}`}>
        {value}
      </dd>
    </div>
  );
}

function FooterItem({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="eyebrow mb-0.5">{label}</p>
      <p className={mono ? "mono text-sm" : "font-serif text-lg leading-tight"}>
        {value}
      </p>
    </div>
  );
}
