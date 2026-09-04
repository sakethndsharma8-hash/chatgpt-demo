"use server";

import { redirect } from "next/navigation";
import { isAdminPasswordValid, setAdminSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!isAdminPasswordValid(password)) {
    redirect("/login?error=1");
  }
  await setAdminSession();
  redirect("/dashboard");
}
