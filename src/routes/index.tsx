import { createFileRoute, redirect } from "@tanstack/react-router";
import { getPreferredLocale } from "@/i18n/runtime";

export const Route = createFileRoute("/")({
  beforeLoad: ({ location }) => {
    const locale = getPreferredLocale(location.pathname);
    throw redirect({ 
      to: "/$locale", 
      params: { locale },
      hash: location.hash || (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '')
    });
  }
});
