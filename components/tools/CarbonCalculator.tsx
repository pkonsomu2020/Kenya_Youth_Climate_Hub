// ============================================================
// Carbon Footprint Calculator — KYCH Custom Tool
// Pure frontend, no API needed, Kenya-specific emission factors
// ============================================================
"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/zine/Icon";
import { ToolDialog, shareText } from "@/components/tools/ToolDialog";

// ── Kenya-specific emission factors (kg CO₂/year) ────────────
// Keyed by option id; labels live in messages under calculator.options.*
const TRANSPORT_EMISSIONS: Record<string, number> = {
  walk:    0,
  matatu:  180,
  boda:    220,
  car:     1200,
  taxi:    600,
};

const ENERGY_EMISSIONS: Record<string, number> = {
  solar:      50,
  gridSolar:  200,
  grid:       400,
  generator:  800,
};

const FOOD_EMISSIONS: Record<string, number> = {
  meat:   1200,
  mixed:  700,
  veg:    400,
  vegan:  200,
};

const WASTE_EMISSIONS: Record<string, number> = {
  always:     50,
  sometimes:  150,
  rarely:     300,
  never:      500,
};

// Material Symbols per answer (no emoji)
const OPTION_ICON: Record<string, string> = {
  walk: "directions_walk", matatu: "directions_bus", boda: "two_wheeler", car: "directions_car", taxi: "local_taxi",
  solar: "solar_power", gridSolar: "bolt", grid: "electrical_services", generator: "local_gas_station",
  meat: "kebab_dining", mixed: "restaurant", veg: "nutrition", vegan: "eco",
  always: "recycling", sometimes: "delete", rarely: "block", never: "delete_forever",
};

const KENYA_AVG  = 0.4;
const AFRICA_AVG = 1.0;
const WORLD_AVG  = 4.7;

// ── Tips based on highest emission category (returns calculator.tips.* keys) ──
function getTips(transport: number, energy: number, food: number, waste: number) {
  return [
    { label: "transport", val: transport },
    { label: "energy",    val: energy },
    { label: "food",      val: food },
    { label: "waste",     val: waste },
  ].sort((a, b) => b.val - a.val).slice(0, 3).map((s) => s.label);
}

const STEPS = [
  { id: "transport", icon: "directions_car", options: Object.keys(TRANSPORT_EMISSIONS) },
  { id: "energy",    icon: "bolt",           options: Object.keys(ENERGY_EMISSIONS) },
  { id: "food",      icon: "restaurant",     options: Object.keys(FOOD_EMISSIONS) },
  { id: "waste",     icon: "delete",         options: Object.keys(WASTE_EMISSIONS) },
];

