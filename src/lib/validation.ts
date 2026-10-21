import { z } from "zod";
import { BUDGETS, PROJECT_TYPES, TIMELINES } from "../types/order";
import type { OrderFormValues as TypesOrderFormValues } from "../types/order";

const projectTypeField = z.enum(PROJECT_TYPES, { message: "Select a project type" });
const budgetField = z.enum(BUDGETS, { message: "Select a budget range" });
const timelineField = z.enum(TIMELINES, { message: "Select a timeline" });
const titleField = z
  .string()
  .trim()
  .min(3, "Title must be at least 3 characters")
  .max(80, "Title must be at most 80 characters");
const descriptionField = z
  .string()
  .trim()
  .min(40, "Description must be at least 40 characters")
  .max(3000, "Description must be at most 3000 characters");
const referencesField = z
  .array(z.string().trim().url("Enter a valid URL"))
  .max(3, "Maximum 3 references");
const nameField = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(80, "Name must be at most 80 characters");
const emailField = z.string().trim().toLowerCase().email("Enter a valid email");
const githubUser = z
  .string()
  .trim()
  .transform((value) => value.replace(/^@/, ""))
  .pipe(
    z.union([
      z.literal(""),
      z
        .string()
        .min(1)
        .max(39)
        .regex(
          /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
          "Invalid GitHub username",
        ),
    ]),
  );
const linksField = z
  .array(
    z
      .string()
      .trim()
      .url("Enter a valid URL")
      .max(200, "URL too long"),
  )
  .max(3, "Maximum 3 links");
const messageField = z
  .string()
  .trim()
  .min(20, "Message must be at least 20 characters")
  .max(2000, "Message must be at most 2000 characters");
const companyField = z.string().trim();
const websiteField = z.string();

export const stepScopeSchema = z.object({
  projectType: projectTypeField,
});

export const stepCommercialSchema = z.object({
  budget: budgetField,
  timeline: timelineField,
});

export const stepBriefSchema = z.object({
  title: titleField,
  description: descriptionField,
  references: referencesField,
});

export const stepContactSchema = z.object({
  name: nameField,
  email: emailField,
  github: githubUser,
  company: companyField,
});

export const orderFormSchema = z.object({
  projectType: projectTypeField,
  budget: budgetField,
  timeline: timelineField,
  title: titleField,
  description: descriptionField,
  references: referencesField,
  name: nameField,
  email: emailField,
  github: githubUser,
  company: companyField,
  website: websiteField,
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

// Compile-time guard: the hand-written `OrderFormValues` in `src/types/order.ts`
// (used by client components so they need no zod import) must stay structurally
// identical to the schema's inferred output. If either side changes, this fails
// the typecheck.
type _AssertOrderFormValuesMatch = OrderFormValues extends TypesOrderFormValues
  ? TypesOrderFormValues extends OrderFormValues
    ? true
    : never
  : never;
const _assertOrderFormValues: _AssertOrderFormValuesMatch = true;
void _assertOrderFormValues;

const metaSchema = z.object({
  startedAt: z.number().int().positive(),
  honeypot: z.string(),
  source: z.string(),
});

export const orderPayloadSchema = z.object({
  scope: stepScopeSchema,
  commercial: stepCommercialSchema,
  brief: z.object({
    title: titleField,
    description: descriptionField,
    references: z.preprocess(
      (value) =>
        Array.isArray(value)
          ? value.filter((entry) => typeof entry === "string" && entry.trim() !== "")
          : value,
      referencesField,
    ),
  }),
  contact: z
    .object({
      name: nameField,
      email: emailField,
      github: githubUser.optional(),
      company: companyField.optional(),
    })
    .transform(({ github, company, ...rest }) => ({
      ...rest,
      ...(github ? { github } : {}),
      ...(company ? { company } : {}),
    })),
  meta: metaSchema,
});

export const contactPayloadSchema = z.object({
  kind: z.enum(["general"] as const, { message: "Select a kind" }),
  name: nameField,
  email: emailField,
  github: githubUser.optional(),
  message: messageField,
  links: z.preprocess(
    (value) =>
      Array.isArray(value)
        ? value.filter((entry) => typeof entry === "string" && entry.trim() !== "")
        : value,
    linksField,
  ),
  meta: metaSchema,
});


// type compatibility checked

// Labels now live in `src/types/order.ts` (zod-free) so client components can
// import them without pulling zod into the browser bundle. Re-exported here for
// existing server-side callers.
export {
  BUDGET_LABELS,
  PROJECT_TYPE_LABELS,
  TIMELINE_LABELS,
} from "../types/order";
