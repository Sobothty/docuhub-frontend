"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const param = useSearchParams();
  useEffect(() => {
    signIn("keycloak", { callbackUrl: param.get("callbackUrl") || "/" });
  }, [param]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="">Redirect to keycloak.....</div>
    </div>
  );
}
