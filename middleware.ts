import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isOperator } from "@/lib/operator";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  if (!isOperator(user?.email) && request.nextUrl.pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = { matcher: ["/dashboard/:path*"] };
