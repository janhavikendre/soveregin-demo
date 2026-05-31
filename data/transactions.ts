// Hardcoded on-chain settlement steppers per deal — Settlement tab of /deals/[id].
// Vertical stepper showing escrow → oracle attestation → settlement broadcast →
// confirmation on Liquid. Pure UI; no chain calls.

export type TxStepState = "done" | "current" | "locked";

export interface TxSubItem {
  label: string;
  done: boolean;
}

export interface TxStep {
  title: string;
  state: TxStepState;
  detail?: string;
  txHash?: string; // monospace tx hash for completed on-chain steps
  confirmations?: string; // "12 confirmations"
  timestamp?: string; // "May 18, 11:40 UTC"
  subItems?: TxSubItem[]; // e.g. the two pending oracle attestations
}

export interface TxFlow {
  counterpartyWallet: string; // "lq1q...a4f2"
  network: string; // "Liquid Network"
  explorerLabel: string; // "Esplora"
  steps: TxStep[];
}

// Default in-transit flow (escrow funded, oracle pending) — used by SP-2847.
const inTransitFlow: TxFlow = {
  counterpartyWallet: "lq1qw8f3k2m...a4f2",
  network: "Liquid Network",
  explorerLabel: "Esplora",
  steps: [
    {
      title: "Escrow funded",
      state: "done",
      detail: "Party A funded 1.24 L-BTC into the settlement covenant.",
      txHash: "0x5e98b3cb7a204f19d6c8e0b2a7f43195c0e8d6b1",
      confirmations: "12 confirmations",
      timestamp: "May 18, 11:40 UTC",
    },
    {
      title: "Oracle attestation pending",
      state: "current",
      detail: "Settlement releases once both oracles attest via zkPass (BIP-340).",
      subItems: [
        { label: "Awaiting BL verification via essDOCS", done: true },
        { label: "Awaiting inspection report from SGS", done: false },
      ],
    },
    {
      title: "Settlement transaction",
      state: "locked",
      detail: "Will broadcast once both oracles attest.",
    },
    {
      title: "Confirmed on Liquid",
      state: "locked",
      detail: "Final settlement to seller wallet on the Liquid Network.",
    },
  ],
};

// Fully settled flow — used by settled deals.
const settledFlow: TxFlow = {
  counterpartyWallet: "lq1qz3p9d7x...7d90",
  network: "Liquid Network",
  explorerLabel: "Esplora",
  steps: [
    {
      title: "Escrow funded",
      state: "done",
      detail: "Party A funded the settlement covenant.",
      txHash: "0x2a71f9c0b3e84d215a9f6c0e7b1d4830f5c2a9e6",
      confirmations: "144 confirmations",
      timestamp: "May 09, 07:15 UTC",
    },
    {
      title: "Oracle attestation complete",
      state: "done",
      detail: "Both oracles attested via zkPass (BIP-340).",
      subItems: [
        { label: "BL verified via Bolero", done: true },
        { label: "Inspection report from Bureau Veritas", done: true },
      ],
    },
    {
      title: "Settlement transaction",
      state: "done",
      detail: "Settlement broadcast to the Liquid Network.",
      txHash: "0x8d40c1b7e2f95a306c8b1d0a4e7f2935b6c1d8a0",
      confirmations: "98 confirmations",
      timestamp: "May 23, 12:58 UTC",
    },
    {
      title: "Confirmed on Liquid",
      state: "done",
      detail: "0.62 L-BTC released to seller wallet.",
      txHash: "0x4f10a9d6c3b87e215f0a9c6e1b7d4830a5c2f9e1",
      confirmations: "96 confirmations",
      timestamp: "May 23, 13:02 UTC",
    },
  ],
};

// Alert flow — escrow funded but attestation failed / on hold (SP-2845).
const alertFlow: TxFlow = {
  counterpartyWallet: "lq1qm2k8s4v...3c1e",
  network: "Liquid Network",
  explorerLabel: "Esplora",
  steps: [
    {
      title: "Escrow funded",
      state: "done",
      detail: "Party A funded 0.37 L-BTC into the settlement covenant.",
      txHash: "0x91c7e0b4a2f86d135c9e0b7a1d4f3820e6c5a9b3",
      confirmations: "61 confirmations",
      timestamp: "May 12, 16:22 UTC",
    },
    {
      title: "Oracle attestation on hold",
      state: "current",
      detail: "Settlement blocked — inspection oracle returned a failure.",
      subItems: [
        { label: "BL verification pending — not yet issued", done: false },
        { label: "Inspection failed at Intertek — re-test requested", done: false },
      ],
    },
    {
      title: "Settlement transaction",
      state: "locked",
      detail: "Will not broadcast while an oracle attestation has failed.",
    },
    {
      title: "Confirmed on Liquid",
      state: "locked",
      detail: "Escrow remains locked pending resolution.",
    },
  ],
};

// Cancelled flow — escrow refunded (SP-2838).
const cancelledFlow: TxFlow = {
  counterpartyWallet: "lq1qr5t2y8u...0b3d",
  network: "Liquid Network",
  explorerLabel: "Esplora",
  steps: [
    {
      title: "Escrow funded",
      state: "done",
      detail: "Party A funded 1.10 L-BTC into the settlement covenant.",
      txHash: "0x73b1c0e9a4f82d605c8b1d0a7e4f3920b6c5a1d8",
      confirmations: "210 confirmations",
      timestamp: "Apr 15, 10:30 UTC",
    },
    {
      title: "Refund executed",
      state: "done",
      detail: "Counterparty withdrew — escrow refunded to Party A.",
      txHash: "0x1e6a9c0b7d3f84215a0c9e6b1d7f4830c5b2a9e4",
      confirmations: "208 confirmations",
      timestamp: "Apr 18, 13:20 UTC",
    },
    {
      title: "Settlement transaction",
      state: "locked",
      detail: "Not applicable — deal cancelled.",
    },
    {
      title: "Confirmed on Liquid",
      state: "locked",
      detail: "Not applicable — deal cancelled.",
    },
  ],
};

// Map deal id → flow. Anything not listed falls back by status heuristic.
const flows: Record<string, TxFlow> = {
  "SP-2847": inTransitFlow,
  "SP-2846": settledFlow,
  "SP-2845": alertFlow,
  "SP-2838": cancelledFlow,
};

export function getTxFlow(dealId: string, statusLabel?: string): TxFlow {
  if (flows[dealId]) return flows[dealId];
  if (statusLabel === "Settled") return settledFlow;
  if (statusLabel === "Alert") return alertFlow;
  if (statusLabel === "Cancelled") return cancelledFlow;
  return inTransitFlow;
}
