// ============================================================
// Emergency and disaster contacts — single source of truth.
// Used by the Climate Watch directory (app/(frontend)/weather) and the
// Climate AI knowledge base, so the two can never disagree.
// Labels shown on the site live in messages under weatherPage.<key>.
// ============================================================

export type EmergencyContact = {
  key: "ndoc" | "redCrossAmb" | "ndmu" | "kmd";
  /** English name, used by the Climate AI context */
  name: string;
  /** dial string for tel: links */
  tel: string;
  /** main number as displayed */
  number: string;
  /** message key + value for the second line */
  main: "tollFree" | null;
  sub: "landline" | "rescue247" | "mobile" | "advisories";
  subNumber?: string;
  hot: boolean;
};

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { key: "ndoc", name: "National Disaster Operations Centre (NDOC)", tel: "0800721570", main: "tollFree", number: "0800 721 570", sub: "landline", subNumber: "020 221 2386", hot: false },
  { key: "redCrossAmb", name: "Kenya Red Cross (ambulance, rescue)", tel: "1199", main: "tollFree", number: "1199", sub: "rescue247", hot: true },
  { key: "ndmu", name: "National Disaster Management Unit (NDMU)", tel: "0203871851", main: null, number: "020 387 1851", sub: "mobile", subNumber: "0722 519 288", hot: false },
  { key: "kmd", name: "Kenya Meteorological Department (KMD)", tel: "0203867880", main: null, number: "020 386 7880", sub: "advisories", hot: false },
];

/** Plain-text list for the Climate AI context. */
export function emergencyContactsText() {
  return EMERGENCY_CONTACTS.map((c) => `- ${c.name}: ${c.number}${c.subNumber ? ` (also ${c.subNumber})` : ""}${c.main === "tollFree" ? " — toll-free" : ""}`).join("\n");
}
