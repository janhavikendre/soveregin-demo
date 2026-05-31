"use client";

import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Markdown } from "@/components/Markdown";
import { useToast } from "@/components/Toast";
import { chats, cannedReplies, type ChatMessage } from "@/data/chats";

export default function AiPage() {
  return (
    <AppShell>
      <AiChat />
    </AppShell>
  );
}

function AiChat() {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState(chats[0].id);
  // Local thread copy so typed messages append without touching the source data.
  const [thread, setThread] = useState<ChatMessage[]>(chats[0].messages);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const switchChat = (id: string) => {
    const c = chats.find((x) => x.id === id);
    if (!c) return;
    setActiveId(id);
    setThread(c.messages);
    setThinking(false);
  };

  const newChat = () => {
    setActiveId("new");
    setThread([]);
    setThinking(false);
  };

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread, thinking]);

  const send = () => {
    const text = draft.trim();
    if (!text || thinking) return;
    setThread((prev) => [...prev, { role: "user", content: text }]);
    setDraft("");
    setThinking(true);
    window.setTimeout(() => {
      const reply = cannedReplies[replyIdx % cannedReplies.length];
      setReplyIdx((n) => n + 1);
      setThread((prev) => [...prev, { role: "assistant", content: reply }]);
      setThinking(false);
    }, 1200);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Group chats by their `when` label for the sidebar.
  const groups = chats.reduce<Record<string, typeof chats>>((acc, c) => {
    (acc[c.when] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="flex-1 flex min-h-0 max-w-[1180px] w-full mx-auto px-3 sm:px-6 py-6 gap-4">
      {/* sidebar */}
      <aside className="hidden md:flex w-[260px] shrink-0 flex-col rounded-xl border border-hairline bg-cream-warm overflow-hidden">
        <div className="p-3 border-b border-hairline-soft">
          <button
            onClick={newChat}
            className="w-full rounded-md bg-ink text-cream-warm px-4 py-2.5 font-serif text-lg hover:bg-[#241a0e] transition-colors"
          >
            + New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {Object.entries(groups).map(([when, list]) => (
            <div key={when} className="mb-3">
              <p className="eyebrow px-2 mb-1.5">{when}</p>
              {list.map((c) => {
                const active = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    onClick={() => switchChat(c.id)}
                    className={`w-full text-left rounded-md px-3 py-2 font-serif text-base truncate transition-colors ${
                      active
                        ? "bg-cream-sunk text-ink"
                        : "text-ink-mute hover:bg-cream-card hover:text-ink"
                    }`}
                  >
                    {c.title}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-hairline-soft">
          <p className="mono text-[10px] text-ink-dim leading-relaxed">
            Sovereign AI guides the platform. It does not create or settle deals.
          </p>
        </div>
      </aside>

      {/* main thread */}
      <section className="flex-1 flex flex-col min-w-0 rounded-xl border border-hairline bg-cream-base overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-hairline-soft bg-cream-warm">
          <span className="h-2 w-2 rounded-full bg-gold-light" />
          <span className="font-serif text-xl">Sovereign AI</span>
          <span className="badge badge-neutral ml-2">Guide · read-only</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-5">
            {thread.length === 0 && (
              <div className="text-center py-16">
                <p className="font-serif text-2xl text-ink-mute">
                  Ask about a deal, a document, or a vessel.
                </p>
                <p className="mono text-xs text-ink-dim mt-3">
                  e.g. &ldquo;What&rsquo;s the status of SP-2847?&rdquo;
                </p>
              </div>
            )}
            {thread.map((m, i) => (
              <MessageBubble key={i} message={m} onCopy={() => toast("Copied to clipboard", "neutral")} />
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm border border-hairline bg-cream-warm px-4 py-3">
                  <span className="flex gap-1">
                    <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* input */}
        <div className="border-t border-hairline-soft bg-cream-warm px-4 sm:px-8 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 rounded-xl border border-hairline bg-cream-base px-3 py-2 focus-within:border-ink transition-colors">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Message Sovereign AI…"
                className="flex-1 resize-none bg-transparent px-2 py-1.5 font-serif text-lg text-ink placeholder:text-ink-dim focus:outline-none max-h-36"
              />
              <button
                onClick={send}
                disabled={!draft.trim() || thinking}
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-cream-warm hover:bg-[#241a0e] transition-colors disabled:opacity-40"
              >
                ↑
              </button>
            </div>
            <p className="mono text-[10px] text-ink-dim mt-2 text-center">
              Demo · replies are canned. The AI guides only — it never creates or settles deals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
}: {
  message: ChatMessage;
  onCopy: () => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-gold-light/30 bg-status-amber-soft/60 px-4 py-2.5">
          <p className="font-serif text-lg leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start group">
      <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-hairline bg-cream-warm px-4 py-3 font-serif text-lg text-ink">
        <Markdown content={message.content} />
        <button
          onClick={onCopy}
          className="mt-2 mono text-[10px] text-ink-dim hover:text-ink opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-ink-dim animate-bounce"
      style={{ animationDelay: delay }}
    />
  );
}
