# Kenya Youth Climate Hub — KYCH Platform

> The digital headquarters of Kenya's youth climate movement. Built with Next.js 15, powered by Supabase, and anchored within **Afosi — Action for Sustainability Initiative**.

---

## What is KYCH?

The Kenya Youth Climate Hub (KYCH) is a national platform connecting young Kenyans (ages 15–35) to climate finance, skills, policy spaces, and innovation opportunities across all 47 counties. It turns ideas into impact by bridging youth energy with the resources and networks needed to drive systems change.

**Key pillars:**
- Climate Finance & Opportunity Access — live board of grants, fellowships, internships and competitions
- E-Library & Resource Hub — reports, toolkits, policy briefs and research papers
- Events & Workshops — summits, hackathons, webinars and bootcamps
- Youth Climate Innovation Challenge — incubation program with KES 500K prize pool, in partnership with [Flarehub](https://www.flarehub.org)
- Climate AI Assistant — 24/7 AI guide trained on Kenya's climate data *(coming soon)*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS design system |
| Font | Space Grotesk (local, self-hosted) |
| Auth | Supabase Auth (email/password) |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React |
| UI Components | shadcn/ui (Radix UI primitives) |
| Charts | Recharts |
| Email | Resend |
| AI | OpenAI API |
| Data Fetching | RSS feeds via `rss-parser`, Google Custom Search API |
| Deployment | Vercel (recommended) / Cloudflare Workers |

---

## Project Structure

```
NEXTJS APP/
├── app/
│   ├── (admin)/
│   │   └── admin-hub/          # CMS — login, dashboard, news, events, opportunities, resources, messages, settings, bookings
│   ├── (frontend)/
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About KYCH & team
│   │   ├── booking-space/      # Space reservation form
│   │   ├── challenges/         # Youth Climate Innovation Challenge
│   │   ├── contact/            # Contact form
│   │   ├── dashboard/          # User dashboard
│   │   ├── e-library/          # Resource hub + interactive tools
│   │   ├── events/             # Live events calendar
│   │   ├── news/               # Live climate news feed
│   │   ├── opportunities/      # Live funding & opportunities board
│   │   ├── register/           # Youth registration
│   │   └── success-stories/    # YCIC beneficiary stories
│   ├── api/
│   │   ├── news/               # GET /api/news, POST /api/news/fetch
│   │   ├── opportunities/      # GET /api/opportunities, POST /api/opportunities/fetch
│   │   ├── events/             # GET /api/events, POST /api/events/fetch
│   │   ├── library/            # GET /api/library, POST /api/library/fetch
│   │   └── bookings/           # POST /api/bookings, GET/PATCH /api/bookings/[id]
│   ├── globals.css             # Full KYCH design system
│   └── layout.tsx              # Root layout, fonts, SEO metadata
├── components/
│   ├── Nav.tsx                 # Floating pill navbar + full-screen dark slide panel
│   ├── Footer.tsx              # Site footer
│   ├── AIFab.tsx               # Climate AI floating action button
│   ├── PageHeader.tsx          # Shared page header component
│   ├── Newsletter.tsx          # Newsletter signup
│   ├── ThemeToggle.tsx         # Light/dark mode toggle
│   ├── Providers.tsx           # Redux + client providers
│   ├── admin/                  # Admin UI components (AdminUI, CrudTable)
│   └── tools/
│       ├── CarbonCalculator.tsx  # Interactive carbon footprint calculator
│       └── ClimateQuiz.tsx       # Climate readiness quiz with badge tiers
├── lib/
│   ├── contentStore.ts         # localStorage-backed mini CMS (resources, posts, messages, settings)
│   ├── useNews.ts              # Hook — fetches live news from /api/news
│   ├── useOpportunities.ts     # Hook — fetches live opportunities from /api/opportunities
│   ├── useEvents.ts            # Hook — fetches live events from /api/events
│   ├── useLibrary.ts           # Hook — fetches library resources from /api/library
│   ├── data/
│   │   └── successStories.ts   # YCIC beneficiary stories data
│   ├── services/               # Backend data storage services (Supabase)
│   ├── jobs/                   # Data fetch jobs (news, opportunities, events, library)
│   └── db/                     # Supabase DB setup scripts
├── utils/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       ├── server.ts           # Server Supabase client
│       └── middleware.ts       # Auth session middleware
├── public/
│   ├── kych_logo.png           # KYCH logo
│   ├── Space Grotesk/          # Self-hosted font files
│   └── YCIC_Photos/            # Success story photos
├── scripts/
│   └── create-admin.js         # One-time script to seed admin user in Supabase Auth
├── .env                        # Environment variables (see below)
├── middleware.ts               # Route protection — redirects unauthenticated users from /admin-hub
└── next.config.ts              # Next.js config
```

---

## Environment Variables

Create a `.env` file in this directory (already exists — do not commit to git):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# OpenAI (for AI assistant and content filtering)
OPENAI_API_KEY=sk-...

# Google (for news RSS and search)
GOOGLE_API_KEY=your-google-api-key
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id

# ScrapingBee — removed, using Google RSS feeds instead
# SCRAPINGBEE_API_KEY=...
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your Supabase and API keys.

### 3. Create the admin user

Run this once to seed the admin account in Supabase Auth:

```bash
node scripts/create-admin.js
```

### 4. Run the development server

```bash
npm run dev
```

Open [https://kenyayouthclimatehub.org](https://kenyayouthclimatehub.org) to view the frontend.

Admin dashboard: [https://kenyayouthclimatehub.org/admin-hub](https://kenyayouthclimatehub.org/admin-hub)

---

## Admin Dashboard

The admin hub (`/admin-hub`) is a full CMS protected by Supabase Auth.

**Default credentials:**
- Email: `admin@kych.org`
- Password: `KYCH@2026!`

**Sections:**
| Route | Purpose |
|---|---|
| `/admin-hub` | Dashboard — stats overview, quick actions, recent messages |
| `/admin-hub/news` | Manage news articles |
| `/admin-hub/opportunities` | Manage funding opportunities |
| `/admin-hub/events` | Manage events |
| `/admin-hub/resources` | Manage E-Library resources |
| `/admin-hub/messages` | View contact form submissions |
| `/admin-hub/booking-space` | Manage space booking requests |
| `/admin-hub/settings` | Site-wide settings (hero text, impact stats) |

---

## Interactive Tools (E-Library)

Two custom tools built exclusively for young Kenyan climate changemakers:

### 🌍 Carbon Footprint Calculator
- 4-step modal, Kenya-specific emission factors
- Comparison bars vs Kenya / Africa / World averages
- Personalised reduction tips
- Share button

### 🧠 Climate Readiness Quiz
- 8 questions covering Kenya's climate landscape
- 4 badge tiers: Seedling → Changemaker → Champion → Expert
- Resource recommendations based on wrong answers
- Share button

---

## Data Pipelines

Live data is fetched via Next.js API routes that call internal job functions:

| Endpoint | Source | Schedule |
|---|---|---|
| `/api/news/fetch` | Google RSS feeds (climate Kenya) | Every 3 hours |
| `/api/opportunities/fetch` | Google Custom Search + RSS | Every 12 hours |
| `/api/events/fetch` | Google Custom Search + RSS | Every 12 hours |
| `/api/library/fetch` | Curated sources + GitHub | Every 24 hours |

All data is stored in Supabase and served via the respective GET endpoints.

---

## Design System

The KYCH design system lives in `app/globals.css`:

- **Primary colour:** `#059669` (Emerald green) and shades
- **Font:** Space Grotesk (300–700 weights, self-hosted)
- **Dark mode:** Full support via `next-themes` and CSS custom properties
- **Components:** `.k-card`, `.btn-green`, `.btn-w`, `.btn-g`, `.sec`, `.sec-in`, `.s-title`, `.s-label`, `.k-input`, `.k-label`, `.f-pill`, `.k-tag`, `.knav-pill`, `.ah-*` (admin)

---

## Deployment

### Vercel (recommended)

```bash
vercel deploy
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Cloudflare Workers

A `vercel.json` and `wrangler` config are included for Cloudflare deployment.

---

## Partners

- **Afosi** — Action for Sustainability Initiative (parent organisation)
- **Flarehub** — Cohort-based startup launchpad for Kenyan founders under 30 ([flarehub.org](https://www.flarehub.org))
- **UNICEF / Generation Unlimited / Yoma** — Strategic partners

---

## License

© 2025 Kenya Youth Climate Hub. All rights reserved.  
Built with ♥ for Kenya's climate future by the KYCH team.
