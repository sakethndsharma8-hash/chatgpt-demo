import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { createDemoAction } from "./actions";

export default async function NewDemoPage() {
  await requireAdmin();
  return (
    <AppShell title="New demo" subtitle="Define the business and qualification storyline">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to demos</Link>
        <div className="mb-7"><h1 className="text-3xl font-semibold tracking-tight">Create a demo</h1><p className="mt-2 text-sm text-slate-500">Keep the information prospect-facing and practical. These fields become the context for the simulator and the chat preview.</p></div>
        <form action={createDemoAction} className="space-y-5">
          <Card className="p-6">
            <div className="mb-5 flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><Sparkles className="h-4 w-4" /></div><div><h2 className="font-semibold">Business profile</h2><p className="text-xs text-slate-500">The identity the simulated setter represents.</p></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Demo name</label><input name="demoName" required className="field" placeholder="Acme Dental AI Setter" /></div>
              <div><label className="label">Business name</label><input name="businessName" required className="field" placeholder="Acme Dental" /></div>
              <div><label className="label">Niche</label><input name="niche" required className="field" placeholder="Cosmetic dentistry" /></div>
              <div><label className="label">Contact / agent name</label><input name="contactName" className="field" placeholder="Maya · Acme Dental" /></div>
              <div className="sm:col-span-2"><label className="label">Services / product info</label><textarea name="serviceInfo" required className="field min-h-28 resize-y" placeholder="What the business sells, who it helps, notable features or outcomes..." /></div>
              <div className="sm:col-span-2"><label className="label">Pricing info</label><textarea name="pricingInfo" className="field min-h-24 resize-y" placeholder="Price ranges, packages, starting prices, what should / should not be quoted..." /></div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Voice & conversation style</h2><p className="mb-5 mt-1 text-xs text-slate-500">Describe how the agent should sound. Sample DMs below are used as tone context later; they are not model training.</p>
            <label className="label">Tone description</label><textarea name="toneDescription" required className="field min-h-28 resize-y" placeholder="Warm, direct, concise. Uses natural WhatsApp language, short messages, light emoji use, never corporate..." />
            <div className="mt-4"><label className="label">Sample conversations / DMs</label><textarea name="sampleConversations" className="field min-h-40 resize-y font-mono text-[13px]" placeholder="Paste representative examples here..." /></div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold">Qualification framework</h2><p className="mb-5 mt-1 text-xs text-slate-500">Give the simulator the talking points it should naturally uncover. We’ll wire this into Gemini in the next module.</p>
            <div className="space-y-4">
              {[['Goal','goalTalkingPoints','What outcome does the lead want? What should the agent learn?'],['Situation','situationTalkingPoints','What is happening today? Existing process, volume, team, tools?'],['Pain','painTalkingPoints','Why does the current situation matter? What is frustrating or costly?'],['Budget','budgetTalkingPoints','How should the agent qualify budget or buying readiness?']].map(([label,name,placeholder]) => <div key={name}><label className="label">{label}</label><textarea name={name} className="field min-h-20 resize-y" placeholder={placeholder} /></div>)}
            </div>
          </Card>

          <div className="flex justify-end gap-3 pb-8"><Link href="/dashboard" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</Link><button className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700">Create demo</button></div>
        </form>
      </div>
    </AppShell>
  );
}
