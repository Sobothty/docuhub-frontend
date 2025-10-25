"use client";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center animate-in fade-in zoom-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 blur-3xl rounded-full animate-pulse" />
            <div className="relative bg-transparent border-2 border-red-500 rounded-full p-8 transition-transform hover:scale-110 duration-300">
              <ShieldX
                className="w-24 h-24 text-red-500"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <h1 className="text-8xl md:text-9xl font-bold text-foreground tracking-tight">
            403
          </h1>
          <div className="h-1 w-24 bg-destructive mx-auto rounded-full animate-in fade-in zoom-in duration-500 delay-300" />
        </div>

        {/* Message */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-balance">
            Access Denied
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto text-pretty leading-relaxed">
            You don't have permission to access this resource. If you believe
            this is an error, please contact your administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <Button
            size="lg"
            className="min-w-40 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/" className="flex items-center justify-center">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-40 bg-transparent transition-all hover:scale-105 active:scale-95"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
