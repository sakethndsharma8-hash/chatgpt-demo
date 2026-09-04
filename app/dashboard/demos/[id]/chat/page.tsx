import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { WhatsappChat } from "@/components/chat/whatsapp-chat";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { createConversation } from "@/lib/conversations";

export default async function DemoChatPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const demo = await db.demo.findUnique({ where: { id: params.id } });
  if (!demo) return null;
  const { conversation } = await createConversation(demo.id, "DASHBOARD");
  return <AppShell title={demo.name} subtitle="Test mode · local responder">
    <Link href={`/dashboard/demos/${demo.id}`} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to demo</Link>
    <WhatsappChat conversationId={conversation.id} businessName={demo.businessName} contactName={demo.contactName} contactAvatarUrl={demo.contactAvatarUrl} initialMessages={conversation.messages.map(m => ({ id: m.id, role: m.role, content: m.content, sentAt: m.sentAt.toISOString() }))} />
  </AppShell>;
}
