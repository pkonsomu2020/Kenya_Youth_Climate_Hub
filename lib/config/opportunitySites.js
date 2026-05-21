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

module.exports = { OPPORTUNITY_SITES, TYPE_COLORS, TYPE_TOPICS };
