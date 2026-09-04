import Link from "next/link";
import { ArrowLeft, ExternalLink, MessageSquareText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { ShareToggle } from "@/components/demo/share-toggle";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function DemoDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const demo = await db.demo.findUnique({ where: { id: params.id }, include: { _count: { select: { conversations: true, bookings: true } } } });
  if (!demo) return null;

  return <AppShell title={demo.name} subtitle="Demo configuration and presentation links">
    <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> All demos</Link>
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <Card className="p-6"><div className="flex items-start justify-between gap-4"><div><div className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-teal-700">{demo.niche}</div><h1 className="text-2xl font-semibold tracking-tight">{demo.businessName}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{demo.toneDescription}</p></div><div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 text-lg font-bold text-white">{demo.businessName.slice(0,1)}</div></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-400">Services</div><div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{demo.serviceInfo}</div></div><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-400">Pricing</div><div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{demo.pricingInfo || "Not specified"}</div></div></div></Card>
        <ShareToggle id={demo.id} slug={demo.publicSlug} enabled={demo.publicEnabled} />
      </div>
      <div className="space-y-5">
        <Card className="p-5"><div className="grid grid-cols-2 gap-3"><Stat label="Conversations" value={demo._count.conversations.toString()} /><Stat label="Bookings" value={demo._count.bookings.toString()} /></div><div className="mt-5 space-y-2"><Link href={`/dashboard/demos/${demo.id}/chat`} className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"><MessageSquareText className="h-4 w-4" /> Test the chat</Link>{demo.publicEnabled ? <Link target="_blank" href={`/demo/${demo.publicSlug}`} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ExternalLink className="h-4 w-4" /> Open public demo</Link> : null}</div></Card>
        <Card className="p-5"><h2 className="font-semibold">Qualification talking points</h2><div className="mt-4 space-y-3">{Object.entries((demo.qualificationConfig as Record<string, { talkingPoints?: string }>)).map(([stage, config]) => <div key={stage} className="rounded-xl border border-slate-100 p-3"><div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{stage}</div><p className="mt-1 text-sm leading-5 text-slate-600">{config?.talkingPoints || "No talking points yet."}</p></div>)}</div></Card>
      </div>
    </div>
  </AppShell>;
}
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 p-4"><div className="text-xs text-slate-400">{label}</div><div className="mt-1 text-2xl font-semibold">{value}</div></div>; }
