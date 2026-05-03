
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "@/i18n/compat/client";
import Link from "@/lib/link";
import { Sun, Moon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSwitch from "@/components/shared/LanguageSwitch";
import { GitHubStars } from "@/components/shared/GitHubStars";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthDialog } from "@/components/shared/AuthDialog";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  buttonText: string;
  extraItems?: Array<{
    icon: React.ReactNode;
    label: string;
    component: React.ReactNode;
  }>;
}

export default function MobileMenu({
  isOpen,
  onClose,
  buttonText,
  extraItems = [],
}: MobileMenuProps) {
  const t = useTranslations("home");
  const locale = useLocale();
  const { user } = useAuthStore();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-x-0 top-16 z-50 md:hidden"
    >
      <div className="bg-background/90 backdrop-blur-xl border-b border-border shadow-xl">
        <nav className="mx-auto max-w-[1200px] px-6 py-8 flex flex-col gap-6">
          <div className="flex items-center justify-between bg-accent/20 p-4 rounded-2xl">
            <div className="flex gap-4">
              <LanguageSwitch />
              <ThemeToggle>
                <div className="w-10 h-10 relative cursor-pointer rounded-xl hover:bg-accent/50 flex items-center justify-center transition-colors">
                  <Sun className="h-[1.2rem] w-[1.2rem] absolute inset-0 m-auto rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="h-[1.2rem] w-[1.2rem] absolute inset-0 m-auto rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </div>
              </ThemeToggle>
            </div>
            <GitHubStars />
          </div>

          <div className="flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="bg-primary hover:opacity-90 text-white w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link href="/app/dashboard" onClick={onClose}>
                    {buttonText}
                  </Link>
                </Button>
                <div className="flex justify-center pt-2">
                   <UserMenu />
                </div>
              </div>
            ) : (
              <AuthDialog>
                <Button
                  size="lg"
                  className="bg-primary hover:opacity-90 text-white w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20"
                >
                  {t("header.startButton")}
                </Button>
              </AuthDialog>
            )}
          </div>
        </nav>
      </div>
    </motion.div>
  );
}
