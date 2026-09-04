import Link from "next/link";
import { MessageCircleMore, Plus, LogOut } from "lucide-react";
import { logoutAction } from "@/app/dashboard/actions";

export function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">D</span>
              <span className="font-semibold tracking-tight">DemoFlow</span>
            </Link>
            <span className="hidden text-slate-300 sm:block">/</span>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-slate-900">{title}</div>
              {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/demos/new" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
              <Plus className="h-4 w-4" /> New demo
            </Link>
            <form action={logoutAction}>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">{children}</main>
      <div className="fixed bottom-4 right-4 hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 shadow md:flex md:items-center md:gap-1.5">
        <MessageCircleMore className="h-3.5 w-3.5" /> Sales demo environment
      </div>
    </div>
  );
}
