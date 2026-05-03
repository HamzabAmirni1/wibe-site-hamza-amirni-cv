
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "@/i18n/compat/client";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PWAHandler: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const t = useTranslations("common.pwa");

  useEffect(() => {
    // Force unregister existing Service Workers to fix ERR_FAILED
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
          console.log("SW unregistered to fix ERR_FAILED");
        }
      });
    }

    /* Commented out to fix ERR_FAILED
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
    */

    // Handle beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Show custom install notification
      showInstallToast(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const showInstallToast = (promptEvent: any) => {
    toast.info(t("installTitle"), {
      description: t("installDescription"),
      duration: 10000,
      action: {
        label: t("installButton"),
        onClick: () => {
          if (promptEvent) {
            promptEvent.prompt();
            promptEvent.userChoice.then((choiceResult: any) => {
              if (choiceResult.outcome === "accepted") {
                console.log("User accepted the install prompt");
              } else {
                console.log("User dismissed the install prompt");
              }
              setDeferredPrompt(null);
            });
          }
        },
      },
    });
  };

  return null; // This component doesn't render anything itself
};
