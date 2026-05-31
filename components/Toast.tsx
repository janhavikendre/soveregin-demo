"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ToastTone = "green" | "amber" | "neutral";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// useToast() returns a `toast(message, tone?)` function. Safe to call from any
// component rendered inside <ToastProvider> (AppShell provides it).
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // No provider (e.g. used outside AppShell) — no-op so callers never crash.
    return { toast: () => {} };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const toast = useCallback(
    (message: string, tone: ToastTone = "green") => {
      const id = (seq.current += 1);
      setItems((prev) => [...prev, { id, message, tone }]);
    },
    []
  );

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-5 right-5 z-[60] flex flex-col gap-2.5 w-[min(92vw,340px)]">
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onDone={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const toneStyles: Record<ToastTone, { wrap: string; dot: string }> = {
  green: {
    wrap: "border-status-green/40 bg-status-green-soft text-status-green",
    dot: "bg-status-green text-cream-warm",
  },
  amber: {
    wrap: "border-status-amber/40 bg-status-amber-soft text-status-amber",
    dot: "bg-status-amber text-cream-warm",
  },
  neutral: {
    wrap: "border-hairline bg-cream-warm text-ink",
    dot: "bg-ink text-cream-warm",
  },
};

function ToastCard({ item, onDone }: { item: ToastItem; onDone: () => void }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // slide-in on mount
    const raf = window.requestAnimationFrame(() => setShown(true));
    const t = window.setTimeout(onDone, 3800);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [onDone]);

  const s = toneStyles[item.tone];

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-xl backdrop-blur transition-all duration-300 ${
        s.wrap
      } ${shown ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${s.dot}`}
      >
        ✓
      </span>
      <span className="font-serif text-base leading-snug">{item.message}</span>
      <button
        onClick={onDone}
        aria-label="Dismiss"
        className="ml-auto text-current/60 hover:text-current text-sm leading-none"
      >
        ✕
      </button>
    </div>
  );
}
