import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useLocation
} from "@tanstack/react-router";
import appCss from "../app/globals.css?url";
import appFontCss from "../app/font.css?url";
import { NextIntlClientProvider } from "@/i18n/compat/client";
import { useEffect } from "react";
import arMessages from "@/i18n/locales/ar.json";
import frMessages from "@/i18n/locales/fr.json";
import enMessages from "@/i18n/locales/en.json";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { getPreferredLocale } from "@/i18n/runtime";
import { PWAHandler } from "@/components/shared/PWAHandler";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      { title: "Hamza Amirni CV" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "stylesheet",
        href: appFontCss
      },
      {
        rel: "manifest",
        href: "/manifest.webmanifest"
      }
    ]
  }),
  component: RootComponent,
  notFoundComponent: RootNotFound
});

function RootComponent() {
  const pathname = useLocation({
    select: (location) => location.pathname
  });
  const locale = getPreferredLocale(pathname);
  const messages = {
    en: enMessages,
    ar: arMessages,
    fr: frMessages,
  }[locale] || enMessages;

  useEffect(() => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
  }, [locale]);

  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <head>
        <HeadContent />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="icon" href="/icon.png" />
      </head>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="Asia/Shanghai"
        >
          <Providers>
            <Outlet />
            <Toaster position="bottom-center" richColors />
            <PWAHandler />
          </Providers>
        </NextIntlClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Page not found</p>
    </main>
  );
}
