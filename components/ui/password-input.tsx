"use client"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Input } from "./input"

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function PasswordInput({ className, error, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const validatePassword = (password: string) => {
    const hasUpperCase = /[А-ЯA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase) return "Пароль должен содержать хотя бы одну заглавную букву"
    if (!hasNumber) return "Пароль должен содержать хотя бы одну цифру"
    if (!hasSymbol) return "Пароль должен содержать хотя бы один специальный символ"
    return ""
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn(
          "pr-10", // Add padding for the eye icon
          error ? "border-red-500" : "",
          className
        )}
        {...props}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
