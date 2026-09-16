// ============================================================
// KYCH RAG Knowledge Base & Context Retrieval Engine
// Provides structured, domain-grounded context to OpenAI LLM
// ============================================================

export interface KnowledgeChunk {
  id: string;
  category: "ycic" | "opportunities" | "programs" | "library" | "weather" | "about" | "contact";
  title: string;
  tags: string[];
  content: string;
  url?: string;
}

export const KYCH_KNOWLEDGE_BASE: KnowledgeChunk[] = [
  // ── YOUTH CLIMATE INNOVATION CHALLENGE (YCIC) ──
  {
    id: "ycic-overview",
    category: "ycic",
    title: "Youth Climate Innovation Challenge (YCIC) Overview (CONCLUDED)",
    tags: ["ycic", "challenge", "innovation", "incubation", "grant", "funding", "startup", "flarehub", "yoma", "closed", "past"],
    url: "/programs/ycic",
    content: `
**STATUS: CONCLUDED / APPLICATIONS CLOSED**
The Youth Climate Innovation Challenge (YCIC 2025) was an incubation program and startup competition hosted by the Kenya Youth Climate Hub (KYCH) in partnership with Flarehub and Yoma.
- **Current Status**: The 2025 YCIC cohort has **closed and concluded** (applications closed June 2025; Pitch Day held July 2025 at KICC). Applications are NOT currently open.
- **Objective**: Supported young Kenyan innovators in creating impactful climate solutions for informal settlements and vulnerable communities.
- **Prize Pool Awarded**: KES 500,000 in seed grants, incubation support, and mentorship.
- **Partners**: KYCH, Flarehub (www.flarehub.org), Yoma (yoma.world).
- **Next Steps**: Follow KYCH announcements and check the [Opportunities Board](/opportunities) for future challenge cohorts and open funding calls.
    `.trim(),
  },
  {
    id: "ycic-eligibility-focus",
    category: "ycic",
    title: "YCIC Past Focus Areas & Program Scope",
    tags: ["ycic", "eligibility", "requirements", "focus areas", "wash", "flood", "renewable energy", "closed"],
    url: "/programs/ycic",
    content: `
**YCIC 2025 Program Scope (CONCLUDED)**:
Applications for the 2025 edition closed in June 2025. The challenge targeted Kenyan youth aged 18–35 registered on Yoma across 3 main focus areas:
1. **Water, Sanitation & Hygiene (WASH)**: Low-cost filtration, community sanitation, climate-resilient water access.
2. **Flood Resilience & Urban Drainage**: Permeable pavement, rainwater harvesting, early-warning flood management in informal settlements.
3. **Renewable Energy & Sustainable Infrastructure**: Affordable solar home systems, biogas digesters, clean tech, green building materials.

*Note: Applications for this cohort are closed. Please visit the [Opportunities page](/opportunities) for current active grants and fellowships.*
    `.trim(),
  },

  // ── GRANTS & OPPORTUNITIES ──
  {
    id: "opportunities-board",
    category: "opportunities",
    title: "KYCH Opportunities Board (Grants, Fellowships, Internships & Calls)",
    tags: ["grant", "grants", "funding", "fellowship", "fellowships", "internship", "money", "scholarship", "opportunities", "calls"],
    url: "/opportunities",
    content: `
The KYCH Opportunities Board is a curated database of verified funding opportunities for African youth and climate innovators.
- **Types of Opportunities**: Seed Grants, Research Fellowships, Green Internships, Innovation Hackathons, Global Climate Accelerator Programs.
- **Features**: Live deadline countdown alerts, category filters, regional search (Kenya & Africa-wide).
- **How to Access**: Visit the Opportunities page (/opportunities) to filter by opportunity type, sector, or closing date.
- **Tips for Applicants**: Ensure your organization/project aligns with donor thematic areas, submit before the deadline, and highlight local community impact.
    `.trim(),
  },

  // ── PROGRAMS & 5 PILLARS ──
  {
    id: "kych-five-pillars",
    category: "programs",
    title: "KYCH 5 Core Strategic Pillars",
    tags: ["programs", "pillars", "advocacy", "policy", "entrepreneurship", "capacity building", "adaptation", "leadership"],
    url: "/programs",
    content: `
KYCH operates across 5 core strategic pillars to accelerate youth-driven climate action in Kenya:
1. **Climate Policy & Advocacy**: Engaging youth in national climate policy drafting, COP delegations, and local county climate governance.
2. **Climate Innovation & Entrepreneurship**: Incubating youth-led green startups from clean energy to circular waste management (includes YCIC).
3. **Climate Education & Capacity Building**: Conducting community workshops, youth bootcamps, and digital climate literacy training.
4. **Climate Adaptation & Disaster Mitigation**: Supporting grassroots resilience projects, early warning tools, and el niño/drought responses.
5. **Youth Leadership & Community Action**: Mobilizing local youth climate chapters across Kenya's 47 counties.
    `.trim(),
  },

  // ── E-LIBRARY & RESEARCH ──
  {
    id: "elibrary-overview",
    category: "library",
    title: "KYCH E-Library & Climate Research Repository",
    tags: ["library", "e-library", "research", "reports", "policy brief", "toolkit", "publications", "documents"],
    url: "/library",
    content: `
The KYCH E-Library is an open-access repository containing climate research papers, policy briefs, adaptation toolkits, and sector reports.
- **Topics**: Kenya National Climate Change Action Plan (NCCAP), NDC implementation, loss & damage policy, youth climate finance, agroecology, renewable transition.
- **Features**: Filter by category, view pdf summaries, download free resources, save publications to your user dashboard.
    `.trim(),
  },

  // ── CLIMATE WATCH & WEATHER ──
  {
    id: "climate-watch-weather",
    category: "weather",
    title: "Climate Watch & 47 County Weather Telemetry",
    tags: ["weather", "climate watch", "counties", "nairobi", "mombasa", "kisumu", "floods", "drought", "kmd", "heat map"],
    url: "/weather",
    content: `
The Climate Watch hub provides live real-time satellite weather telemetry and disaster advisories for all 47 counties in Kenya.
- **Data Engine**: Powered by Open-Meteo Satellite Weather API & Kenya Meteorological Department (KMD) data.
- **Features**: 7-day daily forecast breakdown, time-of-day temperature carousels, flood/drought risk badges, emergency entity helpline numbers.
- **Emergency Helpline Contacts**:
  - National Disaster Operations Centre (NDOC): +254 20 2212386 / 0800 721596
  - Kenya Red Cross Emergency Toll-Free: 1199 / +254 703 037 000
  - Kenya Meteorological Department: +254 20 3867880
    `.trim(),
  },

  // ── ABOUT & MEMBERSHIP & CONTACT ──
  {
    id: "about-kych-membership",
    category: "about",
    title: "About KYCH, Membership Eligibility & Registration",
    tags: ["about", "join", "member", "membership", "registration", "who we are", "age", "yoma"],
    url: "/about",
    content: `
**About Kenya Youth Climate Hub (KYCH)**:
KYCH is the primary youth-led platform in Kenya uniting young climate activists, green entrepreneurs, researchers, and community leaders.
- **Membership Eligibility**: Open to all young people in Kenya aged 15 to 35 years.
- **How to Join**: Register on the website, sign up for a yoma.world profile, explore the Opportunities board, and join local county chapters.
    `.trim(),
  },
  {
    id: "kych-contact-info",
    category: "contact",
    title: "KYCH Official Contact Details & Location",
    tags: ["contact", "email", "phone", "location", "address", "help", "support", "office"],
    url: "/contact",
    content: `
**Official Contact Information**:
- **Email**: info@kenyayouthclimatehub.org
- **Phone**: (+254) 0115963306
- **Address / HQ**: Nairobi, Kenya
- **Website**: https://kenyayouthclimatehub.org
    `.trim(),
  },
];

