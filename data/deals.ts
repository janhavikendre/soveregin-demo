// Hardcoded demo data for the Sovereign enterprise UI mockup.
// This is a design surface / investor demo — no backend, no live agent.
// The `deals` array drives the dashboard (active deals). `historicalDeals`
// adds settled/closed deals for visual weight on the /deals list.
// `allDeals` is the union; use `getDeal(id)` for deep-linking.

export type BadgeTone = "green" | "amber" | "red" | "blue" | "neutral";

export interface CellValue {
  label: string;
  tone?: BadgeTone; // omitted = plain text (optionally red via `danger`)
  danger?: boolean; // red plain text (e.g. "Delayed — TBC")
}

export interface DealDocument {
  name: string; // "Bill of lading"
  status: "verified" | "pending" | "failed";
  source: string; // platform + timestamp, e.g. "essDOCS · May 20, 14:32"
  platform?: string; // issuing platform, e.g. "essDOCS"
  timestamp?: string; // e.g. "May 20, 14:32 UTC"
  proof?: string; // short zk proof hash, e.g. "0x3a4f...c821"
  proofFull?: string; // full proof hash for the doc-detail view
  note?: string; // for pending/failed docs
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
  source?: string; // AIS data source, e.g. "Datalastic"
}

export interface Settlement {
  amount: string; // "1.24 L-BTC"
  network: string; // "Liquid Network"
  paymentTrigger: string; // "May 26"
  wallet: string; // "lq1q...a4f2"
}

export interface ActivityEvent {
  time: string; // "May 18, 09:02 UTC"
  title: string; // "Deal created"
  detail?: string; // "Escrow structured by Vitol SA"
  tone?: BadgeTone; // dot color
}

export interface Deal {
  // table row
  id: string; // "SP-2847"
  counterparty: string; // "Vitol SA"
  cargo: string; // "Crude oil 100,000 MT"
  vesselName: string; // "NORDIC EAGLE"
  imo: string; // "9447043"
  route: string; // "Antwerp → Rotterdam"
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
  activity: ActivityEvent[];
}

