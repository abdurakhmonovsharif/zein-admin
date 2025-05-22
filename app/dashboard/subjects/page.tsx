"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Subject, useSubjects } from "@/hooks/useSubject"
import { formatDate } from "@/lib/formatDate"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"

export default function SubjectsPage() {
  const { data: subjects, isLoading, error, addSubjectMutation, updateSubjectMutation, deleteSubjectMutation } = useSubjects()

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null)
  const [newSubject, setNewSubject] = useState({ name: "", description: "" })

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const filteredSubjects = subjects
    ?.filter((subject: any) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.sort((a, b) => {
      const dateA = new Date(a.created_at || "").getTime()
      const dateB = new Date(b.created_at || "").getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const handleAddSubject = () => {
    const subject: Subject = {
      name: newSubject.name,
      description: newSubject.description,
      id: 0
    }
    addSubjectMutation.mutate(subject)
    setNewSubject({ name: "", description: "" })
    setIsAddDialogOpen(false)
  }

  const handleEditSubject = () => {
    if (currentSubject) {
      updateSubjectMutation.mutate(currentSubject)
      setIsEditDialogOpen(false)
    }
  }

  const handleDeleteSubject = () => {
    if (currentSubject) {
      deleteSubjectMutation.mutate(currentSubject.id)
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
              <TableHead
                className="hidden md:table-cell cursor-pointer select-none"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                Дата создания {sortOrder === "asc" ? "↑" : "↓"}
              </TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubjects?.length || Array.from({ length: 0 }).length > 0 ? (
              filteredSubjects?.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{subject.description}</TableCell>
                  <TableCell>{subject.topic_count}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(subject.created_at || "")}</TableCell>
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

      {/* Редактирование предмета */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Редактировать предмет</DialogTitle>
            <DialogDescription>Измените информацию о предмете</DialogDescription>
          </DialogHeader>
          {currentSubject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title_ru">Название</Label>
                <Input
                  id="edit-title_ru"
                  value={currentSubject.name}
                  onChange={(e) => setCurrentSubject({ ...currentSubject, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Textarea
                  id="edit-description"
                  value={currentSubject.description || ""}
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

      {/* Удаление предмета */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить предмет</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот предмет? Это действие нельзя будет отменить.
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
