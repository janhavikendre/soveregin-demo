"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useToast } from "@/components/Toast";
import { demoFiles, uploadedDocs, type DemoFile, type DocStatus } from "@/data/documents";

export default function DocumentsPage() {
  return (
    <AppShell>
      <DocumentsScreen />
    </AppShell>
  );
}

type UploadState =
  | { phase: "empty" }
  | { phase: "uploading"; file: DemoFile; progress: number }
  | { phase: "verified"; file: DemoFile };

function DocumentsScreen() {
  const { toast } = useToast();
  const [state, setState] = useState<UploadState>({ phase: "empty" });
  const [pickerOpen, setPickerOpen] = useState(false);
  const timers = useRef<number[]>([]);

  // Clear any running timers on unmount.
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  const startUpload = (file: DemoFile) => {
    setPickerOpen(false);
    setState({ phase: "uploading", file, progress: 0 });

    // Fake progress 0 -> 100 over ~2.5s.
    const steps = 20;
    for (let i = 1; i <= steps; i++) {
      const id = window.setTimeout(() => {
        const progress = Math.round((i / steps) * 100);
        setState({ phase: "uploading", file, progress });
        if (i === steps) {
          const done = window.setTimeout(() => {
            setState({ phase: "verified", file });
            toast(`${file.docType} · Verified via zkPass`);
          }, 250);
          timers.current.push(done);
        }
      }, (i / steps) * 2500);
      timers.current.push(id);
    }
  };

  const reset = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setState({ phase: "empty" });
  };

  return (
    <main className="flex-1 px-5 sm:px-10 py-8 max-w-[1180px] w-full mx-auto">
      <div className="mb-7">
        <p className="eyebrow">Trade documents</p>
        <h1 className="font-serif text-4xl sm:text-5xl mt-1.5">Documents</h1>
        <p className="font-serif text-xl text-ink-mute mt-2 max-w-2xl">
          Upload trade documents. Verified via zkPass against issuing-platform
          records.
        </p>
      </div>

      {/* upload zone */}
      <section className="mb-9">
        {state.phase === "empty" && (
          <div className="rounded-xl border-2 border-dashed border-hairline bg-cream-warm px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream-sunk text-2xl text-ink-mute">
              ↥
            </div>
            <p className="font-serif text-2xl">Drag a document here, or browse</p>
            <p className="mono text-xs text-ink-dim mt-2">
              Supported: PDF, eBL exports, inspection reports
            </p>
            <button
              onClick={() => setPickerOpen(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink text-cream-warm px-6 py-2.5 font-serif text-lg hover:bg-[#241a0e] transition-colors"
            >
              Browse files
            </button>
          </div>
        )}

        {state.phase === "uploading" && (
          <div className="rounded-xl border border-hairline bg-cream-warm px-6 py-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-4 w-4 rounded-full border-2 border-gold-light/40 border-t-gold-light animate-spin" />
              <span className="font-serif text-xl">{state.file.fileName}</span>
              <span className="mono text-xs text-ink-dim ml-auto">
                {state.progress}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-cream-sunk overflow-hidden">
              <div
                className="h-full bg-gold-light transition-all duration-150"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <p className="mono text-xs text-ink-mute mt-3">
              Uploading to zkPass… verifying against {state.file.platform} record
            </p>
          </div>
        )}

        {state.phase === "verified" && (
          <div className="rounded-xl border border-status-green/40 bg-status-green-soft px-6 py-8">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-status-green text-cream-warm text-lg shrink-0">
                ✓
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-2xl text-status-green">
                  {state.file.docType} · Verified
                </p>
                <p className="mono text-xs text-ink-mute mt-2">
                  File: {state.file.fileName}
                </p>
                <p className="mono text-xs text-ink-mute mt-1">
                  Source: {state.file.platform} · proof:{" "}
                  <span className="text-status-green">0xa1b2...c9d0</span>
                </p>
                <p className="font-serif text-base text-ink mt-2">
                  Added to{" "}
                  <Link href="/deals/SP-2847" className="text-gold-light hover:text-ink underline underline-offset-2">
                    SP-2847
                  </Link>
                </p>
              </div>
              <button
                onClick={reset}
                className="rounded-md border border-status-green/40 bg-cream-warm px-4 py-2 font-serif text-base text-status-green hover:border-status-green transition-colors shrink-0"
              >
                Upload another
              </button>
            </div>
          </div>
        )}
      </section>

      {/* recent documents */}
      <div className="flex items-center justify-between mb-3">
        <p className="eyebrow">Recently uploaded</p>
        <span className="eyebrow">{uploadedDocs.length} documents</span>
      </div>
      <div className="rounded-xl border border-hairline bg-cream-warm overflow-hidden">
        {uploadedDocs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-4 px-6 py-4 border-b border-hairline-soft last:border-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-cream-sunk mono text-[10px] text-ink-mute shrink-0">
              PDF
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg leading-tight">{doc.name}</p>
              <p className="mono text-xs text-ink-dim truncate">
                {doc.fileName} · {doc.platform} · {doc.timestamp}
              </p>
            </div>
            <Link
              href={`/deals/${doc.deal}`}
              className="mono text-xs text-gold-light hover:text-ink hidden sm:inline"
            >
              {doc.deal}
            </Link>
            {doc.proof && (
              <span className="mono text-xs text-status-green hidden md:inline">
                {doc.proof}
              </span>
            )}
            <DocStatusPill status={doc.status} />
          </div>
        ))}
      </div>

      {pickerOpen && (
        <PickFileModal onPick={startUpload} onClose={() => setPickerOpen(false)} />
      )}
    </main>
  );
}

function DocStatusPill({ status }: { status: DocStatus }) {
  if (status === "verified")
    return <span className="badge badge-green">Verified</span>;
  if (status === "failed") return <span className="badge badge-red">Failed</span>;
  return <span className="badge badge-amber">Pending</span>;
}

function PickFileModal({
  onPick,
  onClose,
}: {
  onPick: (f: DemoFile) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-hairline bg-cream-warm shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6">
          <div>
            <p className="eyebrow">Demo upload</p>
            <h3 className="font-serif text-2xl mt-1">Pick demo file</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-ink-dim hover:text-ink text-xl leading-none px-2"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 space-y-2">
          {demoFiles.map((f) => (
            <button
              key={f.fileName}
              onClick={() => onPick(f)}
              className="w-full text-left flex items-center gap-3 rounded-lg border border-hairline-soft bg-cream-card px-4 py-3 hover:border-ink transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cream-sunk mono text-[10px] text-ink-mute shrink-0">
                PDF
              </span>
              <div className="min-w-0">
                <p className="font-serif text-lg leading-tight truncate">
                  {f.fileName}
                </p>
                <p className="mono text-xs text-ink-dim">
                  {f.docType} · {f.platform}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