export const deals: Deal[] = [
  {
    id: "SP-2847",
    counterparty: "Vitol SA",
    cargo: "Crude oil 100,000 MT",
    vesselName: "NORDIC EAGLE",
    imo: "9447043",
    route: "Antwerp → Rotterdam",
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
        platform: "essDOCS",
        timestamp: "May 20, 14:32 UTC",
        proof: "0x3a4f...c821",
        proofFull: "0x3a4f9d22e7b1c8045a6f1e9d77b4c2a0e8f3d61b9c4a7e02d5f8b6c1029ac821",
      },
      {
        name: "Certificate of Quality",
        status: "pending",
        source: "SGS portal",
        platform: "SGS",
        note: "Awaiting load-port inspector report",
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
      source: "Datalastic",
    },
    settlement: {
      amount: "1.24 L-BTC",
      network: "Liquid Network",
      paymentTrigger: "May 26",
      wallet: "lq1q...a4f2",
    },
    activity: [
      { time: "May 18, 09:02 UTC", title: "Deal created", detail: "Escrow structured by Vitol SA", tone: "neutral" },
      { time: "May 18, 11:40 UTC", title: "Party A funded escrow", detail: "1.24 L-BTC locked on Liquid", tone: "green" },
      { time: "May 20, 14:32 UTC", title: "BL verified by zkPass", detail: "Bill of lading attested via essDOCS", tone: "green" },
      { time: "May 20, 18:05 UTC", title: "Vessel departed Antwerp", detail: "AIS confirmed departure", tone: "blue" },
      { time: "May 22, 08:14 UTC", title: "Inspection pending", detail: "Awaiting SGS quality report", tone: "amber" },
    ],
  },
  {
    id: "SP-2846",
    counterparty: "Trafigura",
    cargo: "Fuel oil 50,000 MT",
    vesselName: "EASTERN MARINER",
    imo: "9312845",
    route: "Fujairah → Rotterdam",
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
        platform: "Bolero",
        timestamp: "May 16, 09:11 UTC",
        proof: "0x9c12...7be4",
        proofFull: "0x9c12af0b3d7e4528c1096fa2b8d4e7039f1c6a85b2e904d7c3f81a60b29e7be4",
      },
      {
        name: "Certificate of Quantity",
        status: "verified",
        source: "Bureau Veritas · May 21, 11:48",
        platform: "Bureau Veritas",
        timestamp: "May 21, 11:48 UTC",
        proof: "0x47de...a190",
        proofFull: "0x47de1c93a8045f7b2e6c91d04a3f8b75e2091c6da4b7038f5c1e9026d4b8a190",
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
      source: "VesselAPI",
    },
    settlement: {
      amount: "0.62 L-BTC",
      network: "Liquid Network",
      paymentTrigger: "Released May 23",
      wallet: "lq1q...7d90",
    },
    activity: [
      { time: "May 08, 10:20 UTC", title: "Deal created", detail: "Escrow structured by Trafigura", tone: "neutral" },
      { time: "May 09, 07:15 UTC", title: "Party A funded escrow", detail: "0.62 L-BTC locked on Liquid", tone: "green" },
      { time: "May 16, 09:11 UTC", title: "BL verified by zkPass", detail: "Bill of lading attested via Bolero", tone: "green" },
      { time: "May 21, 08:20 UTC", title: "Vessel arrived Rotterdam", detail: "AIS confirmed berthing", tone: "blue" },
      { time: "May 21, 11:48 UTC", title: "CoQ verified by zkPass", detail: "Quantity attested via Bureau Veritas", tone: "green" },
      { time: "May 23, 13:02 UTC", title: "Settlement confirmed", detail: "0.62 L-BTC released to seller", tone: "green" },
    ],
  },
  {
    id: "SP-2845",
    counterparty: "Gunvor",
    cargo: "Gasoline 30,000 MT",
    vesselName: "PACIFIC DAWN",
    imo: "9284731",
    route: "Singapore → Rotterdam",
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
        platform: "essDOCS",
        note: "BL not yet issued by carrier",
      },
      {
        name: "Certificate of Quality",
        status: "failed",
        source: "Intertek portal",
        platform: "Intertek",
        note: "Sampling mismatch — re-test requested",
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
      source: "Datalastic",
    },
    settlement: {
      amount: "0.37 L-BTC",
      network: "Liquid Network",
      paymentTrigger: "On hold",
      wallet: "lq1q...3c1e",
    },
    activity: [
      { time: "May 12, 14:40 UTC", title: "Deal created", detail: "Escrow structured by Gunvor", tone: "neutral" },
      { time: "May 12, 16:22 UTC", title: "Party A funded escrow", detail: "0.37 L-BTC locked on Liquid", tone: "green" },
      { time: "May 19, 10:05 UTC", title: "Inspection failed", detail: "Intertek sampling mismatch flagged", tone: "red" },
      { time: "May 20, 09:30 UTC", title: "Vessel held at anchorage", detail: "Departure on hold pending re-test", tone: "amber" },
    ],
  },
  {
    id: "SP-2844",
    counterparty: "Shell Trading",
    cargo: "LPG 20,000 MT",
    vesselName: "ARCTIC GAS",
    imo: "9391024",
    route: "Mongstad → Rotterdam",
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
        platform: "Bolero",
        timestamp: "May 22, 16:05 UTC",
        proof: "0x1f8a...d34c",
        proofFull: "0x1f8a3c0b97e2d4516a8f0c93b2e7d401f6c98a25b4e703d8c1f96a02e4b7d34c",
      },
      {
        name: "Certificate of Quality",
        status: "verified",
        source: "Intertek · May 22, 18:40",
        platform: "Intertek",
        timestamp: "May 22, 18:40 UTC",
        proof: "0xab02...9f57",
        proofFull: "0xab02d4c19f3e7b6285a0c14d93f8b275e6019cad4b27039f8c1e6a05d4b29f57",
      },
      {
        name: "e-BDN",
        status: "verified",
        source: "VesselChain · May 23, 07:12",
        platform: "VesselChain",
        timestamp: "May 23, 07:12 UTC",
        proof: "0x77c4...e0b8",
        proofFull: "0x77c4e0b913a8d2056f4c1097b2e6d840f3c95a26b4e7081d9c5f6a3024be40b8",
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
      source: "VesselAPI",
    },
    settlement: {
      amount: "0.25 L-BTC",
      network: "Liquid Network",
      paymentTrigger: "May 30",
      wallet: "lq1q...b6f8",
    },
    activity: [
      { time: "May 20, 08:00 UTC", title: "Deal created", detail: "Escrow structured by Shell Trading", tone: "neutral" },
      { time: "May 20, 10:11 UTC", title: "Party A funded escrow", detail: "0.25 L-BTC locked on Liquid", tone: "green" },
      { time: "May 22, 16:05 UTC", title: "BL verified by zkPass", detail: "Bill of lading attested via Bolero", tone: "green" },
      { time: "May 23, 07:12 UTC", title: "e-BDN verified", detail: "Bunker delivery note via VesselChain", tone: "green" },
      { time: "May 23, 09:40 UTC", title: "Vessel departed Mongstad", detail: "AIS confirmed departure", tone: "blue" },
    ],
  },
];

