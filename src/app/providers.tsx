"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/components/providers/I18nProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              {children}
              <Toaster 
                position="top-right" 
                richColors 
                closeButton 
                expand={true}
              />
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </SessionProvider>
    </Provider>
  );
}
