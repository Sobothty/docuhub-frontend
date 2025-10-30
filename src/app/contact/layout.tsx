import { Metadata } from "next";
import { pageSEO } from "@/lib/seo";

export const metadata: Metadata = pageSEO.contact;

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
