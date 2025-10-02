import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/server/proxy";

export async function GET(req: NextRequest, { params }: { params: { paperUuid: string } }) {
  return proxyRequest(req, `/api/v1/comments/paper/${params.paperUuid}`);
}
