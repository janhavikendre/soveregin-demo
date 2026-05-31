"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useToast } from "@/components/Toast";
import {
  apiKey,
  company,
  notifications as defaultNotifications,
  team,
  wallet,
} from "@/data/profile";

export default function ProfilePage() {
  return (
    <AppShell>
      <ProfileScreen />
    </AppShell>
  );
}

function ProfileScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const [prefs, setPrefs] = useState(defaultNotifications);
  const [revealKey, setRevealKey] = useState(false);

  const toggle = (id: string) =>
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );

  const maskedKey = `${apiKey.slice(0, 14)}${"•".repeat(10)}`;

  return (
    <main className="flex-1 px-5 sm:px-10 py-8 max-w-[900px] w-full mx-auto">
      <div className="mb-8">
        <p className="eyebrow">Account</p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-1.5">Profile</h1>
      </div>

      {/* Company */}
      <Section title="Company">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-serif text-2xl">{company.name}</p>
            <p className="font-serif text-base text-ink-mute mt-0.5">
              {company.jurisdiction}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="badge badge-green">{company.kyb}</span>
              <span className="mono text-xs text-ink-dim">
                Reg. {company.registered}
              </span>
              <span className="mono text-xs text-ink-dim">· {company.screening}</span>
            </div>
          </div>
          <button
            onClick={() => toast("Edit company (demo)", "neutral")}
            className="rounded-md border border-hairline px-4 py-2 font-serif text-base hover:border-ink transition-colors"
          >
            Edit
          </button>
        </div>
      </Section>

      {/* Wallet */}
      <Section title="Wallet">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-status-green" />
              <p className="font-serif text-xl">Connected · {wallet.provider}</p>
            </div>
            <p className="mono text-sm text-ink-mute mt-2 break-all">
              {wallet.address}
            </p>
            <p className="font-serif text-2xl mt-3">
              {wallet.balanceLbtc}{" "}
              <span className="text-ink-mute text-lg">({wallet.balanceUsd})</span>
            </p>
          </div>
          <a
            href="https://blockstream.com/green/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-hairline px-4 py-2 font-serif text-base hover:border-ink transition-colors whitespace-nowrap"
          >
            Manage in Green wallet <span className="text-gold-light">↗</span>
          </a>
        </div>
      </Section>

      {/* Team */}
      <Section title="Team">
        <div className="divide-y divide-hairline-soft -my-1">
          {team.map((m) => (
            <div key={m.email} className="flex items-center gap-3 py-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream-warm mono text-xs shrink-0">
                {m.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg leading-tight">{m.name}</p>
                <p className="mono text-xs text-ink-dim truncate">{m.email}</p>
              </div>
              <span className="badge badge-neutral">{m.role}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => toast("Invite sent (demo)")}
          className="mt-3 rounded-md border border-hairline px-4 py-2 font-serif text-base hover:border-ink transition-colors"
        >
          + Invite member
        </button>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <div className="divide-y divide-hairline-soft -my-1">
          {prefs.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <p className="font-serif text-lg leading-tight">{p.label}</p>
                <p className="font-serif text-base text-ink-mute">
                  {p.description}
                </p>
              </div>
              <Toggle on={p.enabled} onClick={() => toggle(p.id)} />
            </div>
          ))}
        </div>
      </Section>

      {/* API access */}
      <Section title="API access">
        <p className="font-serif text-base text-ink-mute mb-3">
          Use this key to access the Sovereign settlement API.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="mono text-sm bg-cream-sunk rounded-md px-3 py-2 text-ink flex-1 min-w-[220px] break-all">
            {revealKey ? apiKey : maskedKey}
          </code>
          <button
            onClick={() => setRevealKey((v) => !v)}
            className="rounded-md border border-hairline px-3 py-2 font-serif text-base hover:border-ink transition-colors"
          >
            {revealKey ? "Hide" : "Reveal"}
          </button>
          <button
            onClick={() => toast("API key copied", "neutral")}
            className="rounded-md border border-hairline px-3 py-2 font-serif text-base hover:border-ink transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => toast("API key regenerated (demo)", "amber")}
            className="rounded-md border border-hairline px-3 py-2 font-serif text-base hover:border-ink transition-colors"
          >
            Regenerate
          </button>
        </div>
      </Section>

      {/* Danger zone */}
      <section className="rounded-xl border border-status-red/30 bg-status-red-soft/40 px-6 py-6 mb-8">
        <p className="eyebrow mb-3" style={{ color: "var(--color-status-red)" }}>
          Danger zone
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-serif text-lg text-ink-mute">
            Sign out of this device.
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-md border border-status-red/40 bg-cream-warm px-5 py-2 font-serif text-lg text-status-red hover:border-status-red transition-colors"
          >
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-cream-warm px-6 py-6 mb-5">
      <p className="eyebrow mb-4">{title}</p>
      {children}
    </section>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-status-green" : "bg-cream-sunk border border-hairline"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-cream-warm shadow transition-all ${
          on ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
