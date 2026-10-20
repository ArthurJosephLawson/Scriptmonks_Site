import { deliverEmail } from "@/lib/delivery/email";
import type { ProjectOrderPayload } from "@/types/order";

export async function deliverOrder(
  payload: ProjectOrderPayload,
  ref: string,
): Promise<void> {
  try {
    await deliverEmail(payload, ref);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(`[delivery] email failed: ${message}`);
    throw new Error("All delivery channels failed");
  }
}
