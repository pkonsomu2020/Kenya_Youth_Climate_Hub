// ============================================================
// Climate & AI Event Target Sites (Scrapfly + RSS)
// ============================================================

const EVENT_SITES = [
  // ── KENYAN EVENTS (Scrapfly Targets) ──────────────────────
  {
    id: "nairobi-events-guide",
    name: "Nairobi Events Guide",
    url: "https://nairobieventsguide.com/upcoming-events/",
    category: "In-Person",
    isScrapfly: true,
    selectors: {
      list: "a[href*='/event/']",
      title: "", // We'll extract text from the link
      link: "",  // We'll extract href from the link
      excerpt: "",
    },
  },
  {
    id: "10times-tech-kenya",
    name: "10times (Tech & AI)",
    url: "https://10times.com/kenya/technology",
    category: "In-Person",
    isScrapfly: true,
    selectors: {
      list: "tr.event-card, .event-card",
      title: "h2 a, .entry-title a, a.event-name",
      link: "h2 a, .entry-title a, a.event-name",
      excerpt: ".text-muted, .description",
    },
  },
  {
    id: "10times-environment-kenya",
    name: "10times (Environment)",
    url: "https://10times.com/kenya/environment",
    category: "In-Person",
    isScrapfly: true,
    selectors: {
      list: "tr.event-card, .event-card",
      title: "h2 a, .entry-title a, a.event-name",
      link: "h2 a, .entry-title a, a.event-name",
      excerpt: ".text-muted, .description",
    },
  },
  
  // ── GOOGLE NEWS RSS FALLBACKS ───────────────────────────────
  {
    id: "rss-kenya-climate-events",
    name: "Google News (Kenya Events)",
    url: "https://news.google.com/rss/search?q=climate+summit+conference+workshop+nairobi+kenya+2026+register&hl=en-KE&gl=KE&ceid=KE:en",
    category: "In-Person",
    isRSS: true,
  },
  {
    id: "rss-africa-climate-events",
    name: "Google News (Africa Events)",
    url: "https://news.google.com/rss/search?q=climate+change+summit+conference+africa+2026+upcoming+register&hl=en&gl=US&ceid=US:en",
    category: "In-Person",
    isRSS: true,
  },
  {
    id: "rss-africa-ai-events",
    name: "Google News (AI & Tech Events)",
    url: "https://news.google.com/rss/search?q=AI+tech+hackathon+summit+conference+kenya+africa+2026+register&hl=en-KE&gl=KE&ceid=KE:en",
    category: "In-Person",
    isRSS: true,
  },
  {
    id: "rss-global-virtual-events",
    name: "Google News (Virtual Events)",
    url: "https://news.google.com/rss/search?q=climate+webinar+virtual+event+youth+global+2026+register+free&hl=en&gl=US&ceid=US:en",
    category: "Virtual",
    isRSS: true,
  },
  {
    id: "rss-cop-unfccc-events",
    name: "Google News (COP & UNFCCC)",
    url: "https://news.google.com/rss/search?q=COP+UNFCCC+climate+event+2026+youth+africa&hl=en&gl=US&ceid=US:en",
    category: "In-Person",
    isRSS: true,
  },
];

// Topic matching map
const TOPIC_KEYWORDS = {
  Finance: ["finance", "funding", "investment", "grant"],
  Policy: ["policy", "unfccc", "cop", "government", "law", "summit"],
  Innovation: ["innovation", "tech", "startup", "hackathon", "ai", "artificial intelligence", "data", "machine learning"],
  Resilience: ["resilience", "adaptation", "vulnerable"],
  Energy: ["energy", "solar", "renewable", "transition"],
  Water: ["water", "ocean", "marine"],
  Agriculture: ["agriculture", "food", "farming"],
};

// Event Category → Color
const CATEGORY_COLORS = {
  "In-Person": "#059669",
  Virtual: "#10B981",
  Hybrid: "#047857",
  "Action Day": "#34D399",
};

// Event Topic → Icon mapping
const TOPIC_ICONS = {
  Finance: "BadgeDollarSign",
  Policy: "Scale",
  Innovation: "Lightbulb",
  Resilience: "Shield",
  Energy: "Zap",
  Water: "Droplets",
  Agriculture: "Sprout",
  Advocacy: "Megaphone",
};

module.exports = { EVENT_SITES, TOPIC_KEYWORDS, CATEGORY_COLORS, TOPIC_ICONS };