function ComparisonBar({ label, value, max, you }: { label: string; value: number; max: number; you?: boolean }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={`z-tool__cmp${you ? " z-tool__cmp--you" : ""}`}>
      <div className="z-tool__cmphead"><span>{label}</span><b>{value.toFixed(1)}t</b></div>
      <div className="z-tool__cmpbar"><i style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function CarbonCalculator({ onClose }: { onClose: () => void }) {
  const t = useTranslations("calculator");
  const [step, setStep] = useState(0); // 0-3 = questions, 4 = results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const currentStep = STEPS[step];
  const isLastQuestion = step === STEPS.length - 1;
  const isResults = step === STEPS.length;

  const transportKg = TRANSPORT_EMISSIONS[answers.transport] ?? 0;
  const energyKg    = ENERGY_EMISSIONS[answers.energy]       ?? 0;
  const foodKg      = FOOD_EMISSIONS[answers.food]           ?? 0;
  const wasteKg     = WASTE_EMISSIONS[answers.waste]         ?? 0;
  const totalTonnes = (transportKg + energyKg + foodKg + wasteKg) / 1000;
  const tips        = getTips(transportKg, energyKg, foodKg, wasteKg);
  const maxBar      = Math.max(totalTonnes, WORLD_AVG) * 1.1;

  const score =
    totalTonnes <= KENYA_AVG  ? { key: "hero",    icon: "emoji_events", tone: "green" } :
    totalTonnes <= AFRICA_AVG ? { key: "well",    icon: "eco",          tone: "light" } :
    totalTonnes <= WORLD_AVG  ? { key: "improve", icon: "spa",          tone: "sun" } :
                                { key: "high",    icon: "warning",      tone: "orange" };

  const reset = () => { setStep(0); setAnswers({}); setCopied(false); };
  const share = async () => {
    const text = t("shareText", { total: totalTonnes.toFixed(1), kenya: KENYA_AVG, world: WORLD_AVG });
    setCopied(await shareText(t("shareTitle"), text));
  };

  return (
    <ToolDialog
      label={t("toolLabel")}
      title={t("title")}
      icon="footprint"
      subtitle={t("subtitle")}
      closeLabel={t("close")}
      progress={isResults ? undefined : { value: step + 1, max: STEPS.length }}
      onClose={onClose}
    >
      {!isResults && currentStep && (
        <fieldset className="z-tool__q">
          <legend>
            <span className="z-tool__qicon"><Icon name={currentStep.icon} size={28} /></span>
            <span>
              <b>{t(`steps.${currentStep.id}.title`)}</b>
              <small>{t(`steps.${currentStep.id}.subtitle`)}</small>
            </span>
          </legend>
          <div className="z-tool__opts">
            {currentStep.options.map((option) => {
              const selected = answers[currentStep.id] === option;
              return (
                <label key={option} className="z-tool__opt" data-selected={selected}>
                  <input
                    type="radio"
                    name={currentStep.id}
                    value={option}
                    checked={selected}
                    onChange={() => setAnswers((prev) => ({ ...prev, [currentStep.id]: option }))}
                  />
                  <Icon name={OPTION_ICON[option]} />
                  <span>{t(`options.${option}`)}</span>
                  {selected && <Icon name="check_circle" fill className="z-tool__tick" />}
                </label>
              );
            })}
          </div>
          <div className="z-tool__acts">
            {step > 0 && (
              <button type="button" className="z-btn z-btn--white z-btn--sm" onClick={() => setStep((s) => s - 1)}>
                <Icon name="arrow_back" /> {t("back")}
              </button>
            )}
            <button
              type="button"
              className="z-btn z-btn--green z-btn--sm z-tool__grow"
              disabled={!answers[currentStep.id]}
              onClick={() => answers[currentStep.id] && setStep((s) => s + 1)}
            >
              {isLastQuestion ? t("calculate") : t("next")} <Icon name="arrow_forward" />
            </button>
          </div>
        </fieldset>
      )}

      {isResults && (
        <>
          <div className={`z-tool__score z-tool__score--${score.tone}`}>
            <b>{totalTonnes.toFixed(1)}</b>
            <span className="z-mono">{t("perYear")}</span>
            <span className="z-tool__pill"><Icon name={score.icon} fill /> {t(`score.${score.key}`)}</span>
          </div>

          <h3 className="z-tool__h">{t("compare")}</h3>
          <ComparisonBar label={t("you")} value={totalTonnes} max={maxBar} you />
          <ComparisonBar label={t("kenyaAvg", { value: KENYA_AVG })} value={KENYA_AVG} max={maxBar} />
          <ComparisonBar label={t("africaAvg", { value: AFRICA_AVG })} value={AFRICA_AVG} max={maxBar} />
          <ComparisonBar label={t("worldAvg", { value: WORLD_AVG })} value={WORLD_AVG} max={maxBar} />

          <h3 className="z-tool__h">{t("breakdown")}</h3>
          <dl className="z-tool__breakdown">
            {[
              { key: "transport", val: transportKg, icon: "directions_car" },
              { key: "energy",    val: energyKg,    icon: "bolt" },
              { key: "food",      val: foodKg,      icon: "restaurant" },
              { key: "waste",     val: wasteKg,     icon: "delete" },
            ].map(({ key, val, icon }) => (
              <div key={key}>
                <dt><Icon name={icon} /> {t(`cat.${key}`)}</dt>
                <dd>{(val / 1000).toFixed(2)}t</dd>
              </div>
            ))}
          </dl>

          <h3 className="z-tool__h"><Icon name="tips_and_updates" /> {t("topActions")}</h3>
          <ol className="z-tool__tips">
            {tips.map((tip) => <li key={tip}>{t(`tips.${tip}`)}</li>)}
          </ol>

          <div className="z-tool__acts">
            <button type="button" className="z-btn z-btn--white z-btn--sm" onClick={reset}><Icon name="restart_alt" /> {t("recalculate")}</button>
            <button type="button" className="z-btn z-btn--green z-btn--sm z-tool__grow" onClick={share}><Icon name="share" /> {t("share")}</button>
          </div>
          <p className="z-tool__status" role="status">{copied ? t("copied") : ""}</p>
        </>
      )}
    </ToolDialog>
  );
}
