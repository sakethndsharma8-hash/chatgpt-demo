import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createConversation } from "@/lib/conversations";

export async function POST(_req: Request, { params }: { params: { slug: string } }) {
  const demo = await db.demo.findUnique({ where: { publicSlug: params.slug } });
  if (!demo || !demo.publicEnabled || demo.status !== "SHARED") {
    return NextResponse.json({ error: "This demo link is unavailable." }, { status: 404 });
  }

  const { conversation, sessionToken } = await createConversation(demo.id, "PUBLIC");
  const response = NextResponse.json({
    conversationId: conversation.id,
    businessName: demo.businessName,
    contactName: demo.contactName,
    contactAvatarUrl: demo.contactAvatarUrl,
    messages: conversation.messages
  });

  response.cookies.set(`demo_session_${conversation.id}`, sessionToken!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 4
  });

  return response;
}
