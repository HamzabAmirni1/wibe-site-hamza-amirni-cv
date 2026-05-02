
import { useTranslations } from "@/i18n/compat/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ThemedAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

const ThemeModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
}: ThemedAlertDialogProps) => {
  const t = useTranslations("themeModal.delete");

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </span>
            {t("title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            <span>
              {t.raw("description").split("{title}")[0]}
              <span className="px-1 font-semibold text-foreground">{title}</span>
              {t.raw("description").split("{title}")[1]}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{t("cancelText")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 border-0 font-semibold"
          >
            {t("confirmText")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ThemeModal;
