import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import {
  BUDGET_LABELS,
  PROJECT_TYPE_LABELS,
  TIMELINE_LABELS,
  type OrderFormValues,
} from "@/lib/validation";

interface StepReviewProps {
  form: UseFormReturn<OrderFormValues>;
  onEdit: (step: 1 | 2 | 3 | 4) => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dark-border py-2 last:border-b-0">
      <span className="font-mono text-xs uppercase tracking-widest text-muted-teal">
        {label}
      </span>
      <span className="text-right text-sm text-ink">{value}</span>
    </div>
  );
}

function Group({
  index,
  title,
  onEdit,
  children,
}: {
  index: number;
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-coral">
          {String(index).padStart(2, "0")} {title}
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="font-mono text-xs uppercase tracking-widest text-muted-teal transition hover:text-accent-coral"
        >
          [ EDIT ]
        </button>
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export function StepReview({ form, onEdit }: StepReviewProps) {
  const values = form.getValues();
  const references = values.references.filter((entry) => entry !== "");

  return (
    <div className="flex flex-col gap-8">
      <Group index={1} title="SCOPE & TYPE" onEdit={() => onEdit(1)}>
        <Row label="Type" value={PROJECT_TYPE_LABELS[values.projectType] ?? "—"} />
      </Group>

      <Group index={2} title="BUDGET & TIMELINE" onEdit={() => onEdit(2)}>
        <Row label="Budget" value={BUDGET_LABELS[values.budget] ?? "—"} />
        <Row label="Timeline" value={TIMELINE_LABELS[values.timeline] ?? "—"} />
      </Group>

      <Group index={3} title="PROJECT BRIEF" onEdit={() => onEdit(3)}>
        <Row label="Title" value={values.title} />
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-teal">
          {values.description}
        </p>
        {references.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-1">
            {references.map((entry, index) => (
              <li key={`${entry}-${index}`} className="break-all text-sm text-muted-teal">
                {entry}
              </li>
            ))}
          </ul>
        ) : null}
      </Group>

      <Group index={4} title="CONTACT" onEdit={() => onEdit(4)}>
        <Row label="Name" value={values.name} />
        <Row label="Email" value={values.email} />
        <Row label="GitHub" value={values.github || "—"} />
        <Row label="Company" value={values.company || "—"} />
      </Group>

      <div className="flex flex-wrap gap-2">
        <Badge>[ REVIEW ]</Badge>
        <Badge>[ READY TO TRANSMIT ]</Badge>
      </div>
    </div>
  );
}
