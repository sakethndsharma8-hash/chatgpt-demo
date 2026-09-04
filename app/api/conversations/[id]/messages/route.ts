import { NextResponse } from "next/server";
import { ConversationMode, MessageRole } from "@prisma/client";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateSimulatedReply } from "@/lib/simulated-agent";
import { hashToken } from "@/lib/utils";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const message = String(body.message ?? "").trim();
    if (!message || message.length > 2000) {
      return NextResponse.json({ error: "Message must be between 1 and 2000 characters." }, { status: 400 });
    }

    const conversation = await db.simulatedConversation.findUnique({
      where: { id: params.id },
      include: { demo: true, messages: { orderBy: { sentAt: "asc" } } }
    });
    if (!conversation) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });

    if (conversation.mode === ConversationMode.DASHBOARD) {
      if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    } else {
      const token = (await import("next/headers")).cookies().get(`demo_session_${params.id}`)?.value;
      if (!token || !conversation.sessionTokenHash || hashToken(token) !== conversation.sessionTokenHash) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
    }

    const leadMessage = await db.simulatedMessage.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.LEAD,
        content: message
      }
    });

    const response = generateSimulatedReply({
      businessName: conversation.demo.businessName,
      serviceInfo: conversation.demo.serviceInfo,
      conversationMessages: [...conversation.messages.map((m) => ({ role: m.role, content: m.content })), { role: "LEAD", content: message }],
      currentStage: conversation.qualificationStage
    });

    const agentMessage = await db.simulatedMessage.create({
      data: {
        conversationId: conversation.id,
        role: MessageRole.AGENT,
        content: response.reply_text,
        agentResponse: response
      }
    });

    await db.simulatedConversation.update({
      where: { id: conversation.id },
      data: {
        qualificationStage: response.qualification_stage,
        readyToBook: response.ready_to_book,
        lastMessageAt: new Date()
      }
    });

    return NextResponse.json({ leadMessage, agentMessage, agentState: response });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
