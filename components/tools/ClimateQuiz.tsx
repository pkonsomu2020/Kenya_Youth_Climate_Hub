// ============================================================
// Climate Readiness Quiz — KYCH Custom Tool
// 8 questions, badges, topics to revisit
// ============================================================
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";
import { ToolDialog, shareText } from "@/components/tools/ToolDialog";

// Question text, options, category and explanation live in messages under quiz.questions[i].
const QUESTION_META = [
  { id: 1, icon: "bolt",          correct: 3 },
  { id: 2, icon: "payments",      correct: 1 },
  { id: 3, icon: "volcano",       correct: 2 },
  { id: 4, icon: "assignment",    correct: 1 },
  { id: 5, icon: "thermostat",    correct: 2 },
  { id: 6, icon: "public",        correct: 0 },
  { id: 7, icon: "factory",       correct: 1 },
  { id: 8, icon: "rocket_launch", correct: 1 },
];

type QuestionText = { category: string; question: string; options: string[]; explanation: string };

// Titles / descriptions live in messages under quiz.badges[i].
const BADGE_META = [
  { min: 0, max: 2, icon: "potted_plant", tone: "light" },
  { min: 3, max: 4, icon: "eco",          tone: "sun" },
  { min: 5, max: 6, icon: "park",         tone: "green" },
  { min: 7, max: 8, icon: "emoji_events", tone: "navy" },
];

export function ClimateQuiz({ onClose }: { onClose: () => void }) {
  const t = useTranslations("quiz");
  const questionText = t.raw("questions") as QuestionText[];
  const badgeText = t.raw("badges") as { title: string; desc: string }[];
  const QUESTIONS = QUESTION_META.map((q, i) => ({ ...q, ...questionText[i] }));
  const BADGES = BADGE_META.map((b, i) => ({ ...b, ...badgeText[i] }));
  const [step, setStep]         = useState<"intro" | "quiz" | "results">("intro");
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied]     = useState(false);

  const question = QUESTIONS[current];
  const totalQ   = QUESTIONS.length;
  const score = Object.entries(answers).filter(([qIdx, ans]) => QUESTIONS[parseInt(qIdx)].correct === ans).length;
  const badge = BADGES.find((b) => score >= b.min && score <= b.max) || BADGES[0];

  // Topics behind the questions answered wrongly (already translated categories)
  const revisit = [...new Set(
    Object.entries(answers)
      .filter(([qIdx, ans]) => QUESTIONS[parseInt(qIdx)].correct !== ans)
      .map(([qIdx]) => QUESTIONS[parseInt(qIdx)].category),
  )];

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
    setCopied(false);
  };

  const share = async () => {
    setCopied(await shareText(t("shareTitle"), t("shareText", { score, total: totalQ, badge: badge.title })));
  };

  const isCorrect = revealed && selected === question?.correct;

  return (
    <ToolDialog
      label={t("toolLabel")}
      title={t("title")}
      icon="psychology"
      subtitle={t("subtitle")}
      closeLabel={t("close")}
      progress={step === "quiz" ? { value: current, max: totalQ, text: t("progress", { n: current + 1, total: totalQ }), aside: t("correctCount", { count: score }) } : undefined}
      onClose={onClose}
    >
      {step === "intro" && (
        <div className="z-tool__intro">
          <h3>{t("introTitle")}</h3>
          <p>{t("introBody")}</p>
          <ul className="z-tool__badges">
            {BADGES.map((b) => (
              <li key={b.title} className={`z-tool__badge z-tool__badge--${b.tone}`}>
                <Icon name={b.icon} fill size={28} />
                <b>{b.title}</b>
                <small className="z-mono">{b.min}–{b.max}</small>
              </li>
            ))}
          </ul>
          <button type="button" className="z-btn z-btn--green z-tool__wide" onClick={() => setStep("quiz")}>
            {t("start")} <Icon name="arrow_forward" />
          </button>
        </div>
      )}

      {step === "quiz" && question && (
        <fieldset className="z-tool__q">
          <legend className="z-tool__qlegend">
            <span className="z-tool__cat"><Icon name={question.icon} /> {question.category}</span>
            <b className="z-tool__question">{question.question}</b>
          </legend>
          <div className="z-tool__opts">
            {question.options.map((opt, idx) => {
              const isSelected = selected === idx;
              const isCorrectOpt = revealed && idx === question.correct;
              const isWrongOpt = revealed && isSelected && idx !== question.correct;
              return (
                <label
                  key={idx}
                  className="z-tool__opt"
                  data-selected={isSelected && !revealed}
                  data-state={isCorrectOpt ? "right" : isWrongOpt ? "wrong" : undefined}
                >
                  <input type="radio" name={`q${current}`} checked={isSelected} disabled={revealed} onChange={() => setSelected(idx)} />
                  <span>{opt}</span>
                  {isCorrectOpt && <Icon name="check_circle" fill className="z-tool__tick" label={t("correct")} />}
                  {isWrongOpt && <Icon name="cancel" fill className="z-tool__tick" label={t("wrong")} />}
                </label>
              );
            })}
          </div>

          {revealed && (
            <div className={`z-tool__explain${isCorrect ? "" : " z-tool__explain--wrong"}`} role="status">
              <b><Icon name={isCorrect ? "check_circle" : "info"} fill /> {isCorrect ? t("correct") : t("wrong")}</b>
              <p>{question.explanation}</p>
            </div>
          )}

          <div className="z-tool__acts">
            {current > 0 && !revealed && (
              <button type="button" className="z-btn z-btn--white z-btn--sm" onClick={handleBack}><Icon name="arrow_back" /> {t("back")}</button>
            )}
            {!revealed ? (
              <button type="button" className="z-btn z-btn--green z-btn--sm z-tool__grow" disabled={selected === null} onClick={handleReveal}>
                {t("check")}
              </button>
            ) : (
              <button type="button" className="z-btn z-btn--green z-btn--sm z-tool__grow" onClick={handleNext}>
                {current < totalQ - 1 ? t("nextQuestion") : t("seeResults")} <Icon name="arrow_forward" />
              </button>
            )}
          </div>
        </fieldset>
      )}

      {step === "results" && (
        <>
          <div className={`z-tool__score z-tool__score--${badge.tone}`}>
            <Icon name={badge.icon} fill size={48} />
            <span className="z-tool__pill">{badge.title}</span>
            <b>{score}/{totalQ}</b>
            <p>{badge.desc}</p>
          </div>

          <h3 className="z-tool__h">{t("yourAnswers")}</h3>
          <ol className="z-tool__review">
            {QUESTIONS.map((q, idx) => {
              const right = answers[idx] === q.correct;
              return (
                <li key={idx} data-state={right ? "right" : "wrong"}>
                  <Icon name={right ? "check_circle" : "cancel"} fill label={right ? t("correct") : t("wrong")} />
                  <span>{q.question}</span>
                </li>
              );
            })}
          </ol>

          {revisit.length > 0 && (
            <>
              <h3 className="z-tool__h"><Icon name="menu_book" /> {t("recommended")}</h3>
              <ul className="z-tool__revisit">
                {revisit.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </>
          )}

          <div className="z-tool__acts">
            <button type="button" className="z-btn z-btn--white z-btn--sm" onClick={reset}><Icon name="restart_alt" /> {t("retake")}</button>
            <button type="button" className="z-btn z-btn--green z-btn--sm z-tool__grow" onClick={share}><Icon name="share" /> {t("share")}</button>
          </div>
          <p className="z-tool__status" role="status">{copied ? t("copied") : ""}</p>
        </>
      )}
    </ToolDialog>
  );
}
