import { ConversationMode, QualificationStage } from "@prisma/client";
import { db } from "./db";
import { createSessionToken, hashToken } from "./utils";

export async function createConversation(demoId: string, mode: ConversationMode) {
  const demo = await db.demo.findUniqueOrThrow({ where: { id: demoId } });
  const sessionToken = mode === "PUBLIC" ? createSessionToken() : null;

  const conversation = await db.simulatedConversation.create({
    data: {
      demoId,
      mode,
      leadName: mode === "PUBLIC" ? "You" : "Test Lead",
      leadAvatarSeed: mode === "PUBLIC" ? "prospect" : "test-lead",
      sessionTokenHash: sessionToken ? hashToken(sessionToken) : undefined,
      qualificationStage: QualificationStage.GOAL,
      messages: {
        create: {
          role: "AGENT",
          content: `Hey! Thanks for reaching out to ${demo.businessName} 👋 What can we help you with?`
        }
      }
    },
    include: { messages: { orderBy: { sentAt: "asc" } } }
  });

  return { conversation, sessionToken };
}
