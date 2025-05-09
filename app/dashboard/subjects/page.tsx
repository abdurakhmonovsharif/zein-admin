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
import { Plus, Search, Pencil, Trash2, BookOpen } from "lucide-react"

// Интерфейс для предмета
interface Subject {
  id: number
  name: string
  description: string
  lessonsCount: number
  createdAt: string
}

// Начальные данные для демонстрации
const initialSubjects: Subject[] = [
  {
    id: 1,
    name: "Математика",
    description: "Базовый курс математики для начальных классов",
    lessonsCount: 12,
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Физика",
    description: "Введение в физику для средней школы",
    lessonsCount: 8,
    createdAt: "2023-02-20",
  },
  {
    id: 3,
    name: "Информатика",
    description: "Основы программирования и компьютерных наук",
    lessonsCount: 15,
    createdAt: "2023-03-10",
  },
  {
    id: 4,
    name: "Биология",
    description: "Изучение живых организмов и их взаимодействий",
    lessonsCount: 10,
    createdAt: "2023-04-05",
  },
  {
    id: 5,
    name: "Химия",
    description: "Основы химии и химических реакций",
    lessonsCount: 9,
    createdAt: "2023-05-12",
  },
]

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null)
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
  })

  // Фильтрация предметов по поисковому запросу
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Обработчик добавления нового предмета
  const handleAddSubject = () => {
    const subject: Subject = {
      id: subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1,
      name: newSubject.name,
      description: newSubject.description,
      lessonsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setSubjects([...subjects, subject])
    setNewSubject({ name: "", description: "" })
    setIsAddDialogOpen(false)
  }

  // Обработчик редактирования предмета
  const handleEditSubject = () => {
    if (currentSubject) {
      setSubjects(subjects.map((subject) => (subject.id === currentSubject.id ? currentSubject : subject)))
      setIsEditDialogOpen(false)
    }
  }

  // Обработчик удаления предмета
  const handleDeleteSubject = () => {
    if (currentSubject) {
      setSubjects(subjects.filter((subject) => subject.id !== currentSubject.id))
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Предметы</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#7635E9] hover:bg-[#6025c7]">
          <Plus className="mr-2 h-4 w-4" /> Добавить предмет
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск предметов..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="hidden md:table-cell">Описание</TableHead>
              <TableHead>Уроков</TableHead>
              <TableHead className="hidden md:table-cell">Дата создания</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{subject.description}</TableCell>
                  <TableCell>{subject.lessonsCount}</TableCell>
                  <TableCell className="hidden md:table-cell">{subject.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setCurrentSubject(subject)
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
                          setCurrentSubject(subject)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Удалить</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <BookOpen className="h-4 w-4" />
                        <span className="sr-only">Уроки</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Предметы не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Диалог добавления предмета */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить предмет</DialogTitle>
            <DialogDescription>Заполните информацию о новом предмете</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                placeholder="Введите название предмета"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                placeholder="Введите описание предмета"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddSubject} className="bg-[#7635E9] hover:bg-[#6025c7]" disabled={!newSubject.name}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования предмета */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать предмет</DialogTitle>
            <DialogDescription>Измените информацию о предмете</DialogDescription>
          </DialogHeader>
          {currentSubject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Название</Label>
                <Input
                  id="edit-name"
                  value={currentSubject.name}
                  onChange={(e) => setCurrentSubject({ ...currentSubject, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  value={currentSubject.description}
                  onChange={(e) => setCurrentSubject({ ...currentSubject, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditSubject} className="bg-[#7635E9] hover:bg-[#6025c7]">
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления предмета */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить предмет</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот предмет? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          {currentSubject && (
            <div className="py-4">
              <p>
                <strong>Название:</strong> {currentSubject.name}
              </p>
              <p>
                <strong>Описание:</strong> {currentSubject.description}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubject}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
