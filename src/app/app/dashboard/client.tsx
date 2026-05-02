import { useState } from "react";
import { IconResumes, IconTemplates, IconSettings, IconAI, IconDeveloper } from "@/components/shared/icons/SidebarIcons";
import { usePathname, useRouter } from "@/lib/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Instagram, Facebook, Youtube, MessageCircle, Send, Globe } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { useLocale, useTranslations } from "@/i18n/compat/client";

interface MenuItem {
  title: string;
  url?: string;
  href?: string;
  icon: any;
  items?: { title: string; href: string }[];
  isExternal?: boolean;
  isDeveloperModal?: boolean;
}

const DeveloperDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          {/* Avatar */}
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-700 shadow-lg shadow-primary/30">
            <span className="text-2xl font-bold text-white">HA</span>
          </div>
          <DialogTitle className="text-xl">المطور (Developer)</DialogTitle>
          <DialogDescription className="text-sm font-medium">
            Hamza Amirni — حمزة اعمرني
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: "https://whatsapp.com/channel/0029ValXRoHCnA7yKopcrn1p", icon: <MessageCircle className="text-green-500" size={18} />, label: "WA Channel", color: "hover:border-green-500/40 hover:bg-green-500/5" },
              { href: "https://chat.whatsapp.com/DDb3fGPuZPB1flLc1BV9gJ", icon: <MessageCircle className="text-green-500" size={18} />, label: "WA Group", color: "hover:border-green-500/40 hover:bg-green-500/5" },
              { href: "https://instagram.com/hamza_amirni_01", icon: <Instagram className="text-pink-500" size={18} />, label: "Instagram 1", color: "hover:border-pink-500/40 hover:bg-pink-500/5" },
              { href: "https://instagram.com/hamza_amirni_02", icon: <Instagram className="text-pink-500" size={18} />, label: "Instagram 2", color: "hover:border-pink-500/40 hover:bg-pink-500/5" },
              { href: "https://www.facebook.com/6kqzuj3y4e", icon: <Facebook className="text-blue-600" size={18} />, label: "Facebook", color: "hover:border-blue-500/40 hover:bg-blue-500/5" },
              { href: "https://www.facebook.com/profile.php?id=61564527797752", icon: <Facebook className="text-blue-600" size={18} />, label: "FB Page", color: "hover:border-blue-500/40 hover:bg-blue-500/5" },
              { href: "https://www.youtube.com/@Hamzaamirni01", icon: <Youtube className="text-red-500" size={18} />, label: "YouTube", color: "hover:border-red-500/40 hover:bg-red-500/5" },
              { href: "https://t.me/hamzaamirni", icon: <Send className="text-sky-400" size={18} />, label: "Telegram", color: "hover:border-sky-400/40 hover:bg-sky-400/5" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 rounded-2xl border border-border/40 bg-card px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-95 ${link.color}`}
              >
                {link.icon}
                <span className="text-foreground/90">{link.label}</span>
              </a>
            ))}
          </div>
          <a
            href="https://hamzaamirni.netlify.app"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-purple-600 px-4 py-3 font-bold text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95"
          >
            <Globe size={18} />
            <span>Portfolio</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations("dashboard");
  const sidebarItems: MenuItem[] = [
    {
      title: t("sidebar.resumes"),
      url: "/app/dashboard/resumes",
      icon: IconResumes,
    },
    {
      title: t("sidebar.templates"),
      url: "/app/dashboard/templates",
      icon: IconTemplates,
    },
    {
      title: t("sidebar.ai"),
      url: "/app/dashboard/ai",
      icon: IconAI,
    },
    {
      title: t("sidebar.settings"),
      url: "/app/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "المطور (Developer)",
      icon: IconDeveloper,
      isDeveloperModal: true,
    },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [open, setOpen] = useState(true);
  const [developerModalOpen, setDeveloperModalOpen] = useState(false);
  const [collapsible, setCollapsible] = useState<"offcanvas" | "icon" | "none">(
    "icon"
  );

  const handleItemClick = (item: MenuItem) => {
    if (item.items) {

    } else if (item.isDeveloperModal) {
      setDeveloperModalOpen(true);
    } else if (item.isExternal && item.url) {
      window.open(item.url, "_blank");
    } else {
      router.push(item.url || item.href || "/");
    }
  };

  const isItemActive = (item: MenuItem) => {
    if (item.isExternal || item.isDeveloperModal) return false;
    if (item.items) {
      return item.items.some((subItem) => pathname === subItem.href);
    }
    return item.url === pathname || item.href === pathname;
  };

  return (
    <div className="flex h-screen bg-background mobile-hide-sidebar">
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar
          collapsible={collapsible}
          className="border-r border-border/40 glass-sidebar hidden md:flex"
        >
          <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/30">
            <div className="w-full cursor-pointer justify-center flex items-center gap-2" onClick={() => router.push(`/${locale}`)}>
              <Logo
                className="hover:opacity-80 transition-opacity"
                size={40}
              />
              {open && (
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                  {t("sidebar.appName")}
                </span>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {sidebarItems.map((item) => {
                    const active = isItemActive(item);
                    return (
                      <TooltipProvider delayDuration={0} key={item.title}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                asChild
                                isActive={active}
                                className={`w-full transition-all duration-200 ease-in-out h-12 mb-1 rounded-xl [&>svg]:size-auto ${active
                                  ? "bg-primary/10 text-primary font-bold hover:bg-primary/20 hover:text-primary shadow-sm"
                                  : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
                                  }`}
                              >
                                <div
                                  className="flex items-center gap-3 px-3 cursor-pointer"
                                  onClick={() => handleItemClick(item)}
                                >
                                  <item.icon size={24} active={active} />
                                  {open && (
                                    <span className="flex-1 text-sm font-medium">
                                      {item.title}
                                    </span>
                                  )}
                                </div>
                              </SidebarMenuButton>
                              {item.items && open && (
                                <div className="ml-9 mt-1 space-y-1 border-l-2 border-muted pl-2">
                                  {item.items.map((subItem) => (
                                    <div
                                      key={subItem.href}
                                      className={`cursor-pointer px-3 py-2 rounded-md text-sm transition-colors ${pathname === subItem.href
                                        ? "text-primary font-medium bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }`}
                                      onClick={() => router.push(subItem.href)}
                                    >
                                      {subItem.title}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </SidebarMenuItem>
                          </TooltipTrigger>
                          {!open && (
                            <TooltipContent side="right" className="font-medium">
                              {item.title}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-2 hidden md:block">
            <SidebarTrigger />
          </div>
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 glass-nav border-b border-border/30">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/${locale}`)}>
              <Logo size={32} />
              <span className="font-bold text-sm bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                {t("sidebar.appName")}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </SidebarProvider>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {sidebarItems.map((item) => {
          const active = isItemActive(item);
          return (
            <button
              key={item.title}
              onClick={() => handleItemClick(item)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${active
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <item.icon size={22} active={active} />
              <span className="text-[10px] font-medium leading-none">
                {item.title.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </nav>

      <DeveloperDialog open={developerModalOpen} onOpenChange={setDeveloperModalOpen} />
    </div>
  );
};

export default DashboardLayout;


