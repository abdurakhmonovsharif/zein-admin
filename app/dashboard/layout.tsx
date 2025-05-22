"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user, getMe } = useAuth()

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login")
    } else if (isAuthenticated) {
      // If authenticated, get latest user data
      getMe()
    }
  }, [isAuthenticated, pathname, router, getMe])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">{children}</main>
      </div>
    </div>
  )
}
