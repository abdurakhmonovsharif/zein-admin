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
import { FAQ, useFAQs } from "@/hooks/useFAQs"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"



export default function FAQPage() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentFAQ, setCurrentFAQ] = useState<FAQ | null>(null)
  const [formData, setFormData] = useState({ question_ru: "", answer_ru: "", question_uz: "", answer_uz: "" })

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
        question_ru: formData.question_ru,
        question_uz: formData.question_uz,
        answer_ru: formData.answer_ru,
        answer_uz: formData.answer_uz,
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
        question_ru: formData.question_ru,
        question_uz: formData.question_uz,
        answer_ru: formData.answer_ru,
        answer_uz: formData.answer_uz,
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



  const openEditDialog = (faq: FAQ) => {
    setCurrentFAQ(faq)
    setFormData({ question_ru: faq.question_ru, answer_ru: faq.answer_ru, question_uz: faq.question_uz, answer_uz: faq.answer_uz })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (faq: FAQ) => {
    setCurrentFAQ(faq)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ question_ru: "", answer_ru: "", question_uz: "", answer_uz: "" })
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
              <Label htmlFor="question_ru">Вопрос (РУ)</Label>
              <Input id="question_ru" value={formData.question_ru} onChange={(e) => setFormData({ ...formData, question_ru: e.target.value })} />
              <Label htmlFor="answer_ru">Ответ (РУ)</Label>
              <Textarea id="answer_ru" rows={5} value={formData.answer_ru} onChange={(e) => setFormData({ ...formData, answer_ru: e.target.value })} />
              <Label htmlFor="question_uz">Вопрос (УЗ)</Label>
              <Input id="question_uz" value={formData.question_uz} onChange={(e) => setFormData({ ...formData, question_uz: e.target.value })} />
              <Label htmlFor="answer_uz">Ответ (УЗ)</Label>
              <Textarea id="answer_uz" rows={5} value={formData.answer_uz} onChange={(e) => setFormData({ ...formData, answer_uz: e.target.value })} />
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
                <TableHead>Вопрос (УЗ)</TableHead>
                <TableHead>Ответ (УЗ)</TableHead>
                <TableHead>Вопрос (РУ)</TableHead>
                <TableHead>Ответ (РУ)</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs?.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell>{faq.question_uz}</TableCell>
                  <TableCell className="max-w-md truncate">{faq.answer_uz}</TableCell>
                  <TableCell>{faq.question_ru}</TableCell>
                  <TableCell className="max-w-md truncate">{faq.answer_ru}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
            <Input id="edit-question" value={formData.question_ru} onChange={(e) => setFormData({ ...formData, question_ru: e.target.value })} />
            <Label htmlFor="edit-answer">Ответ</Label>
            <Textarea id="edit-answer" rows={5} value={formData.answer_ru} onChange={(e) => setFormData({ ...formData, answer_ru: e.target.value })} />
            <Label htmlFor="edit-question">Вопрос</Label>
            <Input id="edit-question" value={formData.question_uz} onChange={(e) => setFormData({ ...formData, question_uz: e.target.value })} />
            <Label htmlFor="edit-answer">Ответ</Label>
            <Textarea id="edit-answer" rows={5} value={formData.answer_uz} onChange={(e) => setFormData({ ...formData, answer_uz: e.target.value })} />
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
