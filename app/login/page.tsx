"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({ username: "", password: "" })

    try {
      if (!formData.username) {
        setErrors(prev => ({ ...prev, username: "Имя пользователя обязательно" }))
        return
      }
      if (!formData.password) {
        setErrors(prev => ({ ...prev, password: "Пароль обязателен" }))
        return
      }

      await login(formData.username, formData.password)
      router.push("/dashboard")
    } catch (error: any) {
      let errorMessage = "Произошла ошибка при входе"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      }

      if (errorMessage === "Invalid credentials") {
        errorMessage = "Неверное имя пользователя или пароль"
      } else if (errorMessage === "No active account found with the given credentials") {
        errorMessage = "Не найден активный аккаунт с указанными учетными данными"
      }

      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Вход в систему</CardTitle>
          <CardDescription>
            Введите свои учетные данные для входа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                placeholder="Введите имя пользователя"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                error={errors.username}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <PasswordInput
                id="password"
                placeholder="Введите пароль"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
