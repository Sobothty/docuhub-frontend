import type { Metadata } from "next";
import { generatePaperSEO } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // For now, return basic metadata
  // In production, you would fetch paper data here
  return generatePaperSEO({
    title: "Research Paper",
    uuid: id,
    description:
      "Read this research paper on Docuhub. Access academic papers, download PDFs, and explore related research in our academic repository.",
  });
}

export default function PaperDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* No navbar or footer for clean paper viewing experience */}
      {children}
    </div>
  );
}
