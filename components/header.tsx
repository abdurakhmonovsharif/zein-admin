"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export const getRoleText = (role: string) => {
  switch (role) {
    case 'dev':
      return 'Разработчик'
    case 'super_admin':
      return 'Супер администратор'
    case 'admin':
      return 'Администратор'
    default:
      return 'Пользователь'
  }
}
export function Header() {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Получение инициалов из имени
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }


  const navigateToSettings = (tab: string = 'general') => {
    router.push(`/dashboard/settings?tab=${tab}`)
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7635E9] text-[10px] text-white">
            3
          </span>
          <span className="sr-only">Уведомления</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder.avif" alt={user?.full_name || "Пользователь"} />
                <AvatarFallback>{user ? getInitials(user.full_name) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role ? getRoleText(user.role) : 'Загрузка...'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigateToSettings('account')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigateToSettings()}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
