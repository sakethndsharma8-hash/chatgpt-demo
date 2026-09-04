"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createDemo } from "@/lib/demo";

export async function createDemoAction(formData: FormData) {
  await requireAdmin();
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  const demo = await createDemo({
    name: get("demoName"),
    businessName: get("businessName"),
    niche: get("niche"),
    contactName: get("contactName") || undefined,
    toneDescription: get("toneDescription"),
    serviceInfo: get("serviceInfo"),
    pricingInfo: get("pricingInfo") || undefined,
    sampleConversations: get("sampleConversations") || undefined,
    qualificationConfig: {
      goal: { talkingPoints: get("goalTalkingPoints") },
      situation: { talkingPoints: get("situationTalkingPoints") },
      pain: { talkingPoints: get("painTalkingPoints") },
      budget: { talkingPoints: get("budgetTalkingPoints") }
    }
  });

  redirect(`/dashboard/demos/${demo.id}`);
}
