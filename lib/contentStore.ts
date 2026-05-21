"use client";

// ============================================================
// KYCH Admin Hub content store — localStorage backed mini CMS
// Opportunities and News are now managed via the backend API.
// This store handles: Resources, Events, Posts, Messages, Settings
// ============================================================
import { useEffect, useState, useCallback } from "react";

export type Resource = { id: string; title: string; type: string; topic: string; date: string; desc: string };
export type Post = { id: string; cat: string; gradient: string; emoji: string; date: string; title: string; excerpt: string };
export type Message = { id: string; from: string; email: string; subject: string; body: string; date: string; read: boolean };
export type SiteSettings = { heroTitle: string; heroSub: string; impactProjects: number; impactCounties: number; impactYouth: number; impactFunding: string };

export type Content = {
  resources: Resource[];
  posts: Post[];
  messages: Message[];
  settings: SiteSettings;
  opportunities?: any[];
  events?: any[];
};

const KEY = "kych-content-v1";
const EVT = "kych-content-change";

const uid = () => Math.random().toString(36).slice(2, 10);

const SEED: Content = {
  resources: [
    { id: uid(), title: "Youth Advocacy Guide to Kenya's NDC", type: "Toolkit", topic: "Advocacy", date: "May 2025", desc: "A simplified guide breaking down Kenya's Nationally Determined Contributions and how youth can engage in local policy." },
    { id: uid(), title: "State of Green Entrepreneurship in Kenya", type: "Report", topic: "Finance", date: "Apr 2025", desc: "Insights and data on the fastest-growing green sectors for youth-led startups across the 47 counties." },
    { id: uid(), title: "Climate Grant Proposal Master Template", type: "Template", topic: "Finance", date: "Mar 2025", desc: "A plug-and-play template designed to help young innovators structure winning climate finance proposals." },
    { id: uid(), title: "Climate Resilience Handbook for Coastal Kenya", type: "Toolkit", topic: "Resilience", date: "Mar 2025", desc: "Practical adaptation strategies for coastal communities tailored to youth-led action." },
    { id: uid(), title: "Solar Microgrids — Implementation Playbook", type: "Guide", topic: "Energy", date: "Feb 2025", desc: "Step-by-step guidance for setting up community solar microgrids in off-grid Kenya." },
    { id: uid(), title: "Climate Finance 101 for Young Entrepreneurs", type: "Guide", topic: "Finance", date: "Feb 2025", desc: "Decode green funding terminology and access the right capital for your startup stage." },
    { id: uid(), title: "Policy Brief: County Climate Change Funds", type: "Policy Brief", topic: "Policy", date: "Jan 2025", desc: "How county-level climate change funds work and how youth can shape them." },
    { id: uid(), title: "Climate Data for Kenya — Open Datasets Index", type: "Report", topic: "Data", date: "Jan 2025", desc: "Curated index of free, open climate datasets covering rainfall, drought, and emissions in Kenya." },
    { id: uid(), title: "Smart Agriculture Toolkit for Smallholder Farmers", type: "Toolkit", topic: "Agriculture", date: "Dec 2024", desc: "Climate-smart practices for shifting rainfall and rising heat — built for youth-led ag enterprises." },
  ],
  posts: [
    { id: uid(), cat: "News", gradient: "#059669", emoji: "Globe", date: "Apr 8, 2025", title: "Kenya Youth Delegation Heads to COP30 in Belém, Brazil", excerpt: "KYCH delegates will represent Kenya's frontline communities at the UN Climate Conference this November." },
    { id: uid(), cat: "Success Stories", gradient: "#10B981", emoji: "Sun", date: "Apr 2, 2025", title: "How SolarEast Africa Connected 4,200 Households to Clean Power", excerpt: "A profile of a YCIC alumna scaling solar microgrids across Western Kenya." },
    { id: uid(), cat: "Events Recap", gradient: "#10B981", emoji: "Calendar", date: "Mar 28, 2025", title: "Recap: County Climate Action Bootcamp in Kisumu", excerpt: "Highlights, takeaways, and downloadable materials from our two-day session with 120 youth." },
    { id: uid(), cat: "Climate Insights", gradient: "#047857", emoji: "Droplets", date: "Mar 15, 2025", title: "Why Water is Kenya's Next Big Climate Frontier", excerpt: "An analysis of water-stress hotspots and where youth innovators are stepping up." },
    { id: uid(), cat: "News", gradient: "#34D399", emoji: "Sprout", date: "Mar 1, 2025", title: "KYCH Announces 38 New Solutions Joining the Incubator", excerpt: "The 2025 cohort spans clean energy, waste tech, regenerative agriculture and water." },
    { id: uid(), cat: "Partner Updates", gradient: "#059669", emoji: "Handshake", date: "Feb 18, 2025", title: "Generation Unlimited Joins KYCH as Strategic Partner", excerpt: "A multi-year partnership unlocking new funding and mobility for Kenyan youth." },
  ],
  messages: [
    { id: uid(), from: "Aisha Mwangi", email: "aisha@school.ac.ke", subject: "Partnership inquiry", body: "We'd love to host a KYCH bootcamp at our university next semester.", date: "Apr 10, 2025", read: false },
    { id: uid(), from: "Brian Kiptoo", email: "brian@startup.io", subject: "Mentorship request", body: "Looking for a mentor in climate-smart agriculture.", date: "Apr 7, 2025", read: true },
  ],
  settings: {
    heroTitle: "Powering Kenya's youth climate movement",
    heroSub: "Resources, funding & tools for young Kenyan climate changemakers.",
    impactProjects: 280,
    impactCounties: 47,
    impactYouth: 12500,
    impactFunding: "KES 84M",
  },
  opportunities: [],
  events: [],
};

function read(): Content {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    return { ...SEED, ...JSON.parse(raw) };
  } catch { return SEED; }
}

function write(c: Content) {
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new Event(EVT));
}

export function useContent() {
  const [content, setContent] = useState<Content>(SEED);
  useEffect(() => {
    setContent(read());
    const h = () => setContent(read());
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener(EVT, h); window.removeEventListener("storage", h); };
  }, []);
  const update = useCallback(<K extends keyof Content>(key: K, value: Content[K]) => {
    const next = { ...read(), [key]: value };
    write(next);
    setContent(next);
  }, []);
  const reset = useCallback(() => { localStorage.removeItem(KEY); write(SEED); setContent(SEED); }, []);
  return { content, update, reset };
}

export const newId = uid;
