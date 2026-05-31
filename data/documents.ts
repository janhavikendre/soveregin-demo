// Hardcoded uploaded-documents list for /documents. No backend — the upload
// flow is a fake progress animation that ends in a verified state.

export type DocStatus = "verified" | "pending" | "failed";

export interface UploadedDoc {
  id: string;
  name: string; // "Bill of Lading"
  fileName: string; // "BL-NordicEagle-May20.pdf"
  status: DocStatus;
  platform: string; // issuing platform, e.g. "essDOCS"
  proof?: string; // zk proof hash for verified docs
  timestamp: string; // relative-ish label, e.g. "May 20, 14:32"
  deal: string; // linked deal ref, e.g. "SP-2847"
  note?: string; // for pending/failed
}

export const uploadedDocs: UploadedDoc[] = [
  {
    id: "DOC-5012",
    name: "Bill of Lading",
    fileName: "BL-NordicEagle-May20.pdf",
    status: "verified",
    platform: "essDOCS",
    proof: "0xa1b2...c9d0",
    timestamp: "May 20, 14:32",
    deal: "SP-2847",
  },
  {
    id: "DOC-5011",
    name: "Certificate of Quantity",
    fileName: "CoQ-SGS-SP2847.pdf",
    status: "pending",
    platform: "SGS",
    timestamp: "May 22, 08:14",
    deal: "SP-2847",
    note: "Awaiting inspector counter-signature",
  },
  {
    id: "DOC-5008",
    name: "e-BDN",
    fileName: "eBDN-ArcticGas-May23.pdf",
    status: "verified",
    platform: "VesselChain",
    proof: "0x77c4...e0b8",
    timestamp: "May 23, 07:12",
    deal: "SP-2844",
  },
  {
    id: "DOC-5004",
    name: "Certificate of Quality",
    fileName: "CoQ-Intertek-PacificDawn.pdf",
    status: "failed",
    platform: "Intertek",
    timestamp: "May 19, 10:05",
    deal: "SP-2845",
    note: "Sampling mismatch — hash did not match issuer record",
  },
  {
    id: "DOC-4999",
    name: "Bill of Lading",
    fileName: "BL-EasternMariner-May16.pdf",
    status: "verified",
    platform: "Bolero",
    proof: "0x9c12...7be4",
    timestamp: "May 16, 09:11",
    deal: "SP-2846",
  },
  {
    id: "DOC-4990",
    name: "Notice of Readiness",
    fileName: "NOR-NorthernLight-May03.pdf",
    status: "verified",
    platform: "CargoDocs",
    proof: "0x09e2...77af",
    timestamp: "May 03, 22:10",
    deal: "SP-2841",
  },
];

// Fake files offered in the "Pick demo file" modal on /documents.
export interface DemoFile {
  fileName: string;
  docType: string; // "Bill of Lading"
  platform: string; // "essDOCS"
}

export const demoFiles: DemoFile[] = [
  { fileName: "BL-NordicEagle-May20.pdf", docType: "Bill of Lading", platform: "essDOCS" },
  { fileName: "CoQ-SGS-SP2847.pdf", docType: "Certificate of Quantity", platform: "SGS" },
  { fileName: "NOR-NordicEagle-May24.pdf", docType: "Notice of Readiness", platform: "CargoDocs" },
  { fileName: "eBDN-ArcticGas-May23.pdf", docType: "e-BDN", platform: "VesselChain" },
];
