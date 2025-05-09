"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Проверяем при монтировании
    checkIfMobile()

    // Добавляем слушатель изменения размера окна
    window.addEventListener("resize", checkIfMobile)

    // Очищаем слушатель при размонтировании
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return isMobile
}
