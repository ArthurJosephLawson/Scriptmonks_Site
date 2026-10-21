import type { UseFormReturn } from "react-hook-form";
import { RadioCard } from "@/components/ui/radio-card";
import { BUDGET_LABELS, TIMELINE_LABELS, type OrderFormValues } from "@/types/order";
import { BUDGETS, TIMELINES } from "@/types/order";

export function StepBudget({ form }: { form: UseFormReturn<OrderFormValues> }) {
  const { errors } = form.formState;
  const budget = form.watch("budget");
  const timeline = form.watch("timeline");

  return (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-teal">
          Budget (NPR)
        </legend>
        <div className="flex flex-col gap-3">
          {BUDGETS.map((option) => (
            <RadioCard
              key={option}
              name="budget"
              value={option}
              label={BUDGET_LABELS[option]}
              checked={budget === option}
              onChange={(value) =>
                form.setValue("budget", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          ))}
        </div>
        {errors.budget ? (
          <p aria-live="polite" className="mt-3 font-mono text-xs text-red-400">
            ! {errors.budget.message}
          </p>
        ) : null}
      </fieldset>

      <fieldset>
        <legend className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-teal">
          Timeline
        </legend>
        <div className="flex flex-col gap-3">
          {TIMELINES.map((option) => (
            <RadioCard
              key={option}
              name="timeline"
              value={option}
              label={TIMELINE_LABELS[option]}
              checked={timeline === option}
              onChange={(value) =>
                form.setValue("timeline", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
          ))}
        </div>
        {errors.timeline ? (
          <p aria-live="polite" className="mt-3 font-mono text-xs text-red-400">
            ! {errors.timeline.message}
          </p>
        ) : null}
      </fieldset>
    </div>
  );
}
