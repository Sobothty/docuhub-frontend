"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  // Expose method to trigger loading
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener("startLoading", handleStart);
    window.addEventListener("completeLoading", handleComplete);

    return () => {
      window.removeEventListener("startLoading", handleStart);
      window.removeEventListener("completeLoading", handleComplete);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 bg-transparent z-[100]">
      <div className="h-full bg-accent animate-loading-bar origin-left" />
    </div>
  );
}