/**
 * Retrieve relevant knowledge base chunks for a user query.
 * Uses keyword matching and scoring over tags, titles, and contents.
 */
export function retrieveRelevantContext(query: string, maxResults = 4): KnowledgeChunk[] {
  if (!query || typeof query !== "string") return KYCH_KNOWLEDGE_BASE.slice(0, 3);

  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (tokens.length === 0) return KYCH_KNOWLEDGE_BASE.slice(0, 3);

  const scored = KYCH_KNOWLEDGE_BASE.map((chunk) => {
    let score = 0;

    for (const token of tokens) {
      // Tags match (high weight)
      if (chunk.tags.some((tag) => tag.toLowerCase().includes(token))) score += 4;
      // Category match
      if (chunk.category.toLowerCase().includes(token)) score += 3;
      // Title match
      if (chunk.title.toLowerCase().includes(token)) score += 3;
      // Content match
      if (chunk.content.toLowerCase().includes(token)) score += 1;
    }

    return { chunk, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Filter chunks with score > 0 or fallback to top items if general
  const matches = scored.filter((item) => item.score > 0).map((item) => item.chunk);

  if (matches.length === 0) {
    // If query is broad (e.g. "hello", "what is this"), include general overview chunks
    return [
      KYCH_KNOWLEDGE_BASE.find((c) => c.id === "about-kych-membership")!,
      KYCH_KNOWLEDGE_BASE.find((c) => c.id === "ycic-overview")!,
      KYCH_KNOWLEDGE_BASE.find((c) => c.id === "opportunities-board")!,
    ];
  }

  return matches.slice(0, maxResults);
}
