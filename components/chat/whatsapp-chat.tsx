"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CheckCheck, ChevronDown, MoreVertical, Paperclip, Send, Smile, Sparkles, X } from "lucide-react";
import { formatTime } from "@/lib/utils";

type ChatMessage = { id: string; role: "LEAD" | "AGENT"; content: string; sentAt: string };

export function WhatsappChat({
  conversationId,
  businessName,
  contactName,
  contactAvatarUrl,
  initialMessages,
  publicMode = false
}: {
  conversationId: string;
  businessName: string;
  contactName?: string | null;
  contactAvatarUrl?: string | null;
  initialMessages: ChatMessage[];
  publicMode?: boolean;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lastStage, setLastStage] = useState("Goal");
  const endRef = useRef<HTMLDivElement>(null);

  const displayContact = contactName || `${businessName} AI`;
  const avatar = useMemo(() => contactAvatarUrl || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayContact)}&backgroundType=gradientLinear`, [contactAvatarUrl, displayContact]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || typing) return;
    setInput("");
    const optimistic: ChatMessage = { id: `local-${Date.now()}`, role: "LEAD", content: value, sentAt: new Date().toISOString() };
    setMessages((current) => [...current, optimistic]);
    setTyping(true);
    try {
      const result = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: value })
      });
      const json = await result.json();
      if (!result.ok) throw new Error(json.error || "Unable to send.");
      setMessages((current) => [...current.filter((m) => m.id !== optimistic.id), { ...json.leadMessage, sentAt: json.leadMessage.sentAt }, { ...json.agentMessage, sentAt: json.agentMessage.sentAt }]);
      setLastStage(json.agentState.qualification_stage.replaceAll("_", " ").toLowerCase().replace(/^./, (c: string) => c.toUpperCase()));
    } catch {
      setMessages((current) => current.filter((m) => m.id !== optimistic.id));
      setInput(value);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="grid min-h-[680px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1fr_300px]">
      <section className="flex min-h-[680px] min-w-0 flex-col bg-[#efeae2]">
        <header className="flex h-[70px] shrink-0 items-center justify-between border-b border-black/10 bg-[#f0f2f5] px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0"><img src={avatar} alt="" className="h-10 w-10 rounded-full bg-slate-200 object-cover" /><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#f0f2f5] bg-emerald-500" /></div>
            <div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-900">{displayContact}</div><div className="text-xs text-slate-500">online · {businessName}</div></div>
          </div>
          <div className="flex items-center gap-1 text-slate-500"><button className="h-9 w-9 rounded-full hover:bg-black/5"><MoreVertical className="mx-auto h-5 w-5" /></button></div>
        </header>

        <div className="wa-wallpaper wa-scrollbar flex-1 overflow-y-auto px-3 py-5 sm:px-8">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-lg bg-[#fff4c6] px-3 py-2 text-[11px] leading-4 text-[#665b27] shadow-sm">🔒 This is a simulated demo conversation.</div>
          <div className="mx-auto flex max-w-2xl flex-col gap-2">
            {messages.map((message) => <Bubble key={message.id} message={message} />)}
            {typing ? <TypingBubble /> : null}
            <div ref={endRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className="flex shrink-0 items-end gap-2 bg-[#f0f2f5] px-3 py-3">
          <button type="button" className="h-11 w-11 shrink-0 rounded-full text-slate-500 hover:bg-black/5"><Smile className="mx-auto h-5 w-5" /></button>
          <button type="button" className="hidden h-11 w-11 shrink-0 rounded-full text-slate-500 hover:bg-black/5 sm:block"><Paperclip className="mx-auto h-5 w-5" /></button>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} rows={1} placeholder="Type a message" className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border-0 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400" />
          <button disabled={!input.trim() || typing} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white transition hover:bg-[#008f72] disabled:opacity-50"><Send className="h-4 w-4" /></button>
        </form>
      </section>

      <aside className="hidden border-l border-slate-200 bg-white p-5 lg:block">
        <div className="flex items-center justify-between"><div className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Simulator</div><span className="rounded-full bg-teal-50 px-2 py-1 text-[10px] font-semibold text-teal-700">{publicMode ? "PUBLIC" : "TEST"}</span></div>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs text-slate-400">Current qualification stage</div><div className="mt-1 text-lg font-semibold text-slate-900">{lastStage}</div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-1/3 rounded-full bg-teal-500" /></div><div className="mt-2 text-[11px] text-slate-400">Demo-only state preview</div></div>
        <div className="mt-5 space-y-3"><div className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /><p className="text-xs leading-5 text-slate-500">Gemini can replace this local responder in Module 3 without changing the chat surface.</p></div><div className="flex gap-3"><ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /><p className="text-xs leading-5 text-slate-500">Bookings will appear here as a simulated transition in the next module.</p></div></div>
      </aside>
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const lead = message.role === "LEAD";
  const time = formatTime(new Date(message.sentAt));
  return <div className={lead ? "flex justify-end" : "flex justify-start"}><div className={lead ? "max-w-[85%] rounded-2xl rounded-tr-md bg-[#d9fdd3] px-3 py-2 shadow-sm sm:max-w-[72%]" : "max-w-[85%] rounded-2xl rounded-tl-md bg-white px-3 py-2 shadow-sm sm:max-w-[72%]"}><div className="whitespace-pre-wrap text-[14px] leading-5 text-slate-800">{message.content}</div><div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-400"><span>{time}</span>{lead ? <CheckCheck className="h-3.5 w-3.5 text-[#53a89a]" /> : null}</div></div></div>;
}

function TypingBubble() {
  return <div className="flex justify-start"><div className="rounded-2xl rounded-tl-md bg-white px-3.5 py-3 shadow-sm"><div className="flex items-center gap-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-.2s]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-.1s]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" /></div></div></div>;
}
