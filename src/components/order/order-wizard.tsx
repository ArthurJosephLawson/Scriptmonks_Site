"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { orderPayloadSchema, orderFormSchema, type OrderFormValues } from "@/lib/validation";
import { apiFetch } from "@/lib/errors";
import type { OrderApiSuccess, ProjectOrderPayload } from "@/types/order";
import { OrderSuccess } from "@/components/order/order-success";
import { StepBrief } from "@/components/order/step-brief";
import { StepBudget } from "@/components/order/step-budget";
import { StepContact } from "@/components/order/step-contact";
import { StepReview } from "@/components/order/step-review";
import { StepScope } from "@/components/order/step-scope";
import { Button } from "@/components/ui/button";

type Step = 1 | 2 | 3 | 4 | "review" | "success";

const DRAFT_KEY = "sm_order_draft_v1";
const SOURCE = "web:/order";

const STEP_HEADINGS: Record<Step, string> = {
  1: "Scope & Type",
  2: "Budget & Timeline",
  3: "Project Brief",
  4: "Contact",
  review: "Review order",
  success: "Order received",
};

const STEP_FIELDS: Record<1 | 2 | 3 | 4, (keyof OrderFormValues)[]> = {
  1: ["projectType"],
  2: ["budget", "timeline"],
  3: ["title", "description", "references"],
  4: ["name", "email", "github", "company"],
};

const NEXT_STEP: Record<1 | 2 | 3 | 4, Step> = {
  1: 2,
  2: 3,
  3: 4,
  4: "review",
};

const PREV_STEP: Record<2 | 3 | 4 | "review", Step> = {
  2: 1,
  3: 2,
  4: 3,
  review: 4,
};

const DEFAULT_VALUES: Partial<OrderFormValues> = {
  title: "",
  description: "",
  references: [],
  name: "",
  email: "",
  github: "",
  company: "",
  website: "",
};

interface Draft {
  values?: Partial<OrderFormValues>;
  step?: Step;
}

function isDraftStep(value: unknown): value is 1 | 2 | 3 | 4 | "review" {
  return value === "review" || (typeof value === "number" && value >= 1 && value <= 4);
}

export function OrderWizard() {
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [submitError, setSubmitError] = useState("");
  const [refId, setRefId] = useState("");
  const startedAtRef = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevStepRef = useRef<Step | null>(null);
  const restoreDoneRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const form = useForm<OrderFormValues>({
    mode: "onTouched",
    resolver: zodResolver(orderFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (startedAtRef.current === 0) startedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    // StrictMode re-runs effects: restore exactly once per instance, or the
    // save effect's intermediate write (stale defaults) gets restored on pass 2
    if (restoreDoneRef.current) return;
    restoreDoneRef.current = true;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      // consume-once: a StrictMode re-run of this effect must not restore
      // twice, and the save effect may overwrite before state re-renders
      sessionStorage.removeItem(DRAFT_KEY);
      const draft = JSON.parse(raw) as Draft;
      if (draft.values && typeof draft.values === "object") {
        form.reset({ ...DEFAULT_VALUES, ...draft.values });
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot sessionStorage draft restore; no user-triggered path exists
        if (isDraftStep(draft.step)) setStep(draft.step);
      }
      // ignore malformed drafts
    } catch {
      // ignore malformed drafts
    }
  }, [form]);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (step === "success") return;
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ values: watchedValues, step }),
      );
    } catch {
      // storage unavailable — draft persistence is best-effort
    }
  }, [watchedValues, step]);

  useEffect(() => {
    if (prevStepRef.current !== null && prevStepRef.current !== step) {
      headingRef.current?.focus();
    }
    prevStepRef.current = step;
  }, [step]);

  async function submitOrder() {
    const values = form.getValues();
    const rawPayload = {
      scope: { projectType: values.projectType },
      commercial: { budget: values.budget, timeline: values.timeline },
      brief: {
        title: values.title,
        description: values.description,
        references: values.references,
      },
      contact: {
        name: values.name,
        email: values.email,
        github: values.github,
        company: values.company,
      },
      meta: {
        startedAt: startedAtRef.current,
        honeypot: values.website,
        source: SOURCE,
      },
    };

    const parsed = orderPayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      setSubmitError("Form data is incomplete. Review the highlighted steps.");
      return;
    }

    setStatus("submitting");
    setSubmitError("");
    const result = await apiFetch<OrderApiSuccess>("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data satisfies ProjectOrderPayload),
    });
    if (result.ok && typeof result.data.ref === "string") {
      sessionStorage.removeItem(DRAFT_KEY);
      setRefId(result.data.ref);
      setStep("success");
      setStatus("idle");
    } else {
      // apiFetch never throws: failures arrive as safe, friendly messages.
      setSubmitError(result.ok ? "Unexpected server response" : result.error.message);
      setStatus("idle");
    }
  }

  async function handleAction() {
    if (step === "success" || status === "submitting") return;
    if (step === "review") {
      await submitOrder();
      return;
    }
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (valid) setStep(NEXT_STEP[step]);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") return;
    const target = event.target;
    if (target instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    void handleAction();
  }

  if (step === "success") {
    return (
      <div className="border border-dark-border bg-dark-surface p-6 md:p-8">
        <OrderSuccess refId={refId} />
      </div>
    );
  }

  const progressStep = typeof step === "number" ? Math.min(step, 4) : 4;

  return (
    <form
      onKeyDown={handleKeyDown}
      className="border border-dark-border bg-dark-surface p-6 md:p-8"
      noValidate
    >
      <Progress step={progressStep} />

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mt-6 text-2xl font-bold tracking-tight text-ink outline-none"
      >
        {STEP_HEADINGS[step]}
      </h2>

      <div className="mt-6 min-h-64">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={String(step)}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.18 }}
          >
            {step === 1 ? <StepScope form={form} /> : null}
            {step === 2 ? <StepBudget form={form} /> : null}
            {step === 3 ? <StepBrief form={form} /> : null}
            {step === 4 ? <StepContact form={form} /> : null}
            {step === "review" ? (
              <StepReview form={form} onEdit={(target) => setStep(target)} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError ? (
        <div aria-live="polite" className="mt-6">
          <p className="font-mono text-xs text-red-400">! TRANSMISSION FAILED: {submitError}</p>
          <p className="mt-1 text-xs text-muted-teal">
            Email us directly:{" "}
            <a
              href="mailto:script.monks.mail@gmail.com"
              className="font-mono text-accent-coral hover:text-accent-coral-dim"
            >
              script.monks.mail@gmail.com
            </a>
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-4">
        {step !== 1 ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep(PREV_STEP[step as 2 | 3 | 4 | "review"])}
            disabled={status === "submitting"}
          >
            BACK
          </Button>
        ) : (
          <span aria-hidden />
        )}

        <Button
          type="button"
          onClick={() => void handleAction()}
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
        >
          {status === "submitting"
            ? "TRANSMITTING..."
            : step === "review"
              ? "SUBMIT ORDER"
              : "NEXT"}
        </Button>
      </div>
    </form>
  );
}
