// ============================================================
// Climate Opportunity Target Sites (Scrapfly + RSS)
// ============================================================

const OPPORTUNITY_SITES = [
  // ── KENYAN OPPORTUNITIES (Targeted Job Boards via Scrapfly) ─────────────
  {
    id: "myjobmag-climate-jobs",
    name: "MyJobMag Kenya",
    url: "https://www.myjobmag.co.ke/jobs-by-title/climate-change-officer",
    type: "Job",
    isScrapfly: true,
    selectors: {
      list: "li.job-info",
      title: "h2 a",
      link: "h2 a",
      excerpt: ".job-desc",
    },
  },
  
  // ── INTERNATIONAL OPPORTUNITIES (Targeted Job Boards via Scrapfly) ──────
  {
    id: "reliefweb-jobs",
    name: "ReliefWeb Jobs",
    url: "https://reliefweb.int/jobs?search=climate+environment+kenya+africa",
    type: "Job",
    isScrapfly: true,
    selectors: {
      list: "article.rw-river-article",
      title: "h3.rw-river-article__title a",
      link: "h3.rw-river-article__title a",
      excerpt: ".rw-river-article__summary",
    },
  },

  // ── Opportunity Desk (best for youth climate opps) ────────
  {
    id: "opportunitydesk-grants",
    name: "Opportunity Desk",
    url: "https://opportunitydesk.org/category/grants/",
    type: "Grant",
    isScrapfly: true,
    selectors: {
      list: "article.post, .post-item, article",
      title: "h2 a, h3 a, .entry-title a",
      link: "h2 a, h3 a, .entry-title a",
      excerpt: ".entry-summary p, .post-excerpt, p",
    },
  },
  {
    id: "opportunitydesk-fellowships",
    name: "Opportunity Desk",
    url: "https://opportunitydesk.org/category/fellowships/",
    type: "Fellowship",
    isScrapfly: true,
    selectors: {
      list: "article.post, .post-item, article",
      title: "h2 a, h3 a, .entry-title a",
      link: "h2 a, h3 a, .entry-title a",
      excerpt: ".entry-summary p, .post-excerpt, p",
    },
  },
  {
    id: "opportunitydesk-internships",
    name: "Opportunity Desk",
    url: "https://opportunitydesk.org/category/internships/",
    type: "Internship",
    isScrapfly: true,
    selectors: {
      list: "article.post, .post-item, article",
      title: "h2 a, h3 a, .entry-title a",
      link: "h2 a, h3 a, .entry-title a",
      excerpt: ".entry-summary p, .post-excerpt, p",
    },
  },
  
  // ── FundsForNGOs Environment ──────────────────────────────
  {
    id: "fundsforngos-environment",
    name: "FundsForNGOs",
    url: "https://www2.fundsforngos.org/category/environment/",
    type: "Grant",
    isScrapfly: true,
    selectors: {
      list: "article, .post",
      title: "h2 a, h3 a, .entry-title a",
      link: "h2 a, h3 a, .entry-title a",
      excerpt: ".entry-summary p, p",
    },
  },

  // ── Green Climate Fund ────────────────────────────────────
  {
    id: "gcf-calls",
    name: "Green Climate Fund",
    url: "https://www.greenclimate.fund/calls",
    type: "Grant",
    isScrapfly: true,
    selectors: {
      list: ".views-row, .call-item, article",
      title: "h3 a, h2 a, .field-title a",
      link: "h3 a, h2 a, .field-title a",
      excerpt: ".field-body p, .views-field-body p, p",
    },
  },

  // ── YouthOp ───────────────────────────────────────────────
  {
    id: "youthop",
    name: "YouthOp",
    url: "https://www.youthop.com/opportunities?category=environment",
    type: "Grant",
    isScrapfly: true,
    selectors: {
      list: ".opportunity-item, article, .post",
      title: "h2 a, h3 a, .title a",
      link: "h2 a, h3 a, .title a",
      excerpt: ".description p, .excerpt, p",
    },
  },

  // ── GOOGLE NEWS RSS FALLBACKS ───────────────────────────────
  {
    id: "rss-kenya-grants",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=climate+grant+funding+kenya+2025+2026&hl=en-KE&gl=KE&ceid=KE:en",
    type: "Grant",
    isRSS: true,
  },
  {
    id: "rss-kenya-internships",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=climate+internship+fellowship+youth+kenya+2026&hl=en-KE&gl=KE&ceid=KE:en",
    type: "Internship",
    isRSS: true,
  },
  {
    id: "rss-kenya-competitions",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=climate+competition+hackathon+award+kenya+africa+2026&hl=en-KE&gl=KE&ceid=KE:en",
    type: "Competition",
    isRSS: true,
  },
  {
    id: "rss-global-fellowships",
    name: "Google News",
    url: "https://news.google.com/rss/search?q=climate+change+fellowship+global+youth+2026&hl=en&gl=US&ceid=US:en",
    type: "Fellowship",
    isRSS: true,
  },
];

