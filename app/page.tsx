import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 sm:px-14 py-7 border-b border-hairline-soft">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-gold-light shadow-[0_0_10px_rgba(166,128,47,0.6)]" />
          <span className="font-serif text-lg tracking-[0.34em] uppercase">
            Sovereign
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="font-serif text-lg text-ink-mute hover:text-ink transition-colors"
          >
            Sign in
          </Link>
          <span className="eyebrow hidden sm:block">v0.1 · Investor demo</span>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center px-6 sm:px-14 py-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-6">Personal Sovereign Agents · Settlement</p>
          <h1 className="font-serif italic text-5xl sm:text-7xl leading-[1.04] tracking-[-0.02em] text-balance">
            Sovereign
            <span className="not-italic text-ink-mute"> · </span>
            <br className="hidden sm:block" />
            Enterprise commodity settlement
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-ink-mute mt-8 max-w-2xl leading-snug">
            Escrowed value on the Liquid Network, released the moment documents
            verify and the vessel arrives. One protocol for the documents, the
            cargo, and the money.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-ink text-cream-warm px-7 py-3.5 font-serif text-lg tracking-wide transition-colors hover:bg-[#241a0e]"
            >
              Sign in
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-hairline px-7 py-3.5 font-serif text-lg tracking-wide text-ink transition-colors hover:border-ink"
            >
              View demo dashboard
              <span aria-hidden className="text-gold-light">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-14 py-8 border-t border-hairline-soft flex items-center justify-between">
        <span className="eyebrow">Sovereign · One protocol. Every rail.</span>
        <span className="eyebrow hidden sm:block">Demo · Hardcoded data</span>
      </footer>
    </main>
  );
}
