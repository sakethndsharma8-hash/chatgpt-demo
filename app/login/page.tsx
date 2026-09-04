import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { loginAction } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  if (await isAdminAuthenticated()) redirect("/dashboard");
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-8">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white">D</div>
          <h1 className="text-2xl font-semibold tracking-tight">DemoFlow</h1>
          <p className="mt-2 text-sm text-slate-500">Internal sales demo simulator.</p>
        </div>
        {searchParams?.error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">Incorrect password.</div> : null}
        <form action={loginAction} className="space-y-4">
          <div>
            <label className="label">Admin password</label>
            <input name="password" type="password" required className="field" autoFocus />
          </div>
          <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Enter simulator</button>
        </form>
      </div>
    </main>
  );
}
