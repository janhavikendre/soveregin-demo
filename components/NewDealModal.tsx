"use client";

import { useState } from "react";
import { cargoTypes, documentRequirements } from "@/data/deals";

const STEPS = ["Counterparty", "Vessel & route", "Escrow & docs", "Review"];

export function NewDealModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [step, setStep] = useState(0);

  // Visual-only form state — never persisted.
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState(cargoTypes[0]);
  const [imo, setImo] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [escrow, setEscrow] = useState("");
  const [docs, setDocs] = useState<string[]>([
    "Bill of Lading",
    "Certificate of Quantity",
  ]);

  const toggleDoc = (d: string) =>
    setDocs((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  const last = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create new deal"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-xl border border-hairline bg-cream-warm shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <p className="eyebrow">New deal</p>
            <h2 className="font-serif text-2xl mt-1">Structure escrow</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-dim hover:text-ink text-xl leading-none px-2"
          >
            ✕
          </button>
        </div>

        {/* step indicator */}
        <div className="flex items-center gap-2 px-6 mt-5">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <span
                className={`mono text-[10px] tracking-wider px-2 py-1 rounded-full ${
                  i === step
                    ? "bg-ink text-cream-warm"
                    : i < step
                      ? "bg-status-green-soft text-status-green"
                      : "bg-cream-sunk text-ink-dim"
                }`}
              >
                {i + 1}
              </span>
              {i < STEPS.length - 1 && (
                <span className="h-px flex-1 bg-hairline" />
              )}
            </div>
          ))}
        </div>
        <p className="eyebrow px-6 mt-3">
          Step {step + 1} / {STEPS.length} · {STEPS[step]}
        </p>

        {/* body */}
        <div className="px-6 py-5 min-h-[220px]">
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Counterparty email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trading@vitol.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Cargo type">
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  className={inputClass}
                >
                  {cargoTypes.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Field label="Vessel IMO">
                <input
                  value={imo}
                  onChange={(e) => setImo(e.target.value)}
                  placeholder="9447043"
                  className={`${inputClass} mono`}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Origin port">
                  <input
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Antwerp"
                    className={inputClass}
                  />
                </Field>
                <Field label="Destination port">
                  <input
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Rotterdam"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="Escrow amount (L-BTC)">
                <input
                  value={escrow}
                  onChange={(e) => setEscrow(e.target.value)}
                  placeholder="1.24"
                  className={`${inputClass} mono`}
                />
              </Field>
              <div>
                <p className="eyebrow mb-2">Document requirements</p>
                <div className="space-y-1.5">
                  {documentRequirements.map((d) => (
                    <label
                      key={d}
                      className="flex items-center gap-3 py-1.5 px-3 rounded-md hover:bg-cream-card cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={docs.includes(d)}
                        onChange={() => toggleDoc(d)}
                        className="accent-[#a6802f] h-4 w-4"
                      />
                      <span className="font-serif text-lg">{d}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <dl className="divide-y divide-hairline-soft">
              <ReviewRow label="Counterparty" value={email || "—"} />
              <ReviewRow label="Cargo" value={cargo} />
              <ReviewRow label="Vessel IMO" value={imo || "—"} mono />
              <ReviewRow
                label="Route"
                value={`${origin || "—"} → ${destination || "—"}`}
              />
              <ReviewRow
                label="Escrow"
                value={escrow ? `${escrow} L-BTC` : "—"}
                mono
              />
              <ReviewRow
                label="Documents"
                value={docs.length ? docs.join(", ") : "—"}
              />
            </dl>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-hairline-soft">
          <button
            onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
            className="font-serif text-lg text-ink-mute hover:text-ink px-2"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>
          <button
            onClick={() => (last ? onCreated() : setStep(step + 1))}
            className="inline-flex items-center gap-2 rounded-md bg-ink text-cream-warm px-6 py-2.5 font-serif text-lg hover:bg-[#241a0e] transition-colors"
          >
            {last ? "Create deal" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-hairline bg-cream-base px-3 py-2.5 font-serif text-lg text-ink placeholder:text-ink-dim focus:outline-none focus:border-ink";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ReviewRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="eyebrow shrink-0">{label}</dt>
      <dd
        className={`text-right text-ink ${mono ? "mono text-sm" : "font-serif text-lg"}`}
      >
        {value}
      </dd>
    </div>
  );
}
