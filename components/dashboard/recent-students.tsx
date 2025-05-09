import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Интерфейс для студента
interface Student {
  id: number
  name: string
  course: string
  level: string
  score: number
  examType: string
  image: string
  achievements: string[]
}

// Начальные данные для демонстрации
const recentStudents: Student[] = [
  {
    id: 1,
    name: "Иван Иванов",
    course: "Математика",
    level: "Начальный",
    score: 85,
    examType: "Тест",
    image: "",
    achievements: ["Отличник", "Быстрый старт"],
  },
  {
    id: 2,
    name: "Мария Петрова",
    course: "Физика",
    level: "Продвинутый",
    score: 92,
    examType: "Экзамен",
    image: "",
    achievements: ["Отличник", "Мастер решений"],
  },
  {
    id: 3,
    name: "Алексей Сидоров",
    course: "Информатика",
    level: "Средний",
    score: 78,
    examType: "Тест",
    image: "",
    achievements: ["Настойчивый ученик"],
  },
  {
    id: 4,
    name: "Елена Козлова",
    course: "Биология",
    level: "Начальный",
    score: 65,
    examType: "Тест",
    image: "",
    achievements: [],
  },
  {
    id: 5,
    name: "Дмитрий Новиков",
    course: "Химия",
    level: "Продвинутый",
    score: 95,
    examType: "Экзамен",
    image: "",
    achievements: ["Отличник", "Мастер решений", "Эксперт"],
  },
]

// Получение инициалов из имени
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

// Получение цвета для оценки
const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600"
  if (score >= 70) return "text-yellow-600"
  return "text-red-600"
}

export function RecentStudents() {
  return (
    <div className="space-y-4">
      {recentStudents.map((student) => (
        <div key={student.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={student.image || "/placeholder.svg"} alt={student.name} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{student.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {student.course}
                </Badge>
                <span className="text-xs text-muted-foreground">{student.level}</span>
              </div>
            </div>
          </div>
          <div className={`text-sm font-bold ${getScoreColor(student.score)}`}>{student.score}%</div>
        </div>
      ))}
    </div>
  )
}
