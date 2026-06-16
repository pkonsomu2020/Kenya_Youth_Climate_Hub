"use client";

import Link from 'next/link';
import { Newsletter } from "@/components/Newsletter";
import { DollarSign, BookOpen, Trophy, Calendar, Leaf, Lightbulb, Handshake, Rocket, CalendarDays, Bot, Recycle, Sun, Sprout, Droplets, Trees, Globe, FileText, ExternalLink, ChevronLeft, ChevronRight, ArrowRight, CheckCircle, MapPin, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useNews } from "@/lib/useNews";
import { useContent } from "@/lib/contentStore";
import { successStories } from "@/lib/data/successStories";
import { AnimatePresence, motion } from "framer-motion";
import * as Icons from "lucide-react";

// ── Icon mapper ──────────────────────────────────────────────
const iconMap: Record<string, LucideIcon> = {
  Leaf, Lightbulb, DollarSign, BookOpen, Handshake, Rocket,
  CalendarDays, Bot, Recycle, Sun, Sprout, Droplets, Trees,
  Globe, FileText, Trophy, Zap,
};
const renderIcon = (iconName: string, size: number = 24) => {
  const I = iconMap[iconName];
  return I ? <I size={size} /> : null;
};
function renderNewsIcon(iconName: string, size = 48) {
  const col = Icons as unknown as Record<string, LucideIcon>;
  const I = col[iconName];
  return I ? <I size={size} strokeWidth={1.5} /> : <Globe size={size} strokeWidth={1.5} />;
}

// ── Shared useInView hook ────────────────────────────────────
function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}

// ── Hero slides (uses real hero images) ─────────────────────
const heroSlides = [
  {
    id: 1,
    subtitle: "Empowering youth, one climate solution at a time.",
    title: (<>Welcome to <span style={{ color: "#5dba2f" }}>Kenya Youth</span><br /><span style={{ color: "#5dba2f" }}>Climate Hub</span></>),
    desc: "Join a community of young innovators addressing climate challenges and building a sustainable future for Kenya.",
    img: "/hero_1.png",
  },
  {
    id: 2,
    subtitle: "Climate Innovation & Entrepreneurship",
    title: (<>Incubating <span style={{ color: "#5dba2f" }}>Green</span><br /><span style={{ color: "#5dba2f" }}>Startups</span></>),
    desc: "Connecting young Kenyans to grants, fellowships, competitions, and jobs that match their climate ambitions.",
    img: "/hero_2.png",
  },
  {
    id: 3,
    subtitle: "Youth Climate Leadership",
    title: (<>Leading the <span style={{ color: "#5dba2f" }}>Change</span><br />Across Counties</>),
    desc: "Training Kenya's next climate negotiators, county advocates, and movement leaders to influence policy at every level.",
    img: "/hero_3.png",
  },
];

// ── Partners data ────────────────────────────────────────────
const partners = [
  { name: "UNICEF", logo: "/PARTNERS/UNICEF_Logo.png" },
  { name: "Yoma", logo: "/PARTNERS/YOMA_Logo.png" },
  { name: "Generation Unlimited", logo: "/PARTNERS/Logo_Generation_Unlimited_0.png.jpg" },
  { name: "STEM Impact Center", logo: "/PARTNERS/STEM IMPACT_Logo.png" },
  { name: "Green Army Foundation", logo: "/PARTNERS/GREEN ARMY_Logo.jpg" },
  { name: "Afosi", logo: "/PARTNERS/afosi_logo.png" },
  { name: "KCIC", logo: "/PARTNERS/KCIC_Logo.png" },
  { name: "Ministry of Environment", logo: "/PARTNERS/MIN_OF_ENVIRONMENT.jpg" },
];

// ── Pillar programs (real images) ────────────────────────────
const programs = [
  {
    num: "01", icon: "Leaf",
    title: "Youth Climate Leadership & Advocacy",
    desc: "Training Kenya's next climate negotiators, county advocates, and movement leaders to influence policy at every level.",
    image: "/Pillar_IMAGES/Youth Climate Leadership & Advocacy.jpeg",
  },
  {
    num: "02", icon: "Lightbulb",
    title: "Climate Innovation & Entrepreneurship",
    desc: "Incubating youth-led green startups — from clean energy to waste tech — through the Youth Climate Innovation Challenge.",
    image: "/Pillar_IMAGES/Climate Innovation & Entrepreneurship.jpeg",
  },
  {
    num: "03", icon: "DollarSign",
    title: "Climate Finance & Opportunity Access",
    desc: "Connecting young Kenyans to grants, fellowships, competitions, and jobs that match their climate ambitions.",
    image: "/Pillar_IMAGES/Climate Finance & Opportunity Access.jpeg",
  },
  {
    num: "04", icon: "BookOpen",
    title: "Capacity Building & Knowledge",
    desc: "Equipping young people with the skills, data, and tools to lead climate action through trainings and digital resources.",
    image: "/Pillar_IMAGES/Capacity Building & Knowledge.jpeg",
  },
  {
    num: "05", icon: "Handshake",
    title: "Partnerships & Ecosystem Building",
    desc: "Building bridges between youth, government, NGOs, development partners, and the private sector.",
    image: "/Pillar_IMAGES/Partnerships & Ecosystem Building.jpeg",
  },
];

