"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useFAQs } from "@/hooks/useFAQs"
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface FAQ {
  id: number
  question: string
  answer: string
  order: number
}

export default function FAQPage() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentFAQ, setCurrentFAQ] = useState<FAQ | null>(null)
  const [formData, setFormData] = useState({ question: "", answer: "" })

  const {
    data: faqs,
    isLoading,
    error,
    addFAQMutation,
    updateFAQMutation,
    deleteFAQMutation,
  } = useFAQs()

  const handleAddFAQ = () => {
    addFAQMutation.mutate(
      {
        id: 0,
        question: formData.question,
        answer: formData.answer,
        order: (faqs?.length || 0) + 1,
      },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false)
          resetForm()
          toast({ title: "FAQ добавлен", description: "Новый вопрос успешно добавлен." })
        },
      }
    )
  }

  const handleEditFAQ = () => {
    if (!currentFAQ) return
    updateFAQMutation.mutate(
      {
        ...currentFAQ,
        question: formData.question,
        answer: formData.answer,
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false)
          resetForm()
          toast({ title: "FAQ обновлен", description: "Вопрос успешно обновлён." })
        },
      }
    )
  }

  const handleDeleteFAQ = () => {
    if (!currentFAQ) return
    deleteFAQMutation.mutate(currentFAQ.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false)
        toast({
          title: "FAQ удалён",
          description: "Вопрос успешно удалён.",
          variant: "destructive",
        })
      },
    })
  }

  const moveFAQUp = (id: number) => {
    if (!faqs) return
    const index = faqs.findIndex((faq) => faq.id === id)
    if (index <= 0) return
    const current = faqs[index]
    const previous = faqs[index - 1]
    updateFAQMutation.mutate({ ...current, order: previous.order })
    updateFAQMutation.mutate({ ...previous, order: current.order })
  }

  const moveFAQDown = (id: number) => {
    if (!faqs) return
    const index = faqs.findIndex((faq) => faq.id === id)
    if (index >= faqs.length - 1) return
    const current = faqs[index]
    const next = faqs[index + 1]
    updateFAQMutation.mutate({ ...current, order: next.order })
    updateFAQMutation.mutate({ ...next, order: current.order })
  }

  const openEditDialog = (faq: FAQ) => {
    setCurrentFAQ(faq)
    setFormData({ question: faq.question, answer: faq.answer })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (faq: FAQ) => {
    setCurrentFAQ(faq)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ question: "", answer: "" })
    setCurrentFAQ(null)
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Управление FAQ</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7635E9] hover:bg-[#6525D9]">
              <Plus className="mr-2 h-4 w-4" /> Добавить FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новый FAQ</DialogTitle>
              <DialogDescription>Заполните поля, чтобы добавить новый часто задаваемый вопрос на сайт.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="question">Вопрос</Label>
              <Input id="question" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} />
              <Label htmlFor="answer">Ответ</Label>
              <Textarea id="answer" rows={5} value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
              <Button className="bg-[#7635E9] hover:bg-[#6525D9]" onClick={handleAddFAQ}>Добавить</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все вопросы</CardTitle>
          <CardDescription>Управляйте часто задаваемыми вопросами. Вы можете добавлять, редактировать, удалять и менять порядок.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Порядок</TableHead>
                <TableHead>Вопрос</TableHead>
                <TableHead>Ответ</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs?.sort((a, b) => a.order - b.order).map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell>{faq.order}</TableCell>
                  <TableCell>{faq.question}</TableCell>
                  <TableCell className="max-w-md truncate">{faq.answer}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => moveFAQUp(faq.id)} disabled={faq.order === 1}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => moveFAQDown(faq.id)} disabled={faq.order === faqs.length}>
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(faq)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500" onClick={() => openDeleteDialog(faq)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать FAQ</DialogTitle>
            <DialogDescription>Обновите данные вопроса ниже.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="edit-question">Вопрос</Label>
            <Input id="edit-question" value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} />
            <Label htmlFor="edit-answer">Ответ</Label>
            <Textarea id="edit-answer" rows={5} value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
            <Button className="bg-[#7635E9] hover:bg-[#6525D9]" onClick={handleEditFAQ}>Сохранить изменения</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердите удаление</DialogTitle>
            <DialogDescription>Вы уверены, что хотите удалить этот вопрос? Это действие необратимо.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
            <Button variant="destructive" onClick={handleDeleteFAQ}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
