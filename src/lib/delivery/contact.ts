import { deliverContact } from "@/lib/delivery/contact-email";
import type { ContactPayload } from "@/types/contact";

export async function deliverContactMessage(
  payload: ContactPayload,
  ref: string,
): Promise<void> {
  try {
    await deliverContact(payload, ref);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(`[delivery] contact email failed: ${message}`);
    throw new Error("All delivery channels failed");
  }
}
