import { Metadata } from "next";
import { pageSEO } from "@/lib/seo";

export const metadata: Metadata = pageSEO.about;

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
