import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ProjectOrderPayload } from "@/types/order";

const payload: ProjectOrderPayload = {
  scope: { projectType: "custom-software" },
  commercial: { budget: "250-1k", timeline: "2-4-weeks" },
  brief: { title: "T", description: "x".repeat(60), references: [] },
  contact: { name: "Ada", email: "a@b.co" },
  meta: { startedAt: 1, honeypot: "", source: "web:/order" },
};

vi.mock("@/lib/delivery/email", () => ({ deliverEmail: vi.fn().mockResolvedValue(undefined) }));

async function loadDeliverOrder() {
  vi.resetModules();
  const email = await import("@/lib/delivery/email");
  const index = await import("@/lib/delivery");
  return {
    deliverOrder: index.deliverOrder,
    email: email.deliverEmail as ReturnType<typeof vi.fn>,
  };
}

describe("deliverOrder (email only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls email and resolves", async () => {
    const { deliverOrder, email } = await loadDeliverOrder();
    await expect(deliverOrder(payload, "SM-TEST01")).resolves.toBeUndefined();
    expect(email).toHaveBeenCalledOnce();
    expect(email).toHaveBeenCalledWith(payload, "SM-TEST01");
  });

  it("throws when email fails", async () => {
    const { deliverOrder, email } = await loadDeliverOrder();
    email.mockRejectedValue(new Error("resend error"));
    await expect(deliverOrder(payload, "SM-TEST01")).rejects.toThrow(
      /all delivery channels failed/i,
    );
  });
});
