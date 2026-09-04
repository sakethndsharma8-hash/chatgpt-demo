"use client";

import { useEffect, useState } from "react";
import { WhatsappChat } from "@/components/chat/whatsapp-chat";

export function PublicDemoChat({ slug }: { slug: string }) {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/public/demos/${slug}/session`, { method: "POST" })
      .then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error || "Unable to open demo"); return j; })
      .then(setSession)
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>;
  if (!session) return <div className="flex min-h-[680px] items-center justify-center rounded-[28px] border border-slate-200 bg-white shadow-2xl"><div className="text-center"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-teal-600" /><p className="text-sm text-slate-500">Opening demo…</p></div></div>;

  return <WhatsappChat conversationId={session.conversationId} businessName={session.businessName} contactName={session.contactName} contactAvatarUrl={session.contactAvatarUrl} initialMessages={session.messages.map((m: any) => ({ id: m.id, role: m.role, content: m.content, sentAt: m.sentAt }))} publicMode />;
}
