"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { successStories } from "@/lib/data/successStories";
import { useLocalizedStories } from "@/lib/data/useLocalizedStories";

const category = (id: string) => {
  const tag = successStories.find((s) => s.id === id)?.tag ?? "";
  return /renew/i.test(tag) ? "Renewable Energy" : tag;
};

/** YCIC founders as taped polaroids on navy. */
export function Stories() {
  const t = useTranslations("home.stories");
  const tax = useTaxonomy();
  const stories = useLocalizedStories().filter((s) => s.photo).slice(0, 4);

  return (
    <section className="z-sec z-dark" aria-labelledby="z-stories-title">
      <div className="z-wrap">
        <div className="z-sec-head">
          <div>
            <span className="z-kicker z-mono">{t("kicker")}</span>
            <h2 id="z-stories-title" className="z-h2">{t.rich("title", { br: () => <br />, s: (c) => <span className="z-serif">{c}</span> })}</h2>
          </div>
          <Link href="/success-stories" className="z-ghost">{t("cta")} <Icon name="arrow_forward" /></Link>
        </div>
        <div className="z-stories">
          {stories.map((s) => (
            <Link key={s.id} href={`/success-stories/${s.id}`} className="z-story">
              <span className="z-story__tag">{tax(category(s.id))}</span>
              <img src={s.photo} alt={s.name} width={260} height={250} loading="lazy" />
              <h3>{s.company}</h3>
              <div className="z-story__who">{s.name}</div>
              <p>{s.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
