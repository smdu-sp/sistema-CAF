import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth/auth";

export async function GET(req: NextRequest) {
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  return handlers.POST(req);
}
