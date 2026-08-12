"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { DollarSign, Trophy, BookOpen, Rocket, CalendarDays, Bot, ArrowRight, ChevronLeft, ChevronRight, Sun } from "lucide-react";
import { useNews } from "@/lib/useNews";
import { successStories } from "@/lib/data/successStories";
import { NK, nkShadow, nkCard } from "@/lib/nkTheme";
import { GrowHeading } from "@/components/GrowHeading";

function useInView(ref: React.RefObject<Element | null>, threshold = 0.12) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ── Data ──────────────────────────────────────────────────────
const HERO_WORDS = ["climate innovators", "county changemakers", "green founders", "policy advocates"];

const PARTNERS = [
  { name: "UNICEF", logo: "/PARTNERS/UNICEF_Logo.png" },
  { name: "Yoma", logo: "/PARTNERS/YOMA_Logo.png" },
  { name: "Generation Unlimited", logo: "/PARTNERS/Logo_Generation_Unlimited_0.png.jpg" },
  { name: "STEM Impact Center", logo: "/PARTNERS/STEM IMPACT_Logo.png" },
  { name: "Green Army Foundation", logo: "/PARTNERS/GREEN ARMY_Logo.jpg" },
  { name: "KCIC", logo: "/PARTNERS/KCIC_Logo.png" },
  { name: "Ministry of Environment", logo: "/PARTNERS/MIN_OF_ENVIRONMENT.jpg" },
  { name: "Afosi", logo: "/PARTNERS/afosi_logo.png" },
];

const PLATFORM_TOOLS = [
  { num: "01", icon: BookOpen, label: "E-Library & Resource Hub", desc: "Reports, toolkits, policy briefs, and research papers. Save them to your dashboard.", cta: "Browse Library →", href: "/e-library" },
  { num: "02", icon: DollarSign, label: "Funding & Opportunities", desc: "A live board of grants, fellowships, and internships with deadline alerts.", cta: "Find Funding →", href: "/opportunities" },
  { num: "03", icon: Rocket, label: "Programs & Challenges", desc: "Apply for incubators like the Youth Climate Innovation Challenge and mentorship programs.", cta: "View Programs →", href: "/programs" },
  { num: "04", icon: CalendarDays, label: "Events & Workshops", desc: "Register for bootcamps, policy dialogues, and webinars from KYCH and partners.", cta: "View Calendar →", href: "/events" },
  { num: "05", icon: Bot, label: "Climate AI Assistant", desc: "A 24/7 AI guide trained on Kenya's climate data, opportunities and resources.", cta: "Ask AI Now →", href: null },
];

const PILLARS = [
  { title: "Youth Climate Leadership & Advocacy", desc: "Training Kenya's next climate negotiators, county advocates, and movement leaders to influence policy at every level." },
  { title: "Climate Innovation & Entrepreneurship", desc: "Incubating youth-led green startups, from clean energy to waste tech, through the Youth Climate Innovation Challenge." },
  { title: "Climate Finance & Opportunity Access", desc: "Connecting young Kenyans to grants, fellowships, competitions, and jobs that match their climate ambitions." },
  { title: "Capacity Building & Knowledge", desc: "Equipping young people with the skills, data, and tools to lead climate action through trainings and digital resources." },
  { title: "Partnerships & Ecosystem Building", desc: "Building bridges between youth, government, NGOs, development partners, and the private sector." },
];

const VALUES = [
  { title: "Climate Justice", desc: "Fair outcomes for frontline communities" },
  { title: "Youth Inclusion", desc: "Ages 15–35 at the centre of every decision" },
  { title: "Gender Equity", desc: "Equal voice, equal access, equal impact" },
  { title: "Innovation", desc: "Kenyan solutions for Kenyan challenges" },
  { title: "Evidence-Based", desc: "Data-driven, research-backed action" },
  { title: "Systems Change", desc: "Beyond symptoms, changing root causes" },
];

const GRADIENT_MAP: Record<string, string> = {
  News: NK.green, "Climate Insights": NK.greenAlt, "Success Stories": NK.green, "Events Recap": NK.greenAlt, "Partner Updates": NK.green,
};

