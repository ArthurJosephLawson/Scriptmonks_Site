"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactPayloadSchema } from "@/lib/validation";
import { ContactSuccess } from "@/components/contact/contact-success";
import type { ContactPayload } from "@/types/contact";

type FormValues = {
  kind: "general";
  name: string;
  email: string;
  github: string;
  role: "developer" | "designer" | "other" | "";
  message: string;
  link1: string;
  link2: string;
  link3: string;
  website: string;
};

const DEFAULT: FormValues = {
  kind: "general",
  name: "",
  email: "",
  github: "",
  role: "",
  message: "",
  link1: "",
  link2: "",
  link3: "",
  website: "",
};

export function ContactForm({ initialKind = "general" }: { initialKind?: "general" }) {
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");
  const [refId, setRefId] = useState("");
  const startedAtRef = useRef(0);

  const form = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: { ...DEFAULT, kind: initialKind },
  });

  useEffect(() => {
    startedAtRef.current = Date.now();
    const id = setTimeout(() => {
      form.reset({ ...DEFAULT, kind: initialKind, website: "" });
    }, 0);
    return () => clearTimeout(id);
  }, [initialKind, form]);

  if (refId) {
    return (
      <div className="border border-dark-border bg-dark-surface p-6 md:p-8">
        <ContactSuccess refId={refId} />
      </div>
    );
  }

  async function onSubmit(values: FormValues) {
    const links = [values.link1, values.link2, values.link3].map((l) => l.trim()).filter(Boolean);
    const payload: ContactPayload = {
      kind: "general" as const,
      name: values.name,
      email: values.email,
      github: values.github || undefined,
      message: values.message,
      links,
      meta: {
        startedAt: startedAtRef.current,
        honeypot: values.website,
        source: `web:/contact?tab=${values.kind}`,
      },
    };
    const parsed = contactPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setError("Validation failed. Check the fields.");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (data.ok && data.ref) {
        setRefId(data.ref);
        setStatus("idle");
      } else {
        setError(data.error || "Transmission failed");
        setStatus("idle");
      }
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit(onSubmit)(e);
      }}
      noValidate
      className="border border-dark-border bg-dark-surface p-6 md:p-8"
    >
      <div className="flex gap-2">
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            form.setValue("kind", "general");
          }}
        >
          [ GENERAL ]
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <div>
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" {...form.register("name")} />
        </div>
        <div>
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" {...form.register("email")} />
        </div>
        <div>
          <Label htmlFor="c-github">GitHub username (optional)</Label>
          <Input id="c-github" placeholder="octocat" {...form.register("github")} />
        </div>
        <div>
          <Label htmlFor="c-message">Message</Label>
          <Textarea id="c-message" rows={8} {...form.register("message")} />
        </div>
        <div>
          <Label>Links (optional, up to 3)</Label>
          <div className="mt-2 flex flex-col gap-3">
            <Input placeholder="https://..." {...form.register("link1")} />
            <Input placeholder="https://..." {...form.register("link2")} />
            <Input placeholder="https://..." {...form.register("link3")} />
          </div>
        </div>
        <input type="hidden" {...form.register("website")} tabIndex={-1} autoComplete="off" />
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
        <Button type="submit" disabled={status === "submitting"} aria-busy={status === "submitting"}>{status === "submitting" ? "SENDING..." : "SEND"}</Button>
      </div>
    </form>
  );
}