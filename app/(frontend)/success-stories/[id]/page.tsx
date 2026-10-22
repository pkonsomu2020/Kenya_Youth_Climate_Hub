"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { useTranslations } from "next-intl";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { useLocalizedStories } from "@/lib/data/useLocalizedStories";
import { Clothesline, storyCategory } from "@/components/stories/Clothesline";
import { Icon } from "@/components/zine/Icon";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default function StoryPage({ params }: StoryPageProps) {
  const { id } = use(params);
  const t = useTranslations("storiesPage");
  const tax = useTaxonomy();
  const stories = useLocalizedStories();
  const story = stories.find((s) => s.id === id);

  if (!story) {
    notFound();
  }

  return (
    <div className="z-page z-st">
      <section className="z-st__detail">
        <div className="z-wrap">
          <Link href="/success-stories" className="z-ghost z-st__back">
            <Icon name="arrow_back" /> {t("back")}
          </Link>

          <div className="z-st__spread z-st__spread--light">
            <figure className="z-st__photo">
              <span className="z-tape" style={{ top: -12, left: "50%", marginLeft: -46, transform: "rotate(3deg)" }} aria-hidden="true" />
              {story.photo && <img src={story.photo} alt={story.name} width={440} height={520} />}
              <figcaption className="z-marker">{story.name}</figcaption>
            </figure>
            <article className="z-st__text">
              <span className="z-mono z-eyebrow">{t("detailEyebrow")}</span>
              <h1 className="z-h2">{story.company}</h1>
              <p className="z-st__by">
                <span className="z-st__tag">{tax(storyCategory(story.id))}</span>
                {t("by", { name: story.name })}
              </p>
              <p className="z-st__excerpt">{story.excerpt}</p>
              <p className="z-st__full z-st__full--drop">{story.fullText}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="z-st__others" aria-labelledby="st-others">
        <div className="z-wrap">
          <h2 id="st-others" className="z-fund__h3"><Icon name="photo_library" /> {t("others")}</h2>
          <Clothesline stories={stories.filter((s) => s.id !== id)} small label={t("others")} />
        </div>
      </section>

      <section className="z-st__next">
        <div className="z-wrap">
          <div className="z-fund__ctagrid">
            <div>
              <span className="z-mono z-kicker">{t("ctaKicker")}</span>
              <h2 className="z-h2 z-balance">{t.rich("ctaTitle", { s: (c) => <span className="z-serif">{c}</span> })}</h2>
              <p className="z-fund__ctabody">{t("ctaBody")}</p>
            </div>
            <div className="z-fund__ctas">
              <Link href="/opportunities" className="z-btn z-btn--navy">{t("ctaButton")} <Icon name="arrow_forward" /></Link>
            </div>
          </div>
        </div>
      </section>
      <div className="z-tear z-tear--top" aria-hidden="true" />
    </div>
  );
}