const PREVIEW_VIDEOS = ["/c_df_b_e_bc_e_c_videomp_.mp4", "/e_a_ea_d_videomp_.mp4", "/e_b_d_a_be_e_f_mp_.mp4"];

// ── Eyebrow label ─────────────────────────────────────────────
function Eyebrow({ children, color = NK.greenAlt }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: "block", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color, marginBottom: "1rem" }}>
      {children}
    </span>
  );
}

// ── Partner flip-board ───────────────────────────────────────
function PartnerBoard() {
  const [idx, setIdx] = useState(0);
  const [barKey, setBarKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restart = (newIdx?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (newIdx !== undefined) setIdx(newIdx);
    setBarKey((k) => k + 1);
    timerRef.current = setInterval(() => {
      setIdx((p) => (p + 1) % PARTNERS.length);
      setBarKey((k) => k + 1);
    }, 3200);
  };

  useEffect(() => { restart(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  return (
    <div style={{ background: NK.ink, padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: NK.green }}>Backed by</div>
        <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedOnDark, marginTop: 4 }}>{String(idx + 1).padStart(2, "0")} / {String(PARTNERS.length).padStart(2, "0")}</div>
      </div>
      <div style={{ flex: 1, minWidth: 200, overflow: "hidden" }}>
        <div key={idx} style={{ animation: "nkFlapIn 0.5s ease", display: "flex", alignItems: "center" }}>
          <div style={{ background: "#fff", padding: "10px 22px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <img src={PARTNERS[idx].logo} alt={PARTNERS[idx].name} style={{ height: "clamp(26px,3.5vw,38px)", maxWidth: 180, objectFit: "contain" }} />
          </div>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.1)", marginTop: 10, maxWidth: 240 }}>
          <div key={barKey} style={{ height: "100%", background: NK.green, animation: "nkBarFill 3.2s linear" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        {PARTNERS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => restart(i)}
            aria-label={`Show ${p.name}`}
            style={{
              width: i === idx ? 26 : 6, height: 6, border: "none", cursor: "pointer",
              background: i === idx ? NK.green : "#2B3A57", transition: "width .3s, background .3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Value card ────────────────────────────────────────────────
function ValueCard({ v, index }: { v: typeof VALUES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...nkCard,
        padding: "2rem",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity .5s ease ${index * 0.06}s, transform .5s ease ${index * 0.06}s, box-shadow .2s, translate .2s`,
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        translate: hov ? "0 -4px" : "0 0",
      }}
    >
      <div style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, color: NK.green, marginBottom: ".75rem" }}>{String(index + 1).padStart(2, "0")}</div>
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.15rem", color: NK.ink, marginBottom: ".5rem" }}>{v.title}</div>
      <p style={{ fontSize: ".9rem", color: NK.muted, lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
    </div>
  );
}

// ── Platform tool card ────────────────────────────────────────
function ToolCard({ tool, index, onChatOpen }: { tool: typeof PLATFORM_TOOLS[0]; index: number; onChatOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  const Icon = tool.icon;
  const content = (
    <>
      <div style={{ width: 46, height: 46, background: index % 2 === 0 ? NK.green : NK.greenAlt, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: NK.navyDeep }}>
        <Icon size={22} />
      </div>
      <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: NK.mutedOnDark, marginBottom: ".5rem" }}>{tool.num}</div>
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.05rem", color: "#fff", marginBottom: ".6rem", lineHeight: 1.25 }}>{tool.label}</div>
      <p style={{ fontSize: ".85rem", color: NK.mutedOnDark, lineHeight: 1.6, marginBottom: "1.25rem" }}>{tool.desc}</p>
      <span style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".82rem", color: hov ? NK.green : NK.offWhiteOnDark }}>{tool.cta}</span>
    </>
  );
  const sharedStyle: React.CSSProperties = {
    display: "block", background: NK.panelNavy, border: `1px solid ${hov ? NK.green : NK.borderNavy}`,
    padding: "1.75rem", textAlign: "left", textDecoration: "none", cursor: "pointer",
    opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
    transition: `opacity .5s ease ${index * 0.06}s, transform .5s ease ${index * 0.06}s, border-color .2s`,
  };
  if (tool.href) {
    return <Link ref={ref as any} href={tool.href as any} style={sharedStyle} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{content}</Link>;
  }
  return <button ref={ref as any} onClick={onChatOpen} style={{ ...sharedStyle, width: "100%" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{content}</button>;
}

// ── Pillar row ────────────────────────────────────────────────
function PillarRow({ p, index }: { p: typeof PILLARS[0]; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", gap: "2rem", padding: "1.9rem 0", alignItems: "flex-start",
        borderTop: `2px solid ${NK.ink}`,
        borderBottom: index === PILLARS.length - 1 ? `2px solid ${NK.ink}` : "none",
        background: hov ? NK.tintGreen : "transparent",
        transition: "background .2s",
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "2.75rem", color: NK.green, minWidth: 80, lineHeight: 1 }}>{String(index + 1).padStart(2, "0")}</div>
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.4rem", color: NK.ink, marginBottom: ".5rem" }}>{p.title}</div>
        <p style={{ fontSize: ".92rem", color: NK.muted, lineHeight: 1.65, margin: 0, maxWidth: 640 }}>{p.desc}</p>
      </div>
      <div style={{ fontFamily: "var(--fm)", fontSize: 11.5, color: NK.mutedLabel, alignSelf: "center", whiteSpace: "nowrap" }}>
        PILLAR {String(index + 1).padStart(2, "0")} / 05
      </div>
    </div>
  );
}

// ── Success story card ───────────────────────────────────────
function StoryCard({ story, index }: { story: typeof successStories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  return (
    <Link
      ref={ref as any}
      href={`/success-stories/${story.id}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...nkCard, display: "flex", flexDirection: "column", textDecoration: "none",
        flexShrink: 0, width: "clamp(280px, 30vw, 360px)", padding: "1.75rem",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity .6s ease ${index * 0.08}s, transform .6s ease ${index * 0.08}s, box-shadow .2s, translate .2s`,
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        translate: hov ? "0 -4px" : "0 0",
      }}
    >
      <span style={{
        alignSelf: "flex-start", fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "5px 9px", background: index % 2 === 0 ? NK.green : NK.ink, color: index % 2 === 0 ? NK.navyDeep : NK.green, marginBottom: "1rem",
      }}>
        {story.tag.replace("Renewal energy", "Renewable Energy")}
      </span>
      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: NK.ink, marginBottom: ".75rem" }}>{story.company}</div>
      <p style={{ fontSize: ".88rem", color: NK.muted, lineHeight: 1.6, flex: 1, marginBottom: "1.25rem" }}>{story.excerpt}</p>
      <div style={{ display: "flex", alignItems: "center", gap: ".75rem", paddingTop: "1rem", borderTop: "1px solid rgba(16,28,51,0.1)" }}>
        <div style={{ width: 36, height: 36, background: NK.ink, color: NK.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".78rem", flexShrink: 0 }}>
          {story.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.1em" }}>Founder</div>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".85rem", color: NK.ink }}>{story.name}</div>
        </div>
      </div>
    </Link>
  );
}

// ── CTA / Newsletter with sun toggle ────────────────────────────
function NewsletterCTA() {
  const [sunOn, setSunOn] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const ctaColor = sunOn ? NK.navyDeep : NK.offWhiteOnDark;
  const btnBg = sunOn ? NK.navyDeep : NK.green;
  const btnFg = sunOn ? "#F6F8F4" : NK.navyDeep;

  return (
    <section style={{ background: NK.navyDeep, position: "relative", overflow: "hidden", transition: "background .8s" }}>
      {sunOn && <div style={{ position: "absolute", inset: 0, background: NK.green, transition: "opacity .8s" }} />}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "8rem 2.5rem 6.5rem", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ maxWidth: 640 }}>
            <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: sunOn ? NK.navyDeep : NK.green, display: "block", marginBottom: "1rem" }}>
              Stay in the Loop
            </span>
            <h2 style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(36px,5.5vw,72px)", color: sunOn ? NK.navyDeep : "#fff", textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.05, margin: 0 }}>
              Ready to join the <span style={{ color: sunOn ? NK.navyDeep : NK.green }}>movement?</span>
            </h2>
            <p style={{ fontFamily: "var(--fb)", fontSize: 15, color: ctaColor, marginTop: "1rem", lineHeight: 1.7, opacity: 0.85 }}>
              Weekly climate opportunities, news, and challenge updates, straight to your inbox.
            </p>
          </div>
          <button
            onClick={() => setSunOn((s) => !s)}
            title="Bring the sun up"
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem", flexShrink: 0 }}
          >
            <Sun size={40} color={sunOn ? "#F6F8F4" : NK.green} style={{ animation: sunOn ? "none" : "nkSunSway 5s ease-in-out infinite" }} />
            <span style={{ fontFamily: "var(--fm)", fontSize: 9.5, color: ctaColor, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>
              {sunOn ? "sun's up" : "bring the sun up"}
            </span>
          </button>
        </div>

        {submitted ? (
          <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "rgba(76,184,44,0.15)", border: `1px solid ${NK.green}`, maxWidth: 440 }}>
            <p style={{ fontFamily: "var(--fb)", fontSize: 13, fontWeight: 700, color: NK.green, margin: 0 }}>You&apos;re subscribed! ✓</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
            style={{ display: "flex", gap: ".75rem", marginTop: "2.5rem", flexWrap: "wrap", maxWidth: 480 }}
          >
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{ flex: 1, minWidth: 220, padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: `2px solid ${sunOn ? NK.navyDeep : "rgba(255,255,255,0.15)"}`, color: ctaColor, fontFamily: "var(--fb)", fontSize: 14, outline: "none" }}
            />
            <button type="submit" style={{ padding: "14px 28px", background: btnBg, color: btnFg, border: "none", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "background .3s, color .3s" }}>
              Subscribe →
            </button>
          </form>
        )}

        <Link href="/opportunities" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", marginTop: "1.5rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: ctaColor, textDecoration: "none", borderBottom: `2px solid ${sunOn ? NK.navyDeep : "rgba(255,255,255,0.3)"}`, paddingBottom: 2 }}>
          Get Started Today <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function Home() {
  const { articles: liveNews, loading: newsLoading, error: newsError } = useNews({ limit: 3 });
  const [wordIdx, setWordIdx] = useState(0);
  const [videoModal, setVideoModal] = useState(false);
  const [videoIdx, setVideoIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((p) => (p + 1) % HERO_WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);

  const openChat = () => {
    // The floating ClimateAIChatbot manages its own open state; dispatch a
    // custom event it listens for so "Ask AI Now" can trigger it directly.
    window.dispatchEvent(new CustomEvent("kych:open-chat"));
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, 0.01);
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef);
  const toolsRef = useRef<HTMLDivElement>(null);
  const toolsInView = useInView(toolsRef);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const pillarsInView = useInView(pillarsRef);
  const storiesRef = useRef<HTMLDivElement>(null);
  const storiesInView = useInView(storiesRef);
  const newsRef = useRef<HTMLDivElement>(null);
  const newsInView = useInView(newsRef);

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: NK.bg, position: "relative", overflow: "hidden" }}>
        <div
          ref={heroRef}
          style={{
            maxWidth: 1320, margin: "0 auto", padding: "3.75rem 2.5rem 5.75rem",
            display: "grid", gridTemplateColumns: "1.04fr 0.96fr", gap: "4.25rem", alignItems: "center",
          }}
          className="nk-hero-grid"
        >
          <div style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(20px)", transition: "opacity .8s ease, transform .8s ease" }}>
            <Eyebrow color={NK.greenAlt}>Empowering youth, one climate solution at a time</Eyebrow>
            <GrowHeading as="h1" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(44px,5.4vw,84px)", color: NK.ink, lineHeight: 1.02, letterSpacing: "-0.02em", margin: 0 }}>
              Kenya Youth <span style={{ color: NK.green }}>Climate Hub.</span>
            </GrowHeading>

            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: 13, color: NK.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Built for</span>
              <span style={{ overflow: "hidden", display: "inline-block", height: "1.4em", verticalAlign: "bottom" }}>
                <span key={wordIdx} style={{ display: "inline-block", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 15, color: NK.greenAlt, borderBottom: `2px solid ${NK.green}`, animation: "nkRollIn .55s cubic-bezier(.16,.84,.3,1)" }}>
                  {HERO_WORDS[wordIdx]}
                </span>
              </span>
            </div>

            <p style={{ fontFamily: "var(--fb)", fontSize: "1.1rem", color: NK.muted, lineHeight: 1.75, marginTop: "1.5rem", maxWidth: 560 }}>
              Join a community of young innovators addressing climate challenges and building a sustainable future for Kenya. Funding, skills, policy spaces and innovation, across all 47 counties.
            </p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "2.25rem", flexWrap: "wrap" }}>
              <HeroButton href="/opportunities" primary>Find Funding</HeroButton>
              <HeroButton href="/programs">View Programs</HeroButton>
            </div>

            <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
              {[["47", "Counties"], ["15–35", "Age focus"], ["2020", "Founded"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.6rem", color: NK.green }}>{n}</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 10.5, color: NK.mutedLabel, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "stretch", gap: "1rem", opacity: heroInView ? 1 : 0, transform: heroInView ? "translateX(0)" : "translateX(40px)", transition: "opacity .9s ease .1s, transform .9s ease .1s" }} className="nk-hero-visual">
            {/* Green accent bar */}
            <div style={{ width: 36, background: NK.green, flexShrink: 0 }} />

            <div style={{ position: "relative", flex: 1 }}>
              <div style={{ position: "relative", height: 470, overflow: "hidden", border: `2px solid ${NK.ink}` }}>
                <img src="/nk/hero1.jpg" alt="Youth climate action in Kenya" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
                <div style={{ position: "absolute", top: 14, right: 14, background: NK.navyDeep, color: "#fff", padding: "1rem 1.25rem" }}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.4rem", color: NK.green }}>47</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 9.5, color: NK.mutedOnDark, textTransform: "uppercase" }}>Counties connected</div>
                </div>
              </div>
              <div style={{ position: "absolute", left: -20, bottom: -30, width: 190, height: 190, border: `8px solid ${NK.bg}`, overflow: "hidden", boxShadow: nkShadow(NK.ink, 10) }}>
                <img src="/nk/sheria.jpg" alt="Climate innovators" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            {/* Rotated label */}
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
              <span style={{
                writingMode: "vertical-rl", transform: "rotate(180deg)",
                fontFamily: "var(--fm)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: NK.mutedLabel,
                whiteSpace: "nowrap",
              }}>
                Youth-led since 2020
              </span>
            </div>
          </div>
        </div>
      </section>

      <PartnerBoard />

      {/* ── WHO WE ARE ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "7rem 2.5rem 2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4.75rem", alignItems: "center" }} className="nk-2col">
          <RevealDiv>
            <div style={{ position: "relative" }}>
              <img src="/nk/hero2.jpg" alt="Kenya Youth Climate Hub" style={{ width: "100%", height: 480, objectFit: "cover", objectPosition: "center 20%", border: `2px solid ${NK.ink}` }} />
              <div style={{ position: "absolute", bottom: -18, left: -18, background: NK.navyDeep, color: "#fff", padding: "1rem 1.25rem" }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.5rem", color: NK.green }}>2020</div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 9.5, color: NK.mutedOnDark, textTransform: "uppercase" }}>Founded</div>
              </div>
              <div style={{ position: "absolute", top: -18, right: -18, background: NK.white, border: `2px solid ${NK.ink}`, boxShadow: nkShadow(NK.ink, 6), padding: ".9rem 1.1rem" }}>
                <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: NK.greenAlt, textTransform: "uppercase", letterSpacing: "0.1em" }}>Powered by</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".95rem", color: NK.ink }}>Afosi</div>
              </div>
            </div>
          </RevealDiv>
          <RevealDiv delay={0.1}>
            <Eyebrow>Who We Are</Eyebrow>
            <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(32px,3.8vw,54px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", lineHeight: 1.08, margin: "0 0 1.5rem" }}>
              More than a hub, <span style={{ color: NK.green }}>a movement.</span>
            </GrowHeading>
            <p style={{ fontFamily: "var(--fb)", fontSize: "1.02rem", color: NK.muted, lineHeight: 1.8, marginBottom: "1.5rem" }}>
              KYCH serves as a national digital platform for Kenya&apos;s youth climate movement, connecting ambition to systems change. It operates under <strong style={{ color: NK.ink }}>Afosi, Action for Sustainability Initiative</strong>, blending over a decade of evidence-based development with youth-first design.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.75rem" }} className="nk-2col-tight">
              {[["Mission", "Equip every young Kenyan to lead climate action."], ["Vision", "A Kenya where young people lead the response."]].map(([label, text]) => (
                <div key={label} style={{ border: `2px solid ${NK.ink}`, padding: "1.25rem" }}>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: NK.greenAlt, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: ".5rem" }}>{label}</div>
                  <p style={{ fontFamily: "var(--fb)", fontSize: ".82rem", color: NK.muted, lineHeight: 1.6, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
            <blockquote style={{ borderLeft: `3px solid ${NK.green}`, background: NK.tintGreen, padding: "1rem 1.25rem", margin: "0 0 2rem" }}>
              <p style={{ fontFamily: "var(--fb)", fontSize: ".95rem", color: NK.muted, lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>
                &quot;Afosi generates the evidence. Youth generate the solutions. The Hub connects them to scale.&quot;
              </p>
            </blockquote>
            <HeroButton href="/about" primary>Our Story &amp; Team</HeroButton>
          </RevealDiv>
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "6.25rem 2.5rem 1.5rem" }}>
          <div ref={valuesRef} style={{ marginBottom: "3rem", opacity: valuesInView ? 1 : 0, transform: valuesInView ? "translateY(0)" : "translateY(24px)", transition: "opacity .7s ease, transform .7s ease" }}>
            <Eyebrow>What Drives Us</Eyebrow>
            <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
              Our core <span style={{ color: NK.green }}>values.</span>
            </GrowHeading>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
            {VALUES.map((v, i) => <ValueCard key={v.title} v={v} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── PLATFORM TOOLS ── */}
      <section style={{ background: NK.navyDeep, marginTop: "6.25rem" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "6.25rem 2.5rem" }}>
          <div ref={toolsRef} style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap", opacity: toolsInView ? 1 : 0, transform: toolsInView ? "translateY(0)" : "translateY(24px)", transition: "opacity .7s ease, transform .7s ease" }}>
            <div>
              <Eyebrow>Platform Tools</Eyebrow>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: "#fff", textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                Everything you need to <span style={{ color: NK.green }}>act.</span>
              </GrowHeading>
            </div>
            <p style={{ fontFamily: "var(--fb)", fontSize: ".95rem", color: NK.mutedOnDark, lineHeight: 1.7, maxWidth: 320, margin: 0 }}>
              One platform connecting Kenya&apos;s youth to funding, knowledge, programs, and climate expertise.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
            {PLATFORM_TOOLS.map((t, i) => <ToolCard key={t.num} tool={t} index={i} onChatOpen={openChat} />)}
          </div>
        </div>
      </section>

      {/* ── FIVE PILLARS ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "6.25rem 2.5rem 2.5rem" }}>
          <div ref={pillarsRef} style={{ marginBottom: "2.5rem", opacity: pillarsInView ? 1 : 0, transform: pillarsInView ? "translateY(0)" : "translateY(24px)", transition: "opacity .7s ease, transform .7s ease" }}>
            <Eyebrow>What We Do</Eyebrow>
            <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
              Five pillars of <span style={{ color: NK.green }}>climate action.</span>
            </GrowHeading>
            <p style={{ fontFamily: "var(--fb)", fontSize: "1rem", color: NK.muted, marginTop: ".75rem", maxWidth: 620 }}>
              Focused strategic areas designed to accelerate climate action through youth-led innovation across all 47 counties.
            </p>
          </div>
          <div>
            {PILLARS.map((p, i) => <PillarRow key={p.title} p={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── IMMERSIVE VIDEO (kept from previous build) ── */}
      <section style={{ position: "relative", width: "100%", height: "55vh", minHeight: 380, background: "#000", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "6.25rem" }}>
        <video key={PREVIEW_VIDEOS[videoIdx]} src={PREVIEW_VIDEOS[videoIdx]} autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
        <button onClick={() => setVideoIdx((p) => (p - 1 + PREVIEW_VIDEOS.length) % PREVIEW_VIDEOS.length)} style={{ position: "absolute", left: "2rem", zIndex: 2, width: 50, height: 50, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => setVideoIdx((p) => (p + 1) % PREVIEW_VIDEOS.length)} style={{ position: "absolute", right: "2rem", zIndex: 2, width: 50, height: 50, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <ChevronRight size={24} />
        </button>
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.1rem" }}>
          <button onClick={() => setVideoModal(true)} style={{ width: 76, height: 76, background: NK.green, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 12px rgba(76,184,44,0.25)" }}>
            <div style={{ width: 0, height: 0, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: "18px solid #fff", marginLeft: 5 }} />
          </button>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.3rem", color: "#fff", textAlign: "center" }}>
            See our impact in action<br /><span style={{ fontSize: ".7rem", fontWeight: 400, opacity: 0.7 }}>Video {videoIdx + 1} of {PREVIEW_VIDEOS.length}</span>
          </div>
        </div>
      </section>
      {videoModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setVideoModal(false)} style={{ position: "absolute", top: "2rem", right: "2rem", background: "none", border: "none", color: "#fff", fontSize: "2.5rem", cursor: "pointer" }}>&times;</button>
          <video key={PREVIEW_VIDEOS[videoIdx]} src={PREVIEW_VIDEOS[videoIdx]} autoPlay controls playsInline style={{ width: "90%", maxWidth: 1000, maxHeight: "80vh" }} />
        </div>
      )}

      {/* ── SUCCESS STORIES ── */}
      <section style={{ background: NK.tintGreen, marginTop: "5rem" }}>
        <div style={{ padding: "6.25rem 0" }}>
          <div className="px-6 md:px-16" style={{ maxWidth: 1320, margin: "0 auto", paddingLeft: "2.5rem", paddingRight: "2.5rem" }}>
            <div ref={storiesRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap", marginBottom: "3rem", opacity: storiesInView ? 1 : 0, transform: storiesInView ? "translateY(0)" : "translateY(24px)", transition: "opacity .7s ease, transform .7s ease" }}>
              <div>
                <Eyebrow>Featured</Eyebrow>
                <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                  Climate startup <span style={{ color: NK.green }}>stories.</span>
                </GrowHeading>
              </div>
              <Link href="/success-stories" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: NK.ink, textDecoration: "none", borderBottom: `2px solid ${NK.ink}`, paddingBottom: 2 }}>
                See All Stories <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="hide-scrollbar" style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingLeft: "2.5rem", paddingRight: "2.5rem", paddingBottom: "1rem" }}>
            {successStories.map((s, i) => <StoryCard key={s.id} story={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── PARTNERS MARQUEE ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "6.25rem 2.5rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <Eyebrow>Trusted Partners &amp; Collaborators</Eyebrow>
          </div>
          <div style={{ border: `2px solid ${NK.ink}`, background: NK.white, overflow: "hidden" }}>
            <div style={{ display: "flex", width: "max-content", animation: "nkPartnerScroll 42s linear infinite" }}>
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <div key={p.name + i} style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 260, height: 140, flexShrink: 0, padding: "2rem",
                  borderRight: "1px solid rgba(16,28,51,0.16)",
                }}>
                  <img src={p.logo} alt={p.name} style={{ height: 38, maxWidth: 140, objectFit: "contain" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section style={{ background: NK.bg }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "2.5rem 2.5rem 6.25rem" }}>
          <div ref={newsRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap", marginBottom: "3rem", opacity: newsInView ? 1 : 0, transform: newsInView ? "translateY(0)" : "translateY(24px)", transition: "opacity .7s ease, transform .7s ease" }}>
            <div>
              <Eyebrow>Latest</Eyebrow>
              <GrowHeading as="h2" style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "clamp(34px,4vw,56px)", color: NK.ink, textTransform: "uppercase", letterSpacing: "-0.02em", margin: 0 }}>
                News, events &amp; <span style={{ color: NK.green }}>resources.</span>
              </GrowHeading>
            </div>
            <Link href="/news" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: NK.ink, textDecoration: "none", borderBottom: `2px solid ${NK.ink}`, paddingBottom: 2 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }} className="nk-grid-3">
            {newsLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ ...nkCard, boxShadow: nkShadow(NK.ink), height: 320 }}>
                    <div style={{ height: 160, background: "rgba(16,28,51,0.06)" }} />
                    <div style={{ padding: "1.5rem" }}>
                      <div style={{ height: 14, background: "rgba(16,28,51,0.08)", width: "70%", marginBottom: 10 }} />
                      <div style={{ height: 14, background: "rgba(16,28,51,0.08)" }} />
                    </div>
                  </div>
                ))
              : newsError
              ? <div style={{ gridColumn: "1/-1", padding: "2rem", textAlign: "center", color: NK.muted, fontFamily: "var(--fb)" }}>Unable to load news right now. Please try again later.</div>
              : liveNews.length === 0
              ? <div style={{ gridColumn: "1/-1", padding: "2rem", textAlign: "center", color: NK.muted, fontFamily: "var(--fb)" }}>No news articles available right now. Check back soon.</div>
              : liveNews.slice(0, 3).map((n, i) => <NewsCard key={n.id} article={n} index={i} />)}
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}

function RevealDiv({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function HeroButton({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href as any}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: ".5rem",
        padding: "16px 32px", fontFamily: "var(--fs)", fontWeight: 700, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
        textDecoration: "none", transition: "background .2s, color .2s",
        background: primary ? (hov ? NK.greenAlt : NK.green) : (hov ? NK.ink : "transparent"),
        color: primary ? NK.navyDeep : (hov ? "#fff" : NK.ink),
        border: primary ? "none" : `2px solid ${NK.ink}`,
      }}
    >
      {children}
    </Link>
  );
}

function NewsCard({ article, index }: { article: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hov, setHov] = useState(false);
  return (
    <a
      ref={ref as any}
      href={article.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...nkCard, display: "block", textDecoration: "none",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity .5s ease ${index * 0.08}s, transform .5s ease ${index * 0.08}s, box-shadow .2s, translate .2s`,
        boxShadow: hov ? nkShadow(NK.green) : nkShadow(NK.ink),
        translate: hov ? "0 -4px" : "0 0",
      }}
    >
      <div style={{ height: 170, overflow: "hidden", borderBottom: `2px solid ${NK.ink}`, background: GRADIENT_MAP[article.category] || NK.green }}>
        {article.image_url && (
          <img src={article.image_url} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      <div style={{ padding: "1.5rem" }}>
        <span style={{ fontFamily: "var(--fm)", fontWeight: 700, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 9px", background: NK.green, color: NK.navyDeep }}>
          {article.category}
        </span>
        <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".95rem", color: NK.ink, marginTop: ".9rem", lineHeight: 1.35 }}>{article.title}</div>
        <div style={{ fontFamily: "var(--fb)", fontSize: ".8rem", color: NK.muted, marginTop: ".5rem", lineHeight: 1.55 }}>{article.excerpt}</div>
      </div>
    </a>
  );
}
