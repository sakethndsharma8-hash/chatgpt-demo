import { db } from "./db";
import { createPublicSlug } from "./utils";

export type QualificationConfig = {
  goal: { talkingPoints: string };
  situation: { talkingPoints: string };
  pain: { talkingPoints: string };
  budget: { talkingPoints: string };
};

export async function createDemo(input: {
  name: string;
  businessName: string;
  niche: string;
  contactName?: string;
  toneDescription: string;
  serviceInfo: string;
  pricingInfo?: string;
  sampleConversations?: string;
  qualificationConfig: QualificationConfig;
}) {
  return db.demo.create({
    data: {
      ...input,
      publicSlug: createPublicSlug(input.businessName),
      qualificationConfig: input.qualificationConfig
    }
  });
}
