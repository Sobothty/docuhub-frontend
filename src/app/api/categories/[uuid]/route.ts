import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/server/proxy";

export async function PUT(req: NextRequest, { params }: { params: { uuid: string } }) {
  return proxyRequest(req, `/api/v1/categories/${params.uuid}`);
}

export async function DELETE(req: NextRequest, { params }: { params: { uuid: string } }) {
  return proxyRequest(req, `/api/v1/categories/${params.uuid}`);
}
