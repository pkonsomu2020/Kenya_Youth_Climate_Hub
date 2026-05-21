// ============================================================
// Climate Readiness Quiz — KYCH Custom Tool
// 8 questions, badges, resource recommendations
// ============================================================
import { useState } from "react";
import { X, ChevronRight, ChevronLeft, RotateCcw, Share2, BookOpen, CheckCircle, XCircle } from "lucide-react";

// ── Quiz questions ────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    category: "Kenya Energy",
    emoji: "⚡",
    question: "What percentage of Kenya's electricity comes from renewable sources?",
    options: ["25%", "50%", "75%", "92%"],
    correct: 3,
    explanation: "Kenya is a renewable energy leader! About 92% of its electricity comes from geothermal, hydro, wind and solar — one of the highest rates in Africa.",
  },
  {
    id: 2,
    category: "Climate Finance",
    emoji: "💰",
    question: "What does 'GCF' stand for in climate finance?",
    options: ["Global Carbon Fund", "Green Climate Fund", "Government Climate Finance", "Global Conservation Fund"],
    correct: 1,
    explanation: "The Green Climate Fund (GCF) is the world's largest dedicated climate fund, helping developing countries like Kenya respond to climate change.",
  },
  {
    id: 3,
    category: "Kenya Energy",
    emoji: "🌋",
    question: "Which renewable energy source generates the MOST electricity in Kenya?",
    options: ["Solar", "Wind", "Geothermal", "Hydro"],
    correct: 2,
    explanation: "Geothermal energy from the Great Rift Valley generates about 47% of Kenya's electricity. Kenya is the 8th largest geothermal producer in the world!",
  },
  {
    id: 4,
    category: "Kenya Policy",
    emoji: "📋",
    question: "What is Kenya's NDC target for reducing greenhouse gas emissions by 2030?",
    options: ["15%", "32%", "45%", "60%"],
    correct: 1,
    explanation: "Kenya's Nationally Determined Contribution (NDC) commits to a 32% reduction in greenhouse gas emissions by 2030, conditional on international support.",
  },
  {
    id: 5,
    category: "Climate Impact",
    emoji: "🌡️",
    question: "Which Kenyan county is MOST vulnerable to drought and climate stress?",
    options: ["Nairobi", "Mombasa", "Turkana", "Kisumu"],
    correct: 2,
    explanation: "Turkana County in northern Kenya is one of the most climate-vulnerable areas in Africa, facing severe droughts, food insecurity, and water scarcity.",
  },
  {
    id: 6,
    category: "Global Policy",
    emoji: "🌍",
    question: "What does 'UNFCCC' stand for?",
    options: [
      "UN Framework Convention on Climate Change",
      "UN Fund for Climate Change Control",
      "UN Finance Committee on Climate Change",
      "UN Forum for Carbon Credit Control",
    ],
    correct: 0,
    explanation: "The UNFCCC (UN Framework Convention on Climate Change) is the international treaty that guides global climate action, including the Paris Agreement.",
  },
  {
    id: 7,
    category: "Carbon Markets",
    emoji: "🏭",
    question: "What is a 'carbon credit'?",
    options: [
      "A loan for green projects",
      "A permit to emit 1 tonne of CO₂",
      "A government climate subsidy",
      "A renewable energy certificate",
    ],
    correct: 1,
    explanation: "A carbon credit represents the right to emit 1 tonne of CO₂. Companies can buy credits to offset their emissions or earn them by reducing emissions.",
  },
  {
    id: 8,
    category: "Youth Action",
    emoji: "🚀",
    question: "What is the Paris Agreement's goal for limiting global temperature rise?",
    options: ["1°C above pre-industrial levels", "1.5°C above pre-industrial levels", "2.5°C above pre-industrial levels", "3°C above pre-industrial levels"],
    correct: 1,
    explanation: "The Paris Agreement aims to limit global warming to 1.5°C above pre-industrial levels. Every fraction of a degree matters for communities like those in Kenya!",
  },
];

