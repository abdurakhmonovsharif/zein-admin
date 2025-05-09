"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Данные для графика активности
const activityData = [
  { name: "Пн", Студенты: 12, Тесты: 18 },
  { name: "Вт", Студенты: 15, Тесты: 20 },
  { name: "Ср", Студенты: 10, Тесты: 15 },
  { name: "Чт", Студенты: 18, Тесты: 25 },
  { name: "Пт", Студенты: 20, Тесты: 30 },
  { name: "Сб", Студенты: 8, Тесты: 10 },
  { name: "Вс", Студенты: 5, Тесты: 8 },
]

export function ActivityChart() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Загрузка графика...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={activityData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="Студенты" fill="#7635E9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Тесты" fill="#addbff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
