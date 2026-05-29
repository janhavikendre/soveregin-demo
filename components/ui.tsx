import type { BadgeTone, CellValue } from "@/data/deals";

const toneClass: Record<BadgeTone, string> = {
  green: "badge-green",
  amber: "badge-amber",
  red: "badge-red",
  blue: "badge-blue",
  neutral: "badge-neutral",
};

export function Badge({
  tone,
  children,
}: {
  tone: BadgeTone;
  children: React.ReactNode;
}) {
  return <span className={`badge ${toneClass[tone]}`}>{children}</span>;
}

// Renders a table cell that is either a pill badge or plain (optionally red) text.
export function Cell({ value }: { value: CellValue }) {
  if (value.tone) {
    return <Badge tone={value.tone}>{value.label}</Badge>;
  }
  return (
    <span
      className={
        value.danger
          ? "text-status-red font-serif"
          : "text-ink-mute font-serif"
      }
    >
      {value.label}
    </span>
  );
}
