import { NextRequest, NextResponse } from "next/server";

// Prefer env, fallback to production API to avoid 500s during local setup
const BACKEND_BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE || 'https://api.docuhub.me')
  .replace(/\/$/, "");

export async function proxyRequest(
  req: NextRequest,
  backendPath: string,
  init?: RequestInit
) {
  const url = new URL(req.url);
  const qs = url.search ? url.search : "";
  const target = `${BACKEND_BASE}${backendPath}${qs}`;

  // Clone headers and forward only safe ones. Keep Authorization and cookies.
  const headers = new Headers();
  const auth = req.headers.get("authorization");
  const cookie = req.headers.get("cookie");
  if (auth) headers.set("authorization", auth);
  if (cookie) headers.set("cookie", cookie);

  // For JSON requests, pass content-type if present
  const contentType = req.headers.get("content-type");
  if (contentType && !contentType.startsWith("multipart/form-data")) {
    headers.set("content-type", contentType);
  }

  const method = req.method;

  let body: BodyInit | undefined = undefined;
  if (method !== "GET" && method !== "HEAD") {
    if (contentType?.startsWith("multipart/form-data")) {
      // Forward FormData for file uploads
      const formData = await req.formData();
      body = formData as unknown as BodyInit;
    } else {
      const buf = await req.arrayBuffer();
      body = buf;
    }
  }

  const resp = await fetch(target, {
    method,
    headers,
    body,
    credentials: "include",
    ...init,
  });

  // Stream back response with original status and headers (excluding hop-by-hop)
  const resHeaders = new Headers();
  resp.headers.forEach((v, k) => {
    // Avoid setting set-cookie manually; Next will carry it through
    if (k.toLowerCase() !== "transfer-encoding") {
      resHeaders.set(k, v);
    }
  });

  // Attempt to passthrough as-is
  const arrayBuf = await resp.arrayBuffer();
  return new NextResponse(arrayBuf, { status: resp.status, headers: resHeaders });
}
