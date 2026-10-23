"use client";
import Photo from "@/components/zine/Photo";
import Link from "next/link";
import { useTaxonomy } from "@/i18n/useTaxonomy";
import { successStories } from "@/lib/data/successStories";

type Story = { id: string; name: string; company: string; excerpt: string; photo?: string };

// The data file mixes "Renewal energy" / "Renewable Energy"; always read the English tag.
export const storyCategory = (id: string) => {
  const tag = successStories.find((s) => s.id === id)?.tag ?? "";
  return /renew/i.test(tag) ? "Renewable Energy" : tag;
};

const TILTS = [-4, 3, -2, 4, -3, 2];
const PEGS = ["var(--z-orange)", "var(--z-green)", "var(--z-sun)", "var(--z-sky)", "var(--z-pink)"];

/**
 * Founders' polaroids pegged to a washing line. Each hangs where the rope sags
 * (a parabola), so the middle ones sit lower. On phones the line scrolls sideways.
 */
export function Clothesline({ stories, small = false, label }: { stories: Story[]; small?: boolean; label: string }) {
  const tax = useTaxonomy();
  const n = Math.max(stories.length, 1);

  return (
    <div className={`z-line${small ? " z-line--small" : ""}`} role="region" aria-label={label} tabIndex={0}>
      <div className="z-line__track" style={{ "--n": n } as React.CSSProperties}>
        <svg className="z-line__rope" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 Q 500 200 1000 0" fill="none" stroke="#101C33" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
        <ul className="z-line__list">
          {stories.map((s, i) => {
            const t = (i + 0.5) / n;
            const sag = 4 * t * (1 - t); // 0 at the posts, 1 in the middle
            return (
              <li key={s.id} style={{ "--drop": sag.toFixed(3), "--tilt": `${TILTS[i % TILTS.length]}deg` } as React.CSSProperties}>
                <Link href={`/success-stories/${s.id}`} className="z-pol">
                  <span className="z-pol__peg" style={{ background: PEGS[i % PEGS.length] }} aria-hidden="true" />
                  {s.photo && <Photo src={s.photo} alt={s.name} loading="lazy" width={220} height={200} />}
                  <span className="z-pol__cap">{s.name.split(" ")[0]} · {s.company}</span>
                  {!small && <span className="z-pol__tag">{tax(storyCategory(s.id))}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
