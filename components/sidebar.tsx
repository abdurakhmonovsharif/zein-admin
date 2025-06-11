"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MailQuestion,
  Menu,
  NotebookPen,
  Settings,
  ShieldCheck,
  Users
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)
  const { isDevRole, isSuperAdminRole, isAdminRole } = useAuth()
  const showAdminsLink = (isDevRole() || isSuperAdminRole()) && !isAdminRole()

  const handleLogout = () => {
    // Очищаем localStorage
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    // Перенаправляем на страницу входа
    router.push("/login")
  }
const navItems = [
  {
    title: "Панель управления",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Курсы",
    href: "/dashboard/courses",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Предметы",
    href: "/dashboard/subjects",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Темы",
    href: "/dashboard/lessons",
    icon: <FileQuestion className="h-5 w-5" />,
  },
  {
    title: "Вопросы",
    href: "/dashboard/questions",
    icon: <FileQuestion className="h-5 w-5" />,
  },
  {
    title: "Результаты студентов",
    href: "/dashboard/students",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  // {
  //   title: "Результаты тестов",
  //   href: "/dashboard/test-results",
  //   icon: <NotebookPen className="h-5 w-5" />,
  // },
  {
    title: "Клиенты",
    href: "/dashboard/clients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Администраторы",
    href: "/dashboard/admins",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Часто задаваемые вопросы",
    href: "/dashboard/faq",
    icon: <MailQuestion className="h-5 w-5" />,
  },
  {
    title: "Настройки",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

  const filteredNavItems = navItems.filter(item => {
    if (item.title === "Администраторы" && isAdminRole()) {
      return false;
    }
    return true;
  })

  const NavItems = () => (
    <>
      <div className="mb-4 px-4 py-2">
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-[#7635E9]">ZEIN EDTECH</h2>
        <p className="text-xs text-muted-foreground">Админ панель</p>
      </div>
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Навигация</h2>
        <div className="space-y-1">
          {filteredNavItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <p className="text-center text-xs text-muted-foreground mb-2">Работает в тестовом режиме</p>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:bg-red-100 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-2">Выйти</span>
        </Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Открыть меню</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-full">
            <div className="flex h-full flex-col">
              <NavItems />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={cn("hidden border-r bg-background lg:block", className)}>
      <ScrollArea className="h-full">
        <div className="flex h-full w-72 flex-col">
          <NavItems />
        </div>
      </ScrollArea>
    </div>
  )
}
