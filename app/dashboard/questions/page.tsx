"use client"

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
import { useToast } from "@/components/ui/use-toast"
import { Choice, Question, useQuestions } from "@/hooks/useQuestion"
import { useSubjects } from "@/hooks/useSubject"
import { useTopics } from "@/hooks/useTopics"
import { formatDate } from "@/lib/formatDate"
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useState } from "react"

export default function QuestionsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    topic: "",
    text_uz: "",
    text_ru: "",
    explanation: "",
    choices: [
      { id: 1, text_uz: "", text_ru: "", is_correct: true },
      { id: 2, text_uz: "", text_ru: "", is_correct: false },
      { id: 3, text_uz: "", text_ru: "", is_correct: false },
      { id: 4, text_uz: "", text_ru: "", is_correct: false }
    ]
  })

  // Fetch data using the hooks
  const { data: subjects = [], isLoading: isLoadingSubjects } = useSubjects()
  const { data: topics = [], isLoading: isLoadingTopics } = useTopics(selectedSubject !== "all" ? selectedSubject : undefined)
  const {
    data: questions = [],
    isLoading: isLoadingQuestions,
    addQuestionMutation,
    updateQuestionMutation,
    deleteQuestionMutation
  } = useQuestions()

  // Filter questions based on search term and selected filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = (
      question.text_uz.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.text_ru.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesTopic = selectedTopic === "all" || (question.topic_id && question.topic_id.toString() === selectedTopic)
    const topicInfo = topics.find(t => t.id === question.topic_id)
    const matchesSubject = selectedSubject === "all" || (topicInfo && topicInfo.subject.id.toString() === selectedSubject)

    return matchesSearch && matchesTopic && matchesSubject
  })

  // Get topic name by ID
  const getTopicName = (topicId: number | null) => {
    if (!topicId) return "Без темы"
    const topic = topics.find(t => t.id === topicId)
    return topic ? topic.name_ru||topic.name_uz : "Неизвестная тема"
  }

  // Handle option change for new question
  const handleOptionChange = (index: number, field: 'text_uz' | 'text_ru', value: string) => {
    const updatedChoices = [...newQuestion.choices]
    updatedChoices[index] = { ...updatedChoices[index], [field]: value }
    setNewQuestion({ ...newQuestion, choices: updatedChoices })
  }

  // Handle correct option change for new question
  const handleCorrectOptionChange = (choiceId: number) => {
    const updatedChoices = newQuestion.choices.map(choice => ({
      ...choice,
      is_correct: choice.id === choiceId
    }))
    setNewQuestion({ ...newQuestion, choices: updatedChoices })
  }

  // Handle option change for editing question
  const handleEditOptionChange = (index: number, field: 'text_uz' | 'text_ru', value: string) => {
    if (currentQuestion) {
      const updatedChoices = [...currentQuestion.choices]
      updatedChoices[index] = { ...updatedChoices[index], [field]: value }
      setCurrentQuestion({ ...currentQuestion, choices: updatedChoices })
    }
  }

  // Handle correct option change for editing question
  const handleEditCorrectOptionChange = (choiceId: number) => {
    if (currentQuestion) {
      const updatedChoices = currentQuestion.choices.map((choice: Choice) => ({
        ...choice,
        is_correct: choice.id === choiceId
      }))
      setCurrentQuestion({ ...currentQuestion, choices: updatedChoices })
    }
  }

  // Add new question
  const handleAddQuestion = async () => {
    try {
      const questionData = {
        topic_id: newQuestion.topic ? parseInt(newQuestion.topic) : null,
        text_uz: newQuestion.text_uz,
        text_ru: newQuestion.text_ru,
        explanation: newQuestion.explanation,
        choices: newQuestion.choices
      }

      await addQuestionMutation.mutateAsync(questionData)

      setNewQuestion({
        topic: "",
        text_uz: "",
        text_ru: "",
        explanation: "",
        choices: [
          { id: 1, text_uz: "", text_ru: "", is_correct: true },
          { id: 2, text_uz: "", text_ru: "", is_correct: false },
          { id: 3, text_uz: "", text_ru: "", is_correct: false },
          { id: 4, text_uz: "", text_ru: "", is_correct: false }
        ]
      })

      setIsAddDialogOpen(false)
      toast({
        title: "Вопрос добавлен",
        description: "Новый вопрос успешно добавлен"
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить вопрос",
        variant: "destructive"
      })
    }
  }

  // Edit question
  const handleEditQuestion = async () => {
    if (currentQuestion) {
      try {
        await updateQuestionMutation.mutateAsync(currentQuestion)
        setIsEditDialogOpen(false)
        toast({
          title: "Вопрос обновлен",
          description: "Вопрос успешно обновлен"
        })
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить вопрос",
          variant: "destructive"
        })
      }
    }
  }

  // Delete question
  const handleDeleteQuestion = async () => {
    if (currentQuestion) {
      try {
        await deleteQuestionMutation.mutateAsync(currentQuestion.id)
        setIsDeleteDialogOpen(false)
        toast({
          title: "Вопрос удален",
          description: "Вопрос успешно удален"
        })
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить вопрос",
          variant: "destructive"
        })
      }
    }
  }

  // Get correct choice from question
  const getCorrectChoice = (choices: Choice[]) => {
    return choices?.find(choice => choice.is_correct)
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
            setSelectedTopic("all")
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Выберите предмет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все предметы</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.name_ru}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedTopic}
          onValueChange={setSelectedTopic}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Выберите тему" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все темы</SelectItem>
            {topics.map((topic) => (
              <SelectItem key={topic.id} value={topic.id.toString()}>
                {topic.name_ru}
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
              <TableHead>Тема</TableHead>
              <TableHead>Вопрос (UZ)</TableHead>
              <TableHead>Вопрос (RU)</TableHead>
              <TableHead>Объяснение</TableHead>
              <TableHead className="hidden md:table-cell">Дата создания</TableHead>
              <TableHead className="hidden md:table-cell">Дата изменения</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingQuestions ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Загрузка вопросов...
                </TableCell>
              </TableRow>
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">{question.id}</TableCell>
                  <TableCell>{getTopicName(question.topic_id)}</TableCell>
                  <TableCell className="max-w-xs truncate">{question.text_uz}</TableCell>
                  <TableCell className="max-w-xs truncate">{question.text_ru}</TableCell>
                  <TableCell className="max-w-xs truncate">{question.explanation}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {question.created_at ? formatDate(question.created_at) : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {question.updated_at ? formatDate(question.updated_at) : "—"}
                  </TableCell>
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
                <TableCell colSpan={8} className="h-24 text-center">
                  Вопросы не найдены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Диалог добавления вопроса */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[99vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Добавить вопрос</DialogTitle>
            <DialogDescription>
              Заполните информацию о новом вопросе
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">Тема</Label>
              <Select
                value={newQuestion.topic}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, topic: value })}
              >
                <SelectTrigger id="topic">
                  <SelectValue placeholder="Выберите тему" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Без темы</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.name_ru}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="text_uz">Текст вопроса (UZ)</Label>
              <Textarea
                id="text_uz"
                value={newQuestion.text_uz}
                onChange={(e) => setNewQuestion({ ...newQuestion, text_uz: e.target.value })}
                placeholder="Введите текст вопроса на узбекском"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="text_ru">Текст вопроса (RU)</Label>
              <Textarea
                id="text_ru"
                value={newQuestion.text_ru}
                onChange={(e) => setNewQuestion({ ...newQuestion, text_ru: e.target.value })}
                placeholder="Введите текст вопроса на русском"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="explanation">Объяснение (необязательно)</Label>
              <Textarea
                id="explanation"
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Введите объяснение к вопросу"
              />
            </div>
            <div className="grid gap-2">
              <Label>Варианты ответов</Label>
              <div className="space-y-4">
                {newQuestion.choices.map((choice, index) => (
                  <div key={index} className="space-y-2">
                    <Input
                      value={choice.text_uz}
                      onChange={(e) => handleOptionChange(index, 'text_uz', e.target.value)}
                      placeholder={`Вариант ${index + 1} (UZ)`}
                    />
                    <Input
                      value={choice.text_ru}
                      onChange={(e) => handleOptionChange(index, 'text_ru', e.target.value)}
                      placeholder={`Вариант ${index + 1} (RU)`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="correctOption">Правильный ответ</Label>
              <RadioGroup
                value={newQuestion.choices.find(c => c.is_correct)?.id.toString() || "1"}
                onValueChange={(value) => handleCorrectOptionChange(Number.parseInt(value))}
              >
                {newQuestion.choices.map((choice, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={choice.id.toString()} id={`option-${choice.id}`} />
                    <Label htmlFor={`option-${choice.id}`}>
                      {choice.text_uz || choice.text_ru || `Вариант ${index + 1}`}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
            <Button
              onClick={handleAddQuestion}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={
                !newQuestion.text_uz ||
                !newQuestion.text_ru ||
                newQuestion.choices.some(c => !c.text_uz || !c.text_ru) ||
                addQuestionMutation.isPending
              }
            >
              {addQuestionMutation.isPending ? "Добавление..." : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования вопроса */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[99vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать вопрос</DialogTitle>
            <DialogDescription>
              Измените информацию о вопросе
            </DialogDescription>
          </DialogHeader>
          {currentQuestion && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-topic">Тема</Label>
                <Select
                  value={currentQuestion.topic_id ? currentQuestion.topic_id.toString() : "null"}
                  onValueChange={(value) => setCurrentQuestion({
                    ...currentQuestion,
                    topic_id: value === "null" ? null : Number.parseInt(value)
                  })}
                >
                  <SelectTrigger id="edit-topic">
                    <SelectValue placeholder="Выберите тему" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Без темы</SelectItem>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id.toString()}>
                        {topic.name_ru}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-text-uz">Текст вопроса (UZ)</Label>
                <Textarea
                  id="edit-text-uz"
                  value={currentQuestion.text_uz}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text_uz: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-text-ru">Текст вопроса (RU)</Label>
                <Textarea
                  id="edit-text-ru"
                  value={currentQuestion.text_ru}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text_ru: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-explanation">Объяснение (необязательно)</Label>
                <Textarea
                  id="edit-explanation"
                  value={currentQuestion.explanation || ""}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Варианты ответов</Label>
                <div className="space-y-4">
                  {currentQuestion.choices?.map((choice: Choice, index: number) => (
                    <div key={index} className="space-y-2">
                      <Input
                        value={choice.text_uz}
                        onChange={(e) => handleEditOptionChange(index, 'text_uz', e.target.value)}
                        placeholder={`Вариант ${index + 1} (UZ)`}
                      />
                      <Input
                        value={choice.text_ru}
                        onChange={(e) => handleEditOptionChange(index, 'text_ru', e.target.value)}
                        placeholder={`Вариант ${index + 1} (RU)`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-correctOption">Правильный ответ</Label>
                <RadioGroup
                  value={(getCorrectChoice(currentQuestion.choices)?.id || 1).toString()}
                  onValueChange={(value) => handleEditCorrectOptionChange(Number.parseInt(value))}
                >
                  {currentQuestion.choices?.map((choice: Choice, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={choice.id.toString()} id={`edit-option-${choice.id}`} />
                      <Label htmlFor={`edit-option-${choice.id}`}>
                        {choice.text_uz || choice.text_ru}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Отмена</Button>
            <Button
              onClick={handleEditQuestion}
              className="bg-[#7635E9] hover:bg-[#6025c7]"
              disabled={updateQuestionMutation.isPending}
            >
              {updateQuestionMutation.isPending ? "Сохранение..." : "Сохранить"}
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
                <h3 className="font-medium">Тема:</h3>
                <p>{getTopicName(currentQuestion.topic_id)}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium">Вопрос (UZ):</h3>
                <p>{currentQuestion.text_uz}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-medium">Вопрос (RU):</h3>
                <p>{currentQuestion.text_ru}</p>
              </div>
              {currentQuestion.explanation && (
                <div className="mb-4">
                  <h3 className="font-medium">Объяснение:</h3>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-medium">Варианты ответов:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {currentQuestion.choices?.map((choice: Choice) => (
                    <li key={choice.id}>
                      UZ: {choice.text_uz}<br />
                      RU: {choice.text_ru}
                      {choice.is_correct && <strong> (Правильный)</strong>}
                    </li>
                  ))}
                </ul>
              </div>
              {currentQuestion.created_at && (
                <div>
                  <h3 className="font-medium">Дата создания:</h3>
                  <p>{formatDate(currentQuestion.created_at)}</p>
                  <h3 className="font-medium">Дата изменения:</h3>
                  <p>{formatDate(currentQuestion.updated_at || "")}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог удаления вопроса */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Удалить вопрос</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот вопрос? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Отмена</Button>
            <Button
              variant="destructive"
              onClick={handleDeleteQuestion}
              disabled={deleteQuestionMutation.isPending}
            >
              {deleteQuestionMutation.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
