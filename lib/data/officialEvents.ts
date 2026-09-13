// ============================================================
// Official 2026 Climate Events Dataset — Kenya Youth Climate Hub
// Source: Calender of Events.docx
// ============================================================

export type OfficialEvent = {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD for sorting/calendar links
  endDate: string;   // YYYY-MM-DD
  dateDisplay: string;
  month: "September" | "October" | "November";
  description: string;
  location: string;
  region: "Kenya" | "Africa / Regional" | "Global";
  format: "In-person" | "Online" | "Hybrid";
  sdgs: string[];
  eventType: string;
  organizer: string;
  link?: string;
};

export const OFFICIAL_EVENTS_2026: OfficialEvent[] = [
  {
    id: "evt-01",
    title: "UNEP Regional Consultative Meeting",
    startDate: "2026-09-16",
    endDate: "2026-09-18",
    dateDisplay: "16th – 18th Sept 2026",
    month: "September",
    description: "Regional consultation gathering UNEP Major Groups, stakeholders, and youth representatives across Africa to prepare key inputs on environmental governance, climate adaptation, and biodiversity ahead of global forums.",
    location: "Addis Ababa, Ethiopia",
    region: "Africa / Regional",
    format: "Hybrid",
    sdgs: ["SDG 13: Climate Action", "SDG 17: Partnerships"],
    eventType: "Consultative Meeting",
    organizer: "UN Environment Programme (UNEP)",
    link: "https://www.unep.org/events"
  },
  {
    id: "evt-02",
    title: "World Clean-up Day 2026",
    startDate: "2026-09-20",
    endDate: "2026-09-20",
    dateDisplay: "20th Sept 2026",
    month: "September",
    description: "A major global civic movement uniting millions of volunteers across 190+ countries, including youth groups across Kenya's 47 counties, for massive waste management and environmental restoration drives.",
    location: "Nationwide & Global",
    region: "Kenya",
    format: "In-person",
    sdgs: ["SDG 13: Climate Action", "SDG 15: Life on Land", "SDG 11: Sustainable Cities"],
    eventType: "Global Action Day",
    organizer: "Let's Do It World & KYCH Partners",
    link: "https://www.worldcleanupday.org"
  },
  {
    id: "evt-03",
    title: "Pre-COP 31 High-Level Summit",
    startDate: "2026-10-05",
    endDate: "2026-10-08",
    dateDisplay: "5th – 8th Oct 2026",
    month: "October",
    description: "Preparatory ministerial and stakeholder gathering setting the strategic agenda, youth position papers, and key negotiation priorities prior to the official UN Climate Change Conference (COP31).",
    location: "International / Regional",
    region: "Global",
    format: "Hybrid",
    sdgs: ["SDG 13: Climate Action", "SDG 17: Partnerships"],
    eventType: "High-Level Summit",
    organizer: "UNFCCC Secretariat & Host Nation",
    link: "https://unfccc.int"
  },
  {
    id: "evt-04",
    title: "Mazingira Day (Kenya National Climate Day)",
    startDate: "2026-10-10",
    endDate: "2026-10-10",
    dateDisplay: "10th Oct 2026",
    month: "October",
    description: "Kenya's official national public holiday dedicated to environmental conservation, tree planting, climate awareness campaigns, and youth-led community ecological restoration across all 47 counties.",
    location: "Kenya (All 47 Counties)",
    region: "Kenya",
    format: "In-person",
    sdgs: ["SDG 13: Climate Action", "SDG 15: Life on Land"],
    eventType: "National Holiday",
    organizer: "Ministry of Environment & Climate Change / AFOSI / KYCH",
    link: "https://kenyayouthclimatehub.org/events"
  },
  {
    id: "evt-05",
    title: "UN Youth Climate Delegate Program – COP31",
    startDate: "2026-10-12",
    endDate: "2026-10-12",
    dateDisplay: "12th Oct 2026",
    month: "October",
    description: "Specialized youth capacity-building workshop and delegation orientation empowering young climate negotiators from Kenya and developing nations to participate meaningfully in intergovernmental COP proceedings.",
    location: "Virtual / Online Platform",
    region: "Global",
    format: "Online",
    sdgs: ["SDG 13: Climate Action", "SDG 4: Quality Education", "SDG 10: Reduced Inequalities"],
    eventType: "Youth Delegate Call",
    organizer: "UN Youth Office & YOUNGO",
    link: "https://unfccc.int/youngo"
  },
  {
    id: "evt-06",
    title: "International Day for Disaster Risk Reduction",
    startDate: "2026-10-13",
    endDate: "2026-10-13",
    dateDisplay: "13th Oct 2026",
    month: "October",
    description: "Global awareness day highlighting youth-led climate adaptation techniques, early-warning flood/drought systems, and community resilience building in climate frontline communities across Kenya.",
    location: "Global / Kenya",
    region: "Kenya",
    format: "Hybrid",
    sdgs: ["SDG 13: Climate Action", "SDG 11: Sustainable Cities"],
    eventType: "Global Observance",
    organizer: "UNDRR & AFOSI",
    link: "https://www.undrr.org"
  },
  {
    id: "evt-07",
    title: "CBD COP17 – UN Biodiversity Conference",
    startDate: "2026-10-19",
    endDate: "2026-10-30",
    dateDisplay: "19th – 30th Oct 2026",
    month: "October",
    description: "The 17th Conference of the Parties to the UN Convention on Biological Diversity (CBD) addressing global biodiversity frameworks, ecosystem restoration, indigenous rights, and nature-based solutions.",
    location: "Armenia",
    region: "Global",
    format: "Hybrid",
    sdgs: ["SDG 13: Climate Action", "SDG 14: Life Below Water", "SDG 15: Life on Land"],
    eventType: "UN Summit",
    organizer: "UN Convention on Biological Diversity",
    link: "https://www.cbd.int"
  },
  {
    id: "evt-08",
    title: "International Day of Climate Action",
    startDate: "2026-10-24",
    endDate: "2026-10-24",
    dateDisplay: "24th Oct 2026",
    month: "October",
    description: "A worldwide day of grassroots climate activism, youth rallies, policy dialogues, and renewable energy exhibitions mobilizing young climate champions across East Africa.",
    location: "Global & Kenya",
    region: "Kenya",
    format: "In-person",
    sdgs: ["SDG 13: Climate Action", "SDG 17: Partnerships"],
    eventType: "Global Action Day",
    organizer: "Global Climate Movement & KYCH",
    link: "https://kenyayouthclimatehub.org/events"
  },
  {
    id: "evt-09",
    title: "Montreal Protocol MOP38 Conference",
    startDate: "2026-11-02",
    endDate: "2026-11-06",
    dateDisplay: "2nd – 6th Nov 2026",
    month: "November",
    description: "38th Meeting of the Parties to the Montreal Protocol focused on ozone layer protection, phasing down hydrofluorocarbons (HFCs), and advancing sustainable cooling technologies in developing countries.",
    location: "International",
    region: "Global",
    format: "Hybrid",
    sdgs: ["SDG 13: Climate Action", "SDG 12: Responsible Consumption"],
    eventType: "Policy Conference",
    organizer: "UNEP Ozone Secretariat",
    link: "https://ozone.unep.org"
  },
  {
    id: "evt-10",
    title: "COP31 – UN Climate Change Conference",
    startDate: "2026-11-09",
    endDate: "2026-11-20",
    dateDisplay: "9th – 20th Nov 2026",
    month: "November",
    description: "The world's premier climate conference gathering world leaders, youth delegations, scientists, and civil society to advance global climate finance targets, loss & damage mechanisms, and NDCs under the Paris Agreement.",
    location: "Türkiye",
    region: "Global",
    format: "Hybrid",
    sdgs: ["SDG 13: Climate Action", "SDG 17: Partnerships"],
    eventType: "UN Global Summit",
    organizer: "UNFCCC & Government of Türkiye",
    link: "https://unfccc.int/cop31"
  }
];

// Helper: Generate a direct "Add to Google Calendar" link for any event
export function getGoogleCalendarUrl(event: OfficialEvent): string {
  const formatGCalDate = (dateStr: string) => dateStr.replace(/-/g, "");
  const start = `${formatGCalDate(event.startDate)}T060000Z`;
  const end = `${formatGCalDate(event.endDate)}T140000Z`;
  
  const details = encodeURIComponent(`${event.description}\n\nOrganized by: ${event.organizer}\nVia Kenya Youth Climate Hub (KYCH)`);
  const title = encodeURIComponent(event.title);
  const location = encodeURIComponent(event.location);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}
