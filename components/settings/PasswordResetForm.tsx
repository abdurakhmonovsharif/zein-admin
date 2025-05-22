"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'
import { PasswordInput } from '../ui/password-input'

export function PasswordResetForm() {
  const { toast } = useToast()
  const { user, isDevRole, changePassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [errors, setErrors] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })

  const validatePassword = (password: string) => {
    const hasUpperCase = /[А-ЯA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase) return "Пароль должен содержать хотя бы одну заглавную букву"
    if (!hasNumber) return "Пароль должен содержать хотя бы одну цифру"
    if (!hasSymbol) return "Пароль должен содержать хотя бы один специальный символ"
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({
      old_password: '',
      new_password: '',
      confirm_password: '',
    })

    // Validation
    let hasErrors = false
    const newErrors = {
      old_password: '',
      new_password: '',
      confirm_password: '',
    }

    // Only validate current password for non-dev users
    if (!isDevRole() && !formData.old_password) {
      newErrors.old_password = 'Текущий пароль обязателен'
      hasErrors = true
    }

    if (!formData.new_password) {
      newErrors.new_password = 'Новый пароль обязателен'
      hasErrors = true
    } else {
      const passwordError = validatePassword(formData.new_password)
      if (passwordError) {
        newErrors.new_password = passwordError
        hasErrors = true
      }
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Подтверждение пароля обязательно'
      hasErrors = true
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Пароли не совпадают'
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const payload = isDevRole()
        ? { new_password: formData.new_password }
        : {
          old_password: formData.old_password,
          new_password: formData.new_password,
        }

      await changePassword(payload)

      toast({
        title: 'Успешно',
        description: 'Пароль успешно изменен',
      })

      // Reset form
      setFormData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      })
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.detail || 'Произошла ошибка при смене пароля',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Изменение пароля</CardTitle>
        <CardDescription>
          Измените свой пароль для обеспечения безопасности
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Only show current password field for non-dev users */}
          {!isDevRole() && (
            <div className="space-y-2">
              <Label htmlFor="old_password">Текущий пароль</Label>
              <PasswordInput
                id="old_password"
                value={formData.old_password}
                onChange={(e) =>
                  setFormData({ ...formData, old_password: e.target.value })
                }
                error={errors.old_password}
                placeholder="Введите текущий пароль"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="new_password">Новый пароль</Label>
            <PasswordInput
              id="new_password"
              value={formData.new_password}
              onChange={(e) =>
                setFormData({ ...formData, new_password: e.target.value })
              }
              error={errors.new_password}
              placeholder="Введите новый пароль"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Подтвердите новый пароль</Label>
            <PasswordInput
              id="confirm_password"
              value={formData.confirm_password}
              onChange={(e) =>
                setFormData({ ...formData, confirm_password: e.target.value })
              }
              error={errors.confirm_password}
              placeholder="Подтвердите новый пароль"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#7635E9] hover:bg-[#6025c7]"
            disabled={isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Изменить пароль'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
