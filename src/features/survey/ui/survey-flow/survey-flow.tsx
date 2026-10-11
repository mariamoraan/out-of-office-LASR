"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type Ref,
} from "react";

import { TEXT_INPUT_DEBOUNCE_MS } from "@/core/constants/app.constants";
import {
  AGE_GROUPS,
  GENDERS,
  LEISURE_TAGS,
  MEETING_SLOTS,
  WORK_AREAS,
  type AgeGroup,
  type Gender,
  type LeisureTag,
  type MeetingSlot,
  type WorkArea,
} from "@/core/constants/survey.constants";
import { getDictionary } from "@/core/i18n";
import { AtSign, Calendar, Link2, MessageCircle, Share2 } from "@/core/icons";
import { appRoutes } from "@/core/routes/app.routes";
import {
  CButton,
  CChip,
  CChoiceGroup,
  CInput,
  CLoader,
  COptionRow,
  CStepShell,
  type FieldStatus,
} from "@/design-system";
import type { SurveyDraftPatch } from "@/features/survey/domain/survey-response";
import {
  SURVEY_STEP_COUNT,
  SURVEY_STEPS,
  type SurveyStepId,
} from "@/features/survey/domain/survey-steps";
import type { SurveyResponseDto } from "@/features/survey/infrastructure/survey-response.dto";
import { useDebouncedCallback } from "@/features/survey/ui/hooks/use-debounced-callback";
import {
  genderIcons,
  leisureIcons,
  workAreaIcons,
} from "@/features/survey/ui/survey-option-meta";
import {
  fetchSurveyDraft,
  patchSurveyDraft,
  submitSurveyDraft,
} from "@/features/survey/ui/survey-api-client";
import {
  clearSurveyLocalDraft,
  readSurveyLocalDraft,
  toSurveyLocalDraftFields,
  writeSurveyLocalDraft,
} from "@/features/survey/ui/survey-local-draft";
import {
  getSurveyStepFocusTarget,
  type SurveyStepFocusTarget,
} from "@/features/survey/ui/survey-step-focus-target";

import "./survey-flow.scss";

const TEXT_SAVED_VISIBLE_MS = 3000;
const SURVEY_STEP_FORM_ID = "survey-step-form";
const SURVEY_STEP_TITLE_ID = "survey-step-title";
const CONTACT_ERROR_ID = "survey-contact-error";
const FORM_ERROR_ID = "survey-form-error";

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function canContinue(step: SurveyStepId, draft: SurveyResponseDto) {
  switch (step) {
    case "fullName":
      return hasText(draft.fullName);
    case "ageGroup":
      return Boolean(draft.ageGroup);
    case "contact":
      return hasText(draft.email) || hasText(draft.whatsapp);
    case "social":
      return true;
    case "work":
      return draft.workAreas.length > 0;
    case "leisure":
      return draft.leisureTags.length > 0 || hasText(draft.leisureOther);
    case "gender":
      return Boolean(draft.gender);
    case "meeting":
      return draft.meetingSlots.length > 0;
    default:
      return false;
  }
}

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function radioTabIndex(
  isSelected: boolean,
  isFirst: boolean,
  hasSelection: boolean,
) {
  if (hasSelection) {
    return isSelected ? 0 : -1;
  }

  return isFirst ? 0 : -1;
}

