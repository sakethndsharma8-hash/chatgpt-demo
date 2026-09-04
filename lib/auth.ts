import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "demo_simulator_session";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isAdminPasswordValid(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(digest(password));
  const b = Buffer.from(digest(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setAdminSession() {
  const value = digest(process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "dev-secret");
  cookies().set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function isAdminAuthenticated() {
  const current = cookies().get(COOKIE)?.value;
  if (!current) return false;
  const expected = digest(process.env.SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "dev-secret");
  return current === expected;
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/login");
}

export async function clearAdminSession() {
  cookies().delete(COOKIE);
}
