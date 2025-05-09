"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Pencil, Trash2, Medal } from "lucide-react"

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
const initialStudents: Student[] = [
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

// Курсы для выбора
const courses = ["Математика", "Физика", "Информатика", "Биология", "Химия"]

// Уровни для выбора
const levels = ["Начальный", "Средний", "Продвинутый"]

// Типы экзаменов для выбора
const examTypes = ["Тест", "Экзамен", "Проект"]

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [newStudent, setNewStudent] = useState({
    name: "",
    course: "",
    level: "",
    score: "",
    examType: "",
    achievements: "",
  })

  // Фильтрация студентов по поисковому запросу, курсу и уровню
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === "all" || student.course === selectedCourse
    const matchesLevel = selectedLevel === "all" || student.level === selectedLevel

    return matchesSearch && matchesCourse && matchesLevel
  })

  // Получение цвета для оценки
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  // Получение инициалов из имени
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Обработчик добавления нового студента
  const handleAddStudent = () => {
    const student: Student = {
      id: students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1,
      name: newStudent.name,
      course: newStudent.course,
      level: newStudent.level,
      score: Number.parseInt(newStudent.score) || 0,
      examType: newStudent.examType,
      image: "",
      achievements: newStudent.achievements ? newStudent.achievements.split(",").map((a) => a.trim()) : [],
    }
    setStudents([...students, student])
    setNewStudent({
      name: "",
      course: "",
      level: "",
      score: "",
      examType: "",
      achievements: "",
    })
    setIsAddDialogOpen(false)
  }

  // Обработчик редактирования студента
  const handleEditStudent = () => {
    if (currentStudent) {
      setStudents(students.map((student) => (student.id === currentStudent.id ? currentStudent : student)))
      setIsEditDialogOpen(false)
    }
  }

  // Обработчик удаления студента
  const handleDeleteStudent = () => {
    if (currentStudent) {
      setStudents(students.filter((student) => student.id !== currentStudent.id))
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Студенты</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#7635E9] hover:bg-[#6025c7]">
          <Plus className="mr-2 h-4 w-4" /> Добавить студента
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск студентов..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Выберите курс" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все курсы</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Выберите уровень" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все уровни</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Студент</TableHead>
              <TableHead>Курс</TableHead>
              <TableHead>Уровень</TableHead>
              <TableHead>Оценка</TableHead>
              <TableHead className="hidden md:table-cell">Тип экзамена</TableHead>
              <TableHead className="hidden md:table-cell">Достижения</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={student.image || "/placeholder.svg"} alt={student.name} />
                        <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.level}</TableCell>
                  <TableCell className={getScoreColor(student.score)}>{student.score}%</TableCell>
                  <TableCell className="hidden md:table-cell">{student.examType}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {student.achievements.length > 0 ? (
                        student.achievements.map((achievement, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <Medal className="h-3 w-3" />
                            {achievement}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">Нет достижений</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentStudent(student)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentStudent(student)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Удалить</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Студенты не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Диалог добавления студента */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить студента</DialogTitle>
            <DialogDescription>Заполните информацию о новом студенте</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ФИО</Label>
              <Input
                id="name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="Введите ФИО студента"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course">Курс</Label>
              <Select
                value={newStudent.course}
                onValueChange={(value) => setNewStudent({ ...newStudent, course: value })}
              >
                <SelectTrigger id="course">
                  <SelectValue placeholder="Выберите курс" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Уровень</Label>
              <Select
                value={newStudent.level}
                onValueChange={(value) => setNewStudent({ ...newStudent, level: value })}
              >
                <SelectTrigger id="level">
                  <SelectValue placeholder="Выберите уровень" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="score">Оценка (%)</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={newStudent.score}
                onChange={(e) => setNewStudent({ ...newStudent, score: e.target.value })}
                placeholder="Введите оценку (0-100)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="examType">Тип экзамена</Label>
              <Select
                value={newStudent.examType}
                onValueChange={(value) => setNewStudent({ ...newStudent, examType: value })}
              >
                <SelectTrigger id="examType">
                  <SelectValue placeholder="Выберите тип экзамена" />
                </SelectTrigger>
                <SelectContent>
                  {examTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="achievements">Достижения</Label>
              <Input
                id="achievements"
                value={newStudent.achievements}
                onChange={(e) => setNewStudent({ ...newStudent, achievements: e.target.value })}
                placeholder="Введите достижения через запятую"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleAddStudent}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={!newStudent.name || !newStudent.course || !newStudent.level}
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования студента */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать студента</DialogTitle>
            <DialogDescription>Измените информацию о студенте</DialogDescription>
          </DialogHeader>
          {currentStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">ФИО</Label>
                <Input
                  id="edit-name"
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-course">Курс</Label>
                <Select
                  value={currentStudent.course}
                  onValueChange={(value) => setCurrentStudent({ ...currentStudent, course: value })}
                >
                  <SelectTrigger id="edit-course">
                    <SelectValue placeholder="Выберите курс" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-level">Уровень</Label>
                <Select
                  value={currentStudent.level}
                  onValueChange={(value) => setCurrentStudent({ ...currentStudent, level: value })}
                >
                  <SelectTrigger id="edit-level">
                    <SelectValue placeholder="Выберите уровень" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-score">Оценка (%)</Label>
                <Input
                  id="edit-score"
                  type="number"
                  min="0"
                  max="100"
                  value={currentStudent.score}
                  onChange={(e) =>
                    setCurrentStudent({ ...currentStudent, score: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-examType">Тип экзамена</Label>
                <Select
                  value={currentStudent.examType}
                  onValueChange={(value) => setCurrentStudent({ ...currentStudent, examType: value })}
                >
                  <SelectTrigger id="edit-examType">
                    <SelectValue placeholder="Выберите тип экзамена" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-achievements">Достижения</Label>
                <Input
                  id="edit-achievements"
                  value={currentStudent.achievements.join(", ")}
                  onChange={(e) =>
                    setCurrentStudent({
                      ...currentStudent,
                      achievements: e.target.value ? e.target.value.split(",").map((a) => a.trim()) : [],
                    })
                  }
                  placeholder="Введите достижения через запятую"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditStudent} className="bg-[#7635E9] hover:bg-[#6025c7]">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления студента */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить студента</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этого студента? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          {currentStudent && (
            <div className="py-4">
              <p>
                <strong>ФИО:</strong> {currentStudent.name}
              </p>
              <p>
                <strong>Курс:</strong> {currentStudent.course}
              </p>
              <p>
                <strong>Уровень:</strong> {currentStudent.level}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