// Historical / settled deals — added to the /deals list for visual weight.
// Fully deep-linkable via getDeal(id).
export const historicalDeals: Deal[] = [
  {
    id: "SP-2843",
    counterparty: "Mercuria",
    cargo: "Diesel 40,000 MT",
    vesselName: "BALTIC TRADER",
    imo: "9265118",
    route: "Rotterdam → New York",
    etaCell: { label: "Arrived May 12" },
    documentsCell: { label: "All verified", tone: "green" },
    paymentCell: { label: "Settled May 14" },
    statusCell: { label: "Settled", tone: "green" },
    escrowLbtc: "0.48 L-BTC",
    escrowUsd: "$4.8M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "done" },
      { label: "Inspection verified", state: "done" },
      { label: "Vessel departed", state: "done" },
      { label: "Vessel arrived", state: "done" },
      { label: "Settled", state: "done" },
    ],
    documents: [
      { name: "Bill of lading", status: "verified", source: "CargoDocs · May 02, 10:00", platform: "CargoDocs", timestamp: "May 02, 10:00 UTC", proof: "0x5b21...c7f0", proofFull: "0x5b21e8a09c4d7f3265b1098ad2e7c401f693a25c4b7e08d1f9c6a30b24e7c7f0" },
      { name: "Certificate of Quantity", status: "verified", source: "SGS · May 11, 09:20", platform: "SGS", timestamp: "May 11, 09:20 UTC", proof: "0x88aa...12bd", proofFull: "0x88aa3c1d9e4b7026f8a0c194d2e7b835f60a9c25b4d7039e8c1f6a05b2e412bd" },
    ],
    tracking: { vessel: "BALTIC TRADER", imo: "9265118", position: "Berthed — New York", speed: "0.0 kn", lastPort: "Rotterdam (May 02)", destination: "New York", eta: "Arrived May 12, 14:00 UTC", source: "VesselAPI" },
    settlement: { amount: "0.48 L-BTC", network: "Liquid Network", paymentTrigger: "Released May 14", wallet: "lq1q...9e21" },
    activity: [
      { time: "Apr 30, 09:00 UTC", title: "Deal created", tone: "neutral" },
      { time: "May 02, 10:00 UTC", title: "BL verified by zkPass", detail: "via CargoDocs", tone: "green" },
      { time: "May 12, 14:00 UTC", title: "Vessel arrived New York", tone: "blue" },
      { time: "May 14, 11:30 UTC", title: "Settlement confirmed", detail: "0.48 L-BTC released", tone: "green" },
    ],
  },
  {
    id: "SP-2842",
    counterparty: "Glencore",
    cargo: "Naphtha 35,000 MT",
    vesselName: "IBERIAN STAR",
    imo: "9302947",
    route: "Algeciras → Houston",
    etaCell: { label: "Arrived May 09" },
    documentsCell: { label: "All verified", tone: "green" },
    paymentCell: { label: "Settled May 10" },
    statusCell: { label: "Settled", tone: "green" },
    escrowLbtc: "0.54 L-BTC",
    escrowUsd: "$5.4M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "done" },
      { label: "Inspection verified", state: "done" },
      { label: "Vessel departed", state: "done" },
      { label: "Vessel arrived", state: "done" },
      { label: "Settled", state: "done" },
    ],
    documents: [
      { name: "Bill of lading", status: "verified", source: "essDOCS · Apr 26, 12:15", platform: "essDOCS", timestamp: "Apr 26, 12:15 UTC", proof: "0x2d77...9a04", proofFull: "0x2d77a9041c3e8b5206f4a019d2e7c835b690a25c4b7e039d8f1c6a02b4e79a04" },
      { name: "Certificate of Quality", status: "verified", source: "Bureau Veritas · May 08, 16:40", platform: "Bureau Veritas", timestamp: "May 08, 16:40 UTC", proof: "0xc419...e6d2", proofFull: "0xc4193e8a0d2c7b5046f9a013d4e7b820f561a9c25b4d7038e9c1f6a05b2e4e6d2" },
    ],
    tracking: { vessel: "IBERIAN STAR", imo: "9302947", position: "Berthed — Houston", speed: "0.0 kn", lastPort: "Algeciras (Apr 26)", destination: "Houston", eta: "Arrived May 09, 06:10 UTC", source: "Datalastic" },
    settlement: { amount: "0.54 L-BTC", network: "Liquid Network", paymentTrigger: "Released May 10", wallet: "lq1q...4ab7" },
    activity: [
      { time: "Apr 24, 11:00 UTC", title: "Deal created", tone: "neutral" },
      { time: "Apr 26, 12:15 UTC", title: "BL verified by zkPass", detail: "via essDOCS", tone: "green" },
      { time: "May 09, 06:10 UTC", title: "Vessel arrived Houston", tone: "blue" },
      { time: "May 10, 15:00 UTC", title: "Settlement confirmed", detail: "0.54 L-BTC released", tone: "green" },
    ],
  },
  {
    id: "SP-2841",
    counterparty: "BP Trading",
    cargo: "Jet fuel 25,000 MT",
    vesselName: "NORTHERN LIGHT",
    imo: "9418772",
    route: "Sullom Voe → Hamburg",
    etaCell: { label: "Arrived May 04" },
    documentsCell: { label: "All verified", tone: "green" },
    paymentCell: { label: "Settled May 05" },
    statusCell: { label: "Settled", tone: "green" },
    escrowLbtc: "0.31 L-BTC",
    escrowUsd: "$3.1M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "done" },
      { label: "Inspection verified", state: "done" },
      { label: "Vessel departed", state: "done" },
      { label: "Vessel arrived", state: "done" },
      { label: "Settled", state: "done" },
    ],
    documents: [
      { name: "Bill of lading", status: "verified", source: "Bolero · Apr 28, 08:55", platform: "Bolero", timestamp: "Apr 28, 08:55 UTC", proof: "0x6f30...b1c9", proofFull: "0x6f30b1c9a2e4d7508f6a0193c2e7b840f561a9c25b4d7039e8c1f6a02b4e7b1c9" },
      { name: "Notice of Readiness", status: "verified", source: "CargoDocs · May 03, 22:10", platform: "CargoDocs", timestamp: "May 03, 22:10 UTC", proof: "0x09e2...77af", proofFull: "0x09e277af3c1d9e4b8025f6a0193d2e7c840b561a9c25b4d7039e8c1f6a05b277af" },
    ],
    tracking: { vessel: "NORTHERN LIGHT", imo: "9418772", position: "Berthed — Hamburg", speed: "0.0 kn", lastPort: "Sullom Voe (Apr 28)", destination: "Hamburg", eta: "Arrived May 04, 19:30 UTC", source: "VesselAPI" },
    settlement: { amount: "0.31 L-BTC", network: "Liquid Network", paymentTrigger: "Released May 05", wallet: "lq1q...d018" },
    activity: [
      { time: "Apr 26, 10:00 UTC", title: "Deal created", tone: "neutral" },
      { time: "Apr 28, 08:55 UTC", title: "BL verified by zkPass", detail: "via Bolero", tone: "green" },
      { time: "May 04, 19:30 UTC", title: "Vessel arrived Hamburg", tone: "blue" },
      { time: "May 05, 09:00 UTC", title: "Settlement confirmed", detail: "0.31 L-BTC released", tone: "green" },
    ],
  },
  {
    id: "SP-2840",
    counterparty: "Koch Supply",
    cargo: "Crude oil 80,000 MT",
    vesselName: "GULF SOVEREIGN",
    imo: "9377155",
    route: "Ras Tanura → Singapore",
    etaCell: { label: "Arrived Apr 29" },
    documentsCell: { label: "All verified", tone: "green" },
    paymentCell: { label: "Settled May 01" },
    statusCell: { label: "Settled", tone: "green" },
    escrowLbtc: "0.97 L-BTC",
    escrowUsd: "$9.7M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "done" },
      { label: "Inspection verified", state: "done" },
      { label: "Vessel departed", state: "done" },
      { label: "Vessel arrived", state: "done" },
      { label: "Settled", state: "done" },
    ],
    documents: [
      { name: "Bill of lading", status: "verified", source: "essDOCS · Apr 14, 06:30", platform: "essDOCS", timestamp: "Apr 14, 06:30 UTC", proof: "0xa7c1...3f88", proofFull: "0xa7c13f88e2d4b7506f9a0193c2e7b840f561a9c25b4d7039e8c1f6a02b4e73f88" },
      { name: "Certificate of Quantity", status: "verified", source: "SGS · Apr 28, 14:00", platform: "SGS", timestamp: "Apr 28, 14:00 UTC", proof: "0x33de...9c10", proofFull: "0x33de9c10a2e4d7b5086f0a193c2e7b840f561a9c25b4d7039e8c1f6a05b2e9c10" },
    ],
    tracking: { vessel: "GULF SOVEREIGN", imo: "9377155", position: "Berthed — Singapore", speed: "0.0 kn", lastPort: "Ras Tanura (Apr 14)", destination: "Singapore", eta: "Arrived Apr 29, 03:45 UTC", source: "Datalastic" },
    settlement: { amount: "0.97 L-BTC", network: "Liquid Network", paymentTrigger: "Released May 01", wallet: "lq1q...c552" },
    activity: [
      { time: "Apr 12, 08:00 UTC", title: "Deal created", tone: "neutral" },
      { time: "Apr 14, 06:30 UTC", title: "BL verified by zkPass", detail: "via essDOCS", tone: "green" },
      { time: "Apr 29, 03:45 UTC", title: "Vessel arrived Singapore", tone: "blue" },
      { time: "May 01, 12:00 UTC", title: "Settlement confirmed", detail: "0.97 L-BTC released", tone: "green" },
    ],
  },
  {
    id: "SP-2839",
    counterparty: "PetroChina Intl",
    cargo: "Fuel oil 60,000 MT",
    vesselName: "ORIENT PHOENIX",
    imo: "9288014",
    route: "Zhoushan → Yokohama",
    etaCell: { label: "Arrived Apr 22" },
    documentsCell: { label: "All verified", tone: "green" },
    paymentCell: { label: "Settled Apr 24" },
    statusCell: { label: "Settled", tone: "green" },
    escrowLbtc: "0.73 L-BTC",
    escrowUsd: "$7.3M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "done" },
      { label: "Inspection verified", state: "done" },
      { label: "Vessel departed", state: "done" },
      { label: "Vessel arrived", state: "done" },
      { label: "Settled", state: "done" },
    ],
    documents: [
      { name: "Bill of lading", status: "verified", source: "CargoDocs · Apr 10, 11:20", platform: "CargoDocs", timestamp: "Apr 10, 11:20 UTC", proof: "0x4e88...a2f1", proofFull: "0x4e88a2f1c3e9d4b7026f8a0193d2e7c840b561a9c25b4d7039e8c1f6a05b2a2f1" },
      { name: "Certificate of Quality", status: "verified", source: "Intertek · Apr 21, 09:00", platform: "Intertek", timestamp: "Apr 21, 09:00 UTC", proof: "0xb902...7d44", proofFull: "0xb9027d44e2c3d9b4086f0a193c2e7b840f561a9c25b4d7039e8c1f6a05b2e7d44" },
    ],
    tracking: { vessel: "ORIENT PHOENIX", imo: "9288014", position: "Berthed — Yokohama", speed: "0.0 kn", lastPort: "Zhoushan (Apr 10)", destination: "Yokohama", eta: "Arrived Apr 22, 22:15 UTC", source: "VesselAPI" },
    settlement: { amount: "0.73 L-BTC", network: "Liquid Network", paymentTrigger: "Released Apr 24", wallet: "lq1q...1f6e" },
    activity: [
      { time: "Apr 08, 07:30 UTC", title: "Deal created", tone: "neutral" },
      { time: "Apr 10, 11:20 UTC", title: "BL verified by zkPass", detail: "via CargoDocs", tone: "green" },
      { time: "Apr 22, 22:15 UTC", title: "Vessel arrived Yokohama", tone: "blue" },
      { time: "Apr 24, 10:00 UTC", title: "Settlement confirmed", detail: "0.73 L-BTC released", tone: "green" },
    ],
  },
  {
    id: "SP-2838",
    counterparty: "Equinor ASA",
    cargo: "Crude oil 90,000 MT",
    vesselName: "FJORD MONARCH",
    imo: "9455031",
    route: "Mongstad → Rotterdam",
    etaCell: { label: "Cancelled Apr 18", danger: true },
    documentsCell: { label: "Voided", tone: "neutral" },
    paymentCell: { label: "Refunded" },
    statusCell: { label: "Cancelled", tone: "neutral" },
    escrowLbtc: "1.10 L-BTC",
    escrowUsd: "$11.0M",
    progress: [
      { label: "Contract committed", state: "done" },
      { label: "BL verified", state: "pending" },
      { label: "Inspection verified", state: "pending" },
      { label: "Vessel departed", state: "pending" },
      { label: "Vessel arrived", state: "pending" },
      { label: "Settled", state: "pending" },
    ],
    documents: [
      { name: "Bill of lading", status: "failed", source: "essDOCS", platform: "essDOCS", note: "Contract cancelled before issuance" },
    ],
    tracking: { vessel: "FJORD MONARCH", imo: "9455031", position: "Berthed — Mongstad", speed: "0.0 kn", lastPort: "Mongstad", destination: "Rotterdam", eta: "Cancelled", source: "Datalastic" },
    settlement: { amount: "1.10 L-BTC", network: "Liquid Network", paymentTrigger: "Refunded Apr 18", wallet: "lq1q...0b3d" },
    activity: [
      { time: "Apr 15, 09:00 UTC", title: "Deal created", tone: "neutral" },
      { time: "Apr 15, 10:30 UTC", title: "Party A funded escrow", detail: "1.10 L-BTC locked on Liquid", tone: "green" },
      { time: "Apr 18, 13:20 UTC", title: "Deal cancelled", detail: "Counterparty withdrew — escrow refunded", tone: "red" },
    ],
  },
];

export const allDeals: Deal[] = [...deals, ...historicalDeals];

export function getDeal(id: string): Deal | undefined {
  return allDeals.find((d) => d.id === id);
}

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

// Filter pills for the /deals list (visual only — do not actually filter).
export const dealFilters = [
  "All",
  "In transit",
  "Settled",
  "Alert",
  "Awaiting docs",
];
