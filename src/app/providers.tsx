"use client";

import { ThemeProvider } from "next-themes";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18nClient";
import { useEffect } from "react";
import ReduxProvider from "@/lib/Provider";
import { SessionProvider } from "next-auth/react";
import { AutoSignOutHandler } from "@/components/auth/autoSignOut";

export function Providers({ children }: { children: React.ReactNode }) {
  // Keep <html lang> in sync with current language
  useEffect(() => {
    const setLangAttr = (lng: string | undefined) => {
      if (typeof document !== "undefined" && lng) {
        document.documentElement.setAttribute("lang", lng);
      }
    };

    setLangAttr(i18n.language);
    const handler = (lng: string) => setLangAttr(lng);
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, []);

  return (
    <ReduxProvider>
      <SessionProvider>
        <I18nextProvider i18n={i18n} defaultNS="common">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
              <AutoSignOutHandler />
              {children}
          </ThemeProvider>
        </I18nextProvider>
      </SessionProvider>
    </ReduxProvider>
  );
}
