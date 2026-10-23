// ============================================================
// KYCH knowledge base for the Climate AI.
// Static facts about the platform; live data (funding calls, events,
// county forecasts) is added per question in lib/rag/liveContext.ts.
// Keep this in step with what the site actually offers.
// ============================================================
import { emergencyContactsText } from "@/lib/data/emergencyContacts";

export interface KnowledgeChunk {
  id: string;
  category: "ycic" | "begreen" | "opportunities" | "programs" | "library" | "weather" | "events" | "about" | "contact" | "stories";
  title: string;
  /** English, Kiswahili and French keywords, so questions in any site language match */
  tags: string[];
  content: string;
  url?: string;
}

export const KYCH_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "ycic-overview",
    category: "ycic",
    title: "Youth Climate Innovation Challenge (YCIC) 2025 — concluded",
    tags: ["ycic", "challenge", "innovation", "incubation", "startup", "flarehub", "yoma", "pitch", "prize", "shindano", "ubunifu", "défi", "concours", "incubateur"],
    url: "/programs/ycic",
    content: `
STATUS: the 2025 cycle has concluded. Applications closed on 9 June 2025; the shortlist was announced 23 June 2025; pitch day was 23 July 2025 at KICC, Nairobi. Applications are NOT open now.
- What it was: an incubator and competition for young Kenyans (18–35, individuals or teams of up to 4, with a yoma.world profile) building climate solutions for informal settlements.
- Focus areas: water, sanitation and hygiene (WASH); flood resilience and urban drainage; renewable energy and sustainable infrastructure.
- Support: KES 500,000 prize pool, 6 months of mentorship, incubation, and a showcase at the Climate Innovation Summit.
- Partners: KYCH with Flarehub and Yoma.
- Founders backed include CarBIO (biogas for dairy farmers), Darubini ya Afya (incinerator emissions scrubber), Veeklture (reusable cloth diapers, Kibera), Greenium Energy and Touché by Kami. Their stories are at /success-stories.
- Next cycles are announced on the funding board (/opportunities).
    `.trim(),
  },
  {
    id: "begreen",
    category: "begreen",
    title: "BeGreen Africa Initiative — Kenya pilot (Nov 2023 – Jul 2025)",
    tags: ["begreen", "waste", "recycling", "plastic", "e-waste", "biogas", "unicef", "generation unlimited", "tony elumelu", "ikea", "taka", "déchets", "recyclage"],
    url: "/programs/begreen",
    content: `
A green entrepreneurship programme in waste management for youth aged 18–35, run by UNICEF/Generation Unlimited, the Tony Elumelu Foundation and the IKEA Foundation, with incubation by STEM Impact Center Kenya.
- Funnel: 2,264 applied; 502 completed business and green entrepreneurship training; 320 business plans; 207 pitched (Nairobi, Kisumu, Mombasa); 146 received grants up to USD 5,000; 112 got USD 1,000–3,000 acceleration funds.
- Results: 846 jobs (vs 260 projected), ~7x revenue growth, 29.9 million kg of waste managed; mentored enterprises created 531 jobs vs 104 without mentorship; 74–90% of participants were from marginalised groups.
    `.trim(),
  },
  {
    id: "opportunities-board",
    category: "opportunities",
    title: "Funding board (grants, fellowships, internships, jobs, competitions)",
    tags: ["grant", "grants", "funding", "fellowship", "internship", "job", "competition", "accelerator", "deadline", "money", "ufadhili", "ruzuku", "ushirika", "ajira", "financement", "subvention", "bourse", "stage", "emploi"],
    url: "/opportunities",
    content: `
The funding board at /opportunities lists grants, fellowships, internships, jobs and competitions collected every day from Kenyan, African and global sources.
- Calls closing in the next 14 days are pinned at the top; each card shows its deadline.
- Filter by type and topic, or search by title or organisation. Each card links to the original call.
- Tips: check eligibility and deadline first, match the funder's themes, and show local community impact.
    `.trim(),
  },
  {
    id: "kych-five-pillars",
    category: "programs",
    title: "KYCH's five pillars",
    tags: ["programs", "programmes", "pillars", "leadership", "advocacy", "innovation", "finance", "capacity", "partnerships", "programu", "nguzo", "piliers"],
    url: "/programs",
    content: `
1. Youth Climate Leadership & Advocacy — training climate negotiators, county advocates and movement leaders.
2. Climate Innovation & Entrepreneurship — incubating youth-led green startups (YCIC).
3. Climate Finance & Opportunity Access — connecting young people to grants, fellowships, competitions and jobs.
4. Capacity Building & Knowledge — skills, data and tools through trainings and digital resources.
5. Partnerships & Ecosystem Building — linking youth, government, NGOs, development partners and the private sector.
Programmes so far: YCIC (/programs/ycic) and BeGreen Africa (/programs/begreen).
    `.trim(),
  },
  {
    id: "elibrary-overview",
    category: "library",
    title: "E-Library: tools and resource cabinet",
    tags: ["library", "e-library", "resources", "toolkit", "dataset", "report", "ai tool", "calculator", "quiz", "carbon footprint", "maktaba", "rasilimali", "kikokotoo", "bibliothèque", "ressources", "outil", "calculateur"],
    url: "/e-library",
    content: `
The E-Library at /e-library has two tools and a resource cabinet.
- Carbon Footprint Calculator: 4 questions (transport, energy, food, waste) with Kenya-specific emission factors; compares you with the Kenya (0.4 t), Africa (1.0 t) and world (4.7 t) averages.
- Climate Readiness Quiz: 8 questions on Kenya's climate policy, finance and science, 4 badge tiers.
- Resource cabinet: toolkits, datasets, AI tools, reports and calculators from climate organisations, filed by type; each opens on the publisher's site. Most are free.
    `.trim(),
  },
  {
    id: "climate-watch-weather",
    category: "weather",
    title: "Climate Watch: weather, flood risk and El Niño checklist",
    tags: ["weather", "climate watch", "county", "counties", "flood", "rain", "forecast", "drought", "el nino", "emergency", "hali ya hewa", "kaunti", "mafuriko", "mvua", "utabiri", "météo", "comté", "inondation", "pluie", "prévision", "urgence"],
    url: "/weather",
    content: `
Climate Watch at /weather has a real map of Kenya's 47 counties coloured by flood risk. Tap a county (or use "Find my county") to see today's weather, a time-of-day forecast, the next 7 days with advice, and the county's flood advisory.
- Forecast data: Open-Meteo, refreshed every 30 minutes. Risk levels: KYCH county list based on KMD and ICPAC outlooks.
- It also has the 23-step El Niño preparedness checklist and an emergency directory.
Emergency numbers (use exactly these):
${emergencyContactsText()}
    `.trim(),
  },
  {
    id: "events",
    category: "events",
    title: "Events calendar",
    tags: ["event", "events", "summit", "conference", "workshop", "hackathon", "cop31", "calendar", "tukio", "matukio", "kongamano", "événement", "sommet", "atelier"],
    url: "/events",
    content: `
The events page at /events shows the next event on a tear-off calendar page, everything after it on a ticket wall, and a month calendar. Filter by region (Kenya, Africa, global), format (in person, online, hybrid) or SDG. Each event can be added to Google Calendar.
    `.trim(),
  },
  {
    id: "stories",
    category: "stories",
    title: "Founder stories",
    tags: ["stories", "founders", "success", "carbio", "veeklture", "darubini", "greenium", "touche", "hadithi", "waanzilishi", "histoires", "fondateurs"],
    url: "/success-stories",
    content: `
/success-stories has five YCIC founders: Joan Ndanu (CarBIO, biogas from dairy waste), Wesley Njenga (Darubini ya Afya, cleaner incinerator air), Violet Ochieng (Veeklture, reusable cloth diapers lasting up to 3 years and cutting diaper costs by up to 70%), Kevine Otieno (Greenium Energy) and Miriam Mukami (Touché by Kami).
    `.trim(),
  },
  {
    id: "about-kych-membership",
    category: "about",
    title: "About KYCH and how to join",
    tags: ["about", "join", "member", "register", "profile", "who", "afosi", "age", "kuhusu", "jiunge", "jisajili", "wasifu", "rejoindre", "inscription", "profil"],
    url: "/about",
    content: `
KYCH (Kenya Youth Climate Hub) was founded in 2020 under Afosi, Action for Sustainability Initiative. It connects young Kenyans aged 15–35 to climate finance, skills, policy spaces and innovation opportunities in every county. The site works in English, Kiswahili and French.
- Join: create a youth profile at /register (county, age, interests). Pin your shortcuts on /dashboard.
    `.trim(),
  },
  {
    id: "kych-contact-info",
    category: "contact",
    title: "Contact KYCH",
    tags: ["contact", "email", "phone", "address", "help", "partner", "media", "wasiliana", "barua pepe", "simu", "contacter", "téléphone"],
    url: "/contact",
    content: `
- Email: info@kenyayouthclimatehub.org (the team replies within 2 business days)
- Phone: (+254) 0115963306
- Location: Nairobi, Kenya
- Contact form: /contact (partnerships, posting an opportunity, sharing a resource, press)
    `.trim(),
  },
];

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * Retrieve the knowledge chunks that best match a question (keyword scoring over
 * tags, titles and content; accents folded so "météo" matches "meteo").
 */
export function retrieveRelevantContext(query: string, maxResults = 4): KnowledgeChunk[] {
  const general = ["about-kych-membership", "opportunities-board", "climate-watch-weather"]
    .map((id) => KYCH_KNOWLEDGE_BASE.find((c) => c.id === id)!);
  if (!query || typeof query !== "string") return general;

  const tokens = fold(query).replace(/[^\p{L}\p{N}\s-]/gu, " ").split(/\s+/).filter((t) => t.length > 2);
  if (tokens.length === 0) return general;

  const scored = KYCH_KNOWLEDGE_BASE.map((chunk) => {
    const tags = chunk.tags.map(fold);
    const title = fold(chunk.title);
    const content = fold(chunk.content);
    let score = 0;
    for (const token of tokens) {
      if (tags.some((tag) => tag.includes(token) || token.includes(tag))) score += 4;
      if (fold(chunk.category).includes(token)) score += 3;
      if (title.includes(token)) score += 3;
      if (content.includes(token)) score += 1;
    }
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matches = scored.filter((s) => s.score > 0).map((s) => s.chunk);
  return matches.length ? matches.slice(0, maxResults) : general;
}
