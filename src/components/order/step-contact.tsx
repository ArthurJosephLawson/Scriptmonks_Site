import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OrderFormValues } from "@/types/order";

export function StepContact({ form }: { form: UseFormReturn<OrderFormValues> }) {
  const { errors } = form.formState;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor="order-name">Name</Label>
        <Input
          id="order-name"
          className="mt-2"
          autoComplete="name"
          error={errors.name?.message}
          {...form.register("name")}
        />
      </div>

      <div>
        <Label htmlFor="order-email">Email</Label>
        <Input
          id="order-email"
          type="email"
          className="mt-2"
          autoComplete="email"
          error={errors.email?.message}
          {...form.register("email")}
        />
      </div>

      <div>
        <Label htmlFor="order-github">GitHub username (optional)</Label>
        <Input
          id="order-github"
          className="mt-2"
          placeholder="octocat"
          error={errors.github?.message}
          {...form.register("github")}
        />
        <p className="mt-1 text-xs text-muted-teal">
          So we can look at your repo or project if relevant
        </p>
      </div>

      <div>
        <Label htmlFor="order-company">Company (optional)</Label>
        <Input
          id="order-company"
          className="mt-2"
          autoComplete="organization"
          error={errors.company?.message}
          {...form.register("company")}
        />
      </div>

      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...form.register("website")}
        />
      </div>

      <p className="text-xs text-muted-teal">
        By submitting you agree we may contact you about this project.
      </p>
    </div>
  );
}
