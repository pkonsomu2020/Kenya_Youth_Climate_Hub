// ============================================================
// Carbon Footprint Calculator — KYCH Custom Tool
// Pure frontend, no API needed, Kenya-specific emission factors
// ============================================================
import { useState } from "react";
import { X, Car, Zap, Leaf, Trash2, Share2, RotateCcw, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

// ── Kenya-specific emission factors (kg CO₂/year) ────────────
const TRANSPORT_EMISSIONS: Record<string, number> = {
  "🚶 Walk / Cycle":    0,
  "🚌 Matatu / Bus":    180,
  "🏍️ Boda Boda":       220,
  "🚗 Private Car":     1200,
  "🚕 Uber / Taxi":     600,
};

const ENERGY_EMISSIONS: Record<string, number> = {
  "☀️ Solar only":          50,
  "⚡ Grid + some solar":   200,
  "🔌 Grid only":           400,
  "🛢️ Generator":           800,
};

const FOOD_EMISSIONS: Record<string, number> = {
  "🥩 Mostly meat":    1200,
  "🍽️ Mixed diet":     700,
  "🥦 Mostly veg":     400,
  "🌱 Vegan":          200,
};

const WASTE_EMISSIONS: Record<string, number> = {
  "♻️ Always recycle":     50,
  "🗑️ Sometimes recycle":  150,
  "❌ Rarely recycle":     300,
  "🚮 Never recycle":      500,
};

const KENYA_AVG  = 0.4;
const AFRICA_AVG = 1.0;
const WORLD_AVG  = 4.7;

// ── Tips based on highest emission category ──────────────────
function getTips(transport: number, energy: number, food: number, waste: number) {
  const tips: string[] = [];
  const sorted = [
    { label: "transport", val: transport, tip: "Switch to matatu or cycle for short trips — saves up to 1.0t CO₂/year" },
    { label: "energy",    val: energy,    tip: "Install a small solar panel — saves 0.35t CO₂/year and cuts electricity bills" },
    { label: "food",      val: food,      tip: "Reduce meat 2 days/week — saves up to 0.5t CO₂/year" },
    { label: "waste",     val: waste,     tip: "Start composting food waste — reduces methane emissions significantly" },
  ].sort((a, b) => b.val - a.val);

  sorted.slice(0, 3).forEach((s) => tips.push(s.tip));
  return tips;
}

// ── Step config ───────────────────────────────────────────────
const STEPS = [
  {
    id: "transport",
    icon: <Car size={28} />,
    color: "#059669",
    title: "How do you get around?",
    subtitle: "Your main daily transport in Kenya",
    options: Object.keys(TRANSPORT_EMISSIONS),
    emissions: TRANSPORT_EMISSIONS,
  },
  {
    id: "energy",
    icon: <Zap size={28} />,
    color: "#047857",
    title: "How do you power your home?",
    subtitle: "Your primary energy source",
    options: Object.keys(ENERGY_EMISSIONS),
    emissions: ENERGY_EMISSIONS,
  },
  {
    id: "food",
    icon: <Leaf size={28} />,
    color: "#10B981",
    title: "What's your diet like?",
    subtitle: "Your typical eating habits",
    options: Object.keys(FOOD_EMISSIONS),
    emissions: FOOD_EMISSIONS,
  },
  {
    id: "waste",
    icon: <Trash2 size={28} />,
    color: "#34D399",
    title: "How do you handle waste?",
    subtitle: "Your recycling & waste habits",
    options: Object.keys(WASTE_EMISSIONS),
    emissions: WASTE_EMISSIONS,
  },
];

// ── Result bar component ──────────────────────────────────────
function ComparisonBar({ label, value, max, color, isYou }: {
  label: string; value: number; max: number; color: string; isYou?: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: ".75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".3rem" }}>
        <span style={{ fontSize: ".78rem", fontWeight: isYou ? 700 : 500, color: isYou ? "var(--dark)" : "var(--muted-foreground)", fontFamily: "var(--fs)" }}>
          {isYou ? "🫵 You" : label}
        </span>
        <span style={{ fontSize: ".78rem", fontWeight: 700, color: isYou ? color : "var(--muted-foreground)", fontFamily: "var(--fs)" }}>
          {value.toFixed(1)}t
        </span>
      </div>
      <div style={{ height: isYou ? 14 : 10, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: isYou ? color : "#D1D5DB",
          borderRadius: 99,
          transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function CarbonCalculator({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0); // 0-3 = questions, 4 = results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [animating, setAnimating] = useState(false);

  const currentStep = STEPS[step];
  const isLastQuestion = step === STEPS.length - 1;
  const isResults = step === STEPS.length;

  // Calculate totals
  const transportKg = TRANSPORT_EMISSIONS[answers.transport] ?? 0;
  const energyKg    = ENERGY_EMISSIONS[answers.energy]       ?? 0;
  const foodKg      = FOOD_EMISSIONS[answers.food]           ?? 0;
  const wasteKg     = WASTE_EMISSIONS[answers.waste]         ?? 0;
  const totalKg     = transportKg + energyKg + foodKg + wasteKg;
  const totalTonnes = totalKg / 1000;
  const tips        = getTips(transportKg, energyKg, foodKg, wasteKg);

  const maxBar = Math.max(totalTonnes, WORLD_AVG) * 1.1;

  // Score label
  const getScoreLabel = () => {
    if (totalTonnes <= KENYA_AVG)  return { label: "Climate Hero 🏆",    color: "#059669", bg: "#ECFDF5" };
    if (totalTonnes <= AFRICA_AVG) return { label: "Doing Well 🌿",      color: "#047857", bg: "#D1FAE5" };
    if (totalTonnes <= WORLD_AVG)  return { label: "Room to Improve 🌱", color: "#d97706", bg: "#FEF9C3" };
    return                                { label: "High Impact ⚠️",      color: "#dc2626", bg: "#FEF2F2" };
  };

  const scoreLabel = getScoreLabel();

  const selectAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentStep.id]: option }));
  };

  const goNext = () => {
    if (!answers[currentStep.id]) return;
    setAnimating(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setAnimating(false);
    }, 200);
  };

  const goBack = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  const handleShare = () => {
    const text = `I calculated my carbon footprint with KYCH! 🌍\nMy footprint: ${totalTonnes.toFixed(1)}t CO₂/year\nKenya average: ${KENYA_AVG}t | World average: ${WORLD_AVG}t\nCalculate yours at kych.org/e-library`;
    if (navigator.share) {
      navigator.share({ title: "My Carbon Footprint — KYCH", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "var(--card)", borderRadius: 20, width: "100%", maxWidth: 520,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 25px 80px rgba(0,0,0,.25)",
        animation: "scale-in .25s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Header */}
        <div style={{
          background: "var(--green)", borderRadius: "20px 20px 0 0",
          padding: "1.5rem 1.75rem 1.25rem",
          position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%",
            width: 32, height: 32, cursor: "pointer", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} />
          </button>
          <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.7)", fontFamily: "var(--fm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem" }}>
            KYCH Tool
          </div>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.3rem", color: "#fff" }}>
            🌍 Carbon Footprint Calculator
          </div>
          <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.75)", marginTop: ".25rem" }}>
            Find out your CO₂ impact in 60 seconds
          </div>

          {/* Progress dots */}
          {!isResults && (
            <div style={{ display: "flex", gap: ".4rem", marginTop: "1rem" }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  height: 4, flex: 1, borderRadius: 99,
                  background: i <= step ? "#fff" : "rgba(255,255,255,.3)",
                  transition: "background .3s",
                }} />
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "1.75rem", opacity: animating ? 0 : 1, transition: "opacity .2s" }}>

          {/* Question step */}
          {!isResults && currentStep && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1.5rem" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: currentStep.color + "15",
                  border: `2px solid ${currentStep.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: currentStep.color,
                }}>
                  {currentStep.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.05rem", color: "var(--dark)" }}>
                    {currentStep.title}
                  </div>
                  <div style={{ fontSize: ".78rem", color: "var(--muted-foreground)", marginTop: ".15rem" }}>
                    {currentStep.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.5rem" }}>
                {currentStep.options.map((option) => {
                  const selected = answers[currentStep.id] === option;
                  return (
                    <button
                      key={option}
                      onClick={() => selectAnswer(option)}
                      style={{
                        padding: ".85rem 1.1rem",
                        border: `2px solid ${selected ? currentStep.color : "var(--border)"}`,
                        borderRadius: 12,
                        background: selected ? currentStep.color + "10" : "#fff",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "var(--fs)",
                        fontWeight: selected ? 700 : 500,
                        fontSize: ".9rem",
                        color: selected ? currentStep.color : "var(--dark)",
                        transition: "all .15s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{option}</span>
                      {selected && <CheckCircle size={18} color={currentStep.color} />}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: ".75rem" }}>
                {step > 0 && (
                  <button onClick={goBack} className="btn-g" style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                <button
                  onClick={goNext}
                  disabled={!answers[currentStep.id]}
                  className="btn-green"
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem",
                    opacity: answers[currentStep.id] ? 1 : 0.4,
                    cursor: answers[currentStep.id] ? "pointer" : "not-allowed",
                  }}
                >
                  {isLastQuestion ? "Calculate My Footprint 🌍" : "Next"} <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* Results */}
          {isResults && (
            <>
              {/* Score */}
              <div style={{
                textAlign: "center", padding: "1.5rem",
                background: scoreLabel.bg, borderRadius: 16, marginBottom: "1.5rem",
                border: `2px solid ${scoreLabel.color}30`,
              }}>
                <div style={{ fontSize: "3.5rem", fontFamily: "var(--fs)", fontWeight: 900, color: scoreLabel.color, lineHeight: 1 }}>
                  {totalTonnes.toFixed(1)}
                </div>
                <div style={{ fontSize: ".85rem", color: scoreLabel.color, fontFamily: "var(--fm)", marginTop: ".25rem" }}>
                  tonnes CO₂ per year
                </div>
                <div style={{
                  display: "inline-block", marginTop: ".75rem",
                  padding: ".35rem 1rem", background: scoreLabel.color,
                  color: "#fff", borderRadius: 99, fontSize: ".8rem",
                  fontFamily: "var(--fs)", fontWeight: 700,
                }}>
                  {scoreLabel.label}
                </div>
              </div>

              {/* Comparison bars */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", marginBottom: "1rem", color: "var(--dark)" }}>
                  How you compare
                </div>
                <ComparisonBar label="You" value={totalTonnes} max={maxBar} color={scoreLabel.color} isYou />
                <ComparisonBar label={`🇰🇪 Kenya avg (${KENYA_AVG}t)`} value={KENYA_AVG} max={maxBar} color="#059669" />
                <ComparisonBar label={`🌍 Africa avg (${AFRICA_AVG}t)`} value={AFRICA_AVG} max={maxBar} color="#047857" />
                <ComparisonBar label={`🌐 World avg (${WORLD_AVG}t)`} value={WORLD_AVG} max={maxBar} color="#dc2626" />
              </div>

              {/* Breakdown */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", marginBottom: ".75rem", color: "var(--dark)" }}>
                  Your breakdown
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
                  {[
                    { label: "Transport", val: transportKg, icon: "🚗" },
                    { label: "Energy",    val: energyKg,    icon: "⚡" },
                    { label: "Food",      val: foodKg,      icon: "🍽️" },
                    { label: "Waste",     val: wasteKg,     icon: "🗑️" },
                  ].map(({ label, val, icon }) => (
                    <div key={label} style={{
                      padding: ".75rem", background: "var(--cd)",
                      borderRadius: 10, textAlign: "center",
                      border: "1px solid var(--border)",
                    }}>
                      <div style={{ fontSize: "1.2rem" }}>{icon}</div>
                      <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".85rem", color: "var(--dark)", marginTop: ".2rem" }}>
                        {(val / 1000).toFixed(2)}t
                      </div>
                      <div style={{ fontSize: ".65rem", color: "var(--muted-foreground)", fontFamily: "var(--fm)" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", marginBottom: ".75rem", color: "var(--dark)" }}>
                  💡 Your top 3 actions
                </div>
                {tips.map((tip, i) => (
                  <div key={i} style={{
                    display: "flex", gap: ".75rem", alignItems: "flex-start",
                    padding: ".75rem", background: "#ECFDF5",
                    borderRadius: 10, marginBottom: ".5rem",
                    border: "1px solid #A7F3D0",
                  }}>
                    <span style={{ fontFamily: "var(--fs)", fontWeight: 800, color: "var(--green)", fontSize: ".85rem", flexShrink: 0 }}>
                      {i + 1}.
                    </span>
                    <span style={{ fontSize: ".82rem", color: "#065F46", lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: ".75rem" }}>
                <button onClick={reset} className="btn-g" style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                  <RotateCcw size={14} /> Recalculate
                </button>
                <button onClick={handleShare} className="btn-green" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".35rem" }}>
                  <Share2 size={14} /> Share My Result
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
