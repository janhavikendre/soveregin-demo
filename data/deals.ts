// Hardcoded demo data for the Sovereign enterprise dashboard mockup.
// This is a marketing/investor demo — no backend, no live agent. Add a fifth
// deal by appending to the `deals` array below; the UI is driven entirely by it.

export type BadgeTone = "green" | "amber" | "red" | "blue" | "neutral";

export interface CellValue {
  label: string;
  tone?: BadgeTone; // omitted = plain text (optionally red via `danger`)
  danger?: boolean; // red plain text (e.g. "Delayed — TBC")
}

export interface DealDocument {
  name: string; // "Bill of lading"
  status: "verified" | "pending";
  source: string; // platform + timestamp, e.g. "essDOCS · May 20, 14:32"
  proof?: string; // zk proof hash for verified docs, e.g. "0x3a4f...c821"
  note?: string; // for pending docs, e.g. "Awaiting inspector report"
}

export interface ProgressStep {
  label: string;
  state: "done" | "current" | "pending";
}

export interface VesselTracking {
  vessel: string;
  imo: string;
  position: string; // "51.95°N, 2.69°E"
  speed: string; // "13.5 kn"
  lastPort: string; // "Antwerp (May 20)"
  destination: string; // "Rotterdam"
  eta: string; // "May 24, 16:00 UTC"
}

export interface Settlement {
  amount: string; // "1.24 L-BTC"
  network: string; // "Liquid Network"
  paymentTrigger: string; // "May 26"
  wallet: string; // "lq1q...a4f2"
}

export interface Deal {
  // table row
  id: string; // "SP-2847"
  counterparty: string; // "Vitol SA"
  cargo: string; // "Crude oil 100,000 MT"
  vesselName: string; // "NORDIC EAGLE"
  imo: string; // "9447043"
  etaCell: CellValue;
  documentsCell: CellValue;
  paymentCell: CellValue;
  statusCell: CellValue;

  // detail panel
  escrowLbtc: string; // "1.24 L-BTC"
  escrowUsd: string; // "$12.4M"
  progress: ProgressStep[];
  documents: DealDocument[];
  tracking: VesselTracking;
  settlement: Settlement;
}

