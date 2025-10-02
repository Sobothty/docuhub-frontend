import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/server/proxy";

export async function POST(req: NextRequest) {
  return proxyRequest(req, "/api/v1/paper/assign-adviser");
}
