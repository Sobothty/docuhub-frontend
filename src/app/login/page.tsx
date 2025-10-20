// app/login/page.tsx (Server Component)
import { Suspense } from "react";
import DocuhubLoader from "@/components/loader/docuhub-loading";
import Login from "@/components/auth/Login";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={<DocuhubLoader />}>
        <Login />
      </Suspense>
    </div>
  );
}