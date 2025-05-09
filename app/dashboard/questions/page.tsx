"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"

// Интерфейс для варианта ответа
interface Option {
  id: number
  text: string
}

// Интерфейс для вопроса
interface Question {
  id: number
  lessonId: number
  text: string
  options: Option[]
  correctOptionId: number
  difficulty: "easy" | "medium" | "hard"
  createdAt: string
}

// Интерфейс для урока
interface Lesson {
  id: number
  title: string
  subjectId: number
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
]

const lessons: Lesson[] = [
  { id: 1, title: "Введение в алгебру", subjectId: 1 },
  { id: 2, title: "Линейные уравнения", subjectId: 1 },
  { id: 3, title: "Механика", subjectId: 2 },
  { id: 4, title: "Алгоритмы и блок-схемы", subjectId: 3 },
]

const initialQuestions: Question[] = [
  {
    id: 1,
    lessonId: 1,
    text: "Что такое алгебра?",
    options: [
      { id: 1, text: "Раздел математики, изучающий числа" },
      { id: 2, text: "Раздел математики, изучающий геометрические фигуры" },
      { id: 3, text: "Раздел математики, изучающий структуры, отношения и количества" },
      { id: 4, text: "Раздел физики, изучающий движение тел" },
    ],
    correctOptionId: 3,
    difficulty: "easy",
    createdAt: "2023-01-25",
  },
  {
    id: 2,
    lessonId: 1,
    text: "Какое из следующих выражений является алгебраическим?",
    options: [
      { id: 1, text: "2 + 2 = 4" },
      { id: 2, text: "x + y = 10" },
      { id: 3, text: "Площадь круга = πr²" },
      { id: 4, text: "Скорость = расстояние / время" },
    ],
    correctOptionId: 2,
    difficulty: "easy",
    createdAt: "2023-01-26",
  },
  {
    id: 3,
    lessonId: 2,
    text: "Решите уравнение: 2x + 5 = 15",
    options: [
      { id: 1, text: "x = 5" },
      { id: 2, text: "x = 10" },
      { id: 3, text: "x = 7.5" },
      { id: 4, text: "x = 3" },
    ],
    correctOptionId: 1,
    difficulty: "medium",
    createdAt: "2023-02-05",
  },
  {
    id: 4,
    lessonId: 3,
    text: "Первый закон Ньютона гласит:",
    options: [
      { id: 1, text: "Сила равна массе, умноженной на ускорение" },
      { id: 2, text: "Каждое действие имеет равное и противоположное противодействие" },
      {
        id: 3,
        text: "Тело остается в состоянии покоя или равномерного прямолинейного движения, если на него не действуют внешние силы",
      },
      { id: 4, text: "Энергия не может быть создана или уничтожена, только преобразована" },
    ],
    correctOptionId: 3,
    difficulty: "medium",
    createdAt: "2023-02-15",
  },
  {
    id: 5,
    lessonId: 4,
    text: "Что такое алгоритм?",
    options: [
      { id: 1, text: "Компьютерная программа" },
      { id: 2, text: "Последовательность инструкций для решения задачи" },
      { id: 3, text: "Язык программирования" },
      { id: 4, text: "Математическая формула" },
    ],
    correctOptionId: 2,
    difficulty: "easy",
    createdAt: "2023-03-20",
  },
]

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLesson, setSelectedLesson] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    lessonId: "",
    text: "",
    options: [
      { id: 1, text: "" },
      { id: 2, text: "" },
      { id: 3, text: "" },
      { id: 4, text: "" }
    ],
    correctOptionId: 1,
    difficulty: "easy"
  })

  // Фильтрация уроков по выбранному предмету
  const filteredLessons = selectedSubject === "all"
    ? lessons
    : lessons.filter(lesson => lesson.subjectId === Number.parseInt(selectedSubject))

  // Фильтрация вопросов по поисковому запросу и выбранному уроку
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLesson = selectedLesson === "all" || question.lessonId === Number.parseInt(selectedLesson)
    const lessonInfo = lessons.find(l => l.id === question.lessonId)
    const matchesSubject = selectedSubject === "all" || (lessonInfo && lessonInfo.subjectId === Number.parseInt(selectedSubject))

    return matchesSearch && matchesLesson && matchesSubject
  })

  // Получение названия урока по ID
  const getLessonTitle = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId)
    return lesson ? lesson.title : "Неизвестный урок"
  }

  // Получение цвета для сложности вопроса
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Получение текста для сложности вопроса
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Легкий"
      case "medium": return "Средний"
      case "hard": return "Сложный"
      default: return "Неизвестно"
    }
  }

  // Обработчик изменения варианта ответа
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options]
    updatedOptions[index] = { ...updatedOptions[index], text: value }
    setNewQuestion({ ...newQuestion, options: updatedOptions })
  }

  // Обработчик изменения варианта ответа при редактировании
  const handleEditOptionChange = (index: number, value: string) => {
    if (currentQuestion) {
      const updatedOptions = [...currentQuestion.options]
      updatedOptions[index] = { ...updatedOptions[index], text: value }
      setCurrentQuestion({ ...currentQuestion, options: updatedOptions })
    }
  }

  // Обработчик добавления нового вопроса
  const handleAddQuestion = () => {
    const question: Question = {
      id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
      lessonId: Number.parseInt(newQuestion.lessonId),
      text: newQuestion.text,
      options: newQuestion.options,
      correctOptionId: newQuestion.correctOptionId,
      difficulty: newQuestion.difficulty as "easy" | "medium" | "hard",
      createdAt: new Date().toISOString().split('T')[0]
    }
    setQuestions([...questions, question])
    setNewQuestion({
      lessonId: "",
      text: "",
      options: [
        { id: 1, text: "" },
        { id: 2, text: "" },
        { id: 3, text: "" },
        { id: 4, text: "" }
      ],
      correctOptionId: 1,
      difficulty: "easy"
    })
    setIsAddDialogOpen(false)
  }

  // Обработчик редактирования вопроса
  const handleEditQuestion = () => {
    if (currentQuestion) {
      setQuestions(questions.map(question =>
        question.id === currentQuestion.id ? currentQuestion : question
      ))
      setIsEditDialogOpen(false)
    }
  }

  // Обработчик удаления вопроса
  const handleDeleteQuestion = () => {
    if (currentQuestion) {
      setQuestions(questions.filter(question => question.id !== currentQuestion.id))
      setIsDeleteDialogOpen(false)
    }
  }

  return (
  <div className="flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Вопросы</h1>
      <Button
        onClick={() => setIsAddDialogOpen(true)}
        className="bg-[#7635E9] hover:bg-[#6025c7]"
      >
        <Plus className="mr-2 h-4 w-4" /> Добавить вопрос
      </Button>
    </div>

    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Поиск вопросов..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select
        value={selectedSubject}
        onValueChange={(value) => {
          setSelectedSubject(value)
          setSelectedLesson("all")
        }}
      >
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
      <Select
        value={selectedLesson}
        onValueChange={setSelectedLesson}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Выберите урок" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все уроки</SelectItem>
          {filteredLessons.map((lesson) => (
            <SelectItem key={lesson.id} value={lesson.id.toString()}>
              {lesson.title}
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
            <TableHead>Урок</TableHead>
            <TableHead>Вопрос</TableHead>
            <TableHead>Сложность</TableHead>
            <TableHead className="hidden md:table-cell">Дата создания</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{question.id}</TableCell>
                <TableCell>{getLessonTitle(question.lessonId)}</TableCell>
                <TableCell className="max-w-xs truncate">{question.text}</TableCell>
                <TableCell>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {getDifficultyText(question.difficulty)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{question.createdAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentQuestion(question)
                        setIsViewDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Просмотр</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentQuestion(question)
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
                        setCurrentQuestion(question)
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
              <TableCell colSpan={6} className="h-24 text-center">
                Вопросы не найдены.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

    {/* Диалог добавления вопроса */}
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавить вопрос</DialogTitle>
          <DialogDescription>
            Заполните информацию о новом вопросе
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="lesson">Урок</Label>
            <Select
              value={newQuestion.lessonId}
              onValueChange={(value) => setNewQuestion({ ...newQuestion, lessonId: value })}
            >
              <SelectTrigger id="lesson">
                <SelectValue placeholder="Выберите урок" />
              </SelectTrigger>
              <SelectContent>
                {lessons.map((lesson) => (
                  <SelectItem key={lesson.id} value={lesson.id.toString()}>
                    {lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text">Текст вопроса</Label>
            <Textarea
              id="text"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
              placeholder="Введите текст вопроса"
            />
          </div>
          <div className="grid gap-2">
            <Label>Варианты ответов</Label>
            <div className="space-y-2">
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Вариант ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="correctOption">Правильный ответ</Label>
            <RadioGroup
              value={newQuestion.correctOptionId.toString()}
              onValueChange={(value) => setNewQuestion({ ...newQuestion, correctOptionId: Number.parseInt(value) })}
            >
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`}>
                    {option.text || `Вариант ${index + 1}`}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="difficulty">Сложность</Label>
            <Select
              value={newQuestion.difficulty}
              onValueChange={(value) =>
                setNewQuestion({ ...newQuestion, difficulty: value as "easy" | "medium" | "hard" })
              }
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Выберите сложность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Легкий</SelectItem>
                <SelectItem value="medium">Средний</SelectItem>
                <SelectItem value="hard">Сложный</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleAddQuestion}
            className="bg-[#7635E9] hover:bg-[#6025c7]"
            disabled={!newQuestion.lessonId || !newQuestion.text || newQuestion.options.some(o => !o.text)}
          >
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Диалог редактирования вопроса */}
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактировать вопрос</DialogTitle>
          <DialogDescription>
            Измените информацию о вопросе
          </DialogDescription>
        </DialogHeader>
        {currentQuestion && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-lesson">Урок</Label>
              <Select
                value={currentQuestion.lessonId.toString()}
                onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, lessonId: Number.parseInt(value) })}
              >
                <SelectTrigger id="edit-lesson">
                  <SelectValue placeholder="Выберите урок" />
                </SelectTrigger>
                <SelectContent>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id.toString()}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-text">Текст вопроса</Label>
              <Textarea
                id="edit-text"
                value={currentQuestion.text}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Варианты ответов</Label>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option.text}
                      onChange={(e) => handleEditOptionChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-correctOption">Правильный ответ</Label>
              <RadioGroup
                value={currentQuestion.correctOptionId.toString()}
                onValueChange={(value) =>
                  setCurrentQuestion({ ...currentQuestion, correctOptionId: Number.parseInt(value) })
                }
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id.toString()} id={`edit-option-${option.id}`} />
                    <Label htmlFor={`edit-option-${option.id}`}>
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-difficulty">Сложность</Label>
              <Select
                value={currentQuestion.difficulty}
                onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, difficulty: value as "easy" | "medium" | "hard" })}
              >
                <SelectTrigger id="edit-difficulty">
                  <SelectValue placeholder="Выберите сложность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Легкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="hard">Сложный</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
          <Button
            onClick={handleEditQuestion}
            className="bg-[#7635E9] hover:bg-[#6025c7]"
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Диалог просмотра вопроса */}
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Просмотр вопроса</DialogTitle>
        </DialogHeader>
        {currentQuestion && (
          <div className="py-4">
            <div className="mb-4">
              <h3 className="font-medium">Урок:</h3>
              <p>{getLessonTitle(currentQuestion.lessonId)}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Вопрос:</h3>
              <p>{currentQuestion.text}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium">Варианты ответов:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {currentQuestion.options.map((option) => (
                  <li key={option.id}>
                    {option.text} {option.id === currentQuestion.correctOptionId && <strong>(Правильный)</strong>}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Сложность:</h3>
              <p>{getDifficultyText(currentQuestion.difficulty)}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>
)
}
