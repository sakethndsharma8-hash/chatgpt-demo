import { db } from "@/lib/db";
import { PublicDemoChat } from "@/components/public/public-demo-chat";

export default async function PublicDemoPage({ params }: { params: { slug: string } }) {
  const demo = await db.demo.findUnique({ where: { publicSlug: params.slug } });
  if (!demo || !demo.publicEnabled || demo.status !== "SHARED") {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6"><div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 font-bold text-slate-500">D</div><h1 className="text-xl font-semibold">Demo unavailable</h1><p className="mt-2 text-sm leading-6 text-slate-500">This sales demo is not currently shared.</p></div></main>;
  }

  return <main className="min-h-screen bg-slate-100 px-3 py-4 sm:px-6 sm:py-8"><div className="mx-auto max-w-6xl"><div className="mb-4 flex items-center justify-between px-1"><div><div className="text-xs font-semibold uppercase tracking-[.18em] text-teal-700">Interactive demo</div><div className="mt-1 text-sm font-semibold text-slate-900">{demo.businessName}</div></div><div className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500 shadow-sm">Built for demonstration</div></div><PublicDemoChat slug={demo.publicSlug} /><p className="mt-4 text-center text-[11px] text-slate-400">This is a simulated experience. No WhatsApp messages or calendar events are sent or created.</p></div></main>;
}
