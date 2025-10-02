import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/server/proxy";

export async function GET(req: NextRequest, { params }: { params: { file: string } }) {
  const file = encodeURIComponent(params.file);
  return proxyRequest(req, `/api/v1/media/${file}`);
}

export async function DELETE(req: NextRequest, { params }: { params: { file: string } }) {
  const file = encodeURIComponent(params.file);
  return proxyRequest(req, `/api/v1/media/${file}`);
}
