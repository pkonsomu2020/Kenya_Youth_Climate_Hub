// ============================================================
// Climate Tools & Libraries — Scraping Sources (100% Free RSS)
// ============================================================

const LIBRARY_SITES = [
  // ── KENYAN RESOURCES (70% Target) ─────────────────────────
  {
    id: "rss-kenya-climate-data",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=climate+data+dataset+report+kenya+africa+2025+2026&hl=en-KE&gl=KE&ceid=KE:en",
    category: "Dataset",
    isRSS: true,
  },
  {
    id: "rss-kenya-climate-tools",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=climate+software+tool+app+kenya+innovation+2026&hl=en-KE&gl=KE&ceid=KE:en",
    category: "Toolkit",
    isRSS: true,
  },
  {
    id: "rss-kenya-climate-reports",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=climate+report+guide+publication+kenya+nema+2026&hl=en-KE&gl=KE&ceid=KE:en",
    category: "Report",
    isRSS: true,
  },
  
  // ── INTERNATIONAL RESOURCES (30% Target) ──────────────────
  {
    id: "rss-global-climate-ai",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=climate+change+AI+tool+machine+learning+open+source+2026&hl=en&gl=US&ceid=US:en",
    category: "AI Tool",
    isRSS: true,
  },
  {
    id: "rss-global-carbon-calculator",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=carbon+footprint+calculator+api+open+source+2026&hl=en&gl=US&ceid=US:en",
    category: "Calculator",
    isRSS: true,
  },
];

// Category → color + icon
const CATEGORY_META = {
  "Open Source Tool": { color: "#059669", icon: "Code2",       badge: "OSS"      },
  "Dataset":          { color: "#047857", icon: "Database",    badge: "Data"     },
  "Data Platform":    { color: "#065F46", icon: "BarChart3",   badge: "Platform" },
  "Calculator":       { color: "#10B981", icon: "Calculator",  badge: "Calc"     },
  "AI Tool":          { color: "#34D399", icon: "Bot",         badge: "AI"       },
  "API":              { color: "#059669", icon: "Plug",        badge: "API"      },
  "Framework":        { color: "#047857", icon: "Layers",      badge: "Framework"},
  "Toolkit":          { color: "#065F46", icon: "Wrench",      badge: "Toolkit"  },
  "Report":           { color: "#10B981", icon: "FileText",    badge: "Report"   },
  "Guide":            { color: "#34D399", icon: "BookOpen",    badge: "Guide"    },
};

module.exports = { LIBRARY_SITES, CATEGORY_META };
