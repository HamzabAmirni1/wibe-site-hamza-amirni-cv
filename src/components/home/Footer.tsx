import { useTranslations } from "@/i18n/compat/client";
import Logo from "@/components/shared/Logo";
import { Instagram, Facebook, Youtube, MessageCircle, Send, Globe } from "lucide-react";

export default function Footer() {
  const t = useTranslations("home");

  return (
    <footer className="py-16 md:py-24 border-t border-border/50 bg-secondary/10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-serif font-semibold text-lg text-foreground/80">Hamza Amirni CV</span>
          </div>

          <div className="flex flex-col md:items-end gap-4">
            <div className="text-sm font-semibold flex items-center gap-2">
              Developer: Hamza Amirni حمزة اعمرني
            </div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <a href="https://whatsapp.com/channel/0029ValXRoHCnA7yKopcrn1p" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="WhatsApp Channel">
                <MessageCircle size={18} />
              </a>
              <a href="https://chat.whatsapp.com/DDb3fGPuZPB1flLc1BV9gJ" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="WhatsApp Group">
                <MessageCircle size={18} />
              </a>
              <a href="https://instagram.com/hamza_amirni_01" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="Instagram 1">
                <Instagram size={18} />
              </a>
              <a href="https://instagram.com/hamza_amirni_02" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="Instagram 2">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/6kqzuj3y4e" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61564527797752" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="Facebook Page">
                <Facebook size={18} />
              </a>
              <a href="https://www.youtube.com/@Hamzaamirni01" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="YouTube">
                <Youtube size={18} />
              </a>
              <a href="https://t.me/hamzaamirni" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="Telegram">
                <Send size={18} />
              </a>
              <a href="https://hamzaamirni.netlify.app" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1" title="Portfolio">
                <Globe size={18} />
              </a>
            </div>
          </div>
          
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground/60 font-light border-t border-border/20 pt-8">
            <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