export function SurveyFlow() {
  const router = useRouter();
  const t = getDictionary("es");
  const [draft, setDraft] = useState<SurveyResponseDto | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [textSavedKey, setTextSavedKey] = useState<string | null>(null);
  const textSavedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const draftRef = useRef<SurveyResponseDto | null>(null);
  const stepFocusRef = useRef<HTMLInputElement | HTMLButtonElement | null>(
    null,
  );

  const stepId = SURVEY_STEPS[stepIndex];
  const stepCopy = t.survey.steps[stepId];
  const focusTarget =
    draft != null ? getSurveyStepFocusTarget(stepId, draft) : null;

  draftRef.current = draft;

  const focusRefFor = <T extends HTMLInputElement | HTMLButtonElement>(
    target: SurveyStepFocusTarget,
  ): Ref<T> | undefined =>
    focusTarget === target ? (stepFocusRef as Ref<T>) : undefined;

  const handleStepEnter = useCallback(() => {
    const currentDraft = draftRef.current;
    if (!currentDraft) {
      return;
    }

    const target = getSurveyStepFocusTarget(stepId, currentDraft);
    if (target) {
      stepFocusRef.current?.focus();
      return;
    }

    document
      .getElementById(SURVEY_STEP_TITLE_ID)
      ?.focus({ preventScroll: true });
  }, [stepId]);

  useEffect(() => {
    return () => {
      if (textSavedTimeoutRef.current) {
        clearTimeout(textSavedTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const survey = await fetchSurveyDraft();
        if (!active) {
          return;
        }

        if (survey.status === "submitted") {
          clearSurveyLocalDraft();
          router.replace(appRoutes.surveyThanks);
          return;
        }

        const local = readSurveyLocalDraft();
        const fields = toSurveyLocalDraftFields(survey);
        const matchedLocal =
          local && local.id === survey.id ? local : null;
        const nextStepIndex = matchedLocal
          ? Math.min(matchedLocal.stepIndex, SURVEY_STEP_COUNT - 1)
          : 0;

        writeSurveyLocalDraft({
          id: survey.id,
          stepIndex: nextStepIndex,
          fields,
        });

        setDraft(survey);
        setStepIndex(nextStepIndex);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar la encuesta.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    if (!draft || draft.status === "submitted") {
      return;
    }

    writeSurveyLocalDraft({
      id: draft.id,
      stepIndex,
      fields: toSurveyLocalDraftFields(draft),
    });
  }, [draft, stepIndex]);

  const markTextSaved = useCallback((key: string) => {
    setTextSavedKey(key);

    if (textSavedTimeoutRef.current) {
      clearTimeout(textSavedTimeoutRef.current);
    }

    textSavedTimeoutRef.current = setTimeout(() => {
      setTextSavedKey((current) => (current === key ? null : current));
      textSavedTimeoutRef.current = null;
    }, TEXT_SAVED_VISIBLE_MS);
  }, []);

  const persistPatch = useCallback(
    async (key: string, kind: "selection" | "text", patch: SurveyDraftPatch) => {
      setSavingKey(key);
      setError(null);

      try {
        const survey = await patchSurveyDraft(patch);
        setDraft(survey);

        if (kind === "text") {
          markTextSaved(key);
        }

        return survey;
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? saveError.message
            : "No se pudo guardar.",
        );
        return null;
      } finally {
        setSavingKey((current) => (current === key ? null : current));
      }
    },
    [markTextSaved],
  );

  const debouncedPersist = useDebouncedCallback(
    (key: string, patch: SurveyDraftPatch) => {
      void persistPatch(key, "text", patch);
    },
    TEXT_INPUT_DEBOUNCE_MS,
  );

  const updateLocal = useCallback((patch: SurveyDraftPatch) => {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const saveImmediate = useCallback(
    async (key: string, patch: SurveyDraftPatch) => {
      updateLocal(patch);
      await persistPatch(key, "selection", patch);
    },
    [persistPatch, updateLocal],
  );

  const saveDebounced = useCallback(
    (key: string, patch: SurveyDraftPatch) => {
      setSavingKey(key);
      setTextSavedKey((current) => (current === key ? null : current));
      updateLocal(patch);
      debouncedPersist(key, patch);
    },
    [debouncedPersist, updateLocal],
  );

  const fieldStatus = useCallback(
    (key: string, kind: "selection" | "text"): FieldStatus => {
      if (savingKey === key) {
        return "saving";
      }

      if (kind === "text" && textSavedKey === key) {
        return "saved";
      }

      return "idle";
    },
    [savingKey, textSavedKey],
  );

  const handleBack = () => {
    if (stepIndex === 0) {
      router.push(appRoutes.home);
      return;
    }

    setContactError(null);
    setStepIndex((index) => index - 1);
  };

  const handleContinue = async () => {
    if (!draft || savingKey) {
      return;
    }

    if (stepId === "contact" && !canContinue("contact", draft)) {
      setContactError(t.survey.steps.contact.error);
      return;
    }

    setContactError(null);

    if (stepId === "meeting") {
      setIsSubmitting(true);
      setError(null);

      try {
        await persistPatch("submit", "selection", {
          fullName: draft.fullName,
          email: draft.email,
          whatsapp: draft.whatsapp,
          linkedin: draft.linkedin,
          instagram: draft.instagram,
          xHandle: draft.xHandle,
          workAreaOther: draft.workAreaOther,
          leisureOther: draft.leisureOther,
          workAreas: draft.workAreas,
          leisureTags: draft.leisureTags,
          ageGroup: draft.ageGroup,
          gender: draft.gender,
          meetingSlots: draft.meetingSlots,
        });
        await submitSurveyDraft();
        clearSurveyLocalDraft();
        router.push(appRoutes.surveyThanks);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "No se pudo enviar la encuesta.",
        );
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setStepIndex((index) => Math.min(index + 1, SURVEY_STEP_COUNT - 1));
  };

  const continueEnabled = useMemo(() => {
    if (!draft || isSubmitting || savingKey !== null) {
      return false;
    }

    // Contact: keep enabled so Enter/click can surface the validation error.
    if (stepId === "contact") {
      return true;
    }

    return canContinue(stepId, draft);
  }, [draft, isSubmitting, savingKey, stepId]);

  const handleStepSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!continueEnabled) {
      return;
    }

    void handleContinue();
  };

  if (isLoading || !draft) {
    return (
      <main className="f-survey-flow f-survey-flow--loading">
        {error && !isLoading ? (
          <p className="f-survey-flow__error" role="alert">
            {error}
          </p>
        ) : (
          <CLoader label={t.common.loading} showLabel={false} />
        )}
      </main>
    );
  }

  const contactInvalid = Boolean(contactError);

  return (
    <CStepShell
      className="f-survey-flow"
      brand={t.appName}
      title={stepCopy.title}
      subtitle={"subtitle" in stepCopy ? stepCopy.subtitle : undefined}
      stepKey={stepId}
      currentStep={stepIndex + 1}
      totalSteps={SURVEY_STEP_COUNT}
      titleId={SURVEY_STEP_TITLE_ID}
      progressLabel={t.a11y.progress(stepIndex + 1, SURVEY_STEP_COUNT)}
      backLabel={t.common.back}
      onBack={handleBack}
      onStepEnter={handleStepEnter}
      footer={
        <div className="f-survey-flow__footer">
          {error ? (
            <p
              id={FORM_ERROR_ID}
              className="f-survey-flow__error"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <CButton
            type="submit"
            form={SURVEY_STEP_FORM_ID}
            disabled={!continueEnabled}
          >
            {stepId === "meeting" ? t.common.submit : t.common.continue}
          </CButton>
        </div>
      }
    >
      <form id={SURVEY_STEP_FORM_ID} onSubmit={handleStepSubmit} noValidate>
        {stepId === "fullName" ? (
          <CInput
            ref={focusRefFor("fullName")}
            id="full-name"
            value={draft.fullName ?? ""}
            placeholder={t.survey.steps.fullName.placeholder}
            status={fieldStatus("fullName", "text")}
            ariaLabelledBy={SURVEY_STEP_TITLE_ID}
            onChange={(value) => {
              saveDebounced("fullName", { fullName: value });
            }}
            autoComplete="name"
          />
        ) : null}

        {stepId === "ageGroup" ? (
          <CChoiceGroup mode="single" labelledBy={SURVEY_STEP_TITLE_ID}>
            {AGE_GROUPS.map((ageGroup, index) => (
              <COptionRow
                key={ageGroup}
                ref={index === 0 ? focusRefFor("ageGroupFirst") : undefined}
                label={t.survey.labels.ageGroups[ageGroup]}
                selected={draft.ageGroup === ageGroup}
                selection="radio"
                tabIndex={radioTabIndex(
                  draft.ageGroup === ageGroup,
                  index === 0,
                  Boolean(draft.ageGroup),
                )}
                status={fieldStatus(`ageGroup:${ageGroup}`, "selection")}
                enterSubmitsFormId={SURVEY_STEP_FORM_ID}
                onClick={() => {
                  void saveImmediate(`ageGroup:${ageGroup}`, {
                    ageGroup: ageGroup as AgeGroup,
                  });
                }}
              />
            ))}
          </CChoiceGroup>
        ) : null}

        {stepId === "contact" ? (
          <div className="f-survey-flow__stack">
            <CInput
              ref={focusRefFor("email")}
              id="email"
              label={t.survey.steps.contact.emailLabel}
              value={draft.email ?? ""}
              placeholder={t.survey.steps.contact.emailPlaceholder}
              type="email"
              inputMode="email"
              autoComplete="email"
              leading={<AtSign size={18} strokeWidth={1.75} />}
              status={fieldStatus("email", "text")}
              ariaInvalid={contactInvalid}
              ariaDescribedBy={contactInvalid ? CONTACT_ERROR_ID : undefined}
              onChange={(value) => {
                setContactError(null);
                saveDebounced("email", { email: value });
              }}
            />
            <CInput
              ref={focusRefFor("whatsapp")}
              id="whatsapp"
              label={t.survey.steps.contact.whatsappLabel}
              value={draft.whatsapp ?? ""}
              placeholder={t.survey.steps.contact.whatsappPlaceholder}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              leading={<MessageCircle size={18} strokeWidth={1.75} />}
              status={fieldStatus("whatsapp", "text")}
              ariaInvalid={contactInvalid}
              ariaDescribedBy={contactInvalid ? CONTACT_ERROR_ID : undefined}
              onChange={(value) => {
                setContactError(null);
                saveDebounced("whatsapp", { whatsapp: value });
              }}
            />
            {contactError ? (
              <p
                id={CONTACT_ERROR_ID}
                className="f-survey-flow__error"
                role="alert"
              >
                {contactError}
              </p>
            ) : null}
          </div>
        ) : null}

        {stepId === "social" ? (
          <div className="f-survey-flow__stack">
            <CInput
              ref={focusRefFor("linkedin")}
              id="linkedin"
              label={t.survey.steps.social.linkedin}
              value={draft.linkedin ?? ""}
              placeholder={t.survey.steps.social.placeholder}
              leading={<Link2 size={18} strokeWidth={1.75} />}
              status={fieldStatus("linkedin", "text")}
              onChange={(value) => {
                saveDebounced("linkedin", { linkedin: value });
              }}
            />
            <CInput
              ref={focusRefFor("instagram")}
              id="instagram"
              label={t.survey.steps.social.instagram}
              value={draft.instagram ?? ""}
              placeholder={t.survey.steps.social.placeholder}
              leading={<Share2 size={18} strokeWidth={1.75} />}
              status={fieldStatus("instagram", "text")}
              onChange={(value) => {
                saveDebounced("instagram", { instagram: value });
              }}
            />
            <CInput
              ref={focusRefFor("xHandle")}
              id="x-handle"
              label={t.survey.steps.social.x}
              value={draft.xHandle ?? ""}
              placeholder={t.survey.steps.social.placeholder}
              leading={<AtSign size={18} strokeWidth={1.75} />}
              status={fieldStatus("xHandle", "text")}
              onChange={(value) => {
                saveDebounced("xHandle", { xHandle: value });
              }}
            />
          </div>
        ) : null}

        {stepId === "work" ? (
          <div className="f-survey-flow__stack">
            <CChoiceGroup mode="multi" labelledBy={SURVEY_STEP_TITLE_ID}>
              {WORK_AREAS.map((workArea, index) => (
                <COptionRow
                  key={workArea}
                  ref={index === 0 ? focusRefFor("workFirst") : undefined}
                  label={t.survey.labels.workAreas[workArea]}
                  icon={workAreaIcons[workArea]}
                  selected={draft.workAreas.includes(workArea)}
                  selection="checkbox"
                  status={fieldStatus(`work:${workArea}`, "selection")}
                  enterSubmitsFormId={SURVEY_STEP_FORM_ID}
                  onClick={() => {
                    const workAreas = toggleValue(
                      draft.workAreas,
                      workArea,
                    ) as WorkArea[];
                    void saveImmediate(`work:${workArea}`, { workAreas });
                  }}
                />
              ))}
            </CChoiceGroup>
            {draft.workAreas.includes("other_tech") ? (
              <CInput
                ref={focusRefFor("workAreaOther")}
                id="work-other"
                label={t.common.other}
                value={draft.workAreaOther ?? ""}
                placeholder={t.common.otherPlaceholder}
                status={fieldStatus("workAreaOther", "text")}
                onChange={(value) => {
                  saveDebounced("workAreaOther", { workAreaOther: value });
                }}
              />
            ) : null}
          </div>
        ) : null}

        {stepId === "leisure" ? (
          <div className="f-survey-flow__stack">
            <CChoiceGroup
              mode="multi"
              labelledBy={SURVEY_STEP_TITLE_ID}
              className="c-choice-group--chips"
            >
              {LEISURE_TAGS.map((tag, index) => (
                <CChip
                  key={tag}
                  ref={index === 0 ? focusRefFor("leisureFirst") : undefined}
                  label={t.survey.labels.leisure[tag]}
                  icon={leisureIcons[tag as LeisureTag]}
                  selected={draft.leisureTags.includes(tag)}
                  selection="checkbox"
                  status={fieldStatus(`leisure:${tag}`, "selection")}
                  enterSubmitsFormId={SURVEY_STEP_FORM_ID}
                  onClick={() => {
                    const leisureTags = toggleValue(draft.leisureTags, tag);
                    void saveImmediate(`leisure:${tag}`, { leisureTags });
                  }}
                />
              ))}
            </CChoiceGroup>
            <CInput
              id="leisure-other"
              label={t.common.other}
              value={draft.leisureOther ?? ""}
              placeholder={t.common.otherPlaceholder}
              status={fieldStatus("leisureOther", "text")}
              onChange={(value) => {
                saveDebounced("leisureOther", { leisureOther: value });
              }}
            />
          </div>
        ) : null}

        {stepId === "gender" ? (
          <CChoiceGroup mode="single" labelledBy={SURVEY_STEP_TITLE_ID}>
            {GENDERS.map((gender, index) => (
              <COptionRow
                key={gender}
                ref={index === 0 ? focusRefFor("genderFirst") : undefined}
                label={t.survey.labels.genders[gender]}
                icon={genderIcons[gender]}
                selected={draft.gender === gender}
                selection="radio"
                tabIndex={radioTabIndex(
                  draft.gender === gender,
                  index === 0,
                  Boolean(draft.gender),
                )}
                status={fieldStatus(`gender:${gender}`, "selection")}
                enterSubmitsFormId={SURVEY_STEP_FORM_ID}
                onClick={() => {
                  void saveImmediate(`gender:${gender}`, {
                    gender: gender as Gender,
                  });
                }}
              />
            ))}
          </CChoiceGroup>
        ) : null}

        {stepId === "meeting" ? (
          <CChoiceGroup mode="multi" labelledBy={SURVEY_STEP_TITLE_ID}>
            {MEETING_SLOTS.map((slot, index) => (
              <COptionRow
                key={slot}
                ref={index === 0 ? focusRefFor("meetingFirst") : undefined}
                label={t.survey.labels.meetingSlots[slot]}
                icon={<Calendar size={18} strokeWidth={1.75} />}
                selected={draft.meetingSlots.includes(slot)}
                selection="checkbox"
                status={fieldStatus(`meeting:${slot}`, "selection")}
                enterSubmitsFormId={SURVEY_STEP_FORM_ID}
                onClick={() => {
                  const meetingSlots = toggleValue(
                    draft.meetingSlots,
                    slot,
                  ) as MeetingSlot[];
                  void saveImmediate(`meeting:${slot}`, { meetingSlots });
                }}
              />
            ))}
          </CChoiceGroup>
        ) : null}
      </form>
    </CStepShell>
  );
}
