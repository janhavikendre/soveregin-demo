// Hardcoded chat threads for /ai. The AI is a *guide* to the platform — it
// explains status, points to deals/docs, and suggests next actions. It never
// creates or settles deals. Assistant messages may contain light markdown
// (bold, bullet lists, and [links](/deals/SP-2847)).

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatThread {
  id: string;
  title: string;
  when: string; // relative group: "Today" | "Yesterday" | "May 28"
  messages: ChatMessage[];
}

export const chats: ChatThread[] = [
  {
    id: "c1",
    title: "Status of SP-2847",
    when: "Today",
    messages: [
      { role: "user", content: "What's the status of SP-2847?" },
      {
        role: "assistant",
        content:
          "**SP-2847 · Vitol SA** is currently **In transit**. Here's where it stands:\n\n- **Vessel:** NORDIC EAGLE (IMO 9447043), Antwerp → Rotterdam\n- **Bill of lading:** verified via essDOCS (zkPass proof `0x3a4f...c821`)\n- **Inspection:** pending — awaiting the SGS quality report\n- **Escrow:** 1.24 L-BTC locked on the Liquid Network\n- **ETA:** May 24, 16:00 UTC\n\nSettlement will release automatically once the SGS oracle attests. You can open the full record on [SP-2847](/deals/SP-2847).",
      },
      { role: "user", content: "What's blocking settlement right now?" },
      {
        role: "assistant",
        content:
          "Just one oracle: the **inspection attestation from SGS**.\n\nThe BL oracle has already attested, and the escrow is funded with 12 confirmations. Once SGS posts the quality report and zkPass verifies it against the issuer record, the settlement transaction broadcasts on its own — no manual step needed.\n\nIf you'd like, you can **notify the counterparty** to chase the inspector, or review the document checklist on the deal's Documents tab.",
      },
      { role: "user", content: "Can you push the inspection through for me?" },
      {
        role: "assistant",
        content:
          "I can't act on the deal — I'm here to **guide** you, not to verify documents or move funds. Verification only happens when SGS submits the report and zkPass attests it against the issuing platform.\n\nWhat I can do is point you to the right place: open the **Documents** tab on [SP-2847](/deals/SP-2847) to see the pending certificate, or head to [Documents](/documents) to track all inspection items across your deals.",
      },
    ],
  },
  {
    id: "c2",
    title: "Why did SP-2845 alert?",
    when: "Today",
    messages: [
      { role: "user", content: "Why is SP-2845 showing an alert?" },
      {
        role: "assistant",
        content:
          "**SP-2845 · Gunvor** is flagged **Alert** for two reasons:\n\n1. **Inspection failed** — Intertek returned a sampling mismatch on the Certificate of Quality, so zkPass could not attest it.\n2. **Bill of lading not yet issued** — the carrier hasn't released the BL via essDOCS.\n\nThe vessel PACIFIC DAWN is holding at Singapore anchorage and the ETA is **TBC**. Escrow (0.37 L-BTC) stays locked until both items resolve.",
      },
      { role: "user", content: "What happens to the escrow if it can't be resolved?" },
      {
        role: "assistant",
        content:
          "The 0.37 L-BTC stays in the settlement covenant — it **cannot release** while any oracle attestation has failed. Nothing moves automatically.\n\nResolution paths are off-platform: either Intertek re-tests and re-issues a passing certificate (which zkPass can then attest), or the counterparties agree to **cancel**, which triggers a refund back to Party A — similar to how [SP-2838](/deals/SP-2838) was unwound.\n\nYou can watch the settlement state on the deal's Settlement tab.",
      },
    ],
  },
  {
    id: "c3",
    title: "Documents awaiting verification",
    when: "Yesterday",
    messages: [
      { role: "user", content: "Which documents are still waiting on verification?" },
      {
        role: "assistant",
        content:
          "Across your active deals, two documents aren't verified yet:\n\n- **Certificate of Quantity** — SGS, on **SP-2847** — *pending*, awaiting inspector counter-signature\n- **Certificate of Quality** — Intertek, on **SP-2845** — *failed*, sampling mismatch\n\nEverything else (BLs, e-BDN, NORs) has a valid zkPass proof. You can see the full list with proof hashes on the [Documents](/documents) screen.",
      },
      { role: "user", content: "How does verification actually work?" },
      {
        role: "assistant",
        content:
          "When a document lands on an issuing platform (essDOCS, Bolero, SGS, etc.), Sovereign asks **zkPass** to produce a zero-knowledge proof that the document on the platform matches what's referenced in the deal — without exposing the document contents on-chain.\n\nThe resulting proof hash (e.g. `0xa1b2...c9d0`) is what the settlement covenant checks. If the proof verifies, the oracle attests; if the underlying record doesn't match, verification **fails** and settlement stays locked.\n\nIt's the same mechanism whether the source is a BL platform or an inspector.",
      },
    ],
  },
  {
    id: "c4",
    title: "NORDIC EAGLE position",
    when: "Yesterday",
    messages: [
      { role: "user", content: "Where is the NORDIC EAGLE right now?" },
      {
        role: "assistant",
        content:
          "Per the latest AIS read (source: Datalastic), **NORDIC EAGLE** is at:\n\n- **Position:** 51.95°N, 2.69°E\n- **Speed:** 13.5 kn\n- **Last port:** Antwerp (departed May 20)\n- **Destination:** Rotterdam\n- **ETA:** May 24, 16:00 UTC\n\nThat's consistent with a normal North Sea approach. You can see the position trail on the Vessel tab of [SP-2847](/deals/SP-2847).",
      },
      { role: "user", content: "Will it arrive in time for the May 26 payment trigger?" },
      {
        role: "assistant",
        content:
          "On current speed, yes — the ETA of **May 24** sits comfortably ahead of the **May 26** payment trigger, leaving roughly two days of buffer.\n\nThe bigger gating item isn't arrival, it's the **SGS inspection** attestation, which is still pending. Arrival alone doesn't release funds; both oracles have to attest first.",
      },
    ],
  },
  {
    id: "c5",
    title: "Settled deals this month",
    when: "May 28",
    messages: [
      { role: "user", content: "How much have we settled this month?" },
      {
        role: "assistant",
        content:
          "Month-to-date settled volume is **$128.4M** across several closed deals, including:\n\n- [SP-2846](/deals/SP-2846) · Trafigura · 0.62 L-BTC\n- [SP-2843](/deals/SP-2843) · Mercuria · 0.48 L-BTC\n- [SP-2842](/deals/SP-2842) · Glencore · 0.54 L-BTC\n- [SP-2840](/deals/SP-2840) · Koch Supply · 0.97 L-BTC\n\nYou currently have **4 active deals** with **$32.5M** locked in escrow. The full ledger is on your [Dashboard](/dashboard).",
      },
      { role: "user", content: "Any of them settle late?" },
      {
        role: "assistant",
        content:
          "No — every settled deal this month released **within two days of vessel arrival**, which is the window you'd expect once both oracles attest.\n\nThe only off-pattern item was [SP-2838](/deals/SP-2838) (Equinor), which was **cancelled** before issuance and refunded — so it never reached settlement at all.",
      },
    ],
  },
  {
    id: "c6",
    title: "How escrow release works",
    when: "May 28",
    messages: [
      { role: "user", content: "Explain how the escrow release works on Liquid." },
      {
        role: "assistant",
        content:
          "At a high level, each deal funds a **settlement covenant** on the Liquid Network with L-BTC. The covenant won't pay out unless its conditions are met:\n\n1. **Escrow funded** by Party A (confirmed on Liquid)\n2. **Both oracles attest** via zkPass — typically the BL platform and an inspector — using BIP-340 signatures\n3. **Settlement transaction** broadcasts automatically\n4. **Confirmed on Liquid** — funds reach the seller wallet\n\nNothing is custodial and no one releases funds by hand. You can watch all four steps on the **Settlement** tab of any deal.",
      },
      { role: "user", content: "What if only one oracle attests?" },
      {
        role: "assistant",
        content:
          "Then nothing moves. The covenant requires **all** configured attestations, so a single oracle is not enough to release funds — the escrow simply stays locked, exactly like [SP-2847](/deals/SP-2847) is right now with its BL verified but inspection still pending.\n\nThis is the whole point of the design: settlement is **conditional on documents and cargo**, not on trust between the parties.",
      },
    ],
  },
];

// Canned assistant replies cycled by message count when the user sends a new
// message. Informational / navigational only — never "I created a deal."
export const cannedReplies: string[] = [
  "Good question. I can help you **navigate** that, but I won't act on the deal itself — verification and settlement are driven entirely by the oracles and the covenant.\n\nFor live status, the **Dashboard** lists every active deal, and each one's Settlement tab shows exactly which step it's on. Want me to point you to a specific deal?",
  "Here's how I'd read that: settlement only releases once **both oracles attest** via zkPass. If a deal is stuck, it's almost always a **pending or failed document**, not the chain.\n\nYou can confirm which document on the [Documents](/documents) screen — verified items carry a proof hash, pending ones show what they're waiting on.",
  "I'm a guide to the platform, so I'll keep this to what's observable: the relevant deal record, its document checklist, and the AIS position for the vessel.\n\nIf you tell me a deal ref like **SP-2847**, I can summarize its status and point you to the right tab — but I won't create or change anything.",
];
