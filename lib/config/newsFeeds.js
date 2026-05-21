// ============================================================
// Climate News RSS Feed Sources (100% Free RSS)
// ============================================================

const NEWS_FEEDS = [
  // ── KENYAN NEWS (70% Target) ──────────────────────────────
  {
    url: "https://news.google.com/rss/search?q=climate+change+kenya&hl=en-KE&gl=KE&ceid=KE:en",
    source: "Google News",
    category: "News",
    priority: 1,
  },
  {
    url: "https://news.google.com/rss/search?q=climate+action+kenya+environment&hl=en-KE&gl=KE&ceid=KE:en",
    source: "Google News",
    category: "Climate Insights",
    priority: 1,
  },
  {
    url: "https://news.google.com/rss/search?q=green+energy+kenya+solar&hl=en-KE&gl=KE&ceid=KE:en",
    source: "Google News",
    category: "Climate Insights",
    priority: 1,
  },
  {
    url: "https://news.google.com/rss/search?q=climate+finance+africa+youth&hl=en-KE&gl=KE&ceid=KE:en",
    source: "Google News",
    category: "News",
    priority: 1,
  },
  {
    url: "https://news.google.com/rss/search?q=climate+COP+africa+kenya+2025&hl=en-KE&gl=KE&ceid=KE:en",
    source: "Google News",
    category: "News",
    priority: 1,
  },
  {
    url: "https://news.google.com/rss/search?q=renewable+energy+africa+2025&hl=en-KE&gl=KE&ceid=KE:en",
    source: "Google News",
    category: "Climate Insights",
    priority: 1,
  },

  // ── INTERNATIONAL NEWS (30% Target) ───────────────────────
  {
    url: "https://news.google.com/rss/search?q=climate+change+global+youth+UNFCCC&hl=en&gl=US&ceid=US:en",
    source: "Google News",
    category: "News",
    priority: 2,
  },
  {
    url: "https://www.climatechangenews.com/feed/",
    source: "Climate Home News",
    category: "News",
    priority: 2,
  },
  {
    url: "https://www.carbonbrief.org/feed/",
    source: "Carbon Brief",
    category: "Climate Insights",
    priority: 2,
  },
];

// Category → gradient color mapping (matches frontend design)
const CATEGORY_GRADIENTS = {
  News: "#059669",
  "Climate Insights": "#047857",
  "Success Stories": "#10B981",
  "Events Recap": "#10B981",
  "Partner Updates": "#059669",
};

// Category → icon mapping (Lucide icon names)
const CATEGORY_ICONS = {
  News: "Globe",
  "Climate Insights": "Droplets",
  "Success Stories": "Sun",
  "Events Recap": "CalendarDays",
  "Partner Updates": "Handshake",
};

module.exports = { NEWS_FEEDS, CATEGORY_GRADIENTS, CATEGORY_ICONS };
