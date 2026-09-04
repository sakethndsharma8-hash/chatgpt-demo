"use client";

import { useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";

export function ShareToggle({ id, slug, enabled: initialEnabled }: { id: string; slug: string; enabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const url = typeof window === "undefined" ? `/demo/${slug}` : `${window.location.origin}/demo/${slug}`;

  async function toggle() {
    setBusy(true);
    try {
      const response = await fetch(`/api/demos/${id}/share`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ enabled: !enabled }) });
      if (response.ok) setEnabled(!enabled);
    } finally { setBusy(false); }
  }

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm"><Link2 className="h-4 w-4" /></div><div><div className="text-sm font-semibold">Shareable demo link</div><div className="mt-0.5 break-all text-xs text-slate-500">/demo/{slug}</div></div></div><div className="flex gap-2"><button disabled={busy} onClick={toggle} className={enabled ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700" : "rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"}>{enabled ? "Enabled" : "Enable link"}</button>{enabled ? <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy link"}</button> : null}</div></div>;
}
