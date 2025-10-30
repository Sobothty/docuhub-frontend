import { Metadata } from "next";
import { pageSEO } from "@/lib/seo";

export const metadata: Metadata = pageSEO.roadmap;

export default function RoadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