// ── GOOGLE CUSTOM SEARCH — LinkedIn coverage ─────────────────
// RSS/Scrapfly can't reliably reach LinkedIn (blocked/auth-walled),
// but Google's own web index does crawl a slice of LinkedIn's public
// posts/pages, so we can search it via the official Custom Search API.
const OPPORTUNITY_SEARCH_QUERIES = [
  {
    id: "gsearch-linkedin-grants",
    name: "LinkedIn (Climate Grants)",
    query: "site:linkedin.com climate grant funding kenya africa youth apply 2026",
    type: "Grant",
    region: "Kenya",
  },
  {
    id: "gsearch-linkedin-fellowships",
    name: "LinkedIn (Fellowships)",
    query: "site:linkedin.com climate fellowship youth apply 2026",
    type: "Fellowship",
    region: "Global",
  },
  {
    id: "gsearch-linkedin-internships",
    name: "LinkedIn (Internships)",
    query: "site:linkedin.com climate internship kenya youth apply 2026",
    type: "Internship",
    region: "Kenya",
  },
  {
    id: "gsearch-linkedin-competitions",
    name: "LinkedIn (Competitions & Hackathons)",
    query: "site:linkedin.com climate hackathon competition youth kenya africa apply 2026",
    type: "Competition",
    region: "Kenya",
  },
  // ── Coverage for sites normally reached via Scrapfly ────────
  // Same domains as the Scrapfly targets above, reached via Google
  // Search instead — covers the gap whenever Scrapfly is rate-limited
  // or over quota, and supplements it the rest of the time.
  {
    id: "gsearch-myjobmag",
    name: "Google Search (MyJobMag Kenya)",
    query: "site:myjobmag.co.ke climate OR environment OR sustainability job kenya",
    type: "Job",
    region: "Kenya",
  },
  {
    id: "gsearch-reliefweb",
    name: "Google Search (ReliefWeb Jobs)",
    query: "site:reliefweb.int/jobs climate environment kenya africa",
    type: "Job",
    region: "Africa",
  },
  {
    id: "gsearch-opportunitydesk",
    name: "Google Search (Opportunity Desk)",
    query: "site:opportunitydesk.org (grant OR fellowship OR internship) climate 2026",
    type: "Grant",
    region: "Global",
  },
  {
    id: "gsearch-fundsforngos",
    name: "Google Search (FundsForNGOs)",
    query: "site:fundsforngos.org environment OR climate grant 2026",
    type: "Grant",
    region: "Global",
  },
  {
    id: "gsearch-greenclimatefund",
    name: "Google Search (Green Climate Fund)",
    query: "site:greenclimate.fund/calls OR site:greenclimate.fund/document request for proposals 2026",
    type: "Grant",
    region: "Global",
  },
  {
    id: "gsearch-youthop",
    name: "Google Search (YouthOp)",
    query: "site:youthop.com environment OR climate opportunity 2026",
    type: "Grant",
    region: "Global",
  },
];

// Opportunity type → color mapping
const TYPE_COLORS = {
  Grant: "#059669",
  Fellowship: "#047857",
  Internship: "#10B981",
  Competition: "#34D399",
  Job: "#065F46",
  Accelerator: "#059669",
};

// Opportunity type → topic mapping (default)
const TYPE_TOPICS = {
  Grant: "Finance",
  Fellowship: "Policy",
  Internship: "Innovation",
  Competition: "Innovation",
  Job: "Advocacy",
  Accelerator: "Innovation",
};

module.exports = { OPPORTUNITY_SITES, OPPORTUNITY_SEARCH_QUERIES, TYPE_COLORS, TYPE_TOPICS };
