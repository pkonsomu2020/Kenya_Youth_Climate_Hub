"use client";
import { useMemo, useState } from "react";
import { countyMap, type MapCounty } from "@/lib/geo/countyMap";

export type Risk = "HIGH FLOOD RISK" | "MODERATE RISK" | "NORMAL";

// Flat fills + a texture per level, so risk never relies on colour alone.
const FILL: Record<Risk, string> = {
  "HIGH FLOOD RISK": "#E8501E",
  "MODERATE RISK": "#FFB703",
  NORMAL: "#DDF3D3",
};
const TEXTURE: Record<Risk, string | null> = {
  "HIGH FLOOD RISK": "url(#z-hatch)",
  "MODERATE RISK": "url(#z-dots)",
  NORMAL: null,
};

/**
 * Interactive map of Kenya's 47 counties, coloured by flood risk.
 * Mouse/touch: hover shows the name, click selects. Keyboard users pick
 * a county from the select next to the map (47 tab stops would be unusable).
 */
export function CountyMap({
  riskById,
  nameById,
  selectedId,
  onSelect,
  label,
  riskLabel,
}: {
  riskById: Record<string, Risk>;
  nameById: Record<string, string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  label: string;
  riskLabel: (risk: Risk) => string;
}) {
  const [hover, setHover] = useState<MapCounty | null>(null);
  const selected = useMemo(() => countyMap.counties.find((c) => c.id === selectedId) ?? null, [selectedId]);

  return (
    <div className="z-cmap">
      <svg viewBox={`0 0 ${countyMap.width} ${countyMap.height}`} role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
        <defs>
          <pattern id="z-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="none" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="#101C33" strokeOpacity=".28" strokeWidth="2" />
          </pattern>
          <pattern id="z-dots" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="1.1" fill="#101C33" fillOpacity=".28" />
          </pattern>
        </defs>

        {countyMap.counties.map((c) => {
          const risk = riskById[c.id] ?? "NORMAL";
          const isSel = c.id === selectedId;
          return (
            <g
              key={c.id}
              className="z-cmap__county"
              data-selected={isSel}
              onMouseEnter={() => setHover(c)}
              onClick={() => onSelect(c.id)}
            >
              <path d={c.d} fill={FILL[risk]} />
              {TEXTURE[risk] && <path d={c.d} fill={TEXTURE[risk]!} pointerEvents="none" />}
              <path d={c.d} className="z-cmap__edge" />
            </g>
          );
        })}

        {/* selected county on top, with a pin */}
        {selected && (
          <g pointerEvents="none">
            <path d={selected.d} fill="none" stroke="#101C33" strokeWidth="4" strokeLinejoin="round" />
            <circle cx={selected.cx} cy={selected.cy} r="10" fill="#101C33" />
            <circle cx={selected.cx} cy={selected.cy} r="4" fill="#FFFDF8" />
          </g>
        )}
      </svg>

      {hover && (
        <div
          className="z-cmap__tip"
          style={{ left: `${(hover.cx / countyMap.width) * 100}%`, top: `${(hover.cy / countyMap.height) * 100}%` }}
          aria-hidden="true"
        >
          <b>{nameById[hover.id] ?? hover.name}</b>
          <span>{riskLabel(riskById[hover.id] ?? "NORMAL")}</span>
        </div>
      )}
    </div>
  );
}

export const RISK_FILL = FILL;
