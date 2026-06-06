"use client";

import Link from 'next/link';
import { Newsletter } from "@/components/Newsletter";
import { DollarSign, BookOpen, Trophy, Calendar, Leaf, Lightbulb, Handshake, Rocket, CalendarDays, Bot, Recycle, Sun, Sprout, Droplets, Trees, Globe, FileText, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { useNews } from "@/lib/useNews";
import { useContent } from "@/lib/contentStore";
import { successStories } from "@/lib/data/successStories";
import * as Icons from "lucide-react";



// Icon mapper function
const iconMap: Record<string, LucideIcon> = {
  Leaf,
  Lightbulb,
  DollarSign,
  BookOpen,
  Handshake,
  Rocket,
  CalendarDays,
  Bot,
  Recycle,
  Sun,
  Sprout,
  Droplets,
  Trees,
  Globe,
  FileText,
  Trophy,
};

const renderIcon = (iconName: string, size: number = 24) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent size={size} /> : null;
};

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

const PREVIEW_VIDEOS = [
  "/c_df_b_e_bc_e_c_videomp_.mp4",
  "/e_a_ea_d_videomp_.mp4",
  "/e_b_d_a_be_e_f_mp_.mp4"
];

const programs = [
  {
    icon: "Leaf",
    title: "Youth Climate Leadership & Advocacy",
    desc: "Training Kenya's next climate negotiators, county advocates, and movement leaders to influence policy at every level.",
    image: "/Pillar_IMAGES/Youth Climate Leadership & Advocacy.jpeg",
    area: "leadership",
  },
  {
    icon: "Lightbulb",
    title: "Climate Innovation & Entrepreneurship",
    desc: "Incubating youth-led green startups — from clean energy to waste tech — through the Youth Climate Innovation Challenge.",
    image: "/Pillar_IMAGES/Climate Innovation & Entrepreneurship.jpeg",
    area: "innovation",
  },
  {
    icon: "DollarSign",
    title: "Climate Finance & Opportunity Access",
    desc: "Connecting young Kenyans to grants, fellowships, competitions, and jobs that match their climate ambitions.",
    image: "/Pillar_IMAGES/Climate Finance & Opportunity Access.jpeg",
    area: "finance",
  },
  {
    icon: "BookOpen",
    title: "Capacity Building & Knowledge",
    desc: "Equipping young people with the skills, data, and tools to lead climate action through trainings and digital resources.",
    image: "/Pillar_IMAGES/Capacity Building & Knowledge.jpeg",
    area: "capacity",
  },
  {
    icon: "Handshake",
    title: "Partnerships & Ecosystem Building",
    desc: "Building bridges between youth, government, NGOs, development partners, and the private sector.",
    image: "/Pillar_IMAGES/Partnerships & Ecosystem Building.jpeg",
    area: "partnerships",
  },
];

const features = [
  { icon: "BookOpen", title: "E-Library & Resource Hub", desc: "Reports, toolkits, policy briefs, and research papers. Save them to your dashboard.", to: "/e-library", link: "Browse Library →" },
  { icon: "DollarSign", title: "Funding & Opportunities", desc: "A live board of grants, fellowships, and internships with deadline alerts.", to: "/opportunities", link: "Find Funding →" },
  { icon: "Rocket", title: "Programs & Challenges", desc: "Apply directly online for incubators like the Youth Climate Innovation Challenge.", to: "/programs", link: "View Programs →" },
  { icon: "CalendarDays", title: "Events & Workshops", desc: "Register for bootcamps, policy dialogues, and webinars from KYCH and partners.", to: "/events", link: "View Calendar →" },
  { icon: "Bot", title: "Climate AI Assistant", desc: "A 24/7 AI guide trained on Kenya's climate data, opportunities & resources.", to: "/dashboard", link: "Ask AI Now →" },
];



const GRADIENT_MAP: Record<string, string> = {
  News: "#059669",
  "Climate Insights": "#047857",
  "Success Stories": "#10B981",
  "Events Recap": "#10B981",
  "Partner Updates": "#059669",
};

function renderNewsIcon(iconName: string, size = 48) {
  const iconCollection = Icons as unknown as Record<string, LucideIcon>;
  const Icon = iconCollection[iconName];
  return Icon ? <Icon size={size} strokeWidth={1.5} /> : <Globe size={size} strokeWidth={1.5} />;
}

