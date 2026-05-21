"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CarbonCalculator } from "@/components/tools/CarbonCalculator";
import { ClimateQuiz } from "@/components/tools/ClimateQuiz";
import { ChevronRight } from "lucide-react";

export default function ELibrary() {
  const [openTool, setOpenTool] = useState<"calculator" | "quiz" | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="Resource Hub"
        title={<>Climate <span>E-Library</span></>}
        subtitle="Discover exclusive interactive tools built for young Kenyan climate changemakers."
      />

      <section className="sec">
        <div className="sec-in">

          {/* ── KYCH Interactive Tools ─────────────────────── */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 3, height: 22, background: "var(--green)", borderRadius: 99 }} />
              <div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.1rem", color: "var(--dark)" }}>
                  KYCH Interactive Tools
                </div>
                <div style={{ fontSize: ".75rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>
                  Built exclusively for young Kenyan climate changemakers
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>

              {/* Carbon Calculator Card */}
              <button
                onClick={() => setOpenTool("calculator")}
                style={{
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  border: "none", borderRadius: 16, padding: "1.5rem",
                  cursor: "pointer", textAlign: "left", position: "relative",
                  overflow: "hidden", transition: "transform .2s, box-shadow .2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(5,150,105,.35)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                {/* Background decoration */}
                <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
                <div style={{ position: "absolute", right: 20, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.05)" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "2.2rem", marginBottom: ".75rem" }}>🌍</div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.05rem", color: "#fff", marginBottom: ".4rem" }}>
                    Carbon Footprint Calculator
                  </div>
                  <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.75)", lineHeight: 1.5, marginBottom: "1rem" }}>
                    Calculate your personal CO₂ impact in 60 seconds. Kenya-specific emission factors.
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                    <span style={{ fontSize: ".68rem", padding: ".2rem .6rem", background: "rgba(255,255,255,.2)", color: "#fff", borderRadius: 99, fontFamily: "var(--fm)" }}>
                      4 questions
                    </span>
                    <span style={{ fontSize: ".68rem", padding: ".2rem .6rem", background: "rgba(255,255,255,.2)", color: "#fff", borderRadius: 99, fontFamily: "var(--fm)" }}>
                      60 seconds
                    </span>
                    <span style={{ marginLeft: "auto", color: "#fff", display: "flex", alignItems: "center", gap: ".2rem", fontSize: ".78rem", fontWeight: 700, fontFamily: "var(--fs)" }}>
                      Launch <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </button>

              {/* Climate Quiz Card */}
              <button
                onClick={() => setOpenTool("quiz")}
                style={{
                  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                  border: "none", borderRadius: 16, padding: "1.5rem",
                  cursor: "pointer", textAlign: "left", position: "relative",
                  overflow: "hidden", transition: "transform .2s, box-shadow .2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(15,23,42,.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,.04)" }} />
                <div style={{ position: "absolute", right: 20, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(5,150,105,.15)" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontSize: "2.2rem", marginBottom: ".75rem" }}>🧠</div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.05rem", color: "#fff", marginBottom: ".4rem" }}>
                    Climate Readiness Quiz
                  </div>
                  <div style={{ fontSize: ".78rem", color: "rgba(255,255,255,.6)", lineHeight: 1.5, marginBottom: "1rem" }}>
                    Test your climate knowledge. Earn a badge. Get personalised learning resources.
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
                    <span style={{ fontSize: ".68rem", padding: ".2rem .6rem", background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.8)", borderRadius: 99, fontFamily: "var(--fm)" }}>
                      8 questions
                    </span>
                    <span style={{ fontSize: ".68rem", padding: ".2rem .6rem", background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.8)", borderRadius: 99, fontFamily: "var(--fm)" }}>
                      3 minutes
                    </span>
                    <span style={{ marginLeft: "auto", color: "var(--green)", display: "flex", alignItems: "center", gap: ".2rem", fontSize: ".78rem", fontWeight: 700, fontFamily: "var(--fs)" }}>
                      Launch <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </button>

            </div>
          </div>

          {/* Tool modals */}
          {openTool === "calculator" && <CarbonCalculator onClose={() => setOpenTool(null)} />}
          {openTool === "quiz"       && <ClimateQuiz      onClose={() => setOpenTool(null)} />}

        </div>
      </section>
    </>
  );
}
