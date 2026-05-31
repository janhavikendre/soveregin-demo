"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Fake sign-in. No magic link is sent — after a short "Sending..." state we
// route straight to /dashboard. This is the demo shortcut Didrik asked for.
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const signIn = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (sending) return;
    setSending(true);
    window.setTimeout(() => router.push("/dashboard"), 800);
  };

  const useDemo = () => {
    if (sending) return;
    setEmail("trading@vitol.com");
    setSending(true);
    window.setTimeout(() => router.push("/dashboard"), 500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {/* wordmark */}
      <Link href="/" className="flex items-center gap-3 mb-10">
        <span className="h-2 w-2 rounded-full bg-gold-light shadow-[0_0_10px_rgba(166,128,47,0.6)]" />
        <span className="font-serif text-lg tracking-[0.34em] uppercase">
          Sovereign
        </span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-hairline bg-cream-warm shadow-sm px-7 sm:px-9 py-9">
        <p className="eyebrow">Sign in</p>
        <h1 className="font-serif text-3xl sm:text-[34px] leading-tight mt-1.5">
          Sign in to Sovereign Protocol
        </h1>
        <p className="font-serif text-lg text-ink-mute mt-3 leading-snug">
          Enterprise commodity settlement on the Liquid Network.
        </p>

        <form onSubmit={signIn} className="mt-7 space-y-4">
          <label className="block">
            <span className="eyebrow block mb-1.5">Work email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trading@vitol.com"
              disabled={sending}
              className="w-full rounded-md border border-hairline bg-cream-base px-3.5 py-3 font-serif text-lg text-ink placeholder:text-ink-dim focus:outline-none focus:border-ink disabled:opacity-60"
            />
          </label>

          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-ink text-cream-warm px-6 py-3 font-serif text-lg hover:bg-[#241a0e] transition-colors disabled:opacity-70"
          >
            {sending ? (
              <>
                <span className="h-3.5 w-3.5 rounded-full border-2 border-cream-warm/40 border-t-cream-warm animate-spin" />
                Sending magic link…
              </>
            ) : (
              <>
                Continue <span aria-hidden>→</span>
              </>
            )}
          </button>
        </form>

        <p className="mono text-xs text-ink-dim mt-4 text-center">
          A magic link will be sent to your inbox.
        </p>

        <div className="flex items-center gap-3 my-6">
          <span className="h-px flex-1 bg-hairline-soft" />
          <span className="eyebrow">or</span>
          <span className="h-px flex-1 bg-hairline-soft" />
        </div>

        <button
          onClick={useDemo}
          disabled={sending}
          className="w-full rounded-md border border-hairline px-6 py-3 font-serif text-lg text-ink hover:border-ink transition-colors disabled:opacity-60"
        >
          Use demo account
        </button>
      </div>

      <p className="eyebrow mt-8">Demo · Hardcoded data · No email is sent</p>
    </main>
  );
}
