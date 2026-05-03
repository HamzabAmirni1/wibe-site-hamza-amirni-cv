import { useAuthStore } from "@/store/useAuthStore"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthDialog } from "./AuthDialog"
import { LogOut, User as UserIcon, LayoutDashboard, Settings } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useTranslations } from "@/i18n/compat/client"

export function UserMenu() {
  const t = useTranslations("auth")
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      signOut()
      toast.success(t("signOutSuccess"))
      navigate({ to: "/" })
    }
  }

  if (!user) {
    return (
      <AuthDialog>
        <Button className="rounded-xl px-6 h-10 font-medium shadow-sm transition-all hover:shadow-md active:scale-95 bg-primary text-primary-foreground">
          {t("signIn")}
        </Button>
      </AuthDialog>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-accent/20 hover:bg-accent/40 border border-border/50">
          <UserIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/app/dashboard" })}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>{t("dashboard")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/app/dashboard/settings" })}>
          <Settings className="mr-2 h-4 w-4" />
          <span>{t("settings")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
