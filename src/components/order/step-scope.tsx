import type { UseFormReturn } from "react-hook-form";
import { RadioCard } from "@/components/ui/radio-card";
import { PROJECT_TYPE_LABELS, type OrderFormValues } from "@/lib/validation";
import { PROJECT_TYPES } from "@/types/order";

const SCOPE_HINTS: Record<(typeof PROJECT_TYPES)[number], string> = {
  "custom-software": "Bespoke systems built around your workflow",
  utility: "Focused tool or automation",
  cli: "Developer-facing command-line tooling",
  "full-app": "End-to-end web/desktop/mobile product",
};

export function StepScope({
  form,
}: {
  form: UseFormReturn<OrderFormValues>;
}) {
  const { errors } = form.formState;
  const selected = form.watch("projectType");

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROJECT_TYPES.map((type) => (
          <RadioCard
            key={type}
            name="projectType"
            value={type}
            label={PROJECT_TYPE_LABELS[type]}
            hint={SCOPE_HINTS[type]}
            checked={selected === type}
            onChange={(value) =>
              form.setValue("projectType", value, {
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />
        ))}
      </div>
      {errors.projectType ? (
        <p aria-live="polite" className="mt-3 font-mono text-xs text-red-400">
          ! {errors.projectType.message}
        </p>
      ) : null}
    </div>
  );
}