export const deals: Deal[] = [
  {
    id: "SP-2847",
    counterparty: "Vitol SA",
    cargo: "Crude oil 100,000 MT",
    vesselName: "NORDIC EAGLE",
    imo: "9447043",
    etaCell: { label: "May 24 16:00 UTC" },
    documentsCell: { label: "Insp. pending", tone: "amber" },
    paymentCell: { label: "May 26" },
    statusCell: { label: "In transit", tone: "blue" },
    escrowLbtc: "1.24 L-BTC",
    escrowUsd: "$12.4M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "done" },
      { label: "Inspection verified", state: "current" },
      { label: "Vessel departed", state: "done" },
      { label: "Vessel arrived", state: "pending" },
      { label: "Settled", state: "pending" },
    ],
    documents: [
      {
        name: "Bill of lading",
        status: "verified",
        source: "essDOCS · May 20, 14:32",
        proof: "0x3a4f...c821",
      },
      {
        name: "Inspection certificate",
        status: "pending",
        source: "SGS portal",
        note: "Awaiting inspector report",
      },
    ],
    tracking: {
      vessel: "NORDIC EAGLE",
      imo: "9447043",
      position: "51.95°N, 2.69°E",
      speed: "13.5 kn",
      lastPort: "Antwerp (May 20)",
      destination: "Rotterdam",
      eta: "May 24, 16:00 UTC",
    },
    settlement: {
      amount: "1.24 L-BTC",
      network: "Liquid Network",
      paymentTrigger: "May 26",
      wallet: "lq1q...a4f2",
    },
  },
  {
    id: "SP-2846",
    counterparty: "Trafigura",
    cargo: "Fuel oil 50,000 MT",
    vesselName: "EASTERN MARINER",
    imo: "9312845",
    etaCell: { label: "Arrived May 21" },
    documentsCell: { label: "All verified", tone: "green" },
    paymentCell: { label: "Settled May 23" },
    statusCell: { label: "Settled", tone: "green" },
    escrowLbtc: "0.62 L-BTC",
    escrowUsd: "$6.2M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "done" },
      { label: "Inspection verified", state: "done" },
      { label: "Vessel departed", state: "done" },
      { label: "Vessel arrived", state: "done" },
      { label: "Settled", state: "done" },
    ],
    documents: [
      {
        name: "Bill of lading",
        status: "verified",
        source: "Bolero · May 16, 09:11",
        proof: "0x9c12...7be4",
      },
      {
        name: "Certificate of Quantity",
        status: "verified",
        source: "Bureau Veritas · May 21, 11:48",
        proof: "0x47de...a190",
      },
    ],
    tracking: {
      vessel: "EASTERN MARINER",
      imo: "9312845",
      position: "Berthed — Rotterdam",
      speed: "0.0 kn",
      lastPort: "Fujairah (May 09)",
      destination: "Rotterdam",
      eta: "Arrived May 21, 08:20 UTC",
    },
    settlement: {
      amount: "0.62 L-BTC",
      network: "Liquid Network",
      paymentTrigger: "Released May 23",
      wallet: "lq1q...7d90",
    },
  },
  {
    id: "SP-2845",
    counterparty: "Gunvor",
    cargo: "Gasoline 30,000 MT",
    vesselName: "PACIFIC DAWN",
    imo: "9284731",
    etaCell: { label: "Delayed — TBC", danger: true },
    documentsCell: { label: "BL pending", tone: "amber" },
    paymentCell: { label: "—" },
    statusCell: { label: "Alert", tone: "red" },
    escrowLbtc: "0.37 L-BTC",
    escrowUsd: "$3.7M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "current" },
      { label: "Inspection verified", state: "pending" },
      { label: "Vessel departed", state: "pending" },
      { label: "Vessel arrived", state: "pending" },
      { label: "Settled", state: "pending" },
    ],
    documents: [
      {
        name: "Bill of lading",
        status: "pending",
        source: "essDOCS",
        note: "BL not yet issued by carrier",
      },
      {
        name: "Certificate of Quality",
        status: "pending",
        source: "Intertek portal",
        note: "Awaiting load-port sampling",
      },
    ],
    tracking: {
      vessel: "PACIFIC DAWN",
      imo: "9284731",
      position: "1.26°N, 103.8°E",
      speed: "0.0 kn",
      lastPort: "Singapore (anchorage)",
      destination: "Rotterdam",
      eta: "Delayed — TBC",
    },
    settlement: {
      amount: "0.37 L-BTC",
      network: "Liquid Network",
      paymentTrigger: "On hold",
      wallet: "lq1q...3c1e",
    },
  },
  {
    id: "SP-2844",
    counterparty: "Shell Trading",
    cargo: "LPG 20,000 MT",
    vesselName: "ARCTIC GAS",
    imo: "9391024",
    etaCell: { label: "May 27 09:00 UTC" },
    documentsCell: { label: "All verified", tone: "green" },
    paymentCell: { label: "May 30" },
    statusCell: { label: "In transit", tone: "blue" },
    escrowLbtc: "0.25 L-BTC",
    escrowUsd: "$2.5M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "done" },
      { label: "Inspection verified", state: "done" },
      { label: "Vessel departed", state: "done" },
      { label: "Vessel arrived", state: "pending" },
      { label: "Settled", state: "pending" },
    ],
    documents: [
      {
        name: "Bill of lading",
        status: "verified",
        source: "Bolero · May 22, 16:05",
        proof: "0x1f8a...d34c",
      },
      {
        name: "Certificate of Quality",
        status: "verified",
        source: "Intertek · May 22, 18:40",
        proof: "0xab02...9f57",
      },
      {
        name: "e-BDN",
        status: "verified",
        source: "VesselChain · May 23, 07:12",
        proof: "0x77c4...e0b8",
      },
    ],
    tracking: {
      vessel: "ARCTIC GAS",
      imo: "9391024",
      position: "57.1°N, 5.3°E",
      speed: "15.2 kn",
      lastPort: "Mongstad (May 23)",
      destination: "Rotterdam",
      eta: "May 27, 09:00 UTC",
    },
    settlement: {
      amount: "0.25 L-BTC",
      network: "Liquid Network",
      paymentTrigger: "May 30",
      wallet: "lq1q...b6f8",
    },
  },
];

// Top-of-page stat cards. Hardcoded so they read cleanly for the demo.
export interface StatCard {
  label: string;
  value: string;
  accent?: "green";
}

export const stats: StatCard[] = [
  { label: "Active deals", value: "4" },
  { label: "Value locked", value: "$32.5M" },
  { label: "Docs pending", value: "2" },
  { label: "Settled MTD", value: "$128.4M", accent: "green" },
];

// Cargo options + document requirements for the New Deal modal.
export const cargoTypes = ["Crude oil", "Fuel oil", "Gasoline", "LPG", "Diesel"];

export const documentRequirements = [
  "Bill of Lading",
  "Certificate of Quantity",
  "Certificate of Quality",
  "Notice of Readiness",
  "e-BDN",
];