// ── Badges ────────────────────────────────────────────────────
const BADGES = [
  { min: 0, max: 2, emoji: "🌱", title: "Climate Seedling",    color: "#10B981", bg: "#ECFDF5", desc: "You're just getting started — and that's great! Every expert was once a beginner." },
  { min: 3, max: 4, emoji: "🌿", title: "Climate Changemaker", color: "#059669", bg: "#D1FAE5", desc: "You have solid climate knowledge. Keep learning and take action in your community!" },
  { min: 5, max: 6, emoji: "🌳", title: "Climate Champion",    color: "#047857", bg: "#A7F3D0", desc: "Impressive! You know your climate facts. You're ready to lead climate action." },
  { min: 7, max: 8, emoji: "🏆", title: "Climate Expert",      color: "#065F46", bg: "#6EE7B7", desc: "Outstanding! You're a climate knowledge leader. Share your expertise with others!" },
];

// ── Resource recommendations based on wrong answers ──────────
const RESOURCE_MAP: Record<number, string> = {
  1: "Youth Advocacy Guide to Kenya's NDC",
  2: "Climate Finance 101 for Young Entrepreneurs",
  3: "Solar Microgrids — Implementation Playbook",
  4: "Youth Advocacy Guide to Kenya's NDC",
  5: "Climate Resilience Handbook for Coastal Kenya",
  6: "Youth Advocacy Guide to Kenya's NDC",
  7: "Climate Grant Proposal Master Template",
  8: "Climate Finance 101 for Young Entrepreneurs",
};