export default function Home() {
  const { content } = useContent();
  const s = content.settings;
  const { articles: liveNews, loading: newsLoading, error: newsError } = useNews({ limit: 3 });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleNextVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentVideoIndex((prev) => (prev + 1) % PREVIEW_VIDEOS.length);
  };

  const handlePrevVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentVideoIndex((prev) => (prev - 1 + PREVIEW_VIDEOS.length) % PREVIEW_VIDEOS.length);
  };

  const newsCards = newsLoading
    ? Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="k-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ height: 175, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
          <div style={{ padding: "1rem 1.1rem 1.2rem", display: "flex", flexDirection: "column", gap: ".6rem" }}>
            <div style={{ height: 14, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
            <div style={{ height: 14, borderRadius: 4, background: "var(--border)", width: "75%", animation: "shimmer 1.5s infinite" }} />
            <div style={{ height: 12, borderRadius: 4, background: "var(--border)", animation: "shimmer 1.5s infinite" }} />
          </div>
        </div>
      ))
    : newsError
    ? [
        <div key="news-error" style={{ gridColumn: "1 / -1", padding: "2rem", background: "#FEF3F2", border: "1px solid #FECACA", borderRadius: 16, color: "#991B1B", textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem" }}>
            Unable to load news right now.
          </p>
          <p style={{ margin: ".75rem 0 0", color: "var(--muted-foreground)", fontSize: ".95rem" }}>
            The news API is unavailable or the backend is offline. Please refresh the page or try again later.
          </p>
        </div>,
      ]
    : liveNews.length === 0
    ? [
        <div key="news-empty" style={{ gridColumn: "1 / -1", padding: "2rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, color: "var(--muted-foreground)", textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1rem" }}>
            No news articles are available right now.
          </p>
          <p style={{ margin: ".75rem 0 0", color: "var(--muted-foreground)", fontSize: ".95rem" }}>
            Check back soon for the latest climate news and event updates from the Hub.
          </p>
        </div>,
      ]
    : liveNews.slice(0, 3).map((n, idx) => (
        <a
          key={n.id}
          href={n.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`k-card animate-on-scroll stagger-${idx + 1}`}
          style={{ padding: 0, textDecoration: "none", display: "block" }}
        >
          {n.image_url ? (
            <div style={{ height: 175, overflow: "hidden", position: "relative" }}>
              <img
                src={n.image_url}
                alt={n.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.parentElement!.style.background = GRADIENT_MAP[n.category] || "#059669";
                  el.style.display = "none";
                }}
              />
              <span style={{ position: "absolute", bottom: ".5rem", right: ".5rem", background: "rgba(0,0,0,.5)", color: "#fff", fontSize: ".6rem", padding: ".2rem .5rem", borderRadius: 4, fontFamily: "var(--fm)" }}>
                {n.source}
              </span>
            </div>
          ) : (
            <div style={{ height: 175, background: GRADIENT_MAP[n.category] || n.gradient || "#059669", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.35)", transition: "all 0.3s", position: "relative" }}>
              <div className="news-card-icon-wrapper">{renderNewsIcon(n.icon || "Globe", 48)}</div>
              <span style={{ position: "absolute", bottom: ".5rem", right: ".5rem", background: "rgba(0,0,0,.25)", color: "rgba(255,255,255,.8)", fontSize: ".6rem", padding: ".2rem .5rem", borderRadius: 4, fontFamily: "var(--fm)" }}>
                {n.source}
              </span>
            </div>
          )}
          <div style={{ padding: ".8rem 1.1rem 0", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span className="k-tag t-news">{n.category}</span>
            <span style={{ fontSize: ".67rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>{n.date}</span>
          </div>
          <div style={{ padding: ".8rem 1.1rem 1.2rem" }}>
            <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".95rem", lineHeight: 1.3, color: "var(--dark)", marginBottom: ".4rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: ".4rem" }}>
              <span>{n.title}</span>
              <ExternalLink size={12} style={{ flexShrink: 0, marginTop: 2, color: "var(--muted-foreground)" }} />
            </div>
            <div style={{ fontSize: ".78rem", color: "var(--muted-foreground)", lineHeight: 1.55 }}>{n.excerpt}</div>
          </div>
        </a>
      ));

  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", background: "var(--background)", padding: "8rem 2.5rem 4rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }} className="hero-grid animate-on-scroll">
          {/* Left Content */}
          <div className="animate-on-scroll stagger-1">
            <div style={{ fontFamily: "var(--fm)", fontSize: ".7rem", letterSpacing: ".15em", color: "var(--muted-foreground)", textTransform: "uppercase", marginBottom: "1rem" }}>
              Empowering youth, one climate solution at a time.
            </div>
            <h1 className="hero-title" style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "6vw", color: "var(--dark)", letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: "1.5rem" }}>
              Welcome to <span style={{ color: "var(--green)" }}>Kenya Youth</span> <span style={{ color: "var(--green)" }}>Climate Hub</span>
            </h1>
            <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 520 }}>
              Join a community of young innovators addressing climate challenges and building a sustainable future for Kenya
            </p>

            {/* Quick Links */}
            <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap", marginTop: "2rem" }}>
              <Link href="/opportunities" style={{ fontSize: ".8rem", color: "var(--muted-foreground)", textDecoration: "none", padding: ".5rem 1rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "var(--fs)", fontWeight: 600, transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", gap: ".4rem" }} className="quick-link animate-on-scroll stagger-2">
                <DollarSign size={16} /> Funding
              </Link>
              <Link href="/e-library" style={{ fontSize: ".8rem", color: "var(--muted-foreground)", textDecoration: "none", padding: ".5rem 1rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "var(--fs)", fontWeight: 600, transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", gap: ".4rem" }} className="quick-link animate-on-scroll stagger-3">
                <BookOpen size={16} /> Resources
              </Link>
              <Link href="/programs" style={{ fontSize: ".8rem", color: "var(--muted-foreground)", textDecoration: "none", padding: ".5rem 1rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "var(--fs)", fontWeight: 600, transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", gap: ".4rem" }} className="quick-link animate-on-scroll stagger-4">
                <Trophy size={16} /> Programs
              </Link>
              <Link href="/events" style={{ fontSize: ".8rem", color: "var(--muted-foreground)", textDecoration: "none", padding: ".5rem 1rem", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontFamily: "var(--fs)", fontWeight: 600, transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)", display: "flex", alignItems: "center", gap: ".4rem" }} className="quick-link animate-on-scroll stagger-5">
                <Calendar size={16} /> Events
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="animate-on-scroll stagger-2" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Background Decorative Shapes */}
            <div style={{ position: "absolute", width: "100%", height: "100%", maxWidth: 500, maxHeight: 500 }}>
              <div style={{ position: "absolute", top: "10%", right: "5%", width: "45%", height: "45%", background: "var(--green)", borderRadius: "50% 50% 0 50%", opacity: 0.15, transform: "rotate(15deg)" }} />
              <div style={{ position: "absolute", bottom: "15%", left: "8%", width: "35%", height: "35%", background: "#10B981", borderRadius: "50%", opacity: 0.12 }} />
              <div style={{ position: "absolute", top: "25%", left: "15%", width: "25%", height: "25%", background: "#047857", borderRadius: "0 50% 50% 50%", opacity: 0.1, transform: "rotate(-20deg)" }} />
            </div>

            {/* Main Image */}
            <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 450, aspectRatio: "1", borderRadius: "50% 50% 50% 0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.1)" }}>
              <img 
                src="/kych_hero.jpg"
                alt="Kenya Youth Climate Hub - Clean Energy" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Floating Stats Cards */}
            <div style={{ position: "absolute", top: "8%", right: "8%", background: "var(--card)", padding: "1rem 1.3rem", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.08)", zIndex: 3, border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.6rem", color: "var(--dark)", lineHeight: 1 }}>{s.impactYouth.toLocaleString()}+</div>
              <div style={{ fontSize: ".7rem", color: "var(--muted-foreground)", marginTop: ".25rem", fontFamily: "var(--fm)" }}>Youth Registered</div>
            </div>

            <div style={{ position: "absolute", top: "45%", left: "-5%", background: "var(--card)", padding: ".8rem 1rem", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.08)", zIndex: 3, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: ".7rem", color: "var(--muted-foreground)", marginBottom: ".2rem" }}>Counties Covered</div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.4rem", color: "var(--green)" }}>{s.impactCounties}/47</div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT BAR */}
      <div className="animate-on-scroll" style={{ background: "#0A0A0A", padding: "2.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "1rem", textAlign: "center" }}>
          {[[(s.impactYouth||0).toLocaleString(), "Youth Reached"], [(s.impactProjects||0).toString(), "Projects Incubated"], [s.impactFunding||"", "Funding Mobilised"], [(s.impactCounties||0).toString(), "Counties Covered"], ["60+", "Opportunities Listed"]].map(([n, l], idx) => (
            <div key={l} className={`animate-on-scroll stagger-${(idx % 5) + 1}`}>
              <span className="impact-stat" style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "2.2rem", color: "var(--green)", letterSpacing: "-.03em", display: "block", lineHeight: 1 }}>{n}</span>
              <span style={{ fontFamily: "var(--fm)", fontSize: ".62rem", color: "rgba(255,255,255,.45)", letterSpacing: ".08em", marginTop: ".4rem", display: "block", textTransform: "uppercase" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PARTNERS MARQUEE */}
      <div className="marq-bar">
        <div className="marq-track">
          {[...partners, ...partners].map((p, i) => (
            <div key={i} className="m-chip" style={{ padding: "0.5rem 1rem", border: "none", gap: "0", background: "transparent" }}>
              <img 
                src={p.logo} 
                alt={p.name}
                style={{ height: "40px", maxWidth: "140px", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT SPLIT */}
      <div className="about-split-grid animate-on-scroll">
        <div className="animate-on-scroll stagger-1" style={{ padding: "5rem 2.5rem", background: "var(--card)" }}>
          <div style={{ maxWidth: 500 }}>
            <div className="s-label">Who We Are</div>
            <h2 className="s-title">More Than a Hub<br /><span>A Movement</span></h2>
            <p style={{ marginTop: "1.25rem", color: "var(--muted-foreground)", lineHeight: 1.7, fontSize: ".92rem" }}>
              Pioneering sustainable technology <strong style={{ color: "var(--dark)" }}>solutions</strong> for a cleaner tomorrow. We harness renewable energy and innovative climate-tech to create meaningful environmental impact across communities worldwide.
            </p>
            <p style={{ marginTop: ".75rem", color: "var(--muted-foreground)", lineHeight: 1.7, fontSize: ".92rem", fontStyle: "italic" }}>
              Afosi generates the evidence. Youth generate the solutions. The Hub connects them to scale.
            </p>
            <Link href="/about" className="btn-green" style={{ marginTop: "1.75rem" }}>Our Story & Team →</Link>
          </div>
        </div>
        <div className="animate-on-scroll stagger-2" style={{ background: "var(--green)", padding: "5rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="s-label" style={{ color: "rgba(255,255,255,.4)" }}>Our Values</div>
          <h3 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.5rem", color: "#fff", letterSpacing: "-.02em" }}>What We Stand For</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: ".7rem", marginTop: "1.5rem" }}>
            {[
              ["Climate Justice", "Fair outcomes for frontline communities"],
              ["Youth Inclusion", "Ages 15–35 at the centre of every decision"],
              ["Gender Equity", "Equal voice, equal access, equal impact"],
              ["Innovation", "Kenyan solutions for Kenyan challenges"],
              ["Evidence-Based", "Data-driven, research-backed action"],
              ["Systems Change", "Beyond symptoms — changing root causes"],
            ].map(([t, s]) => (
              <div key={t} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.11)", borderRadius: 10, padding: ".75rem .9rem" }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".8rem", color: "#fff", marginBottom: ".15rem" }}>{t}</div>
                <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.5)" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO PREVIEW SECTION */}
      <section className="animate-on-scroll" style={{ position: "relative", width: "100%", height: "60vh", minHeight: 400, background: "#000", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Looping Preview Video */}
        <video
          key={PREVIEW_VIDEOS[currentVideoIndex]}
          src={PREVIEW_VIDEOS[currentVideoIndex]}
          autoPlay
          loop
          muted
          playsInline
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        />
        
        {/* Navigation Arrows (Preview) */}
        <button 
          onClick={handlePrevVideo}
          style={{ position: "absolute", left: "2rem", zIndex: 20, width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", transition: "background 0.3s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={handleNextVideo}
          style={{ position: "absolute", right: "2rem", zIndex: 20, width: 50, height: 50, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", transition: "background 0.3s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
        >
          <ChevronRight size={28} />
        </button>

        {/* Overlay & Play Button */}
        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          <button 
            onClick={() => setIsVideoModalOpen(true)}
            style={{ 
              width: 80, height: 80, borderRadius: "50%", background: "var(--green)", 
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 0 10px rgba(16, 185, 129, 0.3)", transition: "transform 0.3s" 
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{ width: 0, height: 0, borderTop: "12px solid transparent", borderBottom: "12px solid transparent", borderLeft: "20px solid #fff", marginLeft: "6px" }} />
          </button>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.5rem", color: "#fff", letterSpacing: "-.02em", textAlign: "center" }}>
            See Our Impact in Action <br/>
            <span style={{ fontSize: "0.8rem", fontWeight: 400, opacity: 0.8 }}>Video {currentVideoIndex + 1} of {PREVIEW_VIDEOS.length}</span>
          </div>
        </div>
      </section>

      {/* FULL VIDEO MODAL */}
      {isVideoModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.9)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button 
            onClick={() => setIsVideoModalOpen(false)}
            style={{ position: "absolute", top: "2rem", right: "2rem", background: "none", border: "none", color: "#fff", fontSize: "3rem", cursor: "pointer", zIndex: 10000, padding: "1rem", lineHeight: 1 }}
          >
            &times;
          </button>

          {/* Navigation Arrows (Modal) */}
          <button 
            onClick={handlePrevVideo}
            style={{ position: "absolute", left: "2rem", zIndex: 10000, background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "1rem", opacity: 0.7, transition: "opacity 0.3s" }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
          >
            <ChevronLeft size={48} />
          </button>
          <button 
            onClick={handleNextVideo}
            style={{ position: "absolute", right: "2rem", zIndex: 10000, background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "1rem", opacity: 0.7, transition: "opacity 0.3s" }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
          >
            <ChevronRight size={48} />
          </button>

          <video
            key={PREVIEW_VIDEOS[currentVideoIndex]}
            src={PREVIEW_VIDEOS[currentVideoIndex]}
            autoPlay
            controls
            playsInline
            style={{ width: "90%", maxWidth: 1000, maxHeight: "80vh", borderRadius: 12, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
          />
        </div>
      )}

      {/* CORE PROGRAMS */}
      <section className="sec" style={{ background: "var(--background)" }}>
        <div className="sec-in">
          <div className="s-label animate-on-scroll">What We Do</div>
          <h2 className="s-title animate-on-scroll">Five Pillars of<br /><span>Climate Action</span></h2>
          <div className="pillars-grid" style={{ gap: "1.25rem", marginTop: "3rem" }}>
            {programs.map((p, idx) => (
              <div
                key={p.title}
                className={`animate-on-scroll stagger-${(idx % 5) + 1} group`}
                style={{
                  gridArea: p.area,
                  position: "relative",
                  minHeight: p.area === "leadership" ? 480 : 320,
                  borderRadius: 24,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  cursor: "pointer",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('.pillar-bg-img') as HTMLElement;
                  if (img) img.style.transform = 'scale(1.05)';
                  const iconBox = e.currentTarget.querySelector('.pillar-icon-box') as HTMLElement;
                  if (iconBox) {
                    iconBox.style.background = 'var(--green)';
                    iconBox.style.color = '#fff';
                    iconBox.style.borderColor = 'transparent';
                  }
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('.pillar-bg-img') as HTMLElement;
                  if (img) img.style.transform = 'scale(1)';
                  const iconBox = e.currentTarget.querySelector('.pillar-icon-box') as HTMLElement;
                  if (iconBox) {
                    iconBox.style.background = 'rgba(255,255,255,0.15)';
                    iconBox.style.color = '#fff';
                    iconBox.style.borderColor = 'rgba(255,255,255,0.2)';
                  }
                }}
              >
                {/* Background Image */}
                <img 
                  src={p.image.replace(/[^\/]+$/, (m) => encodeURIComponent(m))} 
                  alt={p.title} 
                  className="pillar-bg-img"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)",
                    zIndex: 0
                  }}
                />

                {/* Dark Gradient Overlay only at bottom */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 45%, transparent 100%)",
                  zIndex: 1,
                  pointerEvents: "none"
                }} />

                {/* Content Container */}
                <div style={{ position: "relative", zIndex: 2, padding: "2rem", width: "100%" }}>
                  <div
                    className="pillar-icon-box"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      marginBottom: "1.25rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {renderIcon(p.icon, 20)}
                  </div>
                  
                  <h3 style={{ 
                    fontFamily: "var(--fs)", fontWeight: 800, fontSize: p.area === "leadership" ? "1.6rem" : "1.3rem", 
                    color: "#fff", lineHeight: 1.2, marginBottom: "0.5rem" 
                  }}>
                    {p.title}
                  </h3>
                  
                  <p style={{ 
                    color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", 
                    lineHeight: 1.6, margin: 0,
                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                  }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="sec" style={{ background: "var(--cd)", paddingTop: "2rem" }}>
        <div className="sec-in">
          <div className="s-label animate-on-scroll">Platform Tools</div>
          <h2 className="s-title animate-on-scroll">Everything You Need to<br /><span>Lead the Change</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.1rem", marginTop: "2.5rem" }}>
            {features.map((f, idx) => (
              <Link href={f.to} key={f.title} className={`k-card animate-on-scroll stagger-${(idx % 5) + 1}`} style={{ textDecoration: "none" }}>
                <div className="k-card-icon">{renderIcon(f.icon)}</div>
                <div className="k-card-title">{f.title}</div>
                <div className="k-card-desc">{f.desc}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: ".25rem", fontSize: ".75rem", color: "var(--green)", fontWeight: 600, marginTop: ".9rem", fontFamily: "var(--fs)" }}>{f.link}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CHALLENGE BANNER — powered by Flarehub */}
      <section className="animate-on-scroll flarehub-cta-section" style={{ background: "var(--green)", padding: "4rem 2.5rem", overflow: "hidden" }}>
        <div className="flarehub-cta">
          <div className="flarehub-copy">
            <div style={{ fontFamily: "var(--fm)", fontSize: ".65rem", letterSpacing: ".12em", color: "rgba(255,255,255,.6)", textTransform: "uppercase", marginBottom: ".75rem", display: "flex", alignItems: "center", gap: ".4rem" }}>
              <Rocket size={14} /> Applications Open Now
            </div>
            <h2 style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "clamp(2.2rem,4vw,3.4rem)", color: "#fff", letterSpacing: "-.025em", lineHeight: 1.08, marginBottom: ".75rem" }}>
              Youth Climate Innovation<br />Challenge 2025
            </h2>
            <p style={{ fontSize: ".95rem", color: "rgba(255,255,255,.85)", maxWidth: 520, marginBottom: "1.75rem", lineHeight: 1.75 }}>
              Compete for funding, mentorship, and a national platform — in partnership with Flarehub.
            </p>
            <a
              href="https://www.flarehub.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flarehub-cta-button"
            >
              <ExternalLink size={14} /> Explore Flarehub
            </a>
          </div>
          <div className="flarehub-visual" style={{
            backgroundImage: `url("/drone_cofee.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
        </div>
      </section>

      {/* STORIES */}
      <section className="sec animate-on-scroll" style={{ background: "var(--background)", paddingBottom: "6rem" }}>
        <div className="sec-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="s-label animate-on-scroll">Featured</div>
              <h2 className="s-title animate-on-scroll">Climate Startup<br /><span>Stories in Kenya</span></h2>
            </div>
            <Link href="/success-stories" className="animate-on-scroll" style={{ fontFamily: "var(--fs)", fontSize: ".85rem", fontWeight: 700, color: "var(--green)", textDecoration: "none", transition: "all 0.3s" }}>
              See all stories <span className="link-arrow">→</span>
            </Link>
          </div>
          
          <div style={{ position: "relative", minHeight: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "4rem" }}>
            
            {/* Cards wrapper */}
            <div style={{ position: "relative", width: "100%", height: 580, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {successStories.map((s, idx) => {
                const length = successStories.length;
                const prev = (currentStoryIndex - 1 + length) % length;
                const next = (currentStoryIndex + 1) % length;
                const isCurrent = idx === currentStoryIndex;
                const isPrev = idx === prev;
                const isNext = idx === next;
                
                if (!isCurrent && !isPrev && !isNext) return null;

                const baseStyle: CSSProperties = {
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: "clamp(320px, 90vw, 420px)",
                  height: "100%",
                  borderRadius: 0,
                  background: "#fff",
                  boxShadow: isCurrent ? "0 25px 50px rgba(0,0,0,0.15)" : "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                  transform: "translateX(-50%) scale(1)",
                  zIndex: isCurrent ? 4 : 3,
                  opacity: isCurrent ? 1 : 0.6,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  cursor: isCurrent ? "default" : "pointer",
                };

                if (isPrev) {
                  baseStyle.transform = "translateX(calc(-50% - 360px)) scale(0.85)";
                }
                if (isNext) {
                  baseStyle.transform = "translateX(calc(-50% + 360px)) scale(0.85)";
                }

                return (
                  <div key={s.id} style={baseStyle} onClick={() => !isCurrent && setCurrentStoryIndex(idx)}>
                    {/* Top Image Area */}
                    <div style={{ position: "relative", height: 340, width: "100%", background: "#e5e7eb" }}>
                      {s.photo && (
                        <img src={s.photo} alt={s.company} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }} />
                      )}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)", pointerEvents: "none" }} />
                      <div style={{ position: "absolute", bottom: "1.25rem", left: "1.5rem", right: "1.5rem", color: "#fff", fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.6rem", textTransform: "uppercase", letterSpacing: "0.02em", pointerEvents: "none" }}>
                        {s.company}
                      </div>
                    </div>
                    
                    {/* Bottom Content */}
                    <div style={{ flex: 1, padding: "1.8rem 1.5rem", display: "flex", flexDirection: "column", background: "#fff" }}>
                      <div style={{ color: "#6B7280", fontSize: "1.05rem", lineHeight: 1.6, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", marginBottom: "auto" }}>
                        {s.excerpt}
                      </div>
                      
                      <div style={{ height: 1, width: "100%", background: "#F3F4F6", margin: "1.5rem 0" }} />
                      
                      {/* Footer Row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <div style={{ fontSize: "0.75rem", color: "#6B7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
                            Founder
                          </div>
                          <div style={{ color: "var(--green)", fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.05rem" }}>
                            {s.name}
                          </div>
                        </div>
                        
                        {isCurrent ? (
                          <Link href={`/success-stories/${s.id}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
                            <span style={{ color: "var(--green)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              Read Story
                            </span>
                            <div 
                              style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                              <ChevronRight size={20} />
                            </div>
                          </Link>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", opacity: 0.5 }}>
                            <span style={{ color: "var(--green)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              Read Story
                            </span>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <ChevronRight size={20} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div style={{ position: "relative", marginTop: "2rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", zIndex: 10 }}>
              <button
                type="button"
                onClick={() => setCurrentStoryIndex((index) => (index - 1 + successStories.length) % successStories.length)}
                style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4B5563", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <ChevronLeft size={24} />
              </button>
              
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                {successStories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStoryIndex(idx)}
                    style={{
                      width: idx === currentStoryIndex ? 28 : 10,
                      height: 10,
                      borderRadius: 10,
                      background: idx === currentStoryIndex ? "var(--green)" : "#D1D5DB",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s"
                    }}
                    aria-label={`Go to story ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentStoryIndex((index) => (index + 1) % successStories.length)}
                style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#4B5563", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="sec animate-on-scroll">
        <div className="sec-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="s-label animate-on-scroll">Latest</div>
              <h2 className="s-title animate-on-scroll">News, Events &<br /><span>Resources</span></h2>
            </div>
            <Link href="/news" className="animate-on-scroll" style={{ fontFamily: "var(--fs)", fontSize: ".85rem", fontWeight: 700, color: "var(--green)", textDecoration: "none", transition: "all 0.3s" }}>
              View all <span className="link-arrow">→</span>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "1.1rem", marginTop: "2.5rem" }}>
            {newsCards}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