// ── Platform features ────────────────────────────────────────
const features = [
  { icon: "BookOpen", num: "01", label: "E-Library & Resource Hub", desc: "Reports, toolkits, policy briefs, and research papers. Save them to your dashboard.", cta: "Browse Library", to: "/e-library" },
  { icon: "DollarSign", num: "02", label: "Funding & Opportunities", desc: "A live board of grants, fellowships, and internships with deadline alerts.", cta: "Find Funding", to: "/opportunities" },
  { icon: "Rocket", num: "03", label: "Programs & Challenges", desc: "Apply for incubators like the Youth Climate Innovation Challenge and mentorship programs.", cta: "View Programs", to: "/programs" },
  { icon: "CalendarDays", num: "04", label: "Events & Workshops", desc: "Register for bootcamps, policy dialogues, and webinars from KYCH and partners.", cta: "View Calendar", to: "/events" },
  { icon: "Bot", num: "05", label: "Climate AI Assistant", desc: "A 24/7 AI guide trained on Kenya's climate data, opportunities & resources.", cta: "Ask AI Now", to: "/dashboard" },
];

// ── Values ───────────────────────────────────────────────────
const values = [
  { num: "01", title: "Climate Justice", desc: "Fair outcomes for frontline communities" },
  { num: "02", title: "Youth Inclusion", desc: "Ages 15–35 at the centre of every decision" },
  { num: "03", title: "Gender Equity", desc: "Equal voice, equal access, equal impact" },
  { num: "04", title: "Innovation", desc: "Kenyan solutions for Kenyan challenges" },
  { num: "05", title: "Evidence-Based", desc: "Data-driven, research-backed action" },
  { num: "06", title: "Systems Change", desc: "Beyond symptoms — changing root causes" },
];

const GRADIENT_MAP: Record<string, string> = {
  News: "#059669", "Climate Insights": "#047857",
  "Success Stories": "#10B981", "Events Recap": "#10B981", "Partner Updates": "#059669",
};

const PREVIEW_VIDEOS = [
  "/c_df_b_e_bc_e_c_videomp_.mp4",
  "/e_a_ea_d_videomp_.mp4",
  "/e_b_d_a_be_e_f_mp_.mp4",
];



// ─────────────────────────────────────────────────────────────
// PILLAR CARD — pinned note style with slight tilt
// ─────────────────────────────────────────────────────────────
const TILT = [-4, -1.5, 0, 1.5, 4]; // degrees per card
const PIN_OFFSET = [18, 28, 50, 72, 62]; // % horizontal position of pin

