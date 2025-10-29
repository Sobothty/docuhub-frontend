import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paper Details",
  description: "View and interact with academic paper details",
};

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