// ── Main component ────────────────────────────────────────────
export function ClimateQuiz({ onClose }: { onClose: () => void }) {
  const [step, setStep]       = useState<"intro" | "quiz" | "results">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const question = QUESTIONS[current];
  const totalQ   = QUESTIONS.length;

  // Score
  const score = Object.entries(answers).filter(
    ([qIdx, ans]) => QUESTIONS[parseInt(qIdx)].correct === ans
  ).length;

  const badge = BADGES.find((b) => score >= b.min && score <= b.max) || BADGES[0];

  // Wrong question IDs for resource recommendations
  const wrongIds = Object.entries(answers)
    .filter(([qIdx, ans]) => QUESTIONS[parseInt(qIdx)].correct !== ans)
    .map(([qIdx]) => QUESTIONS[parseInt(qIdx)].id);

  const recommendedResources = [...new Set(wrongIds.map((id) => RESOURCE_MAP[id]).filter(Boolean))].slice(0, 3);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelected(idx);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setAnswers((prev) => ({ ...prev, [current]: selected }));
    setRevealed(true);
  };

  const handleNext = () => {
    if (current < totalQ - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setStep("results");
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setSelected(answers[current - 1] ?? null);
      setRevealed(current - 1 in answers);
    }
  };

  const reset = () => {
    setStep("intro");
    setCurrent(0);
    setAnswers({});
    setSelected(null);
    setRevealed(false);
  };

  const handleShare = () => {
    const text = `I scored ${score}/${totalQ} on the KYCH Climate Readiness Quiz! 🌍\nI earned the "${badge.title}" badge ${badge.emoji}\nTest your climate knowledge at kych.org/e-library`;
    if (navigator.share) {
      navigator.share({ title: "My Climate Quiz Result — KYCH", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const isCorrect = revealed && selected === question?.correct;
  const isWrong   = revealed && selected !== question?.correct;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "var(--card)", borderRadius: 20, width: "100%", maxWidth: 540,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 25px 80px rgba(0,0,0,.25)",
        animation: "scale-in .25s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Header */}
        <div style={{
          background: "#0A0A0A", borderRadius: "20px 20px 0 0",
          padding: "1.5rem 1.75rem 1.25rem", position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "rgba(255,255,255,.15)", border: "none", borderRadius: "50%",
            width: 32, height: 32, cursor: "pointer", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={16} />
          </button>
          <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.5)", fontFamily: "var(--fm)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".4rem" }}>
            KYCH Tool
          </div>
          <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.3rem", color: "#fff" }}>
            🧠 Climate Readiness Quiz
          </div>
          <div style={{ fontSize: ".82rem", color: "rgba(255,255,255,.6)", marginTop: ".25rem" }}>
            Test your climate knowledge — earn your badge
          </div>

          {/* Progress bar */}
          {step === "quiz" && (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".35rem" }}>
                <span style={{ fontSize: ".68rem", color: "rgba(255,255,255,.5)", fontFamily: "var(--fm)" }}>
                  Question {current + 1} of {totalQ}
                </span>
                <span style={{ fontSize: ".68rem", color: "var(--green)", fontFamily: "var(--fm)", fontWeight: 700 }}>
                  {score} correct
                </span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,.15)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${((current) / totalQ) * 100}%`,
                  background: "var(--green)", borderRadius: 99,
                  transition: "width .4s cubic-bezier(0.4,0,0.2,1)",
                }} />
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: "1.75rem" }}>

          {/* Intro */}
          {step === "intro" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌍</div>
              <div style={{ fontFamily: "var(--fs)", fontWeight: 800, fontSize: "1.3rem", color: "var(--dark)", marginBottom: ".75rem" }}>
                How climate-ready are you?
              </div>
              <div style={{ fontSize: ".88rem", color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                8 questions covering Kenya's climate policy, renewable energy, carbon markets, and global climate action. Takes about 3 minutes.
              </div>

              {/* Badge preview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem", marginBottom: "1.75rem" }}>
                {BADGES.map((b) => (
                  <div key={b.title} style={{
                    padding: ".75rem", background: b.bg, borderRadius: 12,
                    border: `1px solid ${b.color}30`, textAlign: "center",
                  }}>
                    <div style={{ fontSize: "1.5rem" }}>{b.emoji}</div>
                    <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".78rem", color: b.color, marginTop: ".2rem" }}>{b.title}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => setStep("quiz")} className="btn-green" style={{ width: "100%", fontSize: "1rem", padding: ".85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}>
                Start Quiz <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Quiz */}
          {step === "quiz" && question && (
            <>
              {/* Category badge */}
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "1.2rem" }}>{question.emoji}</span>
                <span style={{
                  fontSize: ".68rem", padding: ".2rem .6rem",
                  background: "var(--cd)", color: "var(--muted-foreground)",
                  borderRadius: 99, fontFamily: "var(--fm)", fontWeight: 600,
                  border: "1px solid var(--border)",
                }}>
                  {question.category}
                </span>
              </div>

              {/* Question */}
              <div style={{
                fontFamily: "var(--fs)", fontWeight: 700, fontSize: "1.05rem",
                color: "var(--dark)", lineHeight: 1.4, marginBottom: "1.25rem",
              }}>
                {question.question}
              </div>

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: ".55rem", marginBottom: "1.25rem" }}>
                {question.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrectOpt = revealed && idx === question.correct;
                  const isWrongOpt   = revealed && isSelected && idx !== question.correct;

                  let bg = "#fff";
                  let border = "var(--border)";
                  let color = "var(--dark)";

                  if (isCorrectOpt) { bg = "#ECFDF5"; border = "#059669"; color = "#065F46"; }
                  else if (isWrongOpt) { bg = "#FEF2F2"; border = "#dc2626"; color = "#991B1B"; }
                  else if (isSelected && !revealed) { bg = "#F0FDF4"; border = "var(--green)"; color = "var(--dark)"; }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={revealed}
                      style={{
                        padding: ".85rem 1.1rem",
                        border: `2px solid ${border}`,
                        borderRadius: 12, background: bg,
                        cursor: revealed ? "default" : "pointer",
                        textAlign: "left", fontFamily: "var(--fs)",
                        fontWeight: isSelected || isCorrectOpt ? 700 : 500,
                        fontSize: ".88rem", color,
                        transition: "all .15s",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <span>{opt}</span>
                      {isCorrectOpt && <CheckCircle size={18} color="#059669" />}
                      {isWrongOpt   && <XCircle    size={18} color="#dc2626" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (after reveal) */}
              {revealed && (
                <div style={{
                  padding: "1rem", borderRadius: 12, marginBottom: "1.25rem",
                  background: isCorrect ? "#ECFDF5" : "#FEF9C3",
                  border: `1px solid ${isCorrect ? "#A7F3D0" : "#FDE68A"}`,
                }}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".85rem", color: isCorrect ? "#065F46" : "#92400E", marginBottom: ".35rem" }}>
                    {isCorrect ? "✅ Correct!" : "❌ Not quite!"}
                  </div>
                  <div style={{ fontSize: ".82rem", color: isCorrect ? "#065F46" : "#92400E", lineHeight: 1.55 }}>
                    {question.explanation}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: ".75rem" }}>
                {current > 0 && !revealed && (
                  <button onClick={handleBack} className="btn-g" style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                )}
                {!revealed ? (
                  <button
                    onClick={handleReveal}
                    disabled={selected === null}
                    className="btn-green"
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem",
                      opacity: selected !== null ? 1 : 0.4,
                      cursor: selected !== null ? "pointer" : "not-allowed",
                    }}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button onClick={handleNext} className="btn-green" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".4rem" }}>
                    {current < totalQ - 1 ? "Next Question" : "See My Results"} <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </>
          )}

          {/* Results */}
          {step === "results" && (
            <>
              {/* Badge */}
              <div style={{
                textAlign: "center", padding: "1.75rem",
                background: badge.bg, borderRadius: 16, marginBottom: "1.5rem",
                border: `2px solid ${badge.color}30`,
              }}>
                <div style={{ fontSize: "4rem", marginBottom: ".5rem" }}>{badge.emoji}</div>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 900, fontSize: "1.4rem", color: badge.color }}>
                  {badge.title}
                </div>
                <div style={{
                  fontFamily: "var(--fs)", fontWeight: 800, fontSize: "2.5rem",
                  color: badge.color, margin: ".5rem 0",
                }}>
                  {score}/{totalQ}
                </div>
                <div style={{ fontSize: ".85rem", color: badge.color, lineHeight: 1.5, maxWidth: 320, margin: "0 auto" }}>
                  {badge.desc}
                </div>
              </div>

              {/* Question review */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", marginBottom: ".75rem", color: "var(--dark)" }}>
                  Your answers
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
                  {QUESTIONS.map((q, idx) => {
                    const userAns = answers[idx];
                    const correct = userAns === q.correct;
                    return (
                      <div key={idx} style={{
                        display: "flex", alignItems: "center", gap: ".75rem",
                        padding: ".6rem .85rem", borderRadius: 10,
                        background: correct ? "#ECFDF5" : "#FEF2F2",
                        border: `1px solid ${correct ? "#A7F3D0" : "#FECACA"}`,
                      }}>
                        {correct
                          ? <CheckCircle size={16} color="#059669" style={{ flexShrink: 0 }} />
                          : <XCircle    size={16} color="#dc2626" style={{ flexShrink: 0 }} />
                        }
                        <span style={{ fontSize: ".78rem", color: correct ? "#065F46" : "#991B1B", lineHeight: 1.4 }}>
                          {q.question.slice(0, 60)}…
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommended resources */}
              {recommendedResources.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--fs)", fontWeight: 700, fontSize: ".9rem", marginBottom: ".75rem", color: "var(--dark)" }}>
                    📚 Recommended for you
                  </div>
                  {recommendedResources.map((res) => (
                    <div key={res} style={{
                      display: "flex", alignItems: "center", gap: ".75rem",
                      padding: ".75rem", background: "var(--cd)", borderRadius: 10,
                      marginBottom: ".5rem", border: "1px solid var(--border)",
                    }}>
                      <BookOpen size={16} color="var(--green)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: ".82rem", color: "var(--dark)", fontWeight: 600 }}>{res}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: "flex", gap: ".75rem" }}>
                <button onClick={reset} className="btn-g" style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>
                  <RotateCcw size={14} /> Retake Quiz
                </button>
                <button onClick={handleShare} className="btn-green" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: ".35rem" }}>
                  <Share2 size={14} /> Share My Badge
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
