import Link from "next/link";
import { ArrowUpRight, ExternalLink, MessageSquareText, Plus, Share2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  await requireAdmin();
  const demos = await db.demo.findMany({ orderBy: { updatedAt: "desc" }, include: { _count: { select: { conversations: true, bookings: true } } } });

  return (
    <AppShell title="Demos" subtitle="Build and present simulated AI setter experiences">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Sales simulator</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Your demos</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Each demo is a self-contained, polished WhatsApp-style conversation you can test privately or share with a prospect.</p>
        </div>
        <Link href="/dashboard/demos/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Create a demo
        </Link>
      </div>

      {demos.length === 0 ? (
        <Card className="border-dashed p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><MessageSquareText /></div>
          <h2 className="text-lg font-semibold">Your first demo starts here</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Create a business profile, add your qualifying talking points, then jump straight into the simulated chat.</p>
          <Link href="/dashboard/demos/new" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"><Plus className="h-4 w-4" /> New demo</Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {demos.map((demo) => (
            <Card key={demo.id} className="group overflow-hidden p-5">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-700 text-sm font-bold text-white">{demo.businessName.slice(0, 1).toUpperCase()}</div>
                  <div className="min-w-0"><h2 className="truncate font-semibold text-slate-900">{demo.name}</h2><p className="truncate text-xs text-slate-500">{demo.businessName} · {demo.niche}</p></div>
                </div>
                <span className={demo.status === "SHARED" ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700" : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"}>{demo.status.toLowerCase()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
                <div><div className="text-slate-400">Conversations</div><div className="mt-1 text-lg font-semibold text-slate-800">{demo._count.conversations}</div></div>
                <div><div className="text-slate-400">Bookings</div><div className="mt-1 text-lg font-semibold text-slate-800">{demo._count.bookings}</div></div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Updated {formatDate(demo.updatedAt)}</span><span>{demo.publicEnabled ? "Public link on" : "Private"}</span></div>
              <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                <Link href={`/dashboard/demos/${demo.id}`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><ArrowUpRight className="h-4 w-4" /> Open</Link>
                <Link href={`/dashboard/demos/${demo.id}/chat`} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2.5 text-sm font-medium text-white hover:bg-slate-800"><MessageSquareText className="h-4 w-4" /> Test chat</Link>
                {demo.publicEnabled ? <Link href={`/demo/${demo.publicSlug}`} target="_blank" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" title="Open shared demo"><ExternalLink className="h-4 w-4" /></Link> : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
