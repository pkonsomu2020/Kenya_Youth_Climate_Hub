"use client";

import { useTranslations } from "next-intl";
import { useHomeFeed } from "@/lib/useHomeFeed";
import { Hero } from "@/components/home/Hero";
import { NowBoard } from "@/components/home/NowBoard";
import { Picker } from "@/components/home/Picker";
import { Simba } from "@/components/home/Simba";
import { Stories } from "@/components/home/Stories";
import { EventsTickets } from "@/components/home/EventsTickets";
import { Join } from "@/components/home/Join";

export default function Home() {
  const t = useTranslations("home");
  const feed = useHomeFeed();

  return (
    <div className="z-page">
      <Hero feed={feed} />
      <NowBoard feed={feed} />
      <Picker feed={feed} />

      <div className="z-tear z-tear--top" aria-hidden="true" />
      <Simba />
      <Stories />
      <div className="z-tear z-tear--bottom" aria-hidden="true" />

      <div className="z-motif" aria-hidden="true"><div className="z-motif__strip" /></div>

      <section className="z-quote" aria-label={t("quote.label")}>
        <div className="z-wrap">
          <blockquote>“{t.rich("quote.text", { m: (c) => <mark>{c}</mark> })}”</blockquote>
          <cite className="z-mono">{t("quote.cite")}</cite>
        </div>
      </section>

      <EventsTickets feed={feed} />
      <Join />
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
