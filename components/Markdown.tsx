import Link from "next/link";
import { Fragment } from "react";

// Tiny hand-rolled markdown renderer for AI chat bubbles. Supports paragraphs,
// bullet (-) and ordered (1.) lists, **bold**, `inline code`, and
// [links](/path). Internal links (starting with /) use next/link. No external
// dependency — keeps the build offline and fast.

export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if (block.type === "ul") {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="text-gold-light mt-[2px] shrink-0">·</span>
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={i} className="space-y-1.5 pl-1">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mono text-sm text-gold-light mt-[2px] shrink-0">
                    {j + 1}.
                  </span>
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="leading-relaxed">
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

type Block =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ") });
      para = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushPara();
      i++;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    para.push(trimmed);
    i++;
  }
  flushPara();
  return blocks;
}

// Inline parser: handles **bold**, `code`, and [text](href) in any order.
function Inline({ text }: { text: string }) {
  const tokens = tokenizeInline(text);
  return (
    <>
      {tokens.map((tok, i) => {
        if (tok.type === "bold") {
          return (
            <strong key={i} className="font-semibold text-ink">
              {tok.value}
            </strong>
          );
        }
        if (tok.type === "code") {
          return (
            <code
              key={i}
              className="mono text-[0.85em] bg-cream-sunk px-1.5 py-0.5 rounded text-ink"
            >
              {tok.value}
            </code>
          );
        }
        if (tok.type === "link") {
          const internal = tok.href.startsWith("/");
          if (internal) {
            return (
              <Link
                key={i}
                href={tok.href}
                className="text-gold-light underline underline-offset-2 hover:text-ink"
              >
                {tok.value}
              </Link>
            );
          }
          return (
            <a
              key={i}
              href={tok.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-light underline underline-offset-2 hover:text-ink"
            >
              {tok.value}
            </a>
          );
        }
        return <Fragment key={i}>{tok.value}</Fragment>;
      })}
    </>
  );
}

type InlineToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; value: string; href: string };

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  // Combined matcher: bold | code | link.
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      tokens.push({ type: "text", value: text.slice(last, m.index) });
    }
    if (m[1] !== undefined) {
      tokens.push({ type: "bold", value: m[1] });
    } else if (m[2] !== undefined) {
      tokens.push({ type: "code", value: m[2] });
    } else if (m[3] !== undefined) {
      tokens.push({ type: "link", value: m[3], href: m[4] });
    }
    last = re.lastIndex;
  }
  if (last < text.length) {
    tokens.push({ type: "text", value: text.slice(last) });
  }
  return tokens;
}
