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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Pencil, Trash2, FileQuestion } from "lucide-react"

// Интерфейс для урока
interface Lesson {
  id: number
  subjectId: number
  title: string
  description: string
  duration: string
  questionsCount: number
  createdAt: string
}

// Интерфейс для предмета
interface Subject {
  id: number
  name: string
}

// Начальные данные для демонстрации
const subjects: Subject[] = [
  { id: 1, name: "Математика" },
  { id: 2, name: "Физика" },
  { id: 3, name: "Информатика" },
  { id: 4, name: "Биология" },
  { id: 5, name: "Химия" },
]

const initialLessons: Lesson[] = [
  {
    id: 1,
    subjectId: 1,
    title: "Введение в алгебру",
    description: "Основные понятия и определения алгебры",
    duration: "45 мин",
    questionsCount: 10,
    createdAt: "2023-01-20",
  },
  {
    id: 2,
    subjectId: 1,
    title: "Линейные уравнения",
    description: "Решение линейных уравнений с одной переменной",
    duration: "60 мин",
    questionsCount: 15,
    createdAt: "2023-01-25",
  },
  {
    id: 3,
    subjectId: 2,
    title: "Механика",
    description: "Основы механики и законы Ньютона",
    duration: "90 мин",
    questionsCount: 12,
    createdAt: "2023-02-10",
  },
  {
    id: 4,
    subjectId: 3,
    title: "Алгоритмы и блок-схемы",
    description: "Введение в алгоритмы и их представление",
    duration: "60 мин",
    questionsCount: 8,
    createdAt: "2023-03-15",
  },
  {
    id: 5,
    subjectId: 4,
    title: "Клетка",
    description: "Строение и функции клетки",
    duration: "45 мин",
    questionsCount: 10,
    createdAt: "2023-04-10",
  },
]

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [newLesson, setNewLesson] = useState({
    subjectId: "",
    title: "",
    description: "",
    duration: "",
  })

  // Фильтрация уроков по поисковому запросу и выбранному предмету
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubject = selectedSubject === "all" || lesson.subjectId === Number.parseInt(selectedSubject)

    return matchesSearch && matchesSubject
  })

  // Получение названия предмета по ID
  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : "Неизвестный предмет"
  }

  // Обработчик добавления нового урока
  const handleAddLesson = () => {
    const lesson: Lesson = {
      id: lessons.length > 0 ? Math.max(...lessons.map((l) => l.id)) + 1 : 1,
      subjectId: Number.parseInt(newLesson.subjectId),
      title: newLesson.title,
      description: newLesson.description,
      duration: newLesson.duration,
      questionsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setLessons([...lessons, lesson])
    setNewLesson({ subjectId: "", title: "", description: "", duration: "" })
    setIsAddDialogOpen(false)
  }

  // Обработчик редактирования урока
  const handleEditLesson = () => {
    if (currentLesson) {
      setLessons(lessons.map((lesson) => (lesson.id === currentLesson.id ? currentLesson : lesson)))
      setIsEditDialogOpen(false)
    }
  }

  // Обработчик удаления урока
  const handleDeleteLesson = () => {
    if (currentLesson) {
      setLessons(lessons.filter((lesson) => lesson.id !== currentLesson.id))
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Уроки</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#7635E9] hover:bg-[#6025c7]">
          <Plus className="mr-2 h-4 w-4" /> Добавить урок
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск уроков..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Выберите предмет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все предметы</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.name}
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
              <TableHead>Предмет</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="hidden md:table-cell">Описание</TableHead>
              <TableHead className="hidden md:table-cell">Длительность</TableHead>
              <TableHead>Вопросов</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-medium">{lesson.id}</TableCell>
                  <TableCell>{getSubjectName(lesson.subjectId)}</TableCell>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{lesson.description}</TableCell>
                  <TableCell className="hidden md:table-cell">{lesson.duration}</TableCell>
                  <TableCell>{lesson.questionsCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentLesson(lesson)
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
                          setCurrentLesson(lesson)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Удалить</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <FileQuestion className="h-4 w-4" />
                        <span className="sr-only">Вопросы</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Уроки не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Диалог добавления урока */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить урок</DialogTitle>
            <DialogDescription>Заполните информацию о новом уроке</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Предмет</Label>
              <Select
                value={newLesson.subjectId}
                onValueChange={(value) => setNewLesson({ ...newLesson, subjectId: value })}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Выберите предмет" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                placeholder="Введите название урока"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={newLesson.description}
                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                placeholder="Введите описание урока"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Длительность</Label>
              <Input
                id="duration"
                value={newLesson.duration}
                onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                placeholder="Например: 45 мин"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleAddLesson}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={!newLesson.subjectId || !newLesson.title}
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования урока */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать урок</DialogTitle>
            <DialogDescription>Измените информацию об уроке</DialogDescription>
          </DialogHeader>
          {currentLesson && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-subject">Предмет</Label>
                <Select
                  value={currentLesson.subjectId.toString()}
                  onValueChange={(value) => setCurrentLesson({ ...currentLesson, subjectId: Number.parseInt(value) })}
                >
                  <SelectTrigger id="edit-subject">
                    <SelectValue placeholder="Выберите предмет" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Название</Label>
                <Input
                  id="edit-title"
                  value={currentLesson.title}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  value={currentLesson.description}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Длительность</Label>
                <Input
                  id="edit-duration"
                  value={currentLesson.duration}
                  onChange={(e) => setCurrentLesson({ ...currentLesson, duration: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditLesson} className="bg-[#7635E9] hover:bg-[#6025c7]">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления урока */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить урок</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот урок? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          {currentLesson && (
            <div className="py-4">
              <p>
                <strong>Предмет:</strong> {getSubjectName(currentLesson.subjectId)}
              </p>
              <p>
                <strong>Название:</strong> {currentLesson.title}
              </p>
              <p>
                <strong>Описание:</strong> {currentLesson.description}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteLesson}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
