import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OrderFormValues } from "@/types/order";

export function StepBrief({ form }: { form: UseFormReturn<OrderFormValues> }) {
  const { errors } = form.formState;
  const description = form.watch("description");
  const references = form.watch("references");

  function setReferences(next: string[]) {
    form.setValue("references", next, { shouldDirty: true, shouldTouch: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor="order-title">Project name / working title</Label>
        <Input
          id="order-title"
          className="mt-2"
          placeholder="Working title"
          error={errors.title?.message}
          {...form.register("title")}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor="order-description">Project brief</Label>
          <span aria-hidden className="font-mono text-xs text-muted-teal">
            {String(description.length).padStart(4, "0")}/3000
          </span>
        </div>
        <Textarea
          id="order-description"
          rows={8}
          className="mt-2"
          placeholder="Goals, target users, must-have features, existing systems..."
          error={errors.description?.message}
          {...form.register("description")}
        />
      </div>

      <div>
        <Label>References (optional, up to 3)</Label>
        <div className="mt-2 flex flex-col gap-3">
          {references.map((_, index) => (
            <div key={index} className="flex items-start gap-2">
              <Input
                placeholder="https://..."
                aria-label={`Reference ${index + 1}`}
                error={
                  Array.isArray(errors.references)
                    ? errors.references[index]?.message
                    : undefined
                }
                {...form.register(`references.${index}` as const)}
              />
              <button
                type="button"
                aria-label={`Remove reference ${index + 1}`}
                onClick={() => setReferences(references.filter((_, i) => i !== index))}
                className="border border-dark-border px-3 py-3 font-mono text-xs text-ink transition hover:border-accent-coral hover:text-accent-coral"
              >
                [ − ]
              </button>
            </div>
          ))}
          {references.length < 3 ? (
            <button
              type="button"
              onClick={() => setReferences([...references, ""])}
              className="w-fit border border-dark-border px-3 py-2 font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:border-accent-coral hover:text-accent-coral"
            >
              [ + ADD REFERENCE ]
            </button>
          ) : null}
        </div>
        {typeof errors.references === "object" && !Array.isArray(errors.references) ? (
          <p aria-live="polite" className="mt-3 font-mono text-xs text-red-400">
            ! {errors.references.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
