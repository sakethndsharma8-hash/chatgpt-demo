import { NextResponse } from "next/server";
import { DemoStatus } from "@prisma/client";
import { isAdminAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const enabled = Boolean(body.enabled);
  const demo = await db.demo.update({ where: { id: params.id }, data: { publicEnabled: enabled, status: enabled ? DemoStatus.SHARED : DemoStatus.DRAFT } });
  return NextResponse.json({ enabled: demo.publicEnabled, slug: demo.publicSlug });
}
