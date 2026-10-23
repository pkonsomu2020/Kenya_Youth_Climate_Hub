// ============================================================
// Build the Climate Watch county map.
// Turns the 47 Kenya county boundaries (geoBoundaries KEN ADM1, public domain,
// source: RCMRD GeoPortal) into ready-made SVG paths so visitors download a small
// JSON file instead of a map library.
//
//   node scripts/build-county-map.mjs
//
// Output: lib/data/kenyaCountiesMap.json
// ============================================================
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { geoMercator, geoPath } from "d3-geo";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(root, "data/geo/geoBoundaries-KEN-ADM1_simplified.geojson");
const OUT = join(root, "lib/data/kenyaCountiesMap.json");
const COUNTIES = join(root, "lib/data/kenyaCountiesWeather.ts");

const WIDTH = 600;
const HEIGHT = 680;
const MIN_STEP = 0.6; // drop points closer than this (in SVG units) to keep the file small

// Names that differ between geoBoundaries and lib/data/kenyaCountiesWeather.ts
const ALIASES = { "nairobi": "nairobi city", "taita taveta": "taita-taveta", "tharaka": "tharaka-nithi" };
const norm = (s) => s.toLowerCase().replace(/’/g, "'").trim();

// county name -> id from our dataset (c-001 … c-047)
const ids = {};
for (const m of readFileSync(COUNTIES, "utf8").matchAll(/id: "(c-\d+)",\s*name: "([^"]+)"/g)) ids[norm(m[2])] = m[1];

const geo = JSON.parse(readFileSync(SRC, "utf8"));

// Note: geoBoundaries rings follow the GeoJSON right-hand rule; d3-geo expects the opposite
// winding for spherical geometry, so reverse each ring before projecting.
for (const f of geo.features) {
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) for (const ring of poly) ring.reverse();
}

const projection = geoMercator().fitExtent([[8, 8], [WIDTH - 8, HEIGHT - 8]], geo);

// Project + thin points in screen space, then emit a compact path string.
function pathFor(geometry) {
  const polys = geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  let d = "";
  for (const poly of polys) {
    for (const ring of poly) {
      const pts = [];
      for (const coord of ring) {
        const [x, y] = projection(coord);
        const last = pts[pts.length - 1];
        if (!last || Math.hypot(x - last[0], y - last[1]) >= MIN_STEP) pts.push([x, y]);
      }
      if (pts.length < 3) continue;
      d += "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
    }
  }
  return d;
}

const path = geoPath(projection);
const missing = [];
const counties = geo.features.map((f) => {
  const name = f.properties.shapeName;
  const key = ALIASES[norm(name)] ?? norm(name);
  const id = ids[key];
  if (!id) missing.push(name);
  const [cx, cy] = path.centroid(f);
  const area = path.area(f);
  return { id, name, iso: f.properties.shapeISO, d: pathFor(f.geometry), cx: +cx.toFixed(1), cy: +cy.toFixed(1), area: Math.round(area) };
});

if (missing.length) {
  console.error("No match in kenyaCountiesWeather.ts for:", missing);
  process.exit(1);
}

counties.sort((a, b) => a.id.localeCompare(b.id));
const out = {
  source: "geoBoundaries KEN ADM1 (gbOpen), public domain; original data: RCMRD GeoPortal / Africa GeoPortal",
  width: WIDTH,
  height: HEIGHT,
  // Mercator settings used above, so the page can place a GPS position on the same map
  projection: { scale: +projection.scale().toFixed(4), translate: projection.translate().map((v) => +v.toFixed(4)) },
  counties,
};
writeFileSync(OUT, JSON.stringify(out));
console.log(`Wrote ${counties.length} counties to ${OUT} (${(JSON.stringify(out).length / 1024).toFixed(0)} KB)`);