function PillarCard({ pillar, index }: { pillar: typeof programs[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);
  const tilt = TILT[index] ?? 0;
  const pinX = PIN_OFFSET[index] ?? 50;

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? `rotate(${hovered ? tilt * 0.5 : tilt}deg) translateY(${hovered ? -10 : 0}px)`
          : "translateY(60px) scale(0.95)",
        transition: `opacity 0.7s ease ${index * 0.12}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)`,
        cursor: "pointer",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pin */}
      <div style={{
        position: "absolute",
        top: -10,
        left: `${pinX}%`,
        transform: "translateX(-50%)",
        width: 16, height: 16,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 35%, #e05c2f, #b83e18)",
        boxShadow: "0 3px 8px rgba(0,0,0,.4), inset 0 1px 2px rgba(255,255,255,.3)",
        zIndex: 10,
      }} />

      {/* Card */}
      <div style={{
        background: "var(--section-light)",
        borderRadius: 16,
        padding: "2rem 1.75rem 1.75rem",
        border: "1px solid rgba(0,0,0,.08)",
        boxShadow: hovered
          ? "0 24px 60px -10px rgba(0,0,0,.22), 0 8px 20px -5px rgba(0,0,0,.12)"
          : "0 8px 30px -5px rgba(0,0,0,.15), 0 2px 8px -2px rgba(0,0,0,.08)",
        transition: "box-shadow 0.3s ease",
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle texture lines */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,.03) 28px)", borderRadius: 16, pointerEvents: "none" }} />

        {/* Icon badge */}
        <div style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          width: 36, height: 36, borderRadius: 10,
          background: "var(--section-dark)", opacity: 0.07,
        }} />
        <div style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          width: 36, height: 36, borderRadius: 10,
          background: "rgba(93,186,47,.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {renderIcon(pillar.icon, 18)}
        </div>

        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Number */}
          <div style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(2.5rem,6vw,4rem)",
            color: "#5dba2f",
            lineHeight: 1,
            marginBottom: ".5rem",
            letterSpacing: "-0.04em",
          }}>
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 900,
            fontSize: "1.1rem",
            color: "var(--foreground)",
            lineHeight: 1.25,
            marginBottom: ".85rem",
            letterSpacing: "-0.02em",
          }}>
            {pillar.title}
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: ".82rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.7,
            flex: 1,
          }}>
            {pillar.desc}
          </p>

          {/* Step indicator */}
          <div style={{
            marginTop: "1.25rem",
            paddingTop: ".85rem",
            borderTop: "1px dashed rgba(0,0,0,.1)",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--muted-foreground)",
          }}>
            PILLAR {String(index + 1).padStart(2, "0")} / 05
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TOOL CARD
// ─────────────────────────────────────────────────────────────
function ToolCard({ tool, index }: { tool: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="rounded-2xl p-7 cursor-pointer flex flex-col justify-between"
      style={{
        background: hovered ? "#5dba2f" : "var(--card-dark)",
        border: `1px solid ${hovered ? "#5dba2f" : "var(--border)"}`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${index * 0.1}s, transform 0.7s ease ${index * 0.1}s, background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`,
        minHeight: "260px",
        boxShadow: hovered ? "0 20px 40px -10px rgba(93,186,47,0.25)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: hovered ? "rgba(255,255,255,0.2)" : "rgba(93,186,47,0.1)" }}
          >
            <span style={{ color: hovered ? "#fff" : "#5dba2f" }}>{renderIcon(tool.icon, 20)}</span>
          </div>
          <span className="font-black" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.2em", color: hovered ? "rgba(255,255,255,0.5)" : "#334155" }}>
            {tool.num}
          </span>
        </div>
        <h3 className="font-extrabold tracking-tight mb-3" style={{ fontSize: "16px", color: "var(--text-on-dark)", lineHeight: "1.3" }}>
          {tool.label}
        </h3>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "13px", color: hovered ? "rgba(255,255,255,0.85)" : "var(--muted-foreground)", lineHeight: "1.6" }}>
          {tool.desc}
        </p>
      </div>
      <Link
        href={tool.to}
        className="flex items-center gap-2 font-black uppercase mt-6 transition-all duration-200"
        style={{ fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.1em", color: hovered ? "#ffffff" : "#5dba2f", textDecoration: "none" }}
      >
        {tool.cta}
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STORY CARD (horizontal scroll)
// ─────────────────────────────────────────────────────────────
function StoryCard({ story, index }: { story: typeof successStories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-700"
      style={{
        width: "clamp(280px, 30vw, 380px)",
        background: "var(--card)",
        boxShadow: hovered ? "0 30px 60px -15px rgba(0,0,0,0.15)" : "0 4px 20px -5px rgba(0,0,0,0.06)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${40 + index * 10}px)`,
        transitionDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ height: 240 }}>
        {story.photo ? (
          <img
            src={story.photo}
            alt={story.name}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{ objectPosition: "center 15%", transform: hovered ? "scale(1.06)" : "scale(1)" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", background: story.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trees size={64} color="rgba(255,255,255,0.3)" />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)" }} />
        <div className="absolute top-4 left-4">
          <span className="font-black uppercase px-2 py-1 rounded" style={{ background: "#5dba2f", color: "#fff", fontFamily: "Montserrat, sans-serif", fontSize: "9px", letterSpacing: "0.15em" }}>
            {story.tag}
          </span>
        </div>
        <div className="absolute bottom-4 left-5">
          <h3 className="font-extrabold tracking-tight uppercase" style={{ color: "#fff", fontSize: "20px" }}>
            {story.company}
          </h3>
        </div>
      </div>
      <div className="p-7">
        <p style={{ color: "#6b7280", fontFamily: "Montserrat, sans-serif", fontSize: "14px", lineHeight: "1.7" }}>
          {story.excerpt}
        </p>
        <div className="flex items-center justify-between mt-6 pt-5" style={{ borderTop: "1px solid #f0e8db" }}>
          <div>
            <span className="uppercase block" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "9px", color: "#9ca3af", letterSpacing: "0.15em" }}>Founder</span>
            <span className="font-black" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "14px", color: "#5dba2f" }}>
              {story.name}
            </span>
          </div>
          <Link
            href={`/success-stories/${story.id}`}
            className="flex items-center gap-2 font-black uppercase transition-all"
            style={{ color: "#5dba2f", fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.08em", textDecoration: "none" }}
          >
            Read Story
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#5dba2f" }}>
              <ArrowRight size={14} color="#fff" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────────────────────
// PARTNER BADGE (real logo images)
// ─────────────────────────────────────────────────────────────
function PartnerBadge({ partner, index }: { partner: typeof partners[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center py-5 px-4 rounded-xl cursor-default transition-all duration-300"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 60}ms`,
        background: hovered ? "var(--section-dark)" : "var(--cd)",
        border: `1px solid ${hovered ? "#5dba2f" : "transparent"}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={partner.logo}
        alt={partner.name}
        style={{ height: "40px", maxWidth: "120px", objectFit: "contain", filter: hovered ? "brightness(0) invert(1)" : "none", transition: "filter 0.3s" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────
export default function Home() {
  const { content } = useContent();
  const s = content.settings;
  const { articles: liveNews, loading: newsLoading, error: newsError } = useNews({ limit: 3 });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Auto-advance hero slider
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((p) => (p === 0 ? heroSlides.length - 1 : p - 1));

  const handleNextVideo = (e?: React.MouseEvent) => { if (e) e.stopPropagation(); setCurrentVideoIndex((p) => (p + 1) % PREVIEW_VIDEOS.length); };
  const handlePrevVideo = (e?: React.MouseEvent) => { if (e) e.stopPropagation(); setCurrentVideoIndex((p) => (p - 1 + PREVIEW_VIDEOS.length) % PREVIEW_VIDEOS.length); };

  // ── Refs for scroll-reveal sections ──
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutInView = useInView(aboutRef);
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef);
  const pillarsRef = useRef<HTMLDivElement>(null);
  const pillarsInView = useInView(pillarsRef);
  const toolsRef = useRef<HTMLDivElement>(null);
  const toolsInView = useInView(toolsRef);
  const storiesRef = useRef<HTMLDivElement>(null);
  const storiesInView = useInView(storiesRef);
  const newsRef = useRef<HTMLDivElement>(null);
  const newsInView = useInView(newsRef);

  // ── News cards ──
  const newsCards = newsLoading
    ? Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "var(--card-dark)" }}>
          <div style={{ height: 200, background: "rgba(255,255,255,0.05)", animation: "shimmer 1.5s infinite" }} />
          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: ".6rem" }}>
            <div style={{ height: 14, borderRadius: 4, background: "rgba(255,255,255,0.08)", animation: "shimmer 1.5s infinite" }} />
            <div style={{ height: 14, borderRadius: 4, background: "rgba(255,255,255,0.08)", width: "75%", animation: "shimmer 1.5s infinite" }} />
          </div>
        </div>
      ))
    : newsError
    ? [<div key="err" style={{ gridColumn: "1/-1", padding: "2rem", background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 16, color: "#fca5a5", textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>Unable to load news right now. Please try again later.</div>]
    : liveNews.length === 0
    ? [<div key="empty" style={{ gridColumn: "1/-1", padding: "2rem", background: "rgba(255,255,255,0.05)", borderRadius: 16, color: "var(--muted-foreground)", textAlign: "center", fontFamily: "Montserrat, sans-serif" }}>No news articles available right now. Check back soon.</div>]
    : liveNews.slice(0, 3).map((n, idx) => (
        <a
          key={n.id}
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl overflow-hidden block"
          style={{
            textDecoration: "none",
            background: "var(--card-dark)",
            border: "1px solid rgba(255,255,255,0.06)",
            opacity: 1,
            transform: "translateY(0)",
            transition: `all 0.7s ease ${idx * 0.15}s`,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#5dba2f"; (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px -10px rgba(93,186,47,0.2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
        >
          {n.image_url ? (
            <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
              <img src={n.image_url} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => { const el = e.target as HTMLImageElement; el.parentElement!.style.background = GRADIENT_MAP[n.category] || "#059669"; el.style.display = "none"; }} />
              <span style={{ position: "absolute", bottom: ".5rem", right: ".5rem", background: "rgba(0,0,0,.5)", color: "#fff", fontSize: ".6rem", padding: ".2rem .5rem", borderRadius: 4, fontFamily: "Montserrat, sans-serif" }}>{n.source}</span>
            </div>
          ) : (
            <div style={{ height: 200, background: GRADIENT_MAP[n.category] || "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.35)", position: "relative" }}>
              {renderNewsIcon(n.icon || "Globe", 48)}
              <span style={{ position: "absolute", bottom: ".5rem", right: ".5rem", background: "rgba(0,0,0,.25)", color: "rgba(255,255,255,.8)", fontSize: ".6rem", padding: ".2rem .5rem", borderRadius: 4, fontFamily: "Montserrat, sans-serif" }}>{n.source}</span>
            </div>
          )}
          <div style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
              <span style={{ background: "#5dba2f", color: "#fff", fontSize: "9px", fontFamily: "Montserrat, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>{n.category}</span>
              <span style={{ fontSize: ".67rem", color: "var(--muted-foreground)", fontFamily: "Montserrat, sans-serif" }}>{n.date}</span>
            </div>
            <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: ".95rem", lineHeight: 1.3, color: "var(--text-on-dark)", marginBottom: ".4rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: ".4rem" }}>
              <span>{n.title}</span>
              <ExternalLink size={12} style={{ flexShrink: 0, marginTop: 2, color: "var(--muted-foreground)" }} />
            </div>
            <div style={{ fontSize: ".78rem", color: "var(--muted-foreground)", lineHeight: 1.55, fontFamily: "Montserrat, sans-serif" }}>{n.excerpt}</div>
          </div>
        </a>
      ));

  return (
    <>
      {/* ════════════════════════════════════════════════════
          HERO — full-screen image slider
          ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "95vh", display: "flex", alignItems: "center", background: "var(--section-dark)" }}>
        {/* Background with Framer Motion zoom */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.5, ease: "easeInOut" }, scale: { duration: 8, ease: "linear" } }}
            className="absolute inset-0 z-0 origin-center"
          >
            <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)" }} />
            <div className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.35)" }} />
            <img
              src={heroSlides[currentSlide].img}
              alt="Hero Background"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-20 w-full px-6 md:px-16" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: "10rem", paddingBottom: "6rem" }}>
          <div style={{ maxWidth: "700px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{ fontSize: "0.7rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.75)", textTransform: "uppercase", marginBottom: "1.25rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ width: "2.5rem", height: "2px", background: "#5dba2f", display: "inline-block", flexShrink: 0 }} />
                  {heroSlides[currentSlide].subtitle}
                </div>
                <h1
                  className="font-extrabold leading-tight"
                  style={{ fontFamily: "Montserrat, sans-serif", fontSize: "clamp(42px, 6.5vw, 88px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: "1.5rem" }}
                >
                  {heroSlides[currentSlide].title}
                </h1>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "clamp(16px,1.8vw,20px)", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: "580px", fontFamily: "Montserrat, sans-serif" }}>
                  {heroSlides[currentSlide].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/opportunities"
                className="flex items-center gap-2 font-black uppercase transition-all"
                style={{ background: "#5dba2f", color: "#0A0A0A", padding: "16px 32px", borderRadius: "6px", fontSize: "12px", letterSpacing: "0.12em", fontFamily: "Montserrat, sans-serif", textDecoration: "none", boxShadow: "0 0 20px rgba(93,186,47,0.3)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#4aa324"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5dba2f"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <DollarSign size={16} /> Find Funding
              </Link>
              <Link
                href="/programs"
                className="flex items-center gap-2 font-black uppercase transition-all"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "16px 32px", borderRadius: "6px", fontSize: "12px", letterSpacing: "0.12em", fontFamily: "Montserrat, sans-serif", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >
                <Trophy size={16} /> View Programs
              </Link>
            </motion.div>
          </div>

          {/* Slide controls */}
          <div className="absolute bottom-10 right-6 md:right-16 z-30 flex items-center gap-6">
            <div className="hidden md:flex gap-2 mr-4">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{ height: "6px", width: currentSlide === idx ? "3rem" : "0.75rem", borderRadius: "9999px", background: currentSlide === idx ? "#5dba2f" : "rgba(255,255,255,0.35)", border: "none", cursor: "pointer", transition: "all 0.5s" }}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={prevSlide} style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#5dba2f"; (e.currentTarget as HTMLElement).style.borderColor = "#5dba2f"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; }}>
                <ChevronLeft size={22} />
              </button>
              <button onClick={nextSlide} style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#5dba2f"; (e.currentTarget as HTMLElement).style.borderColor = "#5dba2f"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; }}>
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PARTNERS MARQUEE
          ════════════════════════════════════════════════════ */}
      <div className="marq-bar">
        <div className="marq-track">
          {[...partners, ...partners].map((p, i) => (
            <div key={i} className="m-chip" style={{ padding: "0.5rem 1rem", border: "none", gap: 0, background: "transparent" }}>
              <img src={p.logo} alt={p.name} style={{ height: "40px", maxWidth: "140px", objectFit: "contain" }} />
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          ABOUT — dark navy split
          ════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16 overflow-hidden" style={{ background: "var(--section-dark)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Image */}
            <div
              ref={aboutRef}
              className="relative transition-all duration-1000"
              style={{ opacity: aboutInView ? 1 : 0, transform: aboutInView ? "translateX(0)" : "translateX(-60px)" }}
            >
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img src="/kych_hero.jpg" alt="Kenya Youth Climate Hub" className="w-full h-full object-cover" style={{ objectPosition: "center 20%" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,23,42,0.6) 0%, transparent 50%)" }} />
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-xl p-5" style={{ background: "#5dba2f" }}>
                <div className="font-black leading-none" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "28px", color: "#fff" }}>2020</div>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.8)", marginTop: "4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Founded</div>
              </div>
              <div className="absolute -top-4 -left-4 rounded-xl px-4 py-3" style={{ background: "var(--card-dark)", border: "1px solid rgba(93,186,47,0.2)" }}>
                <div style={{ fontFamily: "Montserrat, sans-serif", fontSize: "9px", color: "#5dba2f", letterSpacing: "0.15em", textTransform: "uppercase" }}>Powered by</div>
                <div className="font-black" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "14px", color: "#fff" }}>Afosi</div>
              </div>
            </div>

            {/* Text */}
            <div
              className="transition-all duration-1000 delay-200"
              style={{ opacity: aboutInView ? 1 : 0, transform: aboutInView ? "translateX(0)" : "translateX(60px)" }}
            >
              <span className="uppercase font-black" style={{ color: "#5dba2f", fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.25em" }}>Who We Are</span>
              <h2 className="font-extrabold tracking-tight leading-none mt-4 mb-8" style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "var(--text-on-dark)" }}>
                MORE THAN<br />A HUB, <span style={{ color: "#5dba2f" }}>A</span><br />MOVEMENT
              </h2>
              <div className="h-px w-20 mb-8" style={{ background: "#5dba2f" }} />
              <p className="mb-4" style={{ color: "var(--muted-foreground)", fontSize: "17px", lineHeight: "1.8", fontFamily: "Montserrat, sans-serif" }}>
                KYCH serves as a national digital platform for Kenya's youth climate movement, connecting ambition to systems change. It operates under <strong style={{ color: "var(--muted-foreground)" }}>Afosi — Action for Sustainability Initiative</strong>, blending over a decade of evidence-based development with youth-first design.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                {[
                  { label: "Mission", text: "\"Equip every young Kenyan to lead climate action.\"" },
                  { label: "Vision", text: "\"A Kenya where young people don't just adapt to climate change — they lead the response.\"" },
                ].map((item) => (
                  <div key={item.label} className="p-5 rounded-xl" style={{ background: "rgba(93,186,47,0.07)", border: "1px solid rgba(93,186,47,0.15)" }}>
                    <div className="font-black uppercase mb-2" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "9px", letterSpacing: "0.2em", color: "#5dba2f" }}>{item.label}</div>
                    <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "13px", color: "var(--muted-foreground)", lineHeight: "1.6", fontStyle: "italic" }}>{item.text}</p>
                  </div>
                ))}
              </div>
              <blockquote className="mb-10 pl-5" style={{ borderLeft: "3px solid #5dba2f" }}>
                <p style={{ color: "var(--muted-foreground)", fontSize: "15px", lineHeight: "1.7", fontFamily: "Montserrat, sans-serif", fontStyle: "italic" }}>
                  "Afosi generates the evidence. Youth generate the solutions. The Hub connects them to scale."
                </p>
              </blockquote>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 font-black uppercase transition-all duration-300"
                style={{ background: "#5dba2f", color: "#fff", padding: "16px 32px", borderRadius: "4px", fontSize: "12px", letterSpacing: "0.12em", fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#4aa324"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#5dba2f"; }}
              >
                Our Story & Team <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          VALUES — cream grid with borders
          ════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-light)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={valuesRef}
            className="mb-20 transition-all duration-1000"
            style={{ opacity: valuesInView ? 1 : 0, transform: valuesInView ? "translateY(0)" : "translateY(30px)" }}
          >
            <span className="uppercase font-black" style={{ color: "#5dba2f", fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.25em" }}>What Drives Us</span>
            <h2 className="font-extrabold tracking-tight leading-none mt-3" style={{ fontSize: "clamp(36px,5.5vw,68px)", color: "var(--foreground)" }}>
              OUR <span style={{ color: "#5dba2f" }}>CORE</span><br />VALUES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => {
              const isLastRow = i >= values.length - (values.length % 3 || 3);
              const isRightCol = (i % 3) === 2;
              return (
                <ValueRow key={v.num} value={v} index={i} isLastRow={isLastRow} isRightCol={isRightCol} inView={valuesInView} />
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          PLATFORM TOOLS — dark navy cards
          ════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-dark)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={toolsRef}
            className="mb-16 transition-all duration-1000"
            style={{ opacity: toolsInView ? 1 : 0, transform: toolsInView ? "translateY(0)" : "translateY(30px)" }}
          >
            <div className="flex items-end justify-between flex-wrap gap-8">
              <div>
                <span className="uppercase font-black" style={{ color: "#5dba2f", fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.25em" }}>Platform Tools</span>
                <h2 className="font-extrabold tracking-tight leading-none mt-3" style={{ fontSize: "clamp(36px,5vw,64px)", color: "var(--text-on-dark)" }}>
                  EVERYTHING YOU<br />NEED TO <span style={{ color: "#5dba2f" }}>ACT</span>
                </h2>
              </div>
              <p style={{ color: "var(--muted-foreground)", fontSize: "16px", lineHeight: "1.7", maxWidth: "360px", fontFamily: "Montserrat, sans-serif" }}>
                One platform connecting Kenya's youth to funding, knowledge, programs, and climate expertise.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((t, i) => <ToolCard key={t.num} tool={t} index={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FIVE PILLARS — pinned note cards with tilt
          ════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-light)", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={pillarsRef}
            className="mb-20 transition-all duration-1000"
            style={{ opacity: pillarsInView ? 1 : 0, transform: pillarsInView ? "translateY(0)" : "translateY(30px)" }}
          >
            <div className="flex items-end justify-between flex-wrap gap-8">
              <div>
                <span className="uppercase font-black" style={{ color: "#5dba2f", fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.25em" }}>What We Do</span>
                <h2 className="font-extrabold tracking-tight leading-none mt-3" style={{ fontSize: "clamp(36px,5.5vw,68px)", color: "var(--foreground)" }}>
                  FIVE PILLARS<br />OF <span style={{ color: "#5dba2f" }}>CLIMATE</span><br />ACTION
                </h2>
              </div>
              <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.7", maxWidth: "340px", fontFamily: "Montserrat, sans-serif" }}>
                Focused strategic areas designed to accelerate climate action through youth-led innovation across all 47 counties.
              </p>
            </div>
          </div>
          {/* Cards with padding-top for pins + perspective */}
          <div style={{ paddingTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", alignItems: "center" }}>
            {programs.map((p, i) => <PillarCard key={p.num} pillar={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          VIDEO SECTION (preserved)
          ════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", width: "100%", height: "55vh", minHeight: 380, background: "#000", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <video key={PREVIEW_VIDEOS[currentVideoIndex]} src={PREVIEW_VIDEOS[currentVideoIndex]} autoPlay loop muted playsInline style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
        <button onClick={handlePrevVideo} style={{ position: "absolute", left: "2rem", zIndex: 20, width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}><ChevronLeft size={26} /></button>
        <button onClick={handleNextVideo} style={{ position: "absolute", right: "2rem", zIndex: 20, width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}><ChevronRight size={26} /></button>
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
          <button onClick={() => setIsVideoModalOpen(true)} style={{ width: 76, height: 76, borderRadius: "50%", background: "#5dba2f", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 12px rgba(93,186,47,0.25)", transition: "transform 0.3s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
            <div style={{ width: 0, height: 0, borderTop: "11px solid transparent", borderBottom: "11px solid transparent", borderLeft: "18px solid #fff", marginLeft: "5px" }} />
          </button>
          <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#fff", letterSpacing: "-0.02em", textAlign: "center" }}>
            See Our Impact in Action<br /><span style={{ fontSize: "0.75rem", fontWeight: 400, opacity: 0.7 }}>Video {currentVideoIndex + 1} of {PREVIEW_VIDEOS.length}</span>
          </div>
        </div>
      </section>
      {isVideoModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setIsVideoModalOpen(false)} style={{ position: "absolute", top: "2rem", right: "2rem", background: "none", border: "none", color: "#fff", fontSize: "2.5rem", cursor: "pointer", zIndex: 10000, lineHeight: 1 }}>&times;</button>
          <button onClick={handlePrevVideo} style={{ position: "absolute", left: "2rem", zIndex: 10000, background: "none", border: "none", color: "#fff", cursor: "pointer", opacity: 0.7 }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}><ChevronLeft size={48} /></button>
          <button onClick={handleNextVideo} style={{ position: "absolute", right: "2rem", zIndex: 10000, background: "none", border: "none", color: "#fff", cursor: "pointer", opacity: 0.7 }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}><ChevronRight size={48} /></button>
          <video key={PREVIEW_VIDEOS[currentVideoIndex]} src={PREVIEW_VIDEOS[currentVideoIndex]} autoPlay controls playsInline style={{ width: "90%", maxWidth: 1000, maxHeight: "80vh", borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }} />
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          SUCCESS STORIES — cream, horizontal scroll
          ════════════════════════════════════════════════════ */}
      <section className="py-32 overflow-hidden" style={{ background: "var(--section-light)" }}>
        <div className="px-6 md:px-16" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={storiesRef}
            className="flex items-end justify-between mb-16 flex-wrap gap-8 transition-all duration-1000"
            style={{ opacity: storiesInView ? 1 : 0, transform: storiesInView ? "translateY(0)" : "translateY(30px)" }}
          >
            <div>
              <span className="uppercase font-black" style={{ color: "#5dba2f", fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.25em" }}>Featured</span>
              <h2 className="font-extrabold tracking-tight leading-none mt-3" style={{ fontSize: "clamp(36px,5vw,64px)", color: "var(--foreground)" }}>
                CLIMATE<br /><span style={{ color: "#5dba2f" }}>STARTUP</span><br />STORIES
              </h2>
            </div>
            <Link
              href="/success-stories"
              className="flex items-center gap-2 font-black uppercase transition-all duration-300"
              style={{ color: "var(--foreground)", fontSize: "12px", letterSpacing: "0.1em", fontFamily: "Montserrat, sans-serif", textDecoration: "none", borderBottom: "2px solid #0f172a", paddingBottom: "2px" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#5dba2f"; (e.currentTarget as HTMLElement).style.borderBottomColor = "#5dba2f"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#0f172a"; (e.currentTarget as HTMLElement).style.borderBottomColor = "#0f172a"; }}
            >
              See All Stories <ArrowRight size={14} />
            </Link>
          </div>
        </div>
        {/* Horizontal scroll */}
        <div
          className="flex gap-6 overflow-x-auto px-6 md:px-16 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {successStories.map((s, i) => <StoryCard key={s.id} story={s} index={i} />)}
        </div>
      </section>



      {/* ════════════════════════════════════════════════════
          PARTNERS — cream, real logos
          ════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 md:px-16" style={{ background: "var(--section-light)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.1)" }} />
            <span className="uppercase font-black flex-shrink-0" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.25em", color: "#9ca3af" }}>Trusted Partners & Collaborators</span>
            <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.1)" }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {partners.map((p, i) => <PartnerBadge key={p.name} partner={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          NEWS — dark navy
          ════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-16" style={{ background: "var(--section-dark)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            ref={newsRef}
            className="flex items-end justify-between mb-16 flex-wrap gap-8 transition-all duration-1000"
            style={{ opacity: newsInView ? 1 : 0, transform: newsInView ? "translateY(0)" : "translateY(30px)" }}
          >
            <div>
              <span className="uppercase font-black" style={{ color: "#5dba2f", fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.25em" }}>Latest</span>
              <h2 className="font-extrabold tracking-tight leading-none mt-3" style={{ fontSize: "clamp(36px,5vw,64px)", color: "var(--text-on-dark)" }}>
                NEWS, EVENTS<br />& <span style={{ color: "#5dba2f" }}>RESOURCES</span>
              </h2>
            </div>
            <Link
              href="/news"
              className="flex items-center gap-2 font-black uppercase transition-all duration-300"
              style={{ color: "#ffffff", fontSize: "12px", letterSpacing: "0.1em", fontFamily: "Montserrat, sans-serif", textDecoration: "none", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "2px" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#5dba2f"; (e.currentTarget as HTMLElement).style.borderBottomColor = "#5dba2f"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; (e.currentTarget as HTMLElement).style.borderBottomColor = "rgba(255,255,255,0.3)"; }}
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsCards}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// VALUE ROW component (extracted to avoid inline complexity)
// ─────────────────────────────────────────────────────────────
function ValueRow({ value, index, isLastRow, isRightCol, inView }: {
  value: typeof values[0]; index: number; isLastRow: boolean; isRightCol: boolean; inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex items-start gap-6 p-8 transition-all duration-700 cursor-default"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${(index % 3) * 100}ms`,
        borderBottom: isLastRow ? "none" : "1px solid rgba(0,0,0,0.08)",
        borderRight: isRightCol ? "none" : "1px solid rgba(0,0,0,0.08)",
        background: hovered ? "rgba(93,186,47,0.04)" : "transparent",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="font-black flex-shrink-0 pt-1" style={{ fontFamily: "Montserrat, sans-serif", fontSize: "11px", letterSpacing: "0.15em", color: hovered ? "#5dba2f" : "#9ca3af", transition: "color 0.3s" }}>
        {value.num}
      </span>
      <div>
        <h3 className="font-extrabold tracking-tight" style={{ fontSize: "20px", color: "var(--foreground)", marginBottom: "6px" }}>{value.title}</h3>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "14px", color: "#6b7280", lineHeight: "1.6" }}>{value.desc}</p>
      </div>
    </div>
  );
}
