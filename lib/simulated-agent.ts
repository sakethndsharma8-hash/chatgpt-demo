import type { QualificationStage } from "@prisma/client";

export type SimulatedReply = {
  reply_text: string;
  qualification_stage: QualificationStage;
  ready_to_book: boolean;
};

export function generateSimulatedReply(args: {
  businessName: string;
  serviceInfo: string;
  conversationMessages: Array<{ role: "LEAD" | "AGENT"; content: string }>;
  currentStage: QualificationStage;
}): SimulatedReply {
  const leadTurns = args.conversationMessages.filter((m) => m.role === "LEAD").length;

  if (leadTurns <= 1) {
    return {
      reply_text: "Got it — that makes sense. What are you hoping to improve or get more of right now?",
      qualification_stage: "GOAL",
      ready_to_book: false
    };
  }

  if (leadTurns === 2) {
    return {
      reply_text: "Makes sense. And what does your current process look like today?",
      qualification_stage: "SITUATION",
      ready_to_book: false
    };
  }

  if (leadTurns === 3) {
    return {
      reply_text: "Got you. What’s the biggest headache or missed opportunity with the way it works today?",
      qualification_stage: "PAIN",
      ready_to_book: false
    };
  }

  if (leadTurns === 4) {
    return {
      reply_text: "That’s helpful context. Is there a rough budget you’ve set aside to solve this?",
      qualification_stage: "BUDGET",
      ready_to_book: false
    };
  }

  return {
    reply_text: `Thanks — I think this could be a strong fit for ${args.businessName}. Want to pick a time for a quick walkthrough?`,
    qualification_stage: "READY_TO_BOOK",
    ready_to_book: true
  };
}
