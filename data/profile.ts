// Hardcoded account data for /profile. Toggles, copy buttons, and edit
// buttons are visual only — nothing persists.

export interface TeamMember {
  name: string;
  email: string;
  role: "Admin" | "Trader" | "Viewer";
  initials: string;
}

export interface NotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export const company = {
  name: "Vitol SA",
  jurisdiction: "Geneva, Switzerland",
  kyb: "Verified · KYB via ACRA",
  registered: "CHE-105.962.131",
  screening: "OFAC · cleared May 12",
};

export const wallet = {
  provider: "Blockstream Green",
  address: "lq1qx9f2d7m4k0p8s6v3t1z5w9b2n7c4a8z2k",
  addressShort: "lq1qx...8z2k",
  balanceLbtc: "2.84 L-BTC",
  balanceUsd: "$28.4K",
};

export const team: TeamMember[] = [
  { name: "Didrik Hagen", email: "didrik@vitol.com", role: "Admin", initials: "DH" },
  { name: "Lena Fischer", email: "lena.fischer@vitol.com", role: "Trader", initials: "LF" },
  { name: "Marcus Cole", email: "m.cole@vitol.com", role: "Viewer", initials: "MC" },
];

export const notifications: NotificationPref[] = [
  { id: "deal", label: "Deal updates", description: "Status changes on any active deal", enabled: true },
  { id: "doc", label: "Document verification", description: "When a document is verified or fails via zkPass", enabled: true },
  { id: "settle", label: "Settlement triggers", description: "When a settlement transaction broadcasts", enabled: true },
  { id: "ais", label: "AIS alerts", description: "Vessel deviation, delay, or arrival events", enabled: false },
];

export const apiKey = "sk-sov-demo-9f24c0b7e1a8d3f6";